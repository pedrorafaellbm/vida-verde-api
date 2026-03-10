import { useI18n } from '../context/LocaleContext'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'IG' },
  { label: 'Discord', href: 'https://discord.com', icon: 'DC' },
  { label: 'WhatsApp', href: 'https://wa.me/5500000000000', icon: 'WA' },
]

export const Footer = () => {
  const { t } = useI18n()

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h3>greenstore</h3>
          <p>{t('footer.aboutText')}</p>
        </section>

        <section>
          <h3>{t('footer.addressTitle')}</h3>
          <p>Rua das Flores 123</p>
          <p>Sao Paulo - SP</p>
          <p>Brasil</p>
        </section>

        <section>
          <h3>{t('footer.contactTitle')}</h3>
          <p>contato@greenstore.com</p>
          <p>(11) 99999-9999</p>
          <div className="footer-socials">
            {socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="footer-social-link" aria-label={social.label}>
                {social.icon}
              </a>
            ))}
          </div>
        </section>
      </div>
      <div className="container footer-bottom">
        <p>{t('footer.rights')}</p>
      </div>
    </footer>
  )
}
