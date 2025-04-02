import React from 'react';
import profilePhoto from '../../assets/images/profile/profile-photo.jpg';

const AboutPage = () => {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="flex justify-center">
            <div className="w-[60%] aspect-w-4 aspect-h-5 rounded-lg overflow-hidden shadow-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800">
              <img
                src={profilePhoto}
                alt="Ali Ajib"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">About </span>
              <span className="text-[#00e1ff]">Me</span>
            </h1>

            <div className="prose prose-lg text-gray-200 max-w-none">
              <p className="mb-6">
                I am a passionate IT student with a deep interest in software development
                and modern web technologies. My journey in tech is driven by a desire
                to create innovative solutions that make a difference.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-[#00e1ff]">
                  IT and Computer Science
                </h3>
                <p className="text-gray-300 mt-2">
                  Currently pursuing my degree with a focus on software development
                  and web technologies.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Skills</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['React', 'JavaScript', 'HTML/CSS', 'Node.js', 'Git', 'Tailwind CSS'].map((skill) => (
                  <div
                    key={skill}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300"
                  >
                    <span className="text-gray-200">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 