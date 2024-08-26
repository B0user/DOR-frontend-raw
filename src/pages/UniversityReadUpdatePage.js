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
  Chip,
  Tabs,
  Tab
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

const languages_list = ['английский', 'китайский', 'чешский', 'русский', 'испанский', 'турецкий'];
const countries = ['Казахстан', 'Россия', 'США', 'Китай', 'Чехия', 'Испания', 'Турция'];

const UniversityReadUpdatePage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const universityData = state?.data;


  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
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
        name: universityData.name || '',

        // Bachelor data
        bachelor_languages: universityData.bachelor?.languages || [],
        bachelor_grants: universityData.bachelor?.grants || '',
        bachelor_tuition_fee: universityData.bachelor?.tuition_fee || [],
        bachelor_dual_degree_program: universityData.bachelor?.dual_degree_program || '',
        bachelor_dual_major_program: universityData.bachelor?.dual_major_program || '',
        bachelor_living_cost: universityData.bachelor?.living_cost || [],
        bachelor_qs_ranking: universityData.bachelor?.rankings?.qs_ranking || '',
        bachelor_the_ranking: universityData.bachelor?.rankings?.the_ranking || '',
        bachelor_arwu_ranking: universityData.bachelor?.rankings?.arwu_ranking || '',
        bachelor_ielts: universityData.bachelor?.ielts || '',
        bachelor_reviews: universityData.bachelor?.reviews || [],
        bachelor_percentage_acceptance: universityData.bachelor?.acceptance_percentage || '',
        bachelor_application_deadline: universityData.bachelor?.application_deadline || '',
        bachelor_toefl: universityData.bachelor?.toefl || '',
        // Master data
        master_languages: universityData.master?.languages || [],
        master_grants: universityData.master?.grants || '',
        master_tuition_fee: universityData.master?.tuition_fee || [],
        master_dual_degree_program: universityData.master?.dual_degree_program || '',
        master_dual_major_program: universityData.master?.dual_major_program || '',
        master_living_cost: universityData.master?.living_cost || [],
        master_qs_ranking: universityData.master?.rankings?.qs_ranking || '',
        master_the_ranking: universityData.master?.rankings?.the_ranking || '',
        master_arwu_ranking: universityData.master?.rankings?.arwu_ranking || '',
        master_ielts: universityData.master?.ielts || '',
        master_reviews: universityData.master?.reviews || [],
        master_percentage_acceptance: universityData.master?.acceptance_percentage || '',
        master_application_deadline: universityData.master?.application_deadline || '',
        master_toefl: universityData.master?.toefl || '',

        // PhD data
        phd_languages: universityData.phd?.languages || [],
        phd_grants: universityData.phd?.grants || '',
        phd_tuition_fee: universityData.phd?.tuition_fee || [],
        phd_dual_degree_program: universityData.phd?.dual_degree_program || '',
        phd_dual_major_program: universityData.phd?.dual_major_program || '',
        phd_living_cost: universityData.phd?.living_cost || [],
        phd_qs_ranking: universityData.phd?.rankings?.qs_ranking || '',
        phd_the_ranking: universityData.phd?.rankings?.the_ranking || '',
        phd_arwu_ranking: universityData.phd?.rankings?.arwu_ranking || '',
        phd_ielts: universityData.phd?.ielts || '',
        phd_reviews: universityData.phd?.reviews || [],
        phd_percentage_acceptance: universityData.phd?.acceptance_percentage || '',
        phd_application_deadline: universityData.phd?.application_deadline || '',
        phd_toefl: universityData.phd?.toefl || '',

        // General university data
        location: universityData.location || '',
        contact_info: universityData.contact_info || '',
        general_info: universityData.general_info || '',
        faculties: universityData.faculties || '',
        admission_info: universityData.admission_info || '',
        facilities: universityData.facilities || '',
        student_life: universityData.student_life || '',
        city: universityData.city || '',
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
      bachelor: {
        languages: formValues.bachelor_languages,
        grants: formValues.bachelor_grants,
        tuition_fee: formValues.bachelor_tuition_fee,
        dual_degree_program: formValues.bachelor_dual_degree_program,
        dual_major_program: formValues.bachelor_dual_major_program,
        living_cost: formValues.bachelor_living_cost,
        application_deadline: formValues.bachelor_application_deadline,
        rankings: {
          qs_ranking: formValues.bachelor_qs_ranking,
          the_ranking: formValues.bachelor_the_ranking,
          arwu_ranking: formValues.bachelor_arwu_ranking,
        },
        ielts: formValues.bachelor_ielts,
        reviews: formValues.bachelor_reviews,
        acceptance_percentage: formValues.bachelor_percentage_acceptance,
        toefl: formValues.bachelor_toefl,
      },
      master: {
        languages: formValues.master_languages,
        grants: formValues.master_grants,
        tuition_fee: formValues.master_tuition_fee,
        dual_degree_program: formValues.master_dual_degree_program,
        dual_major_program: formValues.master_dual_major_program,
        living_cost: formValues.master_living_cost,
        application_deadline: formValues.master_application_deadline,
        rankings: {
          qs_ranking: formValues.master_qs_ranking,
          the_ranking: formValues.master_the_ranking,
          arwu_ranking: formValues.master_arwu_ranking,
        },
        ielts: formValues.master_ielts,
        reviews: formValues.master_reviews,
        acceptance_percentage: formValues.master_percentage_acceptance,
        toefl: formValues.master_toefl,
      },
      phd: {
        languages: formValues.phd_languages,
        grants: formValues.phd_grants,
        tuition_fee: formValues.phd_tuition_fee,
        dual_degree_program: formValues.phd_dual_degree_program,
        dual_major_program: formValues.phd_dual_major_program,
        living_cost: formValues.phd_living_cost,
        application_deadline: formValues.phd_application_deadline,
        rankings: {
          qs_ranking: formValues.phd_qs_ranking,
          the_ranking: formValues.phd_the_ranking,
          arwu_ranking: formValues.phd_arwu_ranking,
        },
        ielts: formValues.phd_ielts,
        reviews: formValues.phd_reviews,
        acceptance_percentage: formValues.phd_percentage_acceptance,
        toefl: formValues.phd_toefl,
      },
      location: formValues.location,
      contact_info: formValues.contact_info,
      general_info: formValues.general_info,
      faculties: formValues.faculties,
      admission_info: formValues.admission_info,
      facilities: formValues.facilities,
      student_life: formValues.student_life,
      city: formValues.city,
      status_tag: "Одобрено"
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
                <>
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
                  <TextField
                      label="Город"
                      margin="normal"
                      fullWidth
                      name="city"
                      value={formValues.city}
                      onChange={handleInputChange}
                  />
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Бакалавриат" />
                    <Tab label="Магистратура" />
                    <Tab label="PhD" />
                  </Tabs>
                  <TabPanel value={activeTab} index={0}>
                    {renderProgramFields('bachelor', formValues, setFormValues)}
                  </TabPanel>
                  <TabPanel value={activeTab} index={1}>
                    {renderProgramFields('master', formValues, setFormValues)}
                  </TabPanel>
                  <TabPanel value={activeTab} index={2}>
                    {renderProgramFields('phd', formValues, setFormValues)}
                  </TabPanel>
                </>
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

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
};

const renderProgramFields = (programType, formValues, setFormValues) => {
  const formValuesPrefix = `${programType}_`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  return (
      <>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h6">Язык обучения:</Typography>
          <Autocomplete
              multiple
              freeSolo
              options={languages_list}
              value={formValues[`${formValuesPrefix}languages`]}
              onChange={(event, newValue) => {
                setFormValues({
                  ...formValues,
                  [`${formValuesPrefix}languages`]: newValue
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
                  name={`${formValuesPrefix}grants`}
                  value={formValues[`${formValuesPrefix}grants`]}
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
                  name={`${formValuesPrefix}dual_degree_program`}
                  value={formValues[`${formValuesPrefix}dual_degree_program`]}
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
                  name={`${formValuesPrefix}dual_major_program`}
                  value={formValues[`${formValuesPrefix}dual_major_program`]}
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
                name={`${formValuesPrefix}ielts`}
                label="IELTS"
                value={formValues[`${formValuesPrefix}ielts`]}
                onChange={handleInputChange}
                margin="normal"
                fullWidth
            />
            <TextField
                name={`${formValuesPrefix}toefl`}
                label="TOEFL"
                value={formValues[`${formValuesPrefix}toefl`]}
                onChange={handleInputChange}
                margin="normal"
                fullWidth
            />
          </Grid>
        </Grid>
        <TextField
            fullWidth
            name={`${formValuesPrefix}application_deadline`}
            label="Сроки подачи"
            type="date"
            value={formValues[`${formValuesPrefix}application_deadline`]}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
        />

        <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
            <TextField
                name={`${formValuesPrefix}tuition_fee_min`}
                label="Стоимость обучения (от)"
                value={formValues[`${formValuesPrefix}tuition_fee`][0] || ''}
                onChange={(e) => {
                  const newValue = [e.target.value, formValues[`${formValuesPrefix}tuition_fee`][1]];
                  setFormValues({
                    ...formValues,
                    [`${formValuesPrefix}tuition_fee`]: newValue
                  });
                }}
                margin="normal"
                fullWidth
                type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
                name={`${formValuesPrefix}tuition_fee_max`}
                label="Стоимость обучения (до)"
                value={formValues[`${formValuesPrefix}tuition_fee`][1] || ''}
                onChange={(e) => {
                  const newValue = [formValues[`${formValuesPrefix}tuition_fee`][0], e.target.value];
                  setFormValues({
                    ...formValues,
                    [`${formValuesPrefix}tuition_fee`]: newValue
                  });
                }}
                margin="normal"
                fullWidth
                type="number"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
                name={`${formValuesPrefix}living_cost_min`}
                label="Стоимость проживания (от)"
                value={formValues[`${formValuesPrefix}living_cost`][0] || ''}
                onChange={(e) => {
                  const newValue = [e.target.value, formValues[`${formValuesPrefix}living_cost`][1]];
                  setFormValues({
                    ...formValues,
                    [`${formValuesPrefix}living_cost`]: newValue
                  });
                }}
                margin="normal"
                fullWidth
                type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
                name={`${formValuesPrefix}living_cost_max`}
                label="Стоимость проживания (до)"
                value={formValues[`${formValuesPrefix}living_cost`][1] || ''}
                onChange={(e) => {
                  const newValue = [formValues[`${formValuesPrefix}living_cost`][0], e.target.value];
                  setFormValues({
                    ...formValues,
                    [`${formValuesPrefix}living_cost`]: newValue
                  });
                }}
                margin="normal"
                fullWidth
                type="number"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="h6">Рейтинги:</Typography>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
                name={`${formValuesPrefix}the_ranking`}
                label="THE Ranking"
                value={formValues[`${formValuesPrefix}the_ranking`]}
                onChange={handleInputChange}
                margin="normal"
            />
            <TextField
                name={`${formValuesPrefix}arwu_ranking`}
                label="ARWU Ranking"
                value={formValues[`${formValuesPrefix}arwu_ranking`]}
                onChange={handleInputChange}
                margin="normal"
            />
            <TextField
                name={`${formValuesPrefix}qs_ranking`}
                label="QS Ranking"
                value={formValues[`${formValuesPrefix}qs_ranking`]}
                onChange={handleInputChange}
                margin="normal"

            />
          </Grid>

          </Grid>
        </Box>
      </>
  );
};

