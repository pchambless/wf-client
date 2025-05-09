import React from 'react';
import { Typography, List, Divider, Box } from '@mui/material';
import NavSubsection from '@navigation/bb-Sidebar/components/NavSubsection';

const NavSection = ({ title, subsections, onNavigate, divider }) => {
  return (
    <>
      {divider && <Divider sx={{ my: 2 }} />}
      
      <Typography 
        variant="subtitle2" 
        sx={{ 
          px: 2,
          mb: 1, 
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        {title}
      </Typography>
      
      <List>
        {subsections.map((subsection, index) => (
          <NavSubsection
            key={`${title}-subsection-${index}`}
            title={subsection.title}
            items={subsection.items}
            onNavigate={onNavigate}
          />
        ))}
      </List>
    </>
  );
};

export default NavSection;
