import { filter } from 'lodash';
import React, { useEffect, useState } from "react";
import swal from 'sweetalert'; // sweetalert
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
// material
import {
    Card,
    Table,
    Stack,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    TextField
} from '@mui/material';


// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound'; // Common Page
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/producttypeReport'; // Sepearte page

// apiservice
import { postData, getData } from '../../Services/apiservice';

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import jsPDF from "jspdf";



const TABLE_HEAD = [
    { id: 'product_type', label: 'Product Type', alignRight: false },
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
            _user.product_type.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}


function ProducttypeModal({ open, handleClose, getRecord, oneditedId }) {
    const categorySchema = Yup.object().shape({
        product_type_id: '',
        product_type: Yup.string().required('Product Type is required')
    });

    const formik = useFormik({
        initialValues: {
            product_type_id: '',
            product_type: '',
        },
        validationSchema: categorySchema,
        onSubmit: async (values, { resetForm }) => {
            handleClose(); // Modal close
            resetForm(); // Reset form
            getRecord(); // Record Get

            let response = await postData('store_product_type', values);
            console.log("response", response);
            if (response.status === 200) {
                handleClose(); // Modal close
                resetForm(); // Reset form
                toast.success(response.data.message);
                getRecord(); // Record Get
            } else {
                toast.error(response.data.message);
            }

        },
    });

    useEffect(() => {

        const initData = async () => {
            if (oneditedId) {
                let url = 'edit_product_type/' + oneditedId;
                let responseData = await getData(url);
                if (responseData && responseData.data.producttype) {
                    const { product_type_id, product_type } = responseData.data.producttype;
                    formik.setFieldValue("product_type_id", product_type_id);
                    formik.setFieldValue("product_type", product_type);
                }
            } else {
                formik.setFieldValue("product_type_id", '');
                formik.setFieldValue("product_type", '');
            }
        }
        initData()
    }, []);



    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (

        <div>
            <Modal center open={open} onClose={handleClose}>
                <h2>{oneditedId ? 'Edit ProductType' : 'Add ProductType'}</h2>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" encType="multipart/form-data" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={2} sx={{ my: 1 }}>
                            <TextField
                                type="text"
                                label="Prodcut Type"
                                {...getFieldProps('product_type')}
                                error={Boolean(touched.product_type && errors.product_type)}
                                helperText={touched.product_type && errors.product_type}
                            />

                            <Stack direction="row" alignItems="center" justifyContent="center">
                                <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}> Submit </LoadingButton>
                                <Button sx={{ m: 2 }} variant="contained" color="error" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Stack>

                        </Stack>
                    </Form>
                </FormikProvider>

            </Modal>
        </div>

    )
}





export default function ProducttypeReport() {

    const [page, setPage] = useState(0); // By default set page number

    const [selected, setSelected] = useState([]); // checkBox selected

    const [order, setOrder] = useState('asc');  // asc || dsc

    const [orderBy, setOrderBy] = useState('product_type');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);  // setrowsPerPage

    const [list, setList] = useState([]);

    const [open, setOpen] = useState(false);

    const [oneditedId, setoneditedId] = useState('');


    const handleOpen = async () => {
        await setoneditedId('');
        await setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };



    useEffect(() => {
        const initData = async () => {
            let response = await getData('product_type_details');
            if (response && response.data.rows) {
                setList(response.data.rows);
            }
        }
        initData();
    }, []);



    const getRecord = async () => {
        let response = await getData('product_type_details');
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
            const newSelecteds = list.map((n) => n.product_type_id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Single checkbox Click
    const handleClick = (product_type_id) => {
        const selectedIndex = selected.indexOf(product_type_id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, product_type_id);
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
    const ondeleteClick = async (product_type_id) => {

        let apiUrl, selectedArray = [];
        if (selected && selected.length > 1 && product_type_id) {
            selectedArray = selected;
            apiUrl = 'product_type_multi_delete/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'product_type_delete/' + selected;
            } else {
                apiUrl = 'product_type_delete/' + product_type_id;
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

    // On Edit

    const oneditClick = async (product_type_id) => {
        await setoneditedId(product_type_id);
        await setOpen(true);
    }
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
    const onstatusChange = async (product_type_id) => {

        let apiUrl, selectedArray = [];

        if (selected && selected.length > 1 && product_type_id) {
            selectedArray = selected;
            apiUrl = 'product_type_bulk_status_change/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'product_type_status_change/' + selected;
            } else {
                apiUrl = 'product_type_status_change/' + product_type_id;
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

        const title = "Producttype Report";
        const headers = [['Id', "Product Type", "Status"]];

        const data = list.map(elt => [elt.product_type_id, elt.product_type, elt.status]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("producttypeReport.pdf")
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    const filteredUsers = applySortFilter(list, getComparator(order, orderBy), filterName);

    const isDataNotFound = !filteredUsers || filteredUsers.length === 0;

    return (
        <Page title="ProductType Report">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        ProductType Report
                    </Typography>

                    <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
                        Add ProductType
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

                                            const { product_type_id, status, product_type } = row;
                                            const isItemSelected = selected.indexOf(product_type_id) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={product_type_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >

                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(product_type_id)} />
                                                    </TableCell>

                                                    <TableCell align="left">{product_type}</TableCell>
                                                    <TableCell align="left" onClick={() => onstatusChange(product_type_id)}>
                                                        <Iconify
                                                            icon={status === '1' ? 'charm:cross' :
                                                                'typcn:tick'}
                                                            sx={{ width: 25, height: 25, ml: 1 }}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <UserMoreMenu
                                                            selectedList={selected}
                                                            onDelete={ondeleteClick}
                                                            onEdit={oneditClick}
                                                            rowId={product_type_id}
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
                                            <TableCell align="center" colSpan={3} sx={{ py: 3 }}>
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

            {
                open && <ProducttypeModal
                    open={open}
                    handleClose={handleClose}
                    getRecord={getRecord}
                    oneditedId={oneditedId}
                />
            }

        </Page>

    );
}
