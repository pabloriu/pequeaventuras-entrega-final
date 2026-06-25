import { Outlet } from 'react-router-dom';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

function PublicLayout() {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;
