import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// This will be replaced with actual project data from a database or CMS later
const projectsData = {
  'personal-portfolio': {
    title: "Personal Portfolio",
    description: "A modern portfolio website built with React, featuring clean design, smooth animations, and an interactive network background.",
    longDescription: `
      This portfolio website showcases my work and skills as a developer. Built with modern web technologies,
      it features a clean, minimalist design with smooth animations and an interactive network background.
      
      Key Features:
      • Interactive network background with dynamic node connections
      • Responsive design that works on all devices
      • Modern UI with smooth transitions and animations
      • Project showcase with detailed project information
      • Contact form for easy communication
    `,
    technologies: ["React", "Tailwind CSS", "Vite"],
    images: [], // We can add images later
    githubUrl: "", // To be added later
    features: [
      "Interactive Network Background",
      "Responsive Design",
      "Modern UI/UX",
      "Project Showcase",
      "Contact Form"
    ],
    challenges: [
      "Implementing complex canvas animations",
      "Optimizing performance for smooth interactions",
      "Creating a responsive and accessible design"
    ]
  }
  // Add more projects here
};

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const project = projectsData[slug];
  
  // Add useEffect to scroll to top on component mount/slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]); // Dependency array ensures it runs when slug changes
  
  if (!project) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center custom-scrollbar">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Project not found</h2>
          <Link 
            to="/projects"
            className="text-[#00e1ff] hover:text-[#00f2ff] transition-colors duration-300"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="min-h-screen py-16 sm:py-24 custom-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button - Changed from Link, added shadow and history.back() */}
        <button 
          type="button"
          onClick={() => window.history.back()} 
          className="inline-flex items-center text-[#00e1ff] hover:text-[#00f2ff] transition-colors duration-300 mb-8 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Project Title - Update to even stronger shadow */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{project.title}</h1>

        {/* Image Gallery - Conditionally render based on slug */}
        {slug !== 'personal-portfolio' && project.images && project.images.length > 0 && (
          <div className="relative aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden">
            <img 
              src={project.images[currentImageIndex]} 
              alt={`${project.title} screenshot ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover"
            />
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentImageIndex ? 'bg-[#00e1ff]' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Project Description - Wrapped */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border border-gray-800 mb-8">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-line text-gray-300">
              {project.longDescription}
            </div>
          </div>
        </div>

        {/* Technologies - Add shadow to h2 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">Technologies Used</h2>
          {/* Use grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {project.technologies.map((tech) => (
              /* Use div with skill box styling */
              <div
                key={tech}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300"
              >
                <span className="text-gray-200">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features - Add shadow to h2 */}
        <div className="mb-12"> {/* Keep outer spacing div */}
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">Key Features</h2>
          {/* Box applied only to the list wrapper */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <svg className="w-6 h-6 text-[#00e1ff] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Challenges & Solutions - Add shadow to h2 */}
        <div className="mb-12"> {/* Keep outer spacing div */}
          <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">Challenges Overcome</h2>
           {/* Box applied only to the list wrapper */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <ul className="space-y-2">
              {project.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <svg className="w-6 h-6 text-[#00e1ff] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* GitHub Link */}
        {project.githubUrl && (
          <div className="flex justify-center">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              View Code on GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage; 