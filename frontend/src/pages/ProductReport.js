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

import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/productReport'; // Sepearte page

// apiservice
import { getData } from '../Services/apiservice';


const TABLE_HEAD = [
    { id: 'productType', label: 'Product Type', alignRight: false },
    { id: 'productCategory', label: 'Product Category', alignRight: false },
    { id: 'productName', label: 'Product Name', alignRight: false },
    { id: 'productImage', label: 'Product Image', alignRight: false },
    { id: 'productDetails', label: 'Product Details', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '', label: 'Action', alignRight: false },
];


function applySortFilter(array, query) {
    if (query) {
        return filter(array, (_user) => _user.productName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    else {
        return array;
    }
}




export default function ProductReport() {

    const [page, setPage] = useState(0); // By default set page number

    const [selected, setSelected] = useState([]); // checkBox selected

    const [order, setOrder] = useState('asc');  // asc || dsc

    const [orderBy, setOrderBy] = useState('productName'); // By Default CustomerName

    const [filterName, setFilterName] = useState(''); // search filter name set and it's fun

    const [rowsPerPage, setRowsPerPage] = useState(5);  // setrowsPerPage

    const [userList, setuserList] = useState([]);

    useEffect(async () => {
        let data = await getData('productReport');
        setuserList(data);
    }, []);


    // On Table head sort (sort, sortBy)
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // all checkbox Click
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = userList.map((n) => n.productName);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Single checkbox Click
    const handleClick = (productName) => {
        const selectedIndex = selected.indexOf(productName);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, productName);
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

    // On ChangeRowsperPage
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    // onchange search input
    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

    const filteredUsers = applySortFilter(userList, filterName);

    const isUserNotFound = !filteredUsers || filteredUsers.length === 0;

    return (
        <Page title="Product Report">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Product Report
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Add Product
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
                                    rowCount={userList ? userList.length : 0}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers &&
                                        filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                                            const { id, productType, productCategory, productName, productImage, productDetails, status } = row;

                                            const isItemSelected = selected.indexOf(productName) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(productName)} />
                                                    </TableCell>

                                                    <TableCell align="left">{productType}</TableCell>
                                                    <TableCell align="left">{productCategory}</TableCell>
                                                    <TableCell align="left">{productName}</TableCell>
                                                    {/* <TableCell align="left">{productImage}</TableCell> */}

                                                    <TableCell align='left'>
                                                        <Stack direction="row" alignItems="center" spacing={4}>
                                                            <Avatar alt={productName} src={productImage} />
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell align="left">{productDetails}</TableCell>
                                                    <TableCell align="left">{status ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell align="left">
                                                        <UserMoreMenu />
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
                        count={userList ? userList.length : 0}
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
