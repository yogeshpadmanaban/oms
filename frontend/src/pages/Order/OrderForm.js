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

    const design_options = [
        { label: 'Stone', value: 'Stone' },
        { label: 'Enamel', value: 'Enamel' },
        { label: 'Radium', value: 'Radium' },
        { label: 'Cutting', value: 'Cutting' },
    ];


    const ustomerformSchema = Yup.object().shape({

        order_id: Yup.string(),
        product_name: Yup.string().required('Product Name is requried'),
        customer_name: Yup.string().required('Customer Name is requried'),
        purity: Yup.string(),
        jc_number: Yup.string(),
        weight: Yup.string(),
        quantity: Yup.string(),
        designed_by: Yup.string(),
        delivery_date: Yup.string(),
        // order_image: Yup.string(),
        order_details: Yup.string(),

    });

    const formik = useFormik({
        initialValues: {
            order_id: '',
            product_name: '',
            customer_name: '',
            purity: '',
            jc_number: '',
            weight: '',
            quantity: '',
            designed_by: '',
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
                const { order_id, customer_name, purity, jc_number, weight,
                    quantity, designed_by, delivery_date, order_image, order_details } = responseData.data.orders;
                formik.setFieldValue("order_id", order_id);
                formik.setFieldValue("customer_name", customer_name);
                formik.setFieldValue("purity", purity);
                formik.setFieldValue("jc_number", jc_number);
                formik.setFieldValue("weight", weight);
                formik.setFieldValue("quantity", quantity);
                formik.setFieldValue("designed_by", designed_by);
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
            formik.setFieldValue("customer_name", customernameList[0].customer_id);
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
                                    <select name="product_name" value={values.product_name}
                                        onChange={(event) => {
                                            setFieldValue("product_name", event.target.value)
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
                                    {errors.product_name && touched.product_name &&
                                        <div className="selerr">{errors.product_name}</div>
                                    }


                                    <div className="required lbl">Customer Name:</div>
                                    <select name="customer_name" value={values.name}
                                        onChange={(event) => {
                                            setFieldValue("customer_name", event.target.value)
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
                                    {errors.customer_name && touched.customer_name &&
                                        <div className="selerr">{errors.customer_name}</div>
                                    }


                                    <div className="lbl">Purity:</div>
                                    <div role="group" aria-labelledby="my-radio-group">
                                        {
                                            purity_options &&
                                            purity_options.map((option, index) => {
                                                return (
                                                    <div className="ml10">
                                                        <label className='mb-2'><Field type="radio" name="purity" value={option.value} /> {option.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>


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
                                                        <label className='mb-2'><Field type="radio" name="designed_by" value={option.value} /> {option.label}</label>
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
