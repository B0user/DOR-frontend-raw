import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField
} from '@mui/material';
import { Add, Delete, Visibility, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Temp = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(0);
  const [newUniversity, setNewUniversity] = useState({ name: '' });
  const [newGrant, setNewGrant] = useState({ grant_name: '' });
  const [newScholarship, setNewScholarship] = useState({ scholarship_name: '' });
  const [isAdding, setIsAdding] = useState({ university: false, grant: false, scholarship: false });

  const fetchUniversities = async () => {
    const response = await axiosPrivate.get('/universities');
    return response.data;
  };

  const fetchGrants = async () => {
    const response = await axiosPrivate.get('/grants');
    return response.data;
  };

  const fetchScholarships = async () => {
    const response = await axiosPrivate.get('/scholarships');
    return response.data;
  };

  const { data: universities } = useQuery({
    queryKey: ['universities'],
    queryFn: fetchUniversities,
    enabled: value === 0,
  });

  const { data: grants } = useQuery({
    queryKey: ['grants'],
    queryFn: fetchGrants,
    enabled: value === 1,
  });

  const { data: scholarships } = useQuery({
    queryKey: ['scholarships'],
    queryFn: fetchScholarships,
    enabled: value === 2,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow = (type) => {
    setIsAdding({ ...isAdding, [type]: true });
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'university') {
      setNewUniversity({ ...newUniversity, [name]: value });
    } else if (type === 'grant') {
      setNewGrant({ ...newGrant, [name]: value });
    } else if (type === 'scholarship') {
      setNewScholarship({ ...newScholarship, [name]: value });
    }
  };

  const handleSave = async (type) => {
    try {
      if (type === 'university') {
        await axiosPrivate.post('/universities', newUniversity);
        queryClient.invalidateQueries(['universities']);
        setNewUniversity({ name: '' });
      } else if (type === 'grant') {
        await axiosPrivate.post('/grants', newGrant);
        queryClient.invalidateQueries(['grants']);
        setNewGrant({ grant_name: '' });
      } else if (type === 'scholarship') {
        await axiosPrivate.post('/scholarships', newScholarship);
        queryClient.invalidateQueries(['scholarships']);
        setNewScholarship({ scholarship_name: '' });
      }
      setIsAdding({ ...isAdding, [type]: false });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = (id, type) => {
    // Delete logic here
    console.log(`Delete ${type} with id ${id}`);
  };

  const handleRead = (id, type) => {
    
    const selectedData = (type === 'colleges' ? universities : type === 'grants' ? grants : scholarships).find(item => item._id === id);
    navigate(`/${type}/${id}`, { state: { data: selectedData } });
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
          <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
            <Tab label="Университеты" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Гранты" id="tab-1" aria-controls="tabpanel-1" disabled/>
            <Tab label="Стипендии" id="tab-2" aria-controls="tabpanel-2" disabled/>
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/colleges/upload')}>
              Добавить Университет
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {universities?.map((university, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {university.main.name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary">
                        <Visibility onClick={() => handleRead(university._id, 'colleges')}/>
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(university._id, 'university')}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {isAdding.university && (
                  <TableRow>
                    <TableCell>
                      <TextField
                        name="name"
                        label="Название университета"
                        value={newUniversity.name}
                        onChange={(e) => handleInputChange(e, 'university')}
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleSave('university')}>
                        <Save />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleAddRow('grant')}>
              Добавить Грант
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grants?.map((grant, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {grant.grant_name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(grant._id, 'grant')}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {isAdding.grant && (
                  <TableRow>
                    <TableCell>
                      <TextField
                        name="grant_name"
                        label="Название гранта"
                        value={newGrant.grant_name}
                        onChange={(e) => handleInputChange(e, 'grant')}
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleSave('grant')}>
                        <Save />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleAddRow('scholarship')}>
              Добавить Стипендию
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scholarships?.map((scholarship, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {scholarship.scholarship_name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(scholarship._id, 'scholarship')}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {isAdding.scholarship && (
                  <TableRow>
                    <TableCell>
                      <TextField
                        name="scholarship_name"
                        label="Название стипендии"
                        value={newScholarship.scholarship_name}
                        onChange={(e) => handleInputChange(e, 'scholarship')}
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleSave('scholarship')}>
                        <Save />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Temp;
