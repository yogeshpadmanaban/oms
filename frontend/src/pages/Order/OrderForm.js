import * as Yup from 'yup';
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import { LoadingButton } from '@mui/lab';
import { decode as base64_decode, encode as base64_encode } from 'base-64';


// @mui
import { styled } from '@mui/material/styles';

// material
import { Link, Stack, Card, Container, TextField, IconButton, FormControlLabel, Typography, Button } from '@mui/material';

// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';

// Serive
import { postData, getData } from '../../Services/apiservice';
import { ToastContainer, toast } from 'react-toastify';

//css
import '../common.css';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export default function OrderForm() {

    const navigate = useNavigate();
    const params = useParams();

    const [productnameList, setproductnameList] = useState([]);

    const [customernameList, setcustomernameList] = useState([]);

    const purity_options = [
        { label: '95', value: '95' },
        { label: '96', value: '96' },
    ];

    const metalstatus_options = [
        { label: 'Yes', value: "1" },
        { label: 'No', value: "0" },
    ];

    const design_options = [
        { label: 'Stone', value: 'Stone' },
        { label: 'Enamel', value: 'Enamel' },
        { label: 'Radium', value: 'Radium' },
        { label: 'Cutting', value: 'Cutting' },
    ];


    const ustomerformSchema = Yup.object().shape({

        id: '',
        product_id: Yup.string().required('Product Name is requried'),
        customer_id: Yup.string().required('Customer Name is requried'),
        purity: '',
        metal_provided: '',
        metal_provided_date: '',
        order_due_date: '',
        jc_number: '',
        weight: '',
        quantity: '',
        design_by: '',
        delivery_date: '',
        // order_image: '',
        order_details: '',

    });

    const formik = useFormik({
        initialValues: {
            product_id: '',
            customer_id: '',
            purity: '',
            metal_provided: '',
            metal_provided_date: '',
            order_due_date: '',
            jc_number: '',
            weight: '',
            quantity: '',
            design_by: '',
            delivery_date: '',
            order_image: '',
            order_details: ''
        },
        validationSchema: ustomerformSchema,
        onSubmit: async (values) => {
            console.log("values", values);
            let response = await postData('store_order', values);
            if (response) {
                toast.success(response.data.message);
                navigate('/admin/order_report', { replace: true });
            } else {
                toast.error(response.data.message);
            }
        },
    });

    useEffect(async () => {
        await getdropdownRecords();
        if (params && params.id) {
            let url = 'edit_order/' + params.id;
            let responseData = await getData(url);
            console.log(responseData.data.orders);
            if (responseData && responseData.data.orders) {
                const { id, product_id, customer_id, purity, jc_number, weight,
                    quantity, design_by, delivery_date, order_image, order_details, metal_provided, metal_provided_date, order_due_date } = responseData.data.orders;
                formik.setFieldValue("id", id);
                formik.setFieldValue("product_id", product_id);
                formik.setFieldValue("customer_id", customer_id);
                formik.setFieldValue("purity", purity);
                formik.setFieldValue("metal_provided", metal_provided);
                formik.setFieldValue("metal_provided_date", metal_provided_date);
                formik.setFieldValue("order_due_date", order_due_date);
                formik.setFieldValue("jc_number", jc_number);
                formik.setFieldValue("weight", weight);
                formik.setFieldValue("quantity", quantity);
                formik.setFieldValue("design_by", design_by);
                formik.setFieldValue("delivery_date", delivery_date);
                formik.setFieldValue("order_image", order_image);
                formik.setFieldValue("order_details", order_details);
            }
        }
    }, []);

    const getdropdownRecords = async () => {

        let responseData = await getData("add_order");
        let productnameList = responseData.data.products;
        let customernameList = responseData.data.customers;
        productnameList.unshift({
            "product_id": '',
            "name": "Select Product",
        })

        customernameList.unshift({
            "customer_id": '',
            "name": "Select Customer",
        })

        if (params.id == null || params.id == '') {
            formik.setFieldValue("product_id", productnameList[0].product_id);
            formik.setFieldValue("customer_id", customernameList[0].customer_id);
        }
        setproductnameList(productnameList);
        setcustomernameList(customernameList);
    }

    const handleCategoryChange = (event) => {
        console.log('selectedCategory', event.target.value);
    }

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, initialValues } = formik;
    return (
        <Page title={params && params.id ? "Edit Order" : "Add Order"}>
            <RootStyle>
                <Container>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            {params && params.id ? "Edit Order" : "Add Order"}
                        </Typography>
                    </Stack>

                    <Card>
                        <FormikProvider value={formik}>
                            <Form autoComplete="off" encType="multipart/form-data" noValidate onSubmit={handleSubmit}>
                                <Stack spacing={3} sx={{ my: 4 }}>

                                    <div className="required lbl">Product Name:</div>
                                    <select name="product_id" value={values.product_id}
                                        onChange={(event) => {
                                            setFieldValue("product_id", event.target.value)
                                        }}
                                        className="selectfield"
                                    >
                                        {
                                            productnameList &&
                                            productnameList.map((list, index) => {
                                                return (
                                                    <option className="seloptionfield" value={list.product_id} label={list.name}> </option>
                                                )
                                            })

                                        }
                                    </select>
                                    {errors.product_id && touched.product_id &&
                                        <div className="selerr">{errors.product_id}</div>
                                    }


                                    <div className="required lbl">Customer Name:</div>
                                    <select name="customer_id" value={values.name}
                                        onChange={(event) => {
                                            setFieldValue("customer_id", event.target.value)
                                        }}
                                        className="selectfield"
                                    >
                                        {
                                            customernameList &&
                                            customernameList.map((list, index) => {
                                                return (
                                                    <option className="seloptionfield" value={list.customer_id} label={list.name}> </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {errors.customer_id && touched.customer_id &&
                                        <div className="selerr">{errors.customer_id}</div>
                                    }


                                    <div className="lbl">Purity:</div>
                                    <div role="group" aria-labelledby="my-radio-group">
                                        {
                                            purity_options &&
                                            purity_options.map((option, index) => {
                                                return (
                                                    <div className="ml10">
                                                        <label className='mb-2'><Field type="checkbox" name="purity" value={option.value} checked={values.purity == option.value ? true : false} onChange={(event) => {
                                                            setFieldValue("purity", event.target.value)
                                                        }} /> {option.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div className="lbl">Metal Status:</div>
                                    <div role="group" aria-labelledby="my-radio-group1">
                                        {
                                            metalstatus_options &&
                                            metalstatus_options.map((option, index) => {
                                                return (
                                                    <div className="ml10">
                                                        <label className='mb-2'><Field type="checkbox" name="metal_provided" value={option.value} checked={values.metal_provided == option.value ? true : false} onChange={(event) => {
                                                            setFieldValue("metal_provided", event.target.value)
                                                        }} /> {option.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>


                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Metal Status Date"
                                        {...getFieldProps('metal_provided_date')}
                                        InputLabelProps={{ shrink: true }}
                                        error={Boolean(touched.metal_provided_date && errors.metal_provided_date)}
                                        helperText={touched.metal_provided_date && errors.metal_provided_date}
                                    />

                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Order Due Date"
                                        {...getFieldProps('order_due_date')}
                                        InputLabelProps={{ shrink: true }}
                                        error={Boolean(touched.order_due_date && errors.order_due_date)}
                                        helperText={touched.order_due_date && errors.order_due_date}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Jc Number"
                                        {...getFieldProps('jc_number')}
                                        error={Boolean(touched.jc_number && errors.jc_number)}
                                        helperText={touched.jc_number && errors.jc_number}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Weight"
                                        {...getFieldProps('weight')}
                                        error={Boolean(touched.jc_number && errors.jc_number)}
                                        helperText={touched.jc_number && errors.jc_number}
                                    />


                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Quantity"
                                        {...getFieldProps('quantity')}
                                        error={Boolean(touched.quantity && errors.quantity)}
                                        helperText={touched.quantity && errors.quantity}
                                    />


                                    <div className="lbl">To be Design:</div>
                                    <div role="group" aria-labelledby="my-radio-group">
                                        {
                                            design_options &&
                                            design_options.map((option, index) => {
                                                return (
                                                    <div className="ml10">
                                                        <label className='mb-2'><Field type="checkbox" name="design_by" value={option.value} checked={values.design_by == option.value ? true : false}
                                                            onChange={(event) => {
                                                                setFieldValue("design_by", event.target.value)
                                                            }} /> {option.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Delivery Date"
                                        {...getFieldProps('delivery_date')}
                                        InputLabelProps={{ shrink: true }}
                                        error={Boolean(touched.delivery_date && errors.delivery_date)}
                                        helperText={touched.delivery_date && errors.delivery_date}
                                    />


                                    <TextField
                                        fullWidth
                                        type="file"
                                        label="Upload Order Image"
                                        name="order_image"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => {
                                            setFieldValue("order_image", event.currentTarget.files[0])
                                        }}
                                        error={Boolean(touched.order_image && errors.order_image)}
                                        helperText={touched.order_image && errors.order_image}
                                    />


                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Order Details"
                                        multiline
                                        rows={3}
                                        {...getFieldProps('order_details')}
                                        error={Boolean(touched.product_details && errors.product_details)}
                                        helperText={touched.product_details && errors.product_details}
                                    />


                                    <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
                                        <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}> Submit </LoadingButton>
                                        <Button sx={{ m: 2 }} variant="contained" color="error" component={RouterLink} to="/admin/order_report">
                                            Cancel
                                        </Button>
                                    </Stack>

                                </Stack>
                            </Form>
                        </FormikProvider>
                    </Card>
                </Container>
            </RootStyle>
        </Page>
    );
}