
import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <IconButton onClick={toggleSidebar} style={{ position: 'fixed', top: 20, left: 20 }}>
        <MenuIcon />
      </IconButton>
      <Drawer open={isOpen} onClose={toggleSidebar}>
        <List style={{ width: 250 }}>
          <ListItem button component={Link} to="/home" onClick={toggleSidebar}>
            <ListItemText primary="Ana Sayfa" />
          </ListItem>
          <ListItem button component={Link} to="/lands-list" onClick={toggleSidebar}>
            <ListItemText primary="Arazi Listele" />
          </ListItem>
          <ListItem button component={Link} to="/add-land" onClick={toggleSidebar}>
            <ListItemText primary="Arazi Ekle" />
          </ListItem>
          <ListItem button component={Link} to="/crops-list" onClick={toggleSidebar}>
            <ListItemText primary="Ürün Listele" />
          </ListItem>
          <ListItem button component={Link} to="/add-crop" onClick={toggleSidebar}>
            <ListItemText primary="Ürün Ekle" />
          </ListItem>
          <ListItem button component={Link} to="/harvests-list" onClick={toggleSidebar}>
            <ListItemText primary="Hasat Listele" />
          </ListItem>
          <ListItem button component={Link} to="/add-harvest" onClick={toggleSidebar}>
            <ListItemText primary="Hasat Ekle" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default Sidebar;
