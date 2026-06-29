import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';

const AdminLayout = () => (
  <>
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <AdminTopbar />
        <Outlet />
      </div>
    </div>
  </>
);

export default AdminLayout;
