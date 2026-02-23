import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { baseProjects } from '../../data/projectsData';
import profilePhoto from '../../assets/images/profile/logo.jpg';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsHovered, setIsProjectsHovered] = useState(false);
  const [isMobileProjectsOpen, setIsMobileProjectsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const dropdownTimeout = useRef(null);
  const navRef = useRef(null);

  // Trigger loading bar on route change
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle clicking a project in dropdown - ensure it closes
  const handleProjectClick = () => {
    setIsProjectsHovered(false);
    setIsMobileProjectsOpen(false);
    setIsMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsMobileProjectsOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleProjectsMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setIsProjectsHovered(true);
  };

  const handleProjectsMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsProjectsHovered(false);
    }, 150);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-3xl z-50 border-b border-cyan-500/30">
      {/* Top Loading Bar */}
      <div
        className={`absolute top-0 left-0 h-[2px] bg-cyan-400 transition-all duration-700 ease-out z-[60] ${isNavigating ? 'w-full opacity-100' : 'w-0 opacity-0'
          }`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Profile */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            <div className="relative group">
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-cyan-400 transition-colors duration-300">
                <img
                  src={profilePhoto}
                  alt={t('altTexts.aliAjib')}
                  className="h-full w-full object-cover pointer-events-none"
                />
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

          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavLink to="/">{t('nav.home')}</NavLink>
                <NavLink to="/#about">{t('nav.about')}</NavLink>

                {/* Projects with Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={handleProjectsMouseEnter}
                  onMouseLeave={handleProjectsMouseLeave}
                >
                  <NavLink to="/#projects">{t('nav.projects')}</NavLink>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 mt-1 w-64 bg-black/90 backdrop-blur-3xl border border-cyan-500/30 rounded-lg shadow-2xl transition-all duration-300 transform ${isProjectsHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                  >
                    <div className="py-2">
                      <a
                        href="/#projects"
                        onClick={handleProjectClick}
                        className="block px-4 py-2 text-sm text-cyan-400 font-bold hover:bg-cyan-500/10 transition-colors border-b border-cyan-500/10 mb-1"
                      >
                        {t('projects.viewAll')}
                      </a>
                      {baseProjects.map((project) => (
                        <Link
                          key={project.slug}
                          to={`/projects/${project.slug}`}
                          onClick={handleProjectClick}
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
                        >
                          {t(project.titleKey)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <NavLink to="/#contact">{t('nav.contact')}</NavLink>
              </div>
            </div>

            {/* Desktop Language Switcher */}
            <div className="ml-4 hidden md:flex items-center space-x-1 text-sm">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-cyan-400'} transition-colors`}
              >
                EN
              </button>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-2 py-1 rounded ${i18n.language === 'de' ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-cyan-400'} transition-colors`}
              >
                DE
              </button>
            </div>

            {/* Mobile Language Switcher - Added Here */}
            <div className="ml-4 flex md:hidden items-center space-x-1 text-sm">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-cyan-400'} transition-colors`}
              >
                EN
              </button>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-2 py-1 rounded ${i18n.language === 'de' ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-cyan-400'} transition-colors`}
              >
                DE
              </button>
            </div>

            {/* Hamburger Menu Button */}
            <div className="md:hidden ml-2"> {/* Added ml-2 for spacing */}
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
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-90 border-t border-cyan-500/20">
          <div className="flex items-center space-x-2 px-3 py-2 border-b border-cyan-500/20 mb-2">
            <div className="h-6 w-6 rounded-full overflow-hidden border border-cyan-500/20">
              <img
                src={profilePhoto}
                alt={t('altTexts.aliAjib')}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-gray-300 text-xs font-medium">Ali Ajib</span>
          </div>
          <MobileNavLink to="/" onClick={toggleMenu}>{t('nav.home')}</MobileNavLink>
          <MobileNavLink to="/#about" onClick={toggleMenu}>{t('nav.about')}</MobileNavLink>

          {/* Mobile Projects Toggle */}
          <div>
            <button
              onClick={() => setIsMobileProjectsOpen(!isMobileProjectsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-900 transition-all duration-300"
            >
              <span>{t('nav.projects')}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isMobileProjectsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isMobileProjectsOpen ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="pl-4 space-y-1 bg-gray-900/30 rounded-lg py-1">
                <a
                  href="/#projects"
                  onClick={handleProjectClick}
                  className="block px-3 py-2 text-sm text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
                >
                  {t('projects.viewAll')}
                </a>
                {baseProjects.map((project) => (
                  <Link
                    key={project.slug}
                    to={`/projects/${project.slug}`}
                    onClick={handleProjectClick}
                    className="block px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {t(project.titleKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <MobileNavLink to="/#contact" onClick={toggleMenu}>{t('nav.contact')}</MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      const targetHash = to.substring(1); // e.g., "#about"

      if (location.pathname === '/') {
        // We are already on home, just scroll
        const element = document.querySelector(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // We are on another page, navigate to home and then the hash
        navigate(to);
      }
    } else if (to === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (onClick) onClick(e);
  };

  const isHash = to.startsWith('/#');
  const baseClasses = "text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  if (isHash) {
    return (
      <a href={to} onClick={handleClick} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={baseClasses} onClick={handleClick}>
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMobileClick = (e) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      const targetHash = to.substring(1);

      if (location.pathname === '/') {
        const element = document.querySelector(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(to);
      }
    } else if (to === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (onClick) onClick(e);
  };

  const baseClasses = "block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-900 transition-all duration-300 cursor-pointer";

  if (to.startsWith('/#')) {
    return (
      <a href={to} className={baseClasses} onClick={handleMobileClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={baseClasses} onClick={handleMobileClick}>
      {children}
    </Link>
  );
};

export default Navbar; 