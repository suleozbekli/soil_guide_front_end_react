import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CropsList = () => {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const userId = location.state?.userId; // Ensure userId is correctly retrieved

  useEffect(() => {
    const fetchCrops = async () => {
      if (!userId) {
        setError(new Error('User ID is not available.'));
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8080/api/crops/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched crops:', data);
  
        if (Array.isArray(data)) {
          setCrops(data); // Set data if it's an array
        } else {
          setCrops([data]); // Convert single object to array
        }
      } catch (error) {
        setError(error);
      }
    };
  
    fetchCrops();
  }, [userId]);
  

  if (error) {
    return <div>Henüz ekiminiz yoktur...</div>;
  }

  if (crops.length === 0) {
    return <div>Henüz ekiminiz yoktur...</div>;
  }

  return (
    <div>
      <h2>Ekimlerim</h2>
      {crops.map((crop, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>Ekim {index + 1}</h3>
          <p><strong>Arazi:</strong> {crop.landName || 'N/A'}</p>
          <p><strong>Ürün:</strong> {crop.productName || 'N/A'}</p>
          <p><strong>Alan:</strong> {crop.areaInSquareMeters || 'N/A'} m²</p>
          <p><strong>Ekim Tarihi:</strong> {crop.plantingDate|| 'N/A'}</p>
        </div>
      ))}
    </div>
  );
};

export default CropsList;

