import { useEffect, useState } from 'react';
import { getImageUrl, handleImageError } from '../utils/imageUrl.js';

function BannerSlider({ banners }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const timer = window.setInterval(function () {
      setActiveIndex(function (current) {
        return (current + 1) % banners.length;
      });
    }, 5000);

    return function () {
      window.clearInterval(timer);
    };
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <section className="hero hero-empty">
        <div className="hero-copy">
          <span className="hero-pill">
            <i aria-hidden="true" />
            Ofertas que enamoran
          </span>
          <h1>PequeAventuras</h1>
          <p>Productos para acompanar cada etapa de crecimiento.</p>
        </div>
      </section>
    );
  }

  const banner = banners[activeIndex];

  const words = String(banner.titulo || '').split(' ');

  let titleLead = banner.titulo;
  let titleAccent = '';

  if (words.length > 2) {
    titleLead = words.slice(0, words.length - 1).join(' ');
    titleAccent = words[words.length - 1];
  }

  return (
    <section className="hero">
      <span className="hero-balloon" aria-hidden="true"></span>
      <span className="hero-star hero-star-one" aria-hidden="true"></span>
      <span className="hero-star hero-star-two" aria-hidden="true"></span>
      <span className="hero-heart" aria-hidden="true"></span>

      <div className="hero-copy">
        <span className="hero-pill">
          <i aria-hidden="true" />
          Ofertas que enamoran
        </span>

        <h1>
          <span>{titleLead}</span>
          {titleAccent ? <strong>{titleAccent}</strong> : null}
        </h1>

        <p>{banner.descripcion_corta}</p>

        <div className="hero-actions">
          <a className="primary-button" href="/promociones">
            <span className="button-tag" />
            Ver promociones
          </a>

          <a className="outline-button" href="/#categorias">
            <span className="button-grid" />
            Explorar categorias
          </a>
        </div>
      </div>

      <div className="hero-image">
        <img
          src={getImageUrl(banner.imagen)}
          alt={banner.titulo}
          onError={handleImageError}
        />
      </div>

      <div className="slider-dots" aria-label="Banners">
        {banners.map(function (item, index) {
          return (
            <button
              key={item.id_banner}
              type="button"
              className={index === activeIndex ? 'active' : ''}
              onClick={function () {
                setActiveIndex(index);
              }}
              aria-label={`Mostrar banner ${index + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}

export default BannerSlider;
