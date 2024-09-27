import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, MenuItem, Typography } from '@mui/material';

const harvestQualities = [
  { value: 'COK_IYI', label: 'Çok İyi' },
  { value: 'NE_IYI_NE_KOTU', label: 'Ne İyi Ne Kötü' },
  { value: 'COK_KOTU', label: 'Çok Kötü' }
];

const AddHarvest = () => {
  const [landId, setLandId] = useState('');
  const [productId, setProductId] = useState('');
  const [harvestQuality, setHarvestQuality] = useState('');
  const [harvestQuantity, setHarvestQuantity] = useState('');
  const [plantedLands, setPlantedLands] = useState([]);
  const [harvestDate, setHarvestDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add state to track submission
  const navigate = useNavigate();
  const location = useLocation();
  const { username, userId } = location.state || {};

  const filteredProducts = plantedLands.filter((land) => land.landId === parseInt(landId));

  const uniqueLands = Array.from(new Set(plantedLands.map(land => land.landId)))
    .map(id => plantedLands.find(land => land.landId === id));

  useEffect(() => {
    const fetchPlantedLands = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/crops/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched planted lands:', data);
        setPlantedLands(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Failed to fetch planted lands:', error);
      }
    };

    fetchPlantedLands();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true); // Set submitting state to true

    const newHarvest = {
      landId: parseInt(landId),
      productId: parseInt(productId),
      harvestQuality,
      harvestQuantity: harvestQuantity ? parseFloat(harvestQuantity) : null,
      harvestDate,
      userId,
      username
    };

    console.log('Submitting new harvest:', newHarvest);

    try {
      const response = await fetch('http://localhost:8080/api/harvest/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHarvest)
      });

      if (response.ok) {
        const data = await response.json();
        const warningMessage = response.headers.get('Warning');
        if (warningMessage) {
          setMessage(warningMessage);
        } else {
          setMessage('Başarılı Hasat!');
        }
        console.log('Hasat başarıyla eklendi:', data);

        navigate('/harvests-list', {
          state: { userId, username }
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to add harvest:', response.status, errorText);
        setMessage('Hasat tarihi ekim tarihinden sonra olmalıdır');
      }
    } catch (error) {
      console.error('Network error or other error:', error);
      setMessage('Bir ağ hatası veya diğer bir hata oluştu.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Hasat Ekle</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Arazi"
          value={landId}
          onChange={(e) => setLandId(e.target.value)}
          fullWidth
          margin="normal"
        >
          {uniqueLands.map((land, index) => (
            <MenuItem 
              key={land.id || index} 
              value={land.landId || index}>
              {`Arazi ${index+1} - ${land.landName} Alan: ${land.areaInSquareMeters}`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Ürün"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          fullWidth
          margin="normal"
        >
          {filteredProducts.map((product, index) => (
            <MenuItem 
              key={product.id || index} 
              value={product.productId || index}>
              {`${product.productName}`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Hasat Kalitesi"
          value={harvestQuality}
          onChange={(e) => setHarvestQuality(e.target.value)}
          fullWidth
          margin="normal"
        >
          {harvestQualities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Hasat Miktarı (optional)"
          value={harvestQuantity}
          onChange={(e) => setHarvestQuantity(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          type="date"
          label=""
          value={harvestDate || ''}
          onChange={(e) => setHarvestDate(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Kaydet'}
        </Button>
      </form>
      {message && <Typography variant="h6" color="success" style={{ marginTop: '20px' }}>{message}</Typography>}
    </div>
  );
};

export default AddHarvest;
