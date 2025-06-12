import NavBar from '../components/NavBar';
import { Outlet } from 'react-router';

const Layout = () => (
  <>
    <NavBar />
    <main>
      <Outlet />
    </main>
  </>
);

export default Layout;
