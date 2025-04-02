import React from 'react';

const ProjectCard = ({ title, description, technologies, imageUrl, demoUrl, githubUrl }) => (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-[#00e1ff] transition-colors duration-300">
    {imageUrl && (
      <div className="aspect-w-16 aspect-h-9">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
    )}
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
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
      <div className="flex gap-4 pt-4">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-[#00e1ff] hover:bg-[#00d1ff] transition-colors duration-300"
          >
            Live Demo
          </a>
        )}
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
      </div>
    </div>
  </div>
);

const ProjectsPage = () => {
  const projects = [
    {
      title: "Personal Portfolio",
      description: "A modern portfolio website built with React, featuring clean design and smooth animations.",
      technologies: ["React", "Tailwind CSS", "Vite"],
      imageUrl: "/projects/portfolio.jpg",
      demoUrl: "https://aliajib.com",
      githubUrl: "https://github.com/yourusername/portfolio"
    },
    // Add more projects here
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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