// import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home';
import About from './components/About';
import './App.css';
import NoteState from './context/notes/NoteState';
import Login from './components/Login-Signup/Login';
import Signup from './components/Login-Signup/Signup';
import ProtectedRoute from './components/Login-Signup/ProtectedRoute';
import RedirectIfAuth from './components/Login-Signup/RedirectIfAuth';
import Landing from './components/Landing';

function App() {

  

  return (
    <NoteState>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/mynotes" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/Login" element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          } />
          <Route path="/Signup" element={
            <RedirectIfAuth>
              <Signup />
            </RedirectIfAuth>
          } />
        </Routes>
      </Router>
    </NoteState>
  );
}

export default App;
