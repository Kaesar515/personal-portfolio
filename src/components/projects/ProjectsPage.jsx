import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ title, description, technologies, images, githubUrl, slug }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-[#00e1ff] transition-colors duration-300">
      {/* Image Carousel - Only shown if images are provided */}
      {images && images.length > 0 && (
        <div className="relative aspect-w-16 aspect-h-9">
          <img 
            src={images[currentImageIndex]} 
            alt={`${title} screenshot ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentImageIndex ? 'bg-[#00e1ff]' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
        
        {/* Skills/Technologies Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[#00e1ff]">Technologies Used</h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm text-[#00e1ff] bg-[#00e1ff]/10 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300"
            >
              View Code
            </a>
          )}
          <Link
            to={`/projects/${slug}`}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const projects = [
    {
      title: "Personal Portfolio",
      description: "A modern portfolio website built with React, featuring clean design, smooth animations, and an interactive network background.",
      technologies: ["React", "Tailwind CSS", "Vite"],
      images: [], // We can add images later
      githubUrl: "", // To be added later
      slug: "personal-portfolio"
    },
    // Add more projects here
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24 custom-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">My </span>
            <span className="text-[#00e1ff]">Projects</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Here are some of the projects I've worked on
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-2xl text-gray-300 font-medium">
                Projects coming soon...
              </h3>
              <p className="text-gray-400 mt-2">
                Check back later for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage; 