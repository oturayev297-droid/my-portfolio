import { motion } from 'framer-motion'
import { useLang } from '../lang'

export default function Pricing() {
  const { t } = useLang()

  const features1 = [t('pricing.f1'), t('pricing.f2'), t('pricing.f3'), t('pricing.f4')]
  const features2 = [t('pricing.f5'), t('pricing.f6'), t('pricing.f7'), t('pricing.f8')]
  const features3 = [t('pricing.f9'), t('pricing.f10'), t('pricing.f11'), t('pricing.f12')]

  const plans = [
    { icon: 'fas fa-pager', title: t('pricing.p1'), price: t('pricing.p1p'), popular: false, features: features1 },
    { icon: 'fas fa-layer-group', title: t('pricing.p2'), price: t('pricing.p2p'), popular: true, features: features2 },
    { icon: 'fab fa-telegram-plane', title: t('pricing.p3'), price: t('pricing.p3p'), popular: false, features: features3 },
  ]

  return (
    <section id="pricing" className="pricing">
      <div className="text-center">
        <h2 className="section-title">{t('pricing.title')} <span className="gradient-text">{t('pricing.titleGrad')}</span></h2>
        <p className="section-subtitle">{t('pricing.subtitle')}</p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            className={`pricing-card glass-card ${plan.popular ? 'popular' : ''}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            whileHover={{ y: -10 }}
          >
            {plan.popular && <div className="popular-badge">{t('pricing.popular')}</div>}
            <div className="pricing-icon-wrap"><i className={plan.icon} /></div>
            <h3>{plan.title}</h3>
            <div className="pricing-price"><span className="price">{plan.price}</span></div>
            <ul className="pricing-features">
              {plan.features.map((f, j) => (
                <li key={j}><i className="fas fa-check" /> {f}</li>
              ))}
            </ul>
            <a href="#contact" className="pricing-btn">{t('pricing.btn')} <i className="fas fa-arrow-right" /></a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
