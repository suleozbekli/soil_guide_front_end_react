import React, { useState } from 'react';
import logo from './Season Harvest Festival Autumn.png'; 
import { Card, Grid } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './SideBar';
import Login from './Login';
import Register from './Register';
import HomePage from './HomePage';
import LandsList from './Lands/LandsList';
import AddLand from './Lands/AddLand';
import AddCrop from './Crop/AddCrop';
import CropsList from './Crop/CropsList';
import AddHarvest from './Harvest/AddHarvest';
import HarvestList from './Harvest/HarvestList';
import ForgotPassword from './ForgotPassword';
import HarvestSuccessRates from './SuccessRate/HarvestSuccessRates';


const Authentication = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Grid container style={{ height: '100vh' }}>
        <Grid item xs={12} md={7} style={{ height: '100vh' }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ 
              width: '55%', 
              height: '100%', 
              objectFit: 'cover', 
              position: 'fixed', // Fixed position for persistent image
              left: 0, 
              top: 0 
            }} 
          />
        </Grid>
        <Grid item xs={12} md={5} style={{ overflowY: 'auto', height: '100vh', padding: '20px' }}>
          <Card className='card p-8' style={{ maxWidth: '400px', width: '100%', marginTop: '90px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className='flex flex-col items-center mb-5 space-y-15'>
              <h1 className='logo text-center'>Toprak Rehberi</h1>
              <p className='text-center text-sm w-[70%]'>Ekinleriniz İçin En İyi Rehber</p>
            </div>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/home' element={<HomePage />} />
              <Route path='/lands-list' element={<LandsList />} />
              <Route path='/add-land' element={<AddLand />} />
              <Route path='/add-crop' element={<AddCrop />} /> 
              <Route path='/crops-list' element={<CropsList />} /> 
              <Route path='/add-harvest' element={<AddHarvest />} /> 
              <Route path='/harvests-list' element={<HarvestList />} /> 
              <Route path='/forgot-password' element={<ForgotPassword />} /> 
              <Route path='/success-rates' element={<HarvestSuccessRates />} />  
            </Routes>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Authentication;

