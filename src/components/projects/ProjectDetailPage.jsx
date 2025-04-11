import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Base data structure - non-translatable parts
const projectsBaseData = {
  'personal-portfolio': {
    // Translatable keys will be used to fetch text
    technologies: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "Canvas API", "Git"],
    tools: ["VS Code", "Linux", "Windows", "Cursor", "mobile development environment", "Gemini AI API"],
    images: [], // We will add images later if needed
    githubUrl: "", // To be added later
  }
  // Add base data for other projects here
};

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation(); // Removed i18n instance
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const baseProject = projectsBaseData[slug];

  // Construct project object using the fetched values
  const project = baseProject ? {
    ...baseProject,
    title: t(`projectDetails.${slug}.title`),
    longDescription: t(`projectDetails.${slug}.detail.longDescription`),
    features: t(`projectDetails.${slug}.detail.features`, { returnObjects: true }) || [],
    challenges: t(`projectDetails.${slug}.detail.challenges`, { returnObjects: true }) || [],
  } : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center custom-scrollbar">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">{t('projectDetail.notFound')}</h2>
          <Link
            to="/projects"
            className="text-[#00e1ff] hover:text-[#00f2ff] transition-colors duration-300"
          >
            {t('projectDetail.backButton')}
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
     if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
     }
  };

  return (
    <div className="min-h-screen py-16 sm:py-24 custom-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-[#00e1ff] hover:text-[#00f2ff] transition-colors duration-300 mb-8 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {t('projectDetail.backButtonShort')}
        </button>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{project.title}</h1>

        {/* Image Gallery - Keep conditional rendering logic */}
        {slug !== 'personal-portfolio' && project.images && project.images.length > 0 && (
           <div className="relative aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden">
             <img
               src={project.images[currentImageIndex]}
               alt={t('projects.screenshotAlt', { title: project.title, number: currentImageIndex + 1 })} // Reuse key
               className="w-full h-full object-cover"
             />
             {project.images.length > 1 && (
               <>
                 <button
                   onClick={prevImage}
                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                   aria-label={t('projects.prevImageAria')} // Reuse key
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 </button>
                 <button
                   onClick={nextImage}
                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                   aria-label={t('projects.nextImageAria')} // Reuse key
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </button>
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                   {project.images.map((_, index) => (
                     <button
                       key={index}
                       onClick={() => setCurrentImageIndex(index)}
                       className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                         index === currentImageIndex ? 'bg-[#00e1ff]' : 'bg-white/50'
                       }`}
                       aria-label={t('projects.goToImageAria', { number: index + 1 })} // Reuse key
                     />
                   ))}
                 </div>
               </>
             )}
           </div>
         )}

        {/* Project Description */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border border-gray-800 mb-8">
          <div className="prose prose-invert max-w-none">
             {/* Use translated longDescription, allowing HTML */}
            <div className="whitespace-pre-line text-gray-300" dangerouslySetInnerHTML={{ __html: project.longDescription }}></div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('projectDetail.featuresTitle')}</h2>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <ul className="space-y-2">
              {/* Map over translated features array */}
              {Array.isArray(project.features) && project.features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <svg className="w-6 h-6 text-[#00e1ff] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {/* Render feature text, allowing HTML */}
                  <span dangerouslySetInnerHTML={{ __html: feature }} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Challenges & Solutions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('projectDetail.challengesTitle')}</h2>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <ul className="space-y-2">
               {/* Map over translated challenges array */}
              {Array.isArray(project.challenges) && project.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <svg className="w-6 h-6 text-[#00e1ff] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {/* Render challenge text, allowing HTML */}
                  <span dangerouslySetInnerHTML={{ __html: challenge }} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('projectDetail.techTitle')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {project.technologies.map((tech) => (
              <div key={tech} className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300">
                <span className="text-gray-200">{tech}</span> {/* Keep tech names untranslated */}
              </div>
            ))}
          </div>
        </div>

        {/* Tools & OS */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('projectDetail.toolsTitle')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {project.tools.map((tool) => (
              <div key={tool} className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300">
                <span className="text-gray-200">{tool}</span> {/* Keep tool names untranslated */}
              </div>
            ))}
          </div>
        </div>

        {/* View the code section - Removed duplicate, keep GitHub link if available */}
        {project.githubUrl && (
          <div className="flex justify-center mb-12">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
              {t('projectDetail.viewOnGithub')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage; 