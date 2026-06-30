import json
from unittest.mock import patch, MagicMock
from django.test import TestCase, Client
from django.urls import reverse
from portal.models import ContactMessage, AIOrder


class PortalViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    @patch('portal.views.send_telegram_async')
    def test_contact_view_valid(self, mock_send_telegram):
        """Test contact view with valid data."""
        data = {
            'full_name': 'Test User',
            'telegram': '@test_user',
            'subject': 'Test Subject',
            'message': 'This is a test message.'
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        
        # Verify message was saved to database
        self.assertTrue(ContactMessage.objects.filter(full_name='Test User').exists())
        
        # Verify async telegram task was triggered
        mock_send_telegram.assert_called_once()

    def test_contact_view_invalid(self):
        """Test contact view with missing fields (invalid)."""
        data = {
            'full_name': '',
            'telegram': '',
            'subject': 'Test Subject',
            'message': 'This is a test message.'
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'error')

    @patch('portal.ai_service.FallbackAssistant.chat')
    @patch('portal.views.send_telegram_async')
    def test_ai_chat_handler_not_finalized(self, mock_send_telegram, mock_ai_chat):
        """Test ai_chat_handler view with non-finalized agent conversation."""
        mock_ai_chat.return_value = ("Salom! Qanday yordam bera olaman?", False)
        
        payload = {
            'message': 'Salom',
            'history': []
        }
        
        response = self.client.post(
            reverse('ai_chat'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['response'], "Salom! Qanday yordam bera olaman?")
        self.assertFalse(response_data['finalized'])
        
        # Should not save order or send telegram if not finalized
        self.assertEqual(AIOrder.objects.count(), 0)
        mock_send_telegram.assert_not_called()

    @patch('portal.ai_service.FallbackAssistant.chat')
    @patch('portal.views.send_telegram_async')
    def test_ai_chat_handler_finalized(self, mock_send_telegram, mock_ai_chat):
        """Test ai_chat_handler view when conversation is finalized and lead metadata is returned."""
        lead_meta = '###LEAD_DATA={"name": "Mijoz Nom", "brief": "Landing page loyihasi", "finalized": true}###'
        mock_ai_chat.return_value = (f"Rahmat! Ma'lumotlarni oldim.\n{lead_meta}", True)
        
        payload = {
            'message': 'Ismim Mijoz Nom, landing page kerak bo\'ladi',
            'history': []
        }
        
        response = self.client.post(
            reverse('ai_chat'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['response'], "Rahmat! Ma'lumotlarni oldim.")
        self.assertTrue(response_data['finalized'])
        
        # Verify order was saved to database
        self.assertTrue(AIOrder.objects.filter(client_name="Mijoz Nom").exists())
        order = AIOrder.objects.get(client_name="Mijoz Nom")
        self.assertEqual(order.project_brief, "Landing page loyihasi")
        
        # Verify async telegram was triggered
        mock_send_telegram.assert_called_once()
