import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import ProjectsPage from './components/projects/ProjectsPage';
import ContactPage from './components/contact/ContactPage';
import NetworkBackground from './components/layout/background/InteractiveNetwork';
import './App.css';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-black">
        <div className="fixed inset-0 z-0">
          <NetworkBackground />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<div className="text-center py-20 text-white">Page not found!</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
