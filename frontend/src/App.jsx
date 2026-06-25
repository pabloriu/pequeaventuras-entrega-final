import { Route, Routes } from 'react-router-dom';
import PublicLayout from './components/PublicLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminProtectedRoute from './routes/AdminProtectedRoute.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminInventoryPage from './pages/admin/AdminInventoryPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminReportsPage from './pages/admin/AdminReportsPage.jsx';
import {
  AdminBannersPage,
  AdminBrandsPage,
  AdminCategoriesPage,
  AdminPromotionsPage,
  AdminUsersPage
} from './pages/admin/adminCrudConfigs.jsx';
import CartPage from './pages/public/CartPage.jsx';
import CategoryPage from './pages/public/CategoryPage.jsx';
import FeaturedPage from './pages/public/FeaturedPage.jsx';
import HomePage from './pages/public/HomePage.jsx';
import ProductDetailPage from './pages/public/ProductDetailPage.jsx';
import PromotionsPage from './pages/public/PromotionsPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categoria/:slug" element={<CategoryPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/promociones" element={<PromotionsPage />} />
        <Route path="/destacados" element={<FeaturedPage />} />
        <Route path="/carrito" element={<CartPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/productos" element={<AdminProductsPage />} />
          <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
          <Route path="/admin/marcas" element={<AdminBrandsPage />} />
          <Route path="/admin/inventario" element={<AdminInventoryPage />} />
          <Route path="/admin/promociones" element={<AdminPromotionsPage />} />
          <Route path="/admin/banners" element={<AdminBannersPage />} />
          <Route path="/admin/reportes" element={<AdminReportsPage />} />
        </Route>
      </Route>
      <Route element={<AdminProtectedRoute principalOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/administradores" element={<AdminUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
