import { Link } from 'react-router-dom';
import NeuralBackground from './NeuralBackground';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <NeuralBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                Hi, I'm{" "}
              </span>
              <span className="text-[#00e1ff] [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                Ali Ajib
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
              IT Student & Future Developer
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link
                to="/projects"
                className="px-6 py-3 text-lg font-medium rounded-md text-white bg-[#00e1ff] hover:bg-[#00d1ff] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
              >
                View Projects
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 text-lg font-medium rounded-md text-white bg-gray-800/80 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 