import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const LandsList = () => {
  const [lands, setLands] = useState([]);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // Öneri sonuçları için state
  const [open, setOpen] = useState(false); // Dialog açık/kapalı durumu için state
  const [currentNeighbourhoodId, setCurrentNeighbourhoodId] = useState(null); // Şu anda hangi neighbourhoodId'nin önerilerini gösterdiğimiz

  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    const fetchLands = async () => {
      if (!userId) {
        setError(new Error('User ID is not available.'));
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/lands/by-user-id/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setLands(data);
        } else {
          setLands([data]);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchLands();
  }, [userId]);

  const handleDelete = async (landId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/lands/delete/${landId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete land.');
      }
      setLands(lands.filter(land => land.id !== landId)); // Araziler listesini güncelle
    } catch (error) {
      setError(error);
    }
  };

  const handleSuggestion = async (neighbourhoodId) => {
    setCurrentNeighbourhoodId(neighbourhoodId); // Şu anda gösterilen neighbourhoodId'yi ayarla
    setOpen(true); // Dialog'u aç
    try {
      const response = await fetch(`http://localhost:8080/api/products/suggestions/${neighbourhoodId}`);
      if (!response.ok) {
        throw new Error('Failed to get suggestions.');
      }
      const data = await response.json();
      setSuggestions(data); // Önerileri state'e kaydediyoruz
    } catch (error) {
      setError(error);
    }
  };

  const handleClose = () => {
    setOpen(false); // Dialog'u kapat
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (lands.length === 0) {
    return <div>No lands found.</div>; 
  }

  return (
    <div>
      <h2>Arazilerim</h2>
      {lands.map((land, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>Arazi {index + 1}</h3>
          <p><strong>Şehir:</strong>  {land.cityName || 'Unknown City'}</p>
          <p><strong>İlçe:</strong> {land.districtName || 'Unknown District'}</p>
          <p><strong>Mahalle:</strong> {land.neighbourhoodName || 'Unknown Neighbourhood'}</p>
          <p><strong>Arazi Tipi:</strong> {land.landType || 'Unknown Type'}</p>
          <p><strong>Ada-Parsel:</strong> {land.ada_parcel || 'Unknown Type'}</p>
          <p><strong>Alan:</strong> {land.area || 'Unknown Type'}</p>
          <button onClick={() => handleDelete(land.id)}>Sil</button> {/* Silme butonu */}
          <button onClick={() => handleSuggestion(land.neighbourhoodId)}>Ürün Önerisi Al</button>
        </div>
      ))}

      {/* Ürün önerileri gösterimi */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Ürün Önerileri</DialogTitle>
        <DialogContent>
          {suggestions.length > 0 ? (
            <div>
              {suggestions.map((suggestion, index) => (
                <div key={index}>
                  <Typography variant="body1"><strong>Ürün:</strong> {suggestion.urun}</Typography>
                  <Typography variant="body1"><strong>Başarı Oranı:</strong> {suggestion.average_success_rate}%</Typography>
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="body1">Öneri bulunamadı.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Kapat</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LandsList;
