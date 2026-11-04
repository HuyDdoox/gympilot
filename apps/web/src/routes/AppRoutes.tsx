import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App.js';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};
