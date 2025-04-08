import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import portfolioCardImage from '../../assets/images/projects/homepp.jpg';

const ProjectCard = ({ title, description, technologies, images, githubUrl, slug }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Stop propagation helper for nested interactives
  const stopPropagation = (e) => e.stopPropagation();

  const nextImage = (e) => {
    e.stopPropagation(); // Prevent card link navigation
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation(); // Prevent card link navigation
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (e, index) => {
      e.stopPropagation(); // Prevent card link navigation
      setCurrentImageIndex(index);
  };

  return (
    // Wrap the entire card content in a Link
    <Link 
        to={`/projects/${slug}`} 
        className="block bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-[#00e1ff] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent" // Make link block and add focus styles
        aria-label={`View details for ${title}`}
    >
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
              {/* Add stopPropagation to buttons */}
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
                    onClick={(e) => goToImage(e, index)} // Use updated handler
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
      {/* Remove the outer div as Link now handles layout */}
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

        {/* View the code section */}
        <div className="flex justify-center mb-4">
          <span className="text-[#00e1ff] hover:text-[#00f2ff] transition-colors duration-300 cursor-pointer text-lg [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            View the code → <svg className="inline-block w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopPropagation} // Prevent card link navigation
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900" // Add focus styles
              aria-label={`View code for ${title}`}
            >
              View Code
            </a>
          )}
          {/* Re-add the Read More Link with stopPropagation */}
          <Link
            to={`/projects/${slug}`}
            onClick={stopPropagation} // Prevent card link navigation
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#00e1ff] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900" // Add focus styles
            aria-label={`Read more about ${title}`}
           >
             Read More
           </Link>
        </div>
      </div>
    </Link> // End of the wrapping Link
  );
};

const ProjectsPage = () => {
  const projects = [
    {
      title: "Personal Portfolio",
      description: "A self-initiated portfolio project developed from scratch using web technologies, demonstrating problem-solving skills and programming expertise in both Linux and Windows environments.",
      technologies: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "Canvas API", "Git"],
      images: [portfolioCardImage],
      githubUrl: "", // To be added later
      slug: "personal-portfolio"
    },
    // Add more projects here
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24 custom-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            <span className="text-white">My </span>
            <span className="text-[#00e1ff]">Projects</span>
          </h1>
          <p className="text-gray-300 text-lg [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
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