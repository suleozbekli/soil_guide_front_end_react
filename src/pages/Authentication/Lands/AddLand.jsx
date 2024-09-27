import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, MenuItem, Typography } from '@mui/material';

const landTypes = [
  { value: 'TARLA', label: 'Tarla' },
  { value: 'BAHCE', label: 'Bahçe' },
  { value: 'BAG', label: 'Bağ' },
  { value: 'DIGER', label: 'Diğer' }
];

const AddLand = () => {
  const [landType, setLandType] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [neighbourhoodId, setNeighbourhoodId] = useState('');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [area, setArea] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { userId, username } = location.state || {};

  useEffect(() => {
    // Fetch all cities when component mounts
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/cities');
        const data = await response.json();
        setCities(data);
     
      } catch (error) {
        console.error('Failed to fetch cities', error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (cityId) {
        try {
          const response = await fetch(`http://localhost:8080/api/districts/byCity/${cityId}`);
          const data = await response.json();
          setDistricts(data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    };
  
    fetchDistricts();
  }, [cityId]);
  
  useEffect(() => {
    const fetchNeighbourhoods = async () => {
      if (districtId) {
        try {
          const response = await fetch(`http://localhost:8080/api/neighbourhoods/byDistrict/${districtId}`);
          const data = await response.json();
          setNeighbourhoods(data);
        } catch (error) {
          console.error('Failed to fetch neighbourhoods:', error);
        }
      }
    };
  
    fetchNeighbourhoods();
  }, [districtId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLand = {
      landType,
      cityId: cityId,  // ID olarak gönderiliyor
      districtId: districtId,  // ID olarak gönderiliyor
      neighbourhoodId: neighbourhoodId,  // ID olarak gönderiliyor
      username,
      userId,
      area
    };
    console.log("New Land Data:", newLand);

    try {
      const response = await fetch('http://localhost:8080/api/lands/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLand)
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/lands-list', {
          state: { 
            userId: newLand.userId,
            username: newLand.username,
            neighbourhoodId: newLand.neighbourhoodId
          }
        });
        console.log(neighbourhoodId);
      } else {
        console.error('Failed to add land', response.status, await response.text());
      }
    } catch (error) {
      console.error('Network error or other error:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Arazi Ekle</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Arazi Tipi"
          value={landType}
          onChange={(e) => setLandType(e.target.value)}
          fullWidth
          margin="normal"
        >
          {landTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Şehir"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          fullWidth
          margin="normal"
        >
          {cities.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="İlçe"
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          fullWidth
          margin="normal"
        >
          {districts.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Mahalle"
          value={neighbourhoodId}
          onChange={(e) => setNeighbourhoodId(e.target.value)}
          fullWidth
          margin="normal"
        >
          {neighbourhoods.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="number"
          label="Alan (m²)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Kaydet</Button>
      </form>
    </div>
  );
};

export default AddLand;
