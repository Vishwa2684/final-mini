import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  LiveFeed  from './pages/LiveFeed';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import Directory from './pages/Directory';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/LiveFeed' element={<LiveFeed />} />
        <Route path='/Attendance' element={<Attendance />} />
        <Route path='/Directory' element={<Directory/>} />
        <Route path='/Settings' element={<Settings/>} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
