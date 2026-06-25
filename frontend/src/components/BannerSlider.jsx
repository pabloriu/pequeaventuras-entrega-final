import { useEffect, useState } from 'react';
import { getImageUrl, handleImageError } from '../utils/imageUrl.js';

function BannerSlider({ banners }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) {
    return (
      <section className="hero hero-empty">
        <div className="hero-copy">
          <span className="hero-pill"><i aria-hidden="true" />Ofertas que enamoran</span>
          <h1>PequeAventuras</h1>
          <p>Productos para acompanar cada etapa de crecimiento.</p>
        </div>
      </section>
    );
  }

  const banner = banners[activeIndex];
  const titleWords = String(banner.titulo || '').split(' ');
  const titleLead = titleWords.length > 2 ? titleWords.slice(0, -1).join(' ') : banner.titulo;
  const titleAccent = titleWords.length > 2 ? titleWords.at(-1) : '';

  return (
    <section className="hero">
      <span className="hero-balloon" aria-hidden="true" />
      <span className="hero-star hero-star-one" aria-hidden="true" />
      <span className="hero-star hero-star-two" aria-hidden="true" />
      <span className="hero-heart" aria-hidden="true" />
      <div className="hero-copy">
        <span className="hero-pill"><i aria-hidden="true" />Ofertas que enamoran</span>
        <h1>
          <span>{titleLead}</span>
          {titleAccent && <strong>{titleAccent}</strong>}
        </h1>
        <p>{banner.descripcion_corta}</p>
        <div className="hero-actions">
          <a className="primary-button" href="/promociones"><span className="button-tag" />Ver promociones</a>
          <a className="outline-button" href="/#categorias"><span className="button-grid" />Explorar categorias</a>
        </div>
      </div>
      <div className="hero-image">
        <img src={getImageUrl(banner.imagen)} alt={banner.titulo} onError={handleImageError} />
      </div>
      <div className="slider-dots" aria-label="Banners">
        {banners.map((item, index) => (
          <button
            key={item.id_banner}
            className={index === activeIndex ? 'active' : ''}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Mostrar banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default BannerSlider;
