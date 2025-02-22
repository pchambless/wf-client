import React from 'react';
import { TextField, Grid, Button, Box } from '@mui/material';

const CrudForm = ({ pageConfig, formData, setFormData, selectOptions }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={2}>
        {pageConfig.map((fieldConfig) => (
          <Grid item xs={12} sm={6} key={fieldConfig.field}>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense" 
              size="small"
              label={fieldConfig.label}
              name={fieldConfig.field}
              value={formData[fieldConfig.field] || ''}
              onChange={handleChange}
              select={!!fieldConfig.selList}
              SelectProps={{
                native: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: 20, // Adjust the height as needed
                },
                '& .MuiInputLabel-root': {
                  top: '-6px', // Adjust the label position as needed
                },
              }}
            >
              {fieldConfig.selList && (
                <option value=""></option>
              )}
              {fieldConfig.selList && selectOptions[fieldConfig.field]?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        ))}
      </Grid>
      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CrudForm;
