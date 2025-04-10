import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import profilePhoto from '../../assets/images/profile/barphoto.jpg';
import AboutPage from '../about/AboutPage';
import ProjectsPage from '../projects/ProjectsPage';
import ContactPage from '../contact/ContactPage';

// Helper component for styled scroll buttons
const ScrollLinkButton = ({ href, children }) => {
  const { i18n } = useTranslation(); // Get i18n for language check
  const isGerman = i18n.language === 'de';

  // Conditional padding classes (px-4 py-2 for German mobile)
  const paddingClasses = isGerman ? "px-4 py-2 md:px-8 md:py-3" : "px-8 py-3";
  // Conditional text size classes (text-base for German mobile)
  const textSizeClasses = isGerman ? "text-base md:text-lg" : "text-lg";
  // Define base classes excluding padding and text size
  const baseButtonClasses = `group relative font-semibold rounded-md text-black bg-[#00e1ff] hover:bg-[#00f2ff] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-[0_8px_16px_rgba(0,225,255,0.3),0_3px_6px_rgba(0,225,255,0.4)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,225,255,0.4),0_6px_12px_rgba(0,225,255,0.6)] -translate-y-0.5 hover:-translate-y-1 active:translate-y-0 before:absolute before:inset-0 before:rounded-md before:bg-[#00e1ff] before:transition-opacity before:duration-300 before:opacity-0 hover:before:opacity-20 before:-z-10 before:blur-xl`;

  return (
    <a href={href} className={`${baseButtonClasses} ${paddingClasses} ${textSizeClasses}`}>
      <span className="relative z-10">{children}</span>
    </a>
  );
};

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';

  // Define base classes that are always present
  const h1BaseClasses = "font-bold mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]";
  // Conditional margin for tagline
  const pMarginClass = isGerman ? "mb-6 md:mb-8" : "mb-8";
  const pBaseClasses = `text-gray-300 ${pMarginClass} [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]`;

  // Define size classes conditionally based on language for mobile, keeping md+ sizes consistent
  const h1SizeClasses = isGerman
    ? "text-4xl md:text-7xl" // German: smaller on mobile, default on md+
    : "text-5xl md:text-7xl"; // Others: default size

  const pSizeClasses = isGerman
    ? "text-lg md:text-2xl" // German: smaller on mobile, default on md+
    : "text-xl md:text-2xl"; // Others: default size

  // Conditional padding for 'Learn More' button (px-4 py-2 for German mobile)
  const learnMorePaddingClasses = isGerman ? "px-4 py-2 md:px-8 md:py-3" : "px-8 py-3";
  // Conditional text size for 'Learn More' button (text-base for German mobile)
  const learnMoreTextSizeClasses = isGerman ? "text-base md:text-lg" : "text-lg";
  // Base classes for 'Learn More' button (without padding and text size)
  const learnMoreBaseClasses = `group relative font-semibold rounded-md text-white bg-gray-800 hover:bg-gray-700 border-2 border-[#00e1ff]/50 hover:border-[#00e1ff] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 backdrop-blur-sm shadow-[0_8px_16px_rgba(0,225,255,0.1),0_3px_6px_rgba(0,225,255,0.2)] hover:shadow-[0_12px_24px_rgba(0,225,255,0.2),0_6px_12px_rgba(0,225,255,0.3)] -translate-y-0.5 hover:-translate-y-1 active:translate-y-0 before:absolute before:inset-0 before:rounded-md before:bg-[#00e1ff] before:transition-opacity before:duration-300 before:opacity-0 hover:before:opacity-5 before:-z-10 before:blur-xl`;

  // Conditional margin/gap for the image/button container
  const imageButtonContainerMarginClass = isGerman ? "mt-6 md:mt-8" : "mt-8";
  const imageButtonContainerGapClass = isGerman ? "gap-6 md:gap-8" : "gap-8";

  return (
    <div className="">
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in-down">
              <h1 className={`${h1BaseClasses} ${h1SizeClasses}`}>
                <span className="text-white">
                  {t('home.greeting')} {" "}
                </span>
                <span className="text-[#00e1ff]">
                  Ali Ajib
                </span>
              </h1>
              <p className={`${pBaseClasses} ${pSizeClasses}`}>
                {t('home.tagline')}
              </p>
              <div className={`flex flex-col items-center justify-center ${imageButtonContainerGapClass} ${imageButtonContainerMarginClass}`}>
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#00e1ff]/30 hover:border-[#00e1ff] transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
                  <img
                    src={profilePhoto}
                    alt={t('altTexts.aliAjib')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <ScrollLinkButton href="#projects">{t('home.viewProjects')}</ScrollLinkButton>
                    <a
                      href="#about"
                      className={`${learnMoreBaseClasses} ${learnMorePaddingClasses} ${learnMoreTextSizeClasses}`}
                    >
                      <span className="relative z-10">{t('home.learnMore')}</span>
                    </a>
                    <ScrollLinkButton href="#contact">{t('home.getInTouch')}</ScrollLinkButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator Line - Adjusted for mobile (35% shorter) */}
      <div className="h-1.5 w-40 sm:w-64 mx-auto my-4 bg-[#00e1ff]/60 rounded-full shadow-md shadow-[#00e1ff]/40"></div>

      <section 
        id="about" 
        className="py-4 md:py-8"
      >
        <AboutPage />
      </section>

      {/* Separator Line - Adjusted for mobile (35% shorter) */}
      <div className="h-1.5 w-40 sm:w-64 mx-auto my-4 bg-[#00e1ff]/60 rounded-full shadow-md shadow-[#00e1ff]/40"></div>

      <section 
        id="projects" 
        className="py-4 md:py-8"
      >
        <ProjectsPage />
      </section>

      {/* Separator Line - Adjusted for mobile (35% shorter) */}
      <div className="h-1.5 w-40 sm:w-64 mx-auto my-4 bg-[#00e1ff]/60 rounded-full shadow-md shadow-[#00e1ff]/40"></div>

      <section 
        id="contact" 
        className="py-4 md:py-8"
      >
        <ContactPage />
      </section>
    </div>
  );
};

export default HomePage; 