import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="animate-fade-in-down">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-white">Hi, I'm </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Ali Ajib
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            IT Student & Future Developer
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link
              to="/projects"
              className="px-6 py-3 text-lg font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-cyan-500/20 transition-all duration-300"
            >
              View Projects
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 text-lg font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 