import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('aliajib1997@gmail.com');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create formatted email body
    const emailBody = `
Name: ${formData.user_name}
Email: ${formData.user_email}

Message:
${formData.message}
    `.trim();

    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=aliajib1997@gmail.com&su=${encodeURIComponent(`From Portfolio Website: ${formData.subject}`)}&body=${encodeURIComponent(emailBody)}`;

    // Open Gmail in new tab
    window.open(gmailUrl, '_blank');

    // Show success message
    setSubmitSuccess(true);
    
    // Reset form
    setFormData({
      user_name: '',
      user_email: '',
      subject: '',
      message: ''
    });

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Get in </span>
            <span className="text-[#00e1ff]">Touch</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Send Me a Message</h2>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-500/30 rounded-lg text-green-300">
                <p>Opening your email client to send the message...</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent select-text"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent select-text"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent select-text"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent select-text"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 text-lg font-medium rounded-md text-white bg-[#00e1ff] hover:bg-[#00d1ff] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#00e1ff]/10 flex items-center justify-center">
                    <svg className="h-5 w-5 text-[#00e1ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="relative">
                    <h3 className="text-lg font-medium text-white">Email</h3>
                    <button 
                      onClick={handleCopyEmail}
                      className="text-gray-300 hover:text-[#00e1ff] transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span className="select-text">aliajib1997@gmail.com</span>
                      <svg 
                        className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${copySuccess ? 'text-green-400' : 'text-[#00e1ff]'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        {copySuccess ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        )}
                      </svg>
                      {copySuccess && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-900/90 text-green-300 px-2 py-1 rounded text-sm">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#00e1ff]/10 flex items-center justify-center">
                    <svg className="h-5 w-5 text-[#00e1ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Location</h3>
                    <a 
                      href="https://www.google.com/maps/place/Frankfurt,+Germany" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#00e1ff] transition-colors duration-300"
                    >
                      Frankfurt, Germany
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Connect With Me</h2>
              
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/Kaesar515" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-[#00e1ff] hover:bg-gray-700 transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/ali-ajib-1ab6532b4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-[#00e1ff] hover:bg-gray-700 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=aliajib1997@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-[#00e1ff] hover:bg-gray-700 transition-colors duration-300"
                  aria-label="Gmail"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 