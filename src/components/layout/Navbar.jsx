import { useState } from 'react';
import { Link } from 'react-router-dom';
import profilePhoto from '../../assets/images/profile/barphoto.jpg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md z-50 border-b border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Profile */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            <div className="relative group">
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-cyan-400/30 group-hover:border-cyan-400 transition-colors duration-300">
                <img
                  src={profilePhoto}
                  alt="Ali Ajib"
                  className="h-full w-full object-cover pointer-events-none"
                />
              </div>
              <div className="hidden group-hover:block absolute top-0 left-0 transform -translate-y-2 translate-x-16 z-50">
                <div className="h-40 w-40 rounded-lg overflow-hidden border-2 border-cyan-400 shadow-lg">
                  <img
                    src={profilePhoto}
                    alt="Ali Ajib"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <Link 
              to="/"
              onClick={(e) => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors duration-300"
            >
              <span className="text-cyan-400">A</span>li <span className="text-cyan-400">A</span>jib
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/#about">About</NavLink>
              <NavLink to="/#projects">Projects</NavLink>
              <NavLink to="/#contact">Contact</NavLink>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-cyan-400 hover:text-white hover:bg-gray-900 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-90 border-t border-cyan-500/20">
          <div className="flex items-center space-x-2 px-3 py-2 border-b border-cyan-500/20 mb-2">
            <div className="h-6 w-6 rounded-full overflow-hidden border border-cyan-500/20">
              <img
                src={profilePhoto}
                alt="Ali Ajib"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-gray-300 text-xs font-medium">Ali Ajib</span>
          </div>
          <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
          <MobileNavLink to="/#about" onClick={toggleMenu}>About</MobileNavLink>
          <MobileNavLink to="/#projects" onClick={toggleMenu}>Projects</MobileNavLink>
          <MobileNavLink to="/#contact" onClick={toggleMenu}>Contact</MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  if (to.startsWith('/#')) {
    return (
      <a
        href={to}
        className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full"
      >
        {children}
      </a>
    );
  } 
  const handleClick = (e) => {
    if (to === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <Link
      to={to}
      className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full"
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }) => {
  if (to.startsWith('/#')) {
    return (
      <a
        href={to}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-900 transition-all duration-300"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  const handleMobileClick = (e) => {
    if (to === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <Link
      to={to}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-900 transition-all duration-300"
      onClick={handleMobileClick}
    >
      {children}
    </Link>
  );
};

export default Navbar; 