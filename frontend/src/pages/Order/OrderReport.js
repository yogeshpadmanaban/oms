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
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/orderReport'; // Sepearte page

// apiservice
import { postData, getData } from '../../Services/apiservice';


const TABLE_HEAD = [

    { id: 'order_id', label: 'Order Id', alignRight: false },
    { id: 'jc_number', label: 'Jc Number', alignRight: false },
    { id: 'product_type', label: 'Product Type', alignRight: false },
    { id: 'product_category', label: 'Product Category', alignRight: false },
    { id: 'product_name', label: 'Product Name', alignRight: false },
    { id: 'customer_name', label: 'Customer Name', alignRight: false },
    { id: 'purity', label: 'Purity', alignRight: false },
    { id: 'product_weight', label: 'Product Weight', alignRight: false },
    { id: 'quantity', label: 'Quantity', alignRight: false },
    { id: 'design_by', label: 'To Design Using', alignRight: false },
    { id: 'order_details', label: 'Order Details', alignRight: false },
    { id: 'order_image', label: 'Order Image', alignRight: false },
    { id: 'delivery_date', label: 'Delivery Date', alignRight: false },
    { id: 'user_status', label: 'Assigner Status', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '', label: 'Action', alignRight: false }

];


function applySortFilter(array, query) {
    if (query) {
        return filter(array, (_user) => _user.customer_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    else {
        return array;
    }
}

export default function OrderReport() {

    const [page, setPage] = useState(0); // By default set page number

    const [selected, setSelected] = useState([]); // checkBox selected

    const [order, setOrder] = useState('asc');  // asc || dsc


    const [orderBy, setOrderBy] = useState('order_id'); // By Default order_id

    const [filterName, setFilterName] = useState(''); // search filter order_id set and it's fun

    const [rowsPerPage, setRowsPerPage] = useState(5);  // setrowsPerPage

    const [List, setList] = useState([]);

    useEffect(async () => {
        await getRecord();
    }, []);


    const getRecord = async () => {
        let response = await getData('order_datails');
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
            const newSelecteds = List.map((n) => n.order_id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Single checkbox Click
    const handleClick = (order_id) => {
        const selectedIndex = selected.indexOf(order_id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, order_id);
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
    const ondeleteClick = async (order_id) => {

        let apiUrl, selectedArray = [];
        if (selected && selected.length > 1 && order_id) {
            selectedArray = selected;
            apiUrl = 'order_multi_delete/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'order_delete/' + selected;
            } else {
                apiUrl = 'order_delete/' + order_id;
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
                    let responseData = await postData(apiUrl)
                    if (responseData) {
                        toast.success("Deleted Successfully");
                        await getRecord();
                        await handletableReset();
                    } else {
                        toast.error("Oops ! Somewithing wen wrong");
                    }
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
    const onstatusChange = async (order_id) => {

        let apiUrl, selectedArray = [];

        if (selected && selected.length > 1 && order_id) {
            selectedArray = selected;
            apiUrl = 'order_bulk_status_change/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'order_change_status/' + selected;
            } else {
                apiUrl = 'order_change_status/' + order_id;
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
                    let responseData = await postData(apiUrl);
                    if (responseData) {
                        toast.success("Status Changed Successfully");
                        await getRecord();
                        await handletableReset();
                    } else {
                        toast.error("Oops ! Somewithing wen wrong");
                    }
                }
            });
    }

    const handletableReset = () => {
        setRowsPerPage(Number(5));
        setPage(0);
        setSelected([]);
        setFilterName('');
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - List.length) : 0;

    const filteredList = applySortFilter(List, filterName);

    const isDataNotFound = !filteredList || filteredList.length === 0;

    return (
        <Page title="Order Report">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Order Report
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="/admin/add_order" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Add Order
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
                                    rowCount={List ? List.length : 0}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>



                                    {filteredList &&
                                        filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                                            const { order_id, jc_number, product_type, product_category, product_name, customer_name, purity, product_weight, quantity, design_by, order_details,
                                                order_image, delivery_date, user_status, status } = row;

                                            const isItemSelected = selected.indexOf(order_id) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={order_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(order_id)} />
                                                    </TableCell>
                                                    <TableCell align="left">{order_id}</TableCell>
                                                    <TableCell align="left">{jc_number}</TableCell>
                                                    <TableCell align="left">{product_type}</TableCell>
                                                    <TableCell align="left">{product_category}</TableCell>
                                                    <TableCell align="left">{product_name}</TableCell>
                                                    <TableCell align="left">{customer_name}</TableCell>
                                                    <TableCell align="left">{purity}</TableCell>
                                                    <TableCell align="left">{product_weight}</TableCell>

                                                    <TableCell align="left">{quantity}</TableCell>
                                                    <TableCell align="left">{design_by}</TableCell>
                                                    <TableCell align="left">{order_details}</TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar alt={customer_name} src={order_image} />
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{delivery_date}</TableCell>
                                                    <TableCell align="left">{user_status}</TableCell>

                                                    <TableCell align="left" onClick={() => onstatusChange(order_id)}>
                                                        <Iconify
                                                            icon={status == 1 ? 'charm:cross' :
                                                                'typcn:tick'}
                                                            sx={{ width: 25, height: 25, ml: 1 }}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <UserMoreMenu
                                                            url={'/admin/edit_order/' + base64_encode(order_id)}
                                                            selectedList={selected}
                                                            onDelete={ondeleteClick}
                                                            rowId={order_id}
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
                        count={List ? List.length : 0}
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
