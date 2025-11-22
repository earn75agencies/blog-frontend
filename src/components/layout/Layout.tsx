import { Outlet } from 'react-router-dom';
import Header from './Header';
import SecondaryNav from './SecondaryNav';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <SecondaryNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <Outlet />
          </div>
          <aside className="hidden lg:block w-80">
            <Sidebar />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

