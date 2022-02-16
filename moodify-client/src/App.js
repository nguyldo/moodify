import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './views/Login';
import Dashboard from './views/Dashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import './styles/button.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
