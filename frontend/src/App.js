import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;