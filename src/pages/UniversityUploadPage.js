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
import { useNavigate } from 'react-router-dom';
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

const UniversityUploadPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const [formValues, setFormValues] = useState({
    name: '',
    bachelor: {
      languages: [],
      grants: '',
      tuition_fee: [],
      dual_degree_program: '',
      dual_major_program: '',
      living_cost: [],
      application_deadline: '',
      rankings: {
        qs_ranking: '',
        the_ranking: '',
        arwu_ranking: ''
      },
      ielts: '',
      acceptance_percentage: '',
      reviews: []
    },
    master: {
      languages: [],
      grants: '',
      tuition_fee: [],
      dual_degree_program: '',
      dual_major_program: '',
      living_cost: [],
      application_deadline: '',
      rankings: {
        qs_ranking: '',
        the_ranking: '',
        arwu_ranking: ''
      },
      ielts: '',
      acceptance_percentage: '',
      reviews: []
    },
    phd: {
      languages: [],
      grants: '',
      tuition_fee: [],
      dual_degree_program: '',
      dual_major_program: '',
      living_cost: [],
      application_deadline: '',
      rankings: {
        qs_ranking: '',
        the_ranking: '',
        arwu_ranking: ''
      },
      ielts: '',
      acceptance_percentage: '',
      reviews: []
    },
    location: '',
    contact_info: '',
    general_info: '',
    faculties: '',
    admission_info: '',
    facilities: '',
    student_life: '',
    images: []
  });

  const handleInputChange = (e, level) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [level]: {
        ...formValues[level],
        [name]: value
      }
    });
  };

  const handleRankingsChange = (e, level) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [level]: {
        ...formValues[level],
        rankings: {
          ...formValues[level].rankings,
          [name]: value
        }
      }
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

  const handleSelectChange = (e, level) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [level]: {
        ...formValues[level],
        [name]: value
      }
    });
  };

  const handleTuitionFeeChange = (e, newValue, level) => {
    setFormValues({
      ...formValues,
      [level]: {
        ...formValues[level],
        tuition_fee: newValue
      }
    });
  };

  const handleLivingCostChange = (e, newValue, level) => {
    setFormValues({
      ...formValues,
      [level]: {
        ...formValues[level],
        living_cost: newValue
      }
    });
  };

  const handleUpload = async () => {
    const payload = {
      name: formValues.name,
      bachelor: formValues.bachelor,
      master: formValues.master,
      phd: formValues.phd,
      location: formValues.location,
      contact_info: formValues.contact_info,
      general_info: formValues.general_info,
      faculties: formValues.faculties,
      admission_info: formValues.admission_info,
      facilities: formValues.facilities,
      student_life: formValues.student_life,
      images: formValues.images
    };

    try {
      await axiosPrivate.post('/universities', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('Университет успешно добавлен!', {
        position: "top-right",
        autoClose: 3000
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      toast.error('Ошибка при добавлении университета. Попробуйте снова.', {
        position: "top-right",
        autoClose: 3000
      });
      console.error('Error adding university:', error);
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleUpload();
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
          Добавить Университет
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
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                margin="normal"
              />
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Bachelor’s" />
                <Tab label="Master’s" />
                <Tab label="PhD" />
              </Tabs>
              <TabPanel value={activeTab} index={0}>
                <TextField
                  fullWidth
                  name="languages"
                  label="Языки обучения"
                  value={formValues.bachelor.languages}
                  onChange={(e) => handleInputChange(e, 'bachelor')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  name="qs_ranking"
                  label="QS Ranking"
                  value={formValues.bachelor.rankings.qs_ranking}
                  onChange={(e) => handleRankingsChange(e, 'bachelor')}
                  margin="normal"
                />
                {/* Add other fields similarly */}
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <TextField
                  fullWidth
                  name="languages"
                  label="Языки обучения"
                  value={formValues.master.languages}
                  onChange={(e) => handleInputChange(e, 'master')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  name="qs_ranking"
                  label="QS Ranking"
                  value={formValues.master.rankings.qs_ranking}
                  onChange={(e) => handleRankingsChange(e, 'master')}
                  margin="normal"
                />
                {/* Add other fields similarly */}
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <TextField
                  fullWidth
                  name="languages"
                  label="Языки обучения"
                  value={formValues.phd.languages}
                  onChange={(e) => handleInputChange(e, 'phd')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  name="qs_ranking"
                  label="QS Ranking"
                  value={formValues.phd.rankings.qs_ranking}
                  onChange={(e) => handleRankingsChange(e, 'phd')}
                  margin="normal"
                />
                {/* Add other fields similarly */}
              </TabPanel>
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
            {activeStep === steps.length - 1 ? 'Завершить' : 'Далее'}
          </Button>
          <Button variant="contained" color="warning" sx={{ ml: 2 }} onClick={handleUpload}>
            Пропустить все и загрузить
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

export default UniversityUploadPage;
