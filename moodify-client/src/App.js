import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Submood from './views/Submood';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';

function App() {
  console.log("does this work")
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submood" element={<Submood />} />
      </Routes>
    </Router>

  );
}

export default App;
