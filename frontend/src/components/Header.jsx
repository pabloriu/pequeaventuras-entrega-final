import { NavLink } from 'react-router-dom';
import CartButton from './CartButton.jsx';

const navItems = [
  { to: '/', label: 'Inicio', route: true },
  { to: '/#categorias', label: 'Categorias' },
  { to: '/destacados', label: 'Destacados', route: true },
  { to: '/promociones', label: 'Promociones', route: true },
  { to: '/#nosotros', label: 'Nosotros' },
  { to: '/#contacto', label: 'Contacto' }
];

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          <img className="logo-mark" src="/logo-pequeaventuras.svg" alt="" aria-hidden="true" />
          <span className="logo-word">
            Peque<span>Aventuras</span>
          </span>
        </NavLink>
        <nav className="main-nav" aria-label="Menu principal">
          {navItems.map((item) => (
            item.route ? (
              <NavLink key={item.label} to={item.to}>
                {item.label}
              </NavLink>
            ) : (
              <a key={item.label} href={item.to}>
                {item.label}
              </a>
            )
          ))}
        </nav>
        <CartButton />
      </div>
    </header>
  );
}

export default Header;
