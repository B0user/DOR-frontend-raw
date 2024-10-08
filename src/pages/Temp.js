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
  TextField,
  MenuItem, FormControl,
  Select,
  InputLabel, Stack, CircularProgress
} from '@mui/material';
import { Add, Delete, Visibility, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';

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
  const [statusFilter, setStatusFilter] = useState('Все');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const limit = 20;
  let universities;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    console.log(debouncedSearchQuery);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);



  const fetchUniversities = async (page, limit = 10, statusFilter = 'Все', search = '') => {
    const params = {
      limit,
      page,
      statusFilter,
    };

    if (statusFilter !== 'Все') {
      params.status_tag = statusFilter;
    }
    if (params.search != ''){
      params.search = search || undefined;
    }
    console.log(params);
    try {
      const response = await axiosPrivate.get('/universities', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching universities:', error);
      return { universities: [], totalPages: 0, currentPage: 1 };
    }
  };


  const fetchGrants = async () => {
    const response = await axiosPrivate.get('/grants');
    return response.data;
  };

  const fetchScholarships = async () => {
    const response = await axiosPrivate.get('/scholarships');
    return response.data;
  };

  // const { data: universities } = useQuery({
  //   queryKey: ['universities', { page: 1, limit: 10, statusFilter }],
  //   queryFn: ({ queryKey }) => {
  //     const [, { page, limit, statusFilter }] = queryKey;
  //     return fetchUniversities(page, limit, statusFilter);
  //   },
  //   enabled: value === 0,
  // });

  const { data, isLoading, error } = useQuery({
    // queryKey: ['universities', { currentPage, limit, statusFilter }],
    queryKey: ['universities', { currentPage, limit, statusFilter, debouncedSearchQuery}],
    queryFn: ({ queryKey }) => {
      const [, { page, limit, statusFilter, debouncedSearchQuery}] = queryKey;
      return fetchUniversities(currentPage, limit, statusFilter, debouncedSearchQuery);
      // return fetchUniversities(page, limit, statusFilter);
    },
    enabled: value === 0, // Замените value на нужное вам условие
    keepPreviousData: true, // Сохранение данных предыдущей страницы пока загружается новая
  });

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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

  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };
  console.log(data);
  const handleDelete = async (id, type) => {
    try {
      await axiosPrivate.delete(`/universities/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Университет успешно удален.', {
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      toast.error('Ошибка при удалении университета. Попробуйте снова.', {
        position: "top-right",
        autoClose: 3000
      });
      
      console.error('Error creating university:', error);
    }
    

    console.log(`Delete ${type} with id ${id}`);
  };

  const handleRead = (id, type) => {

    const selectedData = (type === 'colleges' ? data?.universities : type === 'grants' ? grants : scholarships).find(item => item._id === id);
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
              <TextField
                  label="Поиск"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Фильтр по статусу</InputLabel>
                <Select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <MenuItem value="Все">Все</MenuItem>
                  <MenuItem value="На проверку">На проверку</MenuItem>
                  <MenuItem value="Одобрено">Одобрено</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell align="right">Статус</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.universities?.map((university, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {university.name}
                        </TableCell>
                        <TableCell align="right">
                          {university.status_tag}
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
            <Stack spacing={2} alignItems="center" mt={2}>
              <Pagination
                  count={data?.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
              />
            </Stack>
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