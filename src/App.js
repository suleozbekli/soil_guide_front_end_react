import React from 'react';
import './App.css';
import Authentication from './pages/Authentication/Authentication';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Authentication/HomePage';
import AddLand from './pages/Authentication/Lands/AddLand';



function App() {
  return (
  
      <div className="App">
        <Routes>
          <Route path='/*' element={<Authentication />} />
          <Route path='/home' element={<HomePage />} />
      </Routes>
      </div>
   );
}

export default App;

