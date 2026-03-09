import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const BannerCarousel = ({ banners = [] }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return undefined
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  useEffect(() => {
    if (current > banners.length - 1) {
      setCurrent(0)
    }
  }, [banners.length, current])

  if (!banners.length) return null

  const goTo = (index) => setCurrent(index)
  const previous = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  const next = () => setCurrent((prev) => (prev + 1) % banners.length)

  return (
    <section className="banner-container">
      {banners.map((banner, index) => (
        <article
          key={banner.id || banner.title || index}
          className={`banner-slide ${index === current ? 'active' : ''}`}
          style={{
            backgroundImage: `linear-gradient(rgba(20, 33, 27, 0.44), rgba(20, 33, 27, 0.58)), url(${banner.image_url || banner.imageUrl})`,
          }}
        >
          <div className="banner-content">
            <p className="banner-kicker">Vida Verde Marketplace</p>
            <h1>{banner.title}</h1>
            <p>{banner.description}</p>
            {banner.link ? (
              <Link to={banner.link} className="btn banner-btn">
                {banner.button_text || 'Saiba mais'}
              </Link>
            ) : null}
          </div>
        </article>
      ))}

      {banners.length > 1 ? (
        <>
          <button type="button" className="banner-nav prev" onClick={previous} aria-label="Banner anterior">
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className="banner-nav next" onClick={next} aria-label="Proximo banner">
            <span aria-hidden="true">›</span>
          </button>
          <div className="banner-dots">
            {banners.map((banner, index) => (
              <button
                key={banner.id || `${banner.title}-${index}`}
                type="button"
                className={`banner-dot ${index === current ? 'active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
