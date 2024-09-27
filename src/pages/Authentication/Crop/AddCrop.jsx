import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AddCrop = () => {
  const [landId, setLandId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [area, setArea] = useState('');
  const [lands, setLands] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [error, setError] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/lands/by-user-id/${userId}`);
        setLands(response.data);
      } catch (error) {
        setError('An error occurred while fetching lands');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
      } catch (error) {
        setError('An error occurred while fetching products');
      }
    };

    fetchLands();
    fetchProducts();
  }, [userId]);

  const handleAddProduct = async () => {
    try {
      // Yeni ürünü ekleyin
      const response = await axios.post('http://localhost:8080/api/products/add', { 
        name: newProductName
      });
  
      setProducts([...products, response.data]);
      setOpen(false);
    } catch (error) {
      setError('An error occurred while adding the product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const crop = {
      landId: parseInt(landId, 10),
      productId: parseInt(productId, 10),
      areaInSquareMeters: parseFloat(area),
      plantingDate,
      userId,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/crops/add', crop);
      navigate('/crops-list', { state: { userId: response.data.userId } });
    } catch (error) {
      setError('An error occurred while adding the crop');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Ürün Ekle</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Arazi"
          value={landId || ''}
          onChange={(e) => setLandId(Number(e.target.value))}
          fullWidth
          margin="normal"
          required
        >
          {lands.map((land, index) => (
            <MenuItem key={land.id} value={land.id}>
              {`Arazi ${index + 1} - ${land.landType} | ${land.cityName}, ${land.districtName}, ${land.neighbourhoodName}, ${land.ada_parcel}`}
            </MenuItem>
          ))}
        </TextField>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            select
            label="Ürün"
            value={productId || ''}
            onChange={(e) => setProductId(Number(e.target.value))}
            fullWidth
            margin="normal"
            required
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
  
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setOpen(true)} 
            size="small" 
            style={{ marginLeft: '8px', height: '40px', minWidth: '40px' }}
          >
            +
          </Button>
        </div>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Yeni Ürün Ekle</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Ürün Adı"
              fullWidth
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">İptal</Button>
            <Button onClick={handleAddProduct} color="primary">Ekle</Button>
          </DialogActions>
        </Dialog>

        <TextField
          type="number"
          label="Alan (m²)"
          value={area || ''}
          onChange={(e) => setArea(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          type="date"
          label=""
          value={plantingDate || ''}
          onChange={(e) => setPlantingDate(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <Button type="submit" variant="contained" color="primary">Kaydet</Button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default AddCrop;
