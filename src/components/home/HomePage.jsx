import { Link } from 'react-router-dom';
import profilePhoto from '../../assets/images/profile/profile-photo.jpg';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in-down">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="text-white">
                  Hi, I'm{" "}
                </span>
                <span className="text-[#00e1ff]">
                  Ali Ajib
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                IT Student & Future Developer
              </p>
              <div className="flex flex-col items-center justify-center gap-8 mt-8">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#00e1ff]/30 hover:border-[#00e1ff] transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
                  <img
                    src={profilePhoto}
                    alt="Ali Ajib"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/projects"
                    className="group relative px-8 py-3 text-lg font-semibold rounded-md text-black bg-[#00e1ff] hover:bg-[#00f2ff] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-[0_8px_16px_rgba(0,225,255,0.3),0_3px_6px_rgba(0,225,255,0.4)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,225,255,0.4),0_6px_12px_rgba(0,225,255,0.6)] -translate-y-0.5 hover:-translate-y-1 active:translate-y-0 before:absolute before:inset-0 before:rounded-md before:bg-[#00e1ff] before:transition-opacity before:duration-300 before:opacity-0 hover:before:opacity-20 before:-z-10 before:blur-xl"
                  >
                    <span className="relative z-10">View Projects</span>
                  </Link>
                  <Link
                    to="/about"
                    className="group relative px-8 py-3 text-lg font-semibold rounded-md text-white bg-gray-800 hover:bg-gray-700 border-2 border-[#00e1ff]/50 hover:border-[#00e1ff] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 backdrop-blur-sm shadow-[0_8px_16px_rgba(0,225,255,0.1),0_3px_6px_rgba(0,225,255,0.2)] hover:shadow-[0_12px_24px_rgba(0,225,255,0.2),0_6px_12px_rgba(0,225,255,0.3)] -translate-y-0.5 hover:-translate-y-1 active:translate-y-0 before:absolute before:inset-0 before:rounded-md before:bg-[#00e1ff] before:transition-opacity before:duration-300 before:opacity-0 hover:before:opacity-5 before:-z-10 before:blur-xl"
                  >
                    <span className="relative z-10">Learn More</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="group relative px-8 py-3 text-lg font-semibold rounded-md text-black bg-[#00e1ff] hover:bg-[#00f2ff] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-[0_8px_16px_rgba(0,225,255,0.3),0_3px_6px_rgba(0,225,255,0.4)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,225,255,0.4),0_6px_12px_rgba(0,225,255,0.6)] -translate-y-0.5 hover:-translate-y-1 active:translate-y-0 before:absolute before:inset-0 before:rounded-md before:bg-[#00e1ff] before:transition-opacity before:duration-300 before:opacity-0 hover:before:opacity-20 before:-z-10 before:blur-xl"
                  >
                    <span className="relative z-10">Get in Touch</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 