import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add more routes as we create components */}
          <Route path="*" element={<div className="text-center py-20">Page not found!</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
