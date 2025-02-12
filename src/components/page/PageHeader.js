import React, { useState, useCallback } from 'react';
import { setVars } from '../../utils/externalStore';
import { useGlobalContext } from '../../context/GlobalContext';
import createLogger from '../../utils/logger';
import logo from '../../assets/wf-icon.png';
import Select from './Select'; // Import the Select component
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';

const PageHeader = () => {
  const log = createLogger('PageHeader');
  const { pageTitle, userID } = useGlobalContext();
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState('defineBusiness');
  const [batchType, setBatchType] = useState('ingr'); // New state to track batch type prefix
  const [selects, setSelects] = useState([
    { value: '', options: [], placeholder: 'Select Type', varName: 'typeID', listEvent: `${batchType}TypeList` },
    { value: '', options: [], placeholder: 'Select Entity', varName: 'entityID', listEvent: `${batchType}List`, visible: false },
  ]);

  const handleAccountChange = (value) => {
    setVars(':acctID', value);
  };

  const handleLogout = () => {
    log('Logging out');
    localStorage.clear();
    navigate('/login');
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
  };

  const updateSelects = async (index, value) => {
    const newSelects = [...selects];
    newSelects[index].value = value;

    // Show the next select widget
    if (index < selects.length - 1) {
      newSelects[index + 1].visible = true;
    } else {
      // Navigate to the batch list page
      const batchListPath = batchType === 'ingr' ? `/ingredientBatches/${value}` : `/productBatches/${value}`;
      navigate(batchListPath);
    }

    setSelects(newSelects);
  };

  log('Rendering');

  return (
    <AppBar position="static" color="default" sx={{ bgcolor: 'lightGray' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img src={logo} alt="Whatsfresh Logo" style={{ width: '48px', height: '48px' }} />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {pageTitle}
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left' }}>
            <Select
              eventType="userAcctList"
              placeholder="Select Account"
              onChange={handleAccountChange}
              params={{ ':userID': userID }} // Pass userID with ':' as a parameter
              sx={{ fontWeight: 'bold', bgcolor: 'inherit', textAlign: 'center', flexShrink: 0 }}
            />
          </Box>
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, bgcolor: 'lightGray' }}>
        <Button
          variant={selectedArea === 'defineBusiness' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleAreaChange('defineBusiness')}
          sx={{ mx: 1 }}
        >
          Define My Business
        </Button>
        <Button
          variant={selectedArea === 'recordBatches' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleAreaChange('recordBatches')}
          sx={{ mx: 1 }}
        >
          Record My Batches
        </Button>
      </Box>
    </AppBar>
  );
};

export default React.memo(PageHeader);
