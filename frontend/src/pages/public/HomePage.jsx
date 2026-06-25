import { useEffect, useState } from 'react';
import BannerSlider from '../../components/BannerSlider.jsx';
import CategoryCard from '../../components/CategoryCard.jsx';
import FeaturedProductCard from '../../components/FeaturedProductCard.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import PromotionCard from '../../components/PromotionCard.jsx';
import SectionHeader from '../../components/SectionHeader.jsx';
import WhatsAppButton from '../../components/WhatsAppButton.jsx';
import {
  getBanners,
  getCategories,
  getFeaturedProducts,
  getProducts,
  getPromotionProducts
} from '../../services/api.js';

function HomePage() {
  const [state, setState] = useState({
    banners: [],
    categories: [],
    products: [],
    featured: [],
    promotions: [],
    loading: true,
    error: ''
  });

  useEffect(() => {
    let active = true;

    async function loadHome() {
      const [banners, categories, products, featured, promotions] = await Promise.allSettled([
        getBanners(),
        getCategories(),
        getProducts(),
        getFeaturedProducts(),
        getPromotionProducts()
      ]);

      if (active) {
        const nextState = {
          banners: banners.status === 'fulfilled' ? banners.value : [],
          categories: categories.status === 'fulfilled' ? categories.value : [],
          products: products.status === 'fulfilled' ? products.value : [],
          featured: featured.status === 'fulfilled' ? featured.value : [],
          promotions: promotions.status === 'fulfilled' ? promotions.value : [],
          loading: false,
          error: ''
        };

        const hasPublicData = nextState.banners.length || nextState.categories.length || nextState.products.length;

        setState({
          ...nextState,
          error: hasPublicData ? '' : 'No se pudo cargar la tienda.'
        });
      }
    }

    loadHome();

    return () => {
      active = false;
    };
  }, []);

  if (state.loading) return <main className="page"><p className="status-text">Cargando PequeAventuras...</p></main>;
  if (state.error) return <main className="page"><p className="status-text">{state.error}</p></main>;

  return (
    <main>
      <BannerSlider banners={state.banners} />

      <section className="section" id="categorias">
        <SectionHeader title="Categorias" eyebrow="Explora">
          Encuentra productos organizados por etapa y necesidad.
        </SectionHeader>
        <div className="category-grid">
          {state.categories.map((category) => (
            <CategoryCard key={category.id_categoria} category={category} />
          ))}
        </div>
      </section>

      <section className="section" id="destacados">
        <SectionHeader title="Productos destacados" eyebrow="Mas vistos" />
        <div className="featured-grid">
          {state.featured.map((product) => (
            <FeaturedProductCard key={product.id_producto} product={product} />
          ))}
        </div>
      </section>

      <section className="section" id="catalogo">
        <SectionHeader title="Catalogo" eyebrow="Productos">
          Productos disponibles para consultar directamente con el vendedor.
        </SectionHeader>
        <div className="product-grid">
          {state.products.map((product) => (
            <ProductCard key={product.id_producto} product={product} showOffer={false} />
          ))}
        </div>
      </section>

      <section className="section" id="promociones">
        <SectionHeader title="Promociones" eyebrow="Ofertas activas" />
        <div className="product-grid">
          {state.promotions.map((product) => (
            <PromotionCard key={`${product.id_promocion}-${product.id_producto}`} product={product} />
          ))}
        </div>
      </section>

      <section className="section about-section" id="nosotros">
        <SectionHeader title="Nosotros" eyebrow="PequeAventuras" />
        <div className="about-grid">
          <article>
            <h3>Historia breve</h3>
            <p>
              PequeAventuras es una tienda dedicada a ofrecer productos para bebes y ninos, brindando opciones de
              calidad, seguridad y variedad para acompanar cada etapa de crecimiento.
            </p>
          </article>
          <article>
            <h3>Mision</h3>
            <p>Acercar productos utiles, seguros y variados para familias que buscan acompanar mejor a sus ninos.</p>
          </article>
          <article>
            <h3>Vision</h3>
            <p>Ser una tienda confiable para familias que valoran atencion cercana y productos bien seleccionados.</p>
          </article>
        </div>
      </section>

      <section className="section contact-section" id="contacto">
        <SectionHeader title="Contacto" eyebrow="WhatsApp">
          Coordinamos disponibilidad, detalles de compra y entregas directamente por WhatsApp.
        </SectionHeader>
        <WhatsAppButton href="https://wa.me/51930700147">Contactar al 930700147</WhatsAppButton>
      </section>
    </main>
  );
}

export default HomePage;
