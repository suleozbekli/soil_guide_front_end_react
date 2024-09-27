import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HarvestList = () => {
  const [harvests, setHarvests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Separate loading state
  const location = useLocation();
  const userId = location.state?.userId; // userId should be available in location state

  useEffect(() => {
    const fetchHarvests = async () => {
      if (!userId) {
        setError(new Error('User ID is not available.'));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/harvest/by-user-id/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched harvests:', data); // Check the data structure

        if (Array.isArray(data)) {
          setHarvests(data); // Directly set if data is an array
        } else {
          setHarvests([data]); // Convert single object to an array
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false); // Set loading to false once data fetching is done
      }
    };

    fetchHarvests();
  }, [userId]); // userId dependency 

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (harvests.length === 0) {
    return <div>No harvest records found.</div>; // Message for empty harvests
  }
  const convertQuality = (quality) => {
    switch(quality) {
      case 'COK_KOTU':
        return 'Çok Kötü';
      case 'NE_IYI_NE_KOTU':
        return 'Ne İyi Ne Kötü';
      case 'COK_IYI':
        return 'Çok İyi'
      default:
        return quality;
    }
  };

  return (
    <div>
      <h2>Hasatlarım</h2>
      {harvests.map((harvest, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>Hasat {index + 1}</h3>
         {/* <p><strong>Land ID:</strong> {harvest.landId || 'N/A'}</p>  */ } 
          <p><strong>Arazi:</strong> {harvest.landName || 'N/A'}</p>
          <p><strong>Ürün:</strong> {harvest.productName|| 'N/A'}</p>
          <p><strong>Hasat Kalitesi:</strong> {convertQuality(harvest.harvestQuality)|| 'N/A'}</p>
          <p><strong>Hasat Tarihi:</strong> {new Date(harvest.harvestDate).toLocaleDateString() || 'N/A'}</p>
        </div>
      ))}
    </div>
  );
};

export default HarvestList;
