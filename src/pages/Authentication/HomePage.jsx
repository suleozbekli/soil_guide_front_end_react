import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar,Box, Typography, Button, Drawer, List, ListItem, ListItemText, IconButton, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AddLand from './Lands/AddLand';
import LandsList from './Lands/LandsList';
import axios from 'axios';

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePicture, setProfilePicture] = useState('/path/to/default-profile-picture.jpg'); // Varsayılan profil resmi
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || 'Kullanıcı';
  const userId = location.state?.userId || 'User ID';

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/profile-picture', {
          params: { userId },
          responseType: 'blob' 
        });
        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        setProfilePicture(imageUrl);
      } catch (error) {
        console.error('Profil fotoğrafı getirme hatası:', error);
      }
    };

    fetchProfilePicture();
  }, [userId]);

  const handleNavigate = (path) => {
    navigate(path, { state: { userId, username } });
    setOpen(false);
  };

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      try {
        const response = await axios.post('http://localhost:8080/api/users/upload-profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Upload response:', response);
        setProfilePicture(URL.createObjectURL(file));
        alert('Profil fotoğrafı başarıyla yüklendi');
      } catch (error) {
        console.error('Profil fotoğrafı yükleme hatası:', error);
        alert('Profil fotoğrafı yükleme hatası');
      }
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 10, fontSize: '2.5rem' }}>
            Merhaba {username}
          </Typography>
          <Tooltip title="Profil Fotoğrafınızı Güncelleyin">
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar src={profilePicture} alt={username} sx={{ width: 100, height: 100 }} />
            </IconButton>
          </Tooltip>
          <Button color="inherit" sx={{ fontSize: '1.1rem' }} onClick={() => navigate("/")}>
            Çıkış
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button onClick={() => handleNavigate('/add-land')}>
            <ListItemText primary="Arazi Ekle" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/lands-list')}>
            <ListItemText primary="Arazilerimi Gör" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/add-crop')}>
            <ListItemText primary="Ürün Ekle" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/crops-list')}>
            <ListItemText primary="Ekimler" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/add-harvest')}>
            <ListItemText primary="Hasat Et" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/harvests-list')}>
            <ListItemText primary="Hasatlarım" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/success-rates')}>
            <ListItemText primary="Toprak Rehberi" />
           </ListItem>
        </List>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem>
          <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
            Fotoğraf Yükle
          </label>
          <input
            id="upload-photo"
            type="file"
            style={{ display: 'none' }}
            onChange={handleProfilePictureChange}
          />
        </MenuItem>
      </Menu>

      <main  style={{
          padding: '100px',
          marginLeft: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh'
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                  Toprak Rehberi'ne Hoşgeldiniz!
                </Typography>

                <Typography variant="h4" sx={{ marginTop: '1rem'}}>
                  Burada arazileriniz, ürünleriniz ve hasat raporlarınızla ilgili işlemleri yönetebilirsiniz.
                </Typography>
              </Box>
            }
          />
          <Route path="/lands-list" element={<LandsList />} />
          <Route path="/add-land" element={<AddLand />} />
          {/* Diğer yönlendirmeler burada */}
        </Routes>
      </main>
    </div>
  );
};

export default HomePage;
