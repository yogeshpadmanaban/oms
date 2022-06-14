import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound'; // Common Page
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/customerReport'; // Sepearte page

// apiservice
import { getData } from '../Services/apiservice';


const TABLE_HEAD = [
  { id: 'profile_picture', label: 'Profile Picture', alignRight: false },
  { id: 'name', label: 'Customer Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'city', label: 'City', alignRight: false },
  { id: 'state', label: 'State', alignRight: false },
  { id: 'gst_no', label: 'Gst', alignRight: false },
  { id: 'pan_no', label: 'Pan', alignRight: false },
  { id: 'other_upload', label: 'Otherupload', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '', label: 'Action', alignRight: false },
];


function applySortFilter(array, query) {
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  else {
    return array;
  }
}




export default function CustomerReport() {

  const [page, setPage] = useState(0); // By default set page number

  const [selected, setSelected] = useState([]); // checkBox selected

  const [order, setOrder] = useState('asc');  // asc || dsc

  const [orderBy, setOrderBy] = useState('customer_id'); // By Default customer_id

  const [filterName, setFilterName] = useState(''); // search filter customer_id set and it's fun

  const [rowsPerPage, setRowsPerPage] = useState(5);  // setrowsPerPage

  const [customerList, setCustomerList] = useState([]);

  useEffect(async () => {
    await getCustomerRecord();
  }, []);


  const getCustomerRecord = async () => {
    let data = await getData('customer_details');
    console.log("sfsdfsdfsdfsdf", data)
    setCustomerList(data.rows);
  }

  // On Table head sort (sort, sortBy)
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // all checkbox Click
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customerList.map((n) => n.customer_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Single checkbox Click
  const handleClick = (customer_id) => {
    const selectedIndex = selected.indexOf(customer_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, customer_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  // On Page Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // On Delete
  const ondeleteClick = async (event) => {
    if (selected && selected.length > 0) {
      console.log("isDelete Click");
      let apiUrl;
      if (selected.length == 1) {
        apiUrl = 'customer_delete/' + [selected];
      } else {
        apiUrl = 'customer_multi_delete/' + [selected];
      }
      console.log("apiurl", apiUrl);
      // let responseData = await getData(apiUrl);
      // console.log("sfsdfsdfsdfsdf", responseData);
      // if (responseData) {
      //   await getCustomerRecord();
      // }

    }
  };

  // On ChangeRowsperPage
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // onchange search input
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customerList.length) : 0;

  const filteredUsers = applySortFilter(customerList, filterName);

  const isUserNotFound = !filteredUsers || filteredUsers.length === 0;

  return (
    <Page title="Customer Report">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Customer Report
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/add_customer" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add Customer
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={customerList ? customerList.length : 0}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers &&
                    filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                      const { customer_id, profile_picture, name, address, city, state, gst_no, pan_no, other_upload, status } = row;
                      const isItemSelected = selected.indexOf(customer_id) !== -1;

                      if (isItemSelected == true) {
                        console.log("selected", selected);
                      }

                      return (
                        <TableRow
                          hover
                          key={customer_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(customer_id)} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={profile_picture} />
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{address}</TableCell>
                          <TableCell align="left">{city}</TableCell>
                          <TableCell align="left">{state}</TableCell>
                          <TableCell align="left">{gst_no}</TableCell>
                          <TableCell align="left">{pan_no}</TableCell>
                          <TableCell align="left">{other_upload}</TableCell>
                          <TableCell align="left">{status ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="right">
                            <UserMoreMenu
                              url={'/dashboard/edit_customer/' + customer_id}
                              selectedList={selected}
                              onDelete={ondeleteClick}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {/* Not found page */}
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {/* Not found page */}


              </Table>
            </TableContainer>
          </Scrollbar>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={customerList ? customerList.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* Pagination */}
        </Card>
      </Container>
    </Page>
  );
}
