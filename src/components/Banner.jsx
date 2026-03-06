import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    title: 'Transforme sua casa com plantas',
    description: 'Selecao especial para ambientes internos com cuidado simples.',
    image:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1600&q=80',
    actionLabel: 'Explorar catalogo',
    actionTo: '/products',
  },
  {
    title: 'Plantas selecionadas com qualidade',
    description: 'Produtos escolhidos por especialistas para decorar e purificar o ar.',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80',
    actionLabel: 'Ver destaques',
    actionTo: '/home',
  },
  {
    title: 'Entrega rapida para sua casa',
    description: 'Receba com seguranca e suporte para manter a saude das suas plantas.',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80',
    actionLabel: 'Comprar agora',
    actionTo: '/products',
  },
]

export const Banner = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => setCurrent(index)
  const prev = () => setCurrent((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  const next = () => setCurrent((prevIndex) => (prevIndex + 1) % slides.length)

  return (
    <section className="banner-container">
      {slides.map((slide, index) => (
        <article
          key={slide.title}
          className={`banner-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(21,36,30,.48), rgba(21,36,30,.48)), url(${slide.image})` }}
        >
          <div className="banner-content">
            <p className="banner-kicker">Vida Verde Marketplace</p>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <Link to={slide.actionTo} className="btn banner-btn">
              {slide.actionLabel}
            </Link>
          </div>
        </article>
      ))}

      <button type="button" className="banner-nav prev" onClick={prev} aria-label="Slide anterior">
        ‹
      </button>
      <button type="button" className="banner-nav next" onClick={next} aria-label="Proximo slide">
        ›
      </button>

      <div className="banner-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={`banner-dot ${index === current ? 'active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
