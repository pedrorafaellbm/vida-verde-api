const socials = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'IG' },
  { label: 'Discord', href: 'https://discord.com', icon: 'DC' },
  { label: 'WhatsApp', href: 'https://wa.me/5500000000000', icon: 'WA' },
]

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h3>Vida Verde</h3>
          <p>
            Marketplace especializado em plantas, vasos e itens de cultivo com curadoria,
            suporte e entrega para todo o Brasil.
          </p>
        </section>

        <section>
          <h3>Endereco</h3>
          <p>Rua das Flores 123</p>
          <p>Sao Paulo - SP</p>
          <p>Brasil</p>
        </section>

        <section>
          <h3>Contato</h3>
          <p>contato@vidaverde.com</p>
          <p>(11) 99999-9999</p>
          <div className="footer-socials">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </section>
      </div>
      <div className="container footer-bottom">
        <p>Vida Verde © 2026. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
