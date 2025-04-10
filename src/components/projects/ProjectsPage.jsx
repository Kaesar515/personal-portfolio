import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import portfolioCardImage from '../../assets/images/projects/homepp.jpg';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    slug,
    title,
    description,
    technologies,
    images,
    githubUrl
  } = project;

  const stopPropagation = (e) => e.stopPropagation();

  const nextImage = (e) => {
    e.stopPropagation();
    if (images && images.length > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images && images.length > 0) {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const goToImage = (e, index) => {
      e.stopPropagation();
      setCurrentImageIndex(index);
  };

  return (
    <Link
        to={`/projects/${slug}`}
        className="block bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-[#00e1ff] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
        aria-label={t('projects.viewDetailsAria', { title })}
    >
      {images && images.length > 0 && (
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={images[currentImageIndex]}
            alt={t('projects.screenshotAlt', { title, number: currentImageIndex + 1 })}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                aria-label={t('projects.prevImageAria')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                aria-label={t('projects.nextImageAria')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(e, index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentImageIndex ? 'bg-[#00e1ff]' : 'bg-white/50'
                    }`}
                    aria-label={t('projects.goToImageAria', { number: index + 1 })}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[#00e1ff]">{t('projects.techUsed')}</h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 text-sm text-[#00e1ff] bg-[#00e1ff]/10 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopPropagation}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={t('projects.viewCodeAria', { title })}
            >
              {t('projects.viewCode')}
            </a>
          )}
          <Link
            to={`/projects/${slug}`}
            onClick={stopPropagation}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={t('projects.readMoreAria', { title })}
           >
             {t('projects.readMore')}
           </Link>
        </div>
      </div>
    </Link>
  );
};

const ProjectsPage = () => {
  const { t } = useTranslation();

  // Define base project data (non-translatable parts + keys)
  const baseProjects = [
    {
      slug: "personal-portfolio",
      titleKey: "projectDetails.personal-portfolio.title",
      descriptionKey: "projectDetails.personal-portfolio.description",
      technologies: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "Canvas API", "Git"],
      githubUrl: ""
      // Image will be added manually below
    }
    // Add other base project info here
  ];

  // Construct the final projects array with translated text
  const projects = baseProjects.map(baseProject => {
    const project = {
      ...baseProject,
      title: t(baseProject.titleKey),
      description: t(baseProject.descriptionKey),
    };
    // Manually add image for now
    if (project.slug === 'personal-portfolio') {
      project.images = [portfolioCardImage];
    }
    return project;
  });

  return (
    <div className="min-h-screen py-16 sm:py-24 custom-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            <span className="text-white">{t('projects.title1')} </span>
            <span className="text-[#00e1ff]">{t('projects.title2')}</span>
          </h1>
          <p className="text-gray-300 text-lg [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            {t('projects.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-2xl text-gray-300 font-medium">
                {t('projects.comingSoon')}
              </h3>
              <p className="text-gray-400 mt-2">
                {t('projects.checkBack')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage; 