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
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/categoryReport'; // Sepearte page

// apiservice
import { postData, getData } from '../../Services/apiservice';

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import jsPDF from "jspdf";
import 'jspdf-autotable'

import { Loader } from "react-full-page-loader-overlay";

const TABLE_HEAD = [
    { id: 'category_name', label: 'Category Name', alignRight: false },
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
            _user.category_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}


function CategoryModal({ open, handleClose, getRecord, oneditedId }) {
    const categorySchema = Yup.object().shape({
        category_id: '',
        category_name: Yup.string().required('Category Name is required')
    });

    const formik = useFormik({
        initialValues: {
            id: '',
            category_name: '',
        },
        validationSchema: categorySchema,
        onSubmit: async (values, { resetForm }) => {
            handleClose(); // Modal close
            resetForm(); // Reset form
            getRecord(); // Record Get

            let response = await postData('store_category', values);
            if (response.data.status === 200) {
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
                let url = 'edit_category/' + oneditedId;
                let responseData = await getData(url);
                if (responseData && responseData.data.category) {
                    const { category_id, category_name } = responseData.data.category;
                    formik.setFieldValue("id", category_id);
                    formik.setFieldValue("category_name", category_name);
                }
            } else {
                formik.setFieldValue("id", '');
                formik.setFieldValue("category_name", '');
            }
        }
        initData()
    }, []);



    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (

        <div>
            <Modal center open={open} onClose={handleClose}>
                <h2>{oneditedId ? 'Edit Category' : 'Add Category'}</h2>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" encType="multipart/form-data" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={2} sx={{ my: 1 }}>
                            <TextField
                                type="text"
                                label="Category Name"
                                {...getFieldProps('category_name')}
                                error={Boolean(touched.category_name && errors.category_name)}
                                helperText={touched.category_name && errors.category_name}
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





export default function CategoryReport() {

    const [page, setPage] = useState(0); // By default set page number

    const [selected, setSelected] = useState([]); // checkBox selected

    const [order, setOrder] = useState('asc');  // asc || dsc

    const [orderBy, setOrderBy] = useState('category_name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);  // setrowsPerPage

    const [list, setList] = useState([]);

    const [open, setOpen] = useState(false);

    const [oneditedId, setoneditedId] = useState('');

    const [loading, setLoading] = useState(true);

    const handleOpen = async () => {
        await setoneditedId('');
        await setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };



    useEffect(() => {
        const initData = async () => {
            let response = await getData('category_details');
            if (response && response.data) {
                setList(response.data);
                setLoading(false);
            }
        }
        initData();
    }, []);



    const getRecord = async () => {
        setLoading(true);
        let response = await getData('category_details');
        if (response && response.data) {
            setList(response.data);
            setLoading(false);
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
            const newSelecteds = list.map((n) => n.category_id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Single checkbox Click
    const handleClick = (category_id) => {
        const selectedIndex = selected.indexOf(category_id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, category_id);
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
    const ondeleteClick = async (category_id) => {

        let apiUrl, selectedArray = [];
        if (selected && selected.length > 1 && category_id) {
            selectedArray = selected;
            apiUrl = 'category_multi_delete/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'category_delete/' + selected;
            } else {
                apiUrl = 'category_delete/' + category_id;
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

    const oneditClick = async (category_id) => {
        await setoneditedId(category_id);
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
    const onstatusChange = async (category_id) => {

        let apiUrl, selectedArray = [];

        if (selected && selected.length > 1 && category_id) {
            selectedArray = selected;
            apiUrl = 'category_bulk_status_change/' + '[' + selectedArray + ']';
        }
        else {
            if (selected && selected.length > 0) {
                apiUrl = 'category_change_status/' + selected;
            } else {
                apiUrl = 'category_change_status/' + category_id;
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

        const title = "Category Report";
        const headers = [['Id', "Category Name", "Status"]];

        const data = list.map(elt => [elt.category_id, elt.category_name, elt.status]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("categoryreport.pdf")
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    const filteredUsers = applySortFilter(list, getComparator(order, orderBy), filterName);

    const isDataNotFound = !filteredUsers || filteredUsers.length === 0;

    return (
        <Page title="Category Report">
            <Loader show={loading} centerBorder={'#2065d1'} />
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Category Report
                    </Typography>

                    <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
                        Add Category
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

                                            const { category_id, status, category_name } = row;
                                            const isItemSelected = selected.indexOf(category_id) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={category_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >

                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(category_id)} />
                                                    </TableCell>

                                                    <TableCell align="left">{category_name}</TableCell>
                                                    <TableCell align="left" onClick={() => onstatusChange(category_id)}>
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
                                                            rowId={category_id}
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
                open && <CategoryModal
                    open={open}
                    handleClose={handleClose}
                    getRecord={getRecord}
                    oneditedId={oneditedId}
                />
            }

        </Page>

    );
}
