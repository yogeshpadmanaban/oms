import { filter } from 'lodash';
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { decode as base64_decode, encode as base64_encode } from 'base-64';
import swal from 'sweetalert'; // sweetalert
import { ToastContainer, toast } from 'react-toastify';

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
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound'; // Common Page
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/productReport'; // Sepearte page

// apiservice
import { postData, getData } from '../../Services/apiservice';


const TABLE_HEAD = [
    { id: 'product_type', label: 'Product Type', alignRight: false },
    { id: 'category_name', label: 'Product Category', alignRight: false },
    { id: 'name', label: 'Product Name', alignRight: false },
    { id: 'product_image', label: 'Product Image', alignRight: false },
    { id: 'product_details', label: 'Product Details', alignRight: false },
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

export default function ProductReport() {

    const [page, setPage] = useState(0); // By default set page number

    const [selected, setSelected] = useState([]); // checkBox selected

    const [order, setOrder] = useState('asc');  // asc || dsc

    const [orderBy, setOrderBy] = useState('product_id'); // By Default product_id

    const [filterName, setFilterName] = useState(''); // search filter product_id set and it's fun

    const [rowsPerPage, setRowsPerPage] = useState(5);  // setrowsPerPage

    const [list, setList] = useState([]);

    useEffect(async () => {
        await getRecord();
    }, []);


    const getRecord = async () => {
        let response = await getData('product_datails');
        console.log(response);
        if (response && response.data.rows) {
            setList(response.data.rows);
        }
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
            const newSelecteds = list.map((n) => n.product_id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Single checkbox Click
    const handleClick = (product_id) => {
        const selectedIndex = selected.indexOf(product_id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, product_id);
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
    const ondeleteClick = async (product_id) => {

        let apiUrl, selectedArray = [];
        if (selected && selected.length > 1 && product_id) {
            selectedArray = selected;
            apiUrl = 'product_bulk_status_change/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'product_delete/' + selected;
            } else {
                apiUrl = 'product_delete/' + product_id;
            }
        }
        swal({
            title: "Are you sure you want to delete?",
            text: "Once deleted, you will not be able to recover!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    console.log("apiUrl", apiUrl);
                    // let responseData = await postData(apiUrl)
                    // if (responseData) {
                    //     toast.success("Deleted Successfully");
                    //     await getRecord();
                    //     await handletableReset();
                    // } else {
                    //     toast.error("Oops ! Somewithing wen wrong");
                    // }
                }
            });
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

    // onStatus Change
    const onstatusChange = async (product_id) => {

        let apiUrl, selectedArray = [];

        if (selected && selected.length > 1 && product_id) {
            selectedArray = selected;
            apiUrl = 'product_bulk_status_change/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'product_change_status/' + selected;
            } else {
                apiUrl = 'product_change_status/' + product_id;
            }
        }
        swal({
            title: "Are you sure you want to change status ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willchangeStatus) => {
                if (willchangeStatus) {
                    console.log("apiurl", apiUrl)
                    // let responseData = await postData(apiUrl);
                    // if (responseData) {
                    //     toast.success("Status Changed Successfully");
                    //     await getRecord();
                    //     await handletableReset();
                    // } else {
                    //     toast.error("Oops ! Somewithing wen wrong");
                    // }
                }
            });
    }

    const handletableReset = () => {
        setRowsPerPage(Number(5));
        setPage(0);
        setSelected([]);
        setFilterName('');
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    const filteredUsers = applySortFilter(list, filterName);

    const isDataNotFound = !filteredUsers || filteredUsers.length === 0;

    return (
        <Page title="Product Report">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Product Report
                    </Typography>

                    <Button variant="contained" component={RouterLink} to="/admin/add_product" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Add Product
                    </Button>

                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName}
                        onDelete={ondeleteClick} onstausChange={onstatusChange} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={list ? list.length : 0}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers &&
                                        filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                                            const { product_id, name, status, category_name, product_image, product_details, product_type } = row;

                                            const isItemSelected = selected.indexOf(product_id) !== -1;

                                            if (isItemSelected == true) {
                                                console.log("selected", selected);
                                            }

                                            return (
                                                <TableRow
                                                    hover
                                                    key={product_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >

                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(product_id)} />
                                                    </TableCell>

                                                    <TableCell align="left">{product_type}</TableCell>
                                                    <TableCell align="left">{category_name}</TableCell>
                                                    <TableCell align="left">{name}</TableCell>
                                                    <TableCell align="left">{product_image}</TableCell>
                                                    <TableCell align="left">{product_details}</TableCell>

                                                    <TableCell align="left" onClick={() => onstatusChange(product_id)}>
                                                        <Iconify
                                                            icon={status == 1 ? 'charm:cross' :
                                                                'typcn:tick'}
                                                            sx={{ width: 25, height: 25, ml: 1 }}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <UserMoreMenu
                                                            url={'/admin/edit_product/' + base64_encode(product_id)}
                                                            selectedList={selected}
                                                            onDelete={ondeleteClick}
                                                            rowId={product_id}
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
                                {isDataNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
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
                        count={list ? list.length : 0}
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
