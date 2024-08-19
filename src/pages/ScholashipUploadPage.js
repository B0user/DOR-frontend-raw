import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const steps = [
  'Основная информация',
  'Критерии и университеты'
];

const ScholarshipUploadPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [formValues, setFormValues] = useState({
    scholarship_name: '',
    scholarship_amount: '',
    eligibility_criteria: '',
    universities: '' // Assume this is a comma-separated list of university IDs
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        const universitiesArray = formValues.universities.split(',').map(id => id.trim());
        const data = { ...formValues, universities: universitiesArray };
        
        await axios.post('http://localhost:3500/scholarships', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        toast.success('Стипендия успешно добавлена!', {
          position: "top-right",
          autoClose: 3000
        });
        setTimeout(() => {
          navigate('/scholarships');
        }, 3000);
      } catch (error) {
        toast.error('Ошибка при добавлении стипендии. Попробуйте снова.', {
          position: "top-right",
          autoClose: 3000
        });
        console.error('Error adding scholarship:', error);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Добавить Стипендию
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Основная информация:
              </Typography>
              <TextField
                fullWidth
                name="scholarship_name"
                label="Название стипендии"
                value={formValues.scholarship_name}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                name="scholarship_amount"
                label="Сумма стипендии"
                value={formValues.scholarship_amount}
                onChange={handleInputChange}
                margin="normal"
              />
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Критерии и университеты:
              </Typography>
              <TextField
                fullWidth
                name="eligibility_criteria"
                label="Критерии отбора"
                value={formValues.eligibility_criteria}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                name="universities"
                label="ID университетов (через запятую)"
                value={formValues.universities}
                onChange={handleInputChange}
                margin="normal"
              />
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={handleBack} disabled={activeStep === 0}>
            Назад
          </Button>
          <Button variant="contained" color="success" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Завершить' : 'Далее'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ScholarshipUploadPage;
