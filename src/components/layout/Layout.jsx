import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen">
        <Navbar />
        <main className="pt-20 pb-12">
          <Outlet />
        </main>
        <footer className="bg-black bg-opacity-70 text-center py-6 border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Ali Ajib. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Built with React & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout; 