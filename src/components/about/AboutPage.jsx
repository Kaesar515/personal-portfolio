import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import profilePhoto from '../../assets/images/profile/profile-photo.jpg';

const AboutPage = () => {
  const { t } = useTranslation();

  // Get language and skill lists from translations
  const languages = t('about.languages', { returnObjects: true }) || [];
  const skillsList = t('about.skillsList', { returnObjects: true }) || [];

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Centered Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            <span className="text-white">{t('about.title1')} </span>
            <span className="text-[#00e1ff]">{t('about.title2')}</span>
          </h1>
        </div>

        {/* First Row: Image and Main Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start mb-12">
          {/* Left Column: Image */}
          <div className="flex justify-center">
            <div className="w-[60%] aspect-w-4 aspect-h-5 rounded-lg overflow-hidden shadow-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800">
              <img
                src={profilePhoto}
                alt={t('altTexts.aliAjib')}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Column: About Me Prose */}
          <div className="prose prose-lg text-gray-200 max-w-none">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 space-y-4">
              <p>{t('about.paragraph1')}</p>
              <p>
                {t('about.paragraph2_part1')}{/*
                */} React, Tailwind CSS, {t('about.paragraph2_part2')} Canvas API.{/*
                */} {t('about.paragraph2_part3')} TCM Security {t('about.paragraph2_part4')} Linux {t('about.paragraph2_part5')}
              </p>
              <p>{t('about.paragraph3')}</p>
              <p className="text-[#00e1ff] font-semibold">{t('about.tagline')}</p>
              <div className="pt-4 border-t border-gray-700/50">
                <a
                  href="https://www.linkedin.com/in/ali-ajib-5a5b5c/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-300 hover:text-[#00e1ff] transition-colors duration-300 group"
                >
                  <span>{t('about.linkedinLink')}</span>
                  <svg className="h-5 w-5 ml-2 text-[#00e1ff] group-hover:text-[#00f2ff] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Fluent In and Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
          {/* Left Column: Fluent In */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('about.fluentTitle')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Map over languages from translation file */}
              {Array.isArray(languages) && languages.map((language) => (
                <div
                  key={language.key}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300"
                >
                  <span className="text-gray-200">{language.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Skills */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{t('about.skillsTitle')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Map over skills from translation file */}
              {Array.isArray(skillsList) && skillsList.map((skill) => (
                <div
                  key={skill.key}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 text-center hover:border-[#00e1ff] transition-colors duration-300"
                >
                  <span className="text-gray-200">{skill.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage; 