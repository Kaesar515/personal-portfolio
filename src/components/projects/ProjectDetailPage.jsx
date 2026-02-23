import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { baseProjects } from '../../data/projectsData';

// Lightbox Component
const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white hover:text-[#00e1ff] transition-colors" onClick={onClose}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <button className="absolute left-4 text-white hover:text-[#00e1ff] transition-colors" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div className="relative max-w-7xl max-h-[90vh] w-full px-4" onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex]} alt={`Screenshot ${currentIndex + 1}`} className="w-full h-full object-contain max-h-[90vh] rounded-lg shadow-2xl shadow-[#00e1ff]/20" />
      </div>
      <button className="absolute right-4 text-white hover:text-[#00e1ff] transition-colors" onClick={(e) => { e.stopPropagation(); onNext(); }}>
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};


// Local data removed - using centralized data from baseProjects

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Find index and build project data
  const currentIndex = baseProjects.findIndex(p => p.slug === slug);
  const baseProject = baseProjects[currentIndex];

  const prevProject = currentIndex > 0 ? baseProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < baseProjects.length - 1 ? baseProjects[currentIndex + 1] : null;

  const project = baseProject ? {
    ...baseProject,
    title: t(baseProject.titleKey),
    longDescription: t(`projectDetails.${slug}.detail.longDescription`),
    features: t(`projectDetails.${slug}.detail.features`, { returnObjects: true }) || [],
    challenges: t(`projectDetails.${slug}.detail.challenges`, { returnObjects: true }) || [],
    imageDescriptions: t(`projectDetails.${slug}.detail.imageDescriptions`, { returnObjects: true }) || [],
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

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen py-16 sm:py-24 custom-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#projects"
            className="inline-flex items-center text-[#00e1ff] hover:text-[#00f2ff] transition-colors duration-300 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] group"
          >
            <svg className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {t('projectDetail.backToProjectsOverview')}
          </Link>

          <div className="flex space-x-4">
            {prevProject && (
              <Link
                to={`/projects/${prevProject.slug}`}
                className="text-gray-400 hover:text-[#00e1ff] transition-colors text-sm"
              >
                ← {t('projectDetail.prevProject')}
              </Link>
            )}
            {nextProject && (
              <Link
                to={`/projects/${nextProject.slug}`}
                className="text-gray-400 hover:text-[#00e1ff] transition-colors text-sm"
              >
                {t('projectDetail.nextProject')} →
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{project.title}</h1>

        {/* Project Description - Moved up for SUMO project */}
        <div className="bg-gray-900/50 backdrop-blur-3xl rounded-lg p-6 border border-gray-800 mb-8">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-line text-gray-300" dangerouslySetInnerHTML={{ __html: project.longDescription }}></div>
          </div>
        </div>

        {/* SUMO Project Gallery (Side-by-Side) */}
        {slug === 'traffic-simulation' && project.images && project.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {project.images.map((img, index) => (
              <div key={index} className="flex flex-col">
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-[#00e1ff] transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={img}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
                {project.imageDescriptions && project.imageDescriptions[index] && (
                  <div className="mt-3 bg-gray-900/50 backdrop-blur-3xl border border-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-sm italic">
                      {project.imageDescriptions[index]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Image Gallery - Keep conditional rendering logic (For other projects or Personal Portfolio if it had images) */}
        {slug !== 'personal-portfolio' && slug !== 'traffic-simulation' && project.images && project.images.length > 0 && (
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
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentImageIndex ? 'bg-[#00e1ff]' : 'bg-white/50'
                        }`}
                      aria-label={t('projects.goToImageAria', { number: index + 1 })} // Reuse key
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Project Description (Rendered above for SUMO, kept here for others if needed structure changes, but for now we moved it up globally or conditionally?) 
            Actually, let's keep it here for non-SUMO projects if we want different layouts, 
            OR since we moved it up generally, we remove it from here to avoid duplication. 
            The user asked for Description -> Images for SUMO. 
            Let's conditionally hide this one if it's already shown above? 
            Or better, let's just move it up for ALL projects as it's a good standard. 
            I already added it above. So I will REMOVE this block. 
        */}

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('projectDetail.featuresTitle')}</h2>
          <div className="bg-gray-900/50 backdrop-blur-3xl rounded-lg p-6 border border-gray-800">
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
          <div className="bg-gray-900/50 backdrop-blur-3xl rounded-lg p-6 border border-gray-800">
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
              <div key={tech} className="bg-gray-900/50 backdrop-blur-3xl rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300">
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
              <div key={tool} className="bg-gray-900/50 backdrop-blur-3xl rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300">
                <span className="text-gray-200">{tool}</span> {/* Keep tool names untranslated */}
              </div>
            ))}
          </div>
        </div>

        {/* View the code section */}
        {project.githubUrl && (
          <div className="flex justify-center mb-16">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-gray-900/60 backdrop-blur-3xl hover:bg-gray-800 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300 group"
            >
              <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-[#00e1ff]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
              {t('projectDetail.viewOnGithub')}
            </a>
          </div>
        )}

        {/* Bottom Modern Navigation with 3D Lift */}
        <div className="mt-16 pt-12 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="w-full sm:w-auto">
            {prevProject ? (
              <Link
                to={`/projects/${prevProject.slug}`}
                className="group flex flex-col items-start p-6 rounded-2xl bg-cyan-500/5 backdrop-blur-3xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-500 w-full sm:min-w-[240px] shadow-[0_6px_0_0_rgba(0,225,255,0.2)] hover:shadow-[0_12px_0_0_rgba(0,225,255,0.3)] hover:-translate-y-2 active:translate-y-0 active:shadow-none relative overflow-hidden"
              >
                {/* Subtle animated gradient overlay - universal reverse sweep (R to L) */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[100%] animate-shine-sweep-reverse transition-transform duration-1000 ease-in-out" />

                <span className="text-xs text-cyan-500/70 mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-[0.2em] font-bold">{t('projectDetail.prevProject')}</span>
                <div className="flex items-center text-white text-lg font-bold group-hover:text-cyan-400 relative z-10">
                  <svg className="w-6 h-6 mr-3 transform group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                  {t(prevProject.titleKey)}
                </div>
              </Link>
            ) : <div className="hidden sm:block w-[240px]" />}
          </div>

          <div className="w-full sm:w-auto">
            {nextProject ? (
              <Link
                to={`/projects/${nextProject.slug}`}
                className="group flex flex-col items-end p-6 rounded-2xl bg-cyan-500/5 backdrop-blur-3xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-500 w-full sm:min-w-[240px] shadow-[0_6px_0_0_rgba(0,225,255,0.2)] hover:shadow-[0_12px_0_0_rgba(0,225,255,0.3)] hover:-translate-y-2 active:translate-y-0 active:shadow-none relative overflow-hidden"
              >
                {/* Subtle animated gradient overlay - universal sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] animate-shine-sweep transition-transform duration-1000 ease-in-out" />

                <span className="text-xs text-cyan-500/70 mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-[0.2em] font-bold">{t('projectDetail.nextProject')}</span>
                <div className="flex items-center text-white text-lg font-bold group-hover:text-cyan-400 relative z-10">
                  {t(nextProject.titleKey)}
                  <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ) : <div className="hidden sm:block w-[240px]" />}
          </div>
        </div>
      </div>
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <Lightbox
          images={project.images}
          currentIndex={currentImageIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage; 