import { filter } from 'lodash';
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';
import swal from 'sweetalert'; // sweetalert
import { toast } from 'react-toastify';

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
import { postData, getData, baseUrl } from '../../Services/apiservice';

import jsPDF from "jspdf";

const TABLE_HEAD = [
    { id: 'product_type', label: 'Creditors', alignRight: false },
    { id: 'category_name', label: 'Product Category', alignRight: false },
    { id: 'name', label: 'Product Name', alignRight: false },
    { id: 'product_image', label: 'Product Image', alignRight: false },
    { id: 'product_details', label: 'Product Details', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '', label: 'Action', alignRight: false },
];


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}


function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) =>
            _user.product_type && _user.product_type.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            _user.category_name && _user.category_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            _user.name && _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            _user.product_details && _user.product_details.toLowerCase().indexOf(query.toLowerCase()) !== -1

        );
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function ProductReport() {

    const [page, setPage] = useState(0); // By default set page number

    const [selected, setSelected] = useState([]); // checkBox selected

    const [order, setOrder] = useState('asc');  

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState(''); 
    
    const [rowsPerPage, setRowsPerPage] = useState(5);  // setrowsPerPage

    const [list, setList] = useState([]);

    useEffect(() => {
        const initData = async () => {
            let response = await getData('product_details');
            if (response && response.data) {
                setList(response.data);
            }
        }
        initData();
    }, []);

    const getRecord = async () => {
        let response = await getData('product_details');
        if (response && response.data) {
            setList(response.data);
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
            apiUrl = 'product_multi_delete/' + '[' + selectedArray + ']';
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

    const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Product Report";
        const headers = [['Product Type', "Product Category", "Product Name",
            'Product Details', 'Status']];

        const data = list.map(elt => [elt.product_type, elt.category_name, elt.name, elt.product_details, elt.status]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("product_report.pdf");
    }


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    const filteredUsers = applySortFilter(list, getComparator(order, orderBy), filterName);

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
                    <UserListToolbar data={list.length} numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName}
                        onDelete={ondeleteClick} onstausChange={onstatusChange} onexport={exportPDF} />

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

                                            const { product_id, name, status, category_name, product_image, product_details, creditor_name } = row;

                                            const isItemSelected = selected.indexOf(product_id) !== -1;


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

                                                    <TableCell align="left">{creditor_name}</TableCell>
                                                    <TableCell align="left">{category_name}</TableCell>
                                                    <TableCell align="left">{name}</TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar className="img_enlarge" alt={name} src={baseUrl + product_image} />
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{product_details}</TableCell>
                                                    <TableCell align="left" onClick={() => onstatusChange(product_id)}>
                                                        <Iconify
                                                            icon={status === '1' ? 'charm:cross' :
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
                                            <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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
