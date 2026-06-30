import json
from unittest.mock import patch, MagicMock
from django.test import TestCase, Client
from django.urls import reverse
from portal.models import ContactMessage, AIOrder, Experience, Project


class PortalViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    @patch('portal.views.send_telegram_async')
    def test_contact_view_valid(self, mock_send_telegram):
        data = {
            'full_name': 'Test User',
            'telegram': '@test_user',
            'subject': 'Test Subject',
            'message': 'This is a test message for contact form.'
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        self.assertTrue(ContactMessage.objects.filter(full_name='Test User').exists())
        mock_send_telegram.assert_called_once()

    def test_contact_view_invalid(self):
        data = {
            'full_name': '',
            'telegram': '',
            'subject': 'Test Subject',
            'message': 'short'
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'error')

    @patch('portal.ai_service.FallbackAssistant.chat')
    @patch('portal.views.send_telegram_async')
    def test_ai_chat_handler_not_finalized(self, mock_send_telegram, mock_ai_chat):
        mock_ai_chat.return_value = ("Salom! Qanday yordam bera olaman?", False)
        payload = {'message': 'Salom', 'history': []}
        response = self.client.post(
            reverse('ai_chat'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['response'], "Salom! Qanday yordam bera olaman?")
        self.assertFalse(response_data['finalized'])
        self.assertEqual(AIOrder.objects.count(), 0)
        mock_send_telegram.assert_not_called()

    @patch('portal.ai_service.FallbackAssistant.chat')
    @patch('portal.views.send_telegram_async')
    def test_ai_chat_handler_finalized(self, mock_send_telegram, mock_ai_chat):
        lead_meta = '###LEAD_DATA={"name": "Mijoz Nom", "brief": "Landing page loyihasi", "finalized": true}###'
        mock_ai_chat.return_value = (f"Rahmat! Ma'lumotlarni oldim.\n{lead_meta}", True)
        payload = {'message': 'Ismim Mijoz Nom, landing page kerak', 'history': []}
        response = self.client.post(
            reverse('ai_chat'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['response'], "Rahmat! Ma'lumotlarni oldim.")
        self.assertTrue(response_data['finalized'])
        self.assertTrue(AIOrder.objects.filter(client_name="Mijoz Nom").exists())
        mock_send_telegram.assert_called_once()

    @patch('portal.ai_service.FallbackAssistant.chat')
    def test_ai_chat_handler_invalid_json_lead(self, mock_ai_chat):
        """Agar Gemini noto'g'ri JSON qaytarsa, chat qulamasligi kerak."""
        bad_lead = '###LEAD_DATA={name: no quotes}###'
        mock_ai_chat.return_value = (f"Xatolik.\n{bad_lead}", True)
        payload = {'message': 'test', 'history': []}
        response = self.client.post(
            reverse('ai_chat'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(AIOrder.objects.count(), 0)

    def test_api_projects(self):
        Project.objects.create(
            title='Test Project',
            category='Veb Loyiha',
            description='Test description',
            tech_stack='Django, JS',
        )
        response = self.client.get(reverse('api_projects'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Test Project')
        self.assertIn('tech_list', data[0])
        self.assertIn('image_url', data[0])

    def test_home_page(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)

    def test_resume_page(self):
        Experience.objects.create(
            company='Test Co',
            role='Developer',
            start_date='2024-01-01',
            description='Test role'
        )
        response = self.client.get(reverse('resume'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Developer')
        self.assertContains(response, 'Python')

    def test_contact_view_rate_limit(self):
        """5 ta requestdan keyin 6-si rate limitga tushishi kerak."""
        data = {
            'full_name': 'Test User',
            'telegram': '@test_user',
            'subject': 'Test',
            'message': 'Test message body content here.'
        }
        for i in range(5):
            resp = self.client.post(reverse('contact'), data)
            self.assertEqual(resp.status_code, 200)
        resp = self.client.post(reverse('contact'), data)
        self.assertEqual(resp.status_code, 429)


class AIOrderModelTestCase(TestCase):
    def test_create_order(self):
        order = AIOrder.objects.create(
            client_name='Test Client',
            project_brief='Test project description',
            estimated_price='$500',
        )
        self.assertEqual(str(order), 'Order from Test Client - $500')
        self.assertFalse(order.is_processed)
        self.assertIsNotNone(order.created_at)

    def test_order_defaults(self):
        order = AIOrder.objects.create(
            client_name='Test',
            project_brief='Brief',
            estimated_price='N/A',
        )
        self.assertIsNone(order.chat_transcript)
        self.assertFalse(order.is_processed)


class ProjectModelTestCase(TestCase):
    def test_tech_list_method(self):
        project = Project.objects.create(
            title='Test',
            category='Veb Loyiha',
            description='Desc',
            tech_stack='Django, React,  PostgreSQL ',
        )
        techs = project.get_tech_list()
        self.assertEqual(techs, ['Django', 'React', 'PostgreSQL'])
