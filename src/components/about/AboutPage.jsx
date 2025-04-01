import React from 'react';
import profilePhoto from '../../assets/images/profile/profile-photo.jpg';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image section */}
        <div className="relative max-w-sm mx-auto w-1/2">
          <div className="aspect-w-4 aspect-h-5 rounded-lg overflow-hidden bg-gray-800 border-2 border-cyan-500/30">
            <img
              src={profilePhoto}
              alt="Ali Ajib"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Content section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            About <span className="text-cyan-400">Me</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Your introduction goes here. Write about your background, interests, and what drives you in the field of IT and development.
          </p>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Education</h2>
            <div className="text-gray-300">
              <p>Your education details go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 