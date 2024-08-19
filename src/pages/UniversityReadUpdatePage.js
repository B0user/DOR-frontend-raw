import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const steps = [
  'Основная информация',
  'Контактная информация',
  'Общая информация',
  'Факультеты и курсы',
  'Информация о поступлении',
  'Удобства и студенческая жизнь'
];

const languages_list = ['английский', 'китайский', 'чешский', 'русский', 'испанский'];
const countries = ['Казахстан', 'Россия', 'США', 'Китай', 'Чехия', 'Испания'];

const UniversityReadUpdatePage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const universityData = state?.data;
  
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({
    name: '',
    country: '',
    languages: [],
    grants: '',
    tuition_fee: [],
    dual_degree_program: '',
    dual_major_program: '',
    living_cost: [],
    qs_ranking: '',
    ielts: '',
    application_deadline: '',
    comments: ['', '', '', '', '', '']
  });

  useEffect(() => {
    if (universityData) {
      setFormValues({
        name: universityData.main.name || '',
        country: universityData.location || '',
        languages: universityData.main.languages || [],
        grants: universityData.main.grants || '',
        tuition_fee: universityData.main.tuition_fee || [],
        dual_degree_program: universityData.main.dual_degree_program || '',
        dual_major_program: universityData.main.dual_major_program || '',
        living_cost: universityData.main.living_cost || [],
        qs_ranking: universityData.main.qs_ranking || '',
        ielts: universityData.main.ielts || '',
        application_deadline: universityData.main.application_deadline || '',
        comments: [
          universityData.contact_info || '',
          universityData.general_info || '',
          universityData.faculties || '',
          universityData.admission_info || '',
          universityData.student_life || '',
          ''
        ]
      });
    }
  }, [universityData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleCommentsChange = (index, value) => {
    const updatedComments = [...formValues.comments];
    updatedComments[index] = value;
    setFormValues({
      ...formValues,
      comments: updatedComments
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleTuitionFeeChange = (e, newValue) => {
    setFormValues({
      ...formValues,
      tuition_fee: newValue
    });
  };

  const handleLivingCostChange = (e, newValue) => {
    setFormValues({
      ...formValues,
      living_cost: newValue
    });
  };

  const handleSaveChanges = async () => {
    const payload = {
      main: {
        name: formValues.name,
        languages: formValues.languages,
        grants: formValues.grants,
        tuition_fee: formValues.tuition_fee,
        dual_degree_program: formValues.dual_degree_program,
        dual_major_program: formValues.dual_major_program,
        living_cost: formValues.living_cost,
        application_deadline: formValues.application_deadline,
        qs_ranking: formValues.qs_ranking,
        ielts: formValues.ielts
      },
      location: formValues.country,
      contact_info: formValues.comments[0],
      general_info: formValues.comments[1],
      faculties: formValues.comments[2],
      admission_info: formValues.comments[3],
      facilities: "",
      student_life: formValues.comments[4],
      images: []
    };

    try {
      await axiosPrivate.put(`/universities/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('Университет успешно обновлен!', {
        position: "top-right",
        autoClose: 3000
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      toast.error('Ошибка при обновлении университета. Попробуйте снова.', {
        position: "top-right",
        autoClose: 3000
      });
      console.error('Error updating university:', error);
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleSaveChanges();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) navigate('/dashboard');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Просмотр и Обновление Университета
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
                name="name"
                label="Название университета"
                value={formValues.name}
                onChange={handleInputChange}
                margin="normal"
              />
              <Autocomplete
                freeSolo
                options={countries}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Страна"
                    margin="normal"
                    fullWidth
                    name="country"
                    value={formValues.country}
                    onChange={handleInputChange}
                  />
                )}
                value={formValues.country}
                onChange={(event, newValue) => {
                  setFormValues({
                    ...formValues,
                    country: newValue || ''
                  });
                }}
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6">Язык обучения:</Typography>
                <Autocomplete
                  multiple
                  freeSolo
                  options={languages_list}
                  value={formValues.languages}
                  onChange={(event, newValue) => {
                    setFormValues({
                      ...formValues,
                      languages: newValue
                    });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Добавить язык"
                      placeholder="Язык"
                    />
                  )}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Гранты</InputLabel>
                    <Select
                      name="grants"
                      value={formValues.grants}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="Да">Да</MenuItem>
                      <MenuItem value="Нет">Нет</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Программа двойных дипломов</InputLabel>
                    <Select
                      name="dual_degree_program"
                      value={formValues.dual_degree_program}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="Да">Да</MenuItem>
                      <MenuItem value="Нет">Нет</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Программа двойных специальностей</InputLabel>
                    <Select
                      name="dual_major_program"
                      value={formValues.dual_major_program}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="Да">Да</MenuItem>
                      <MenuItem value="Нет">Нет</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="qs_ranking"
                    label="QS Ranking"
                    value={formValues.qs_ranking}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="ielts"
                    label="IELTS"
                    value={formValues.ielts}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                name="application_deadline"
                label="Сроки подачи"
                type="date"
                value={formValues.application_deadline}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Стоимость Обучения:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    type="number"
                    name="tuition_fee_min"
                    label="от"
                    value={formValues.tuition_fee[0]}
                    onChange={(e) => handleTuitionFeeChange(e, [e.target.value, formValues.tuition_fee[1]])}
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography>USD</Typography>
                    }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    name="tuition_fee_max"
                    label="до"
                    value={formValues.tuition_fee[1]}
                    onChange={(e) => handleTuitionFeeChange(e, [formValues.tuition_fee[0], e.target.value])}
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography>USD</Typography>
                    }}
                  />
                </Box>
                
                <Typography variant="h6">Стоимость Проживания:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    type="number"
                    name="living_cost_min"
                    label="от"
                    value={formValues.living_cost[0]}
                    onChange={(e) => handleLivingCostChange(e, [e.target.value, formValues.living_cost[1]])}
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography>USD</Typography>
                    }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    name="living_cost_max"
                    label="до"
                    value={formValues.living_cost[1]}
                    onChange={(e) => handleLivingCostChange(e, [formValues.living_cost[0], e.target.value])}
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography>USD</Typography>
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {activeStep > 0 && activeStep < steps.length && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {steps[activeStep]}:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                name={`comments-${activeStep}`}
                label="Комментарии"
                value={formValues.comments[activeStep]}
                onChange={(e) => handleCommentsChange(activeStep, e.target.value)}
                margin="normal"
              />
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 3, justifyContent: 'space-between', display: 'flex' }}>
          <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={handleBack}>
            Назад
          </Button>
          <Button variant="contained" color="success" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Сохранить изменения' : 'Далее'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UniversityReadUpdatePage;
