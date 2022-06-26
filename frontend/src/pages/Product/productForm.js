import * as Yup from 'yup';
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
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

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export default function ProductForm() {

    const navigate = useNavigate();
    const params = useParams();


    const ustomerformSchema = Yup.object().shape({
        product_id: '',
        name: Yup.string().required('Name is required'),
        product_details: Yup.string(),
        product_image: '',
    });

    const formik = useFormik({
        initialValues: {
            product_id: '',
            name: '',
            product_details: '',
            product_image: ''
        },
        validationSchema: ustomerformSchema,
        onSubmit: async (values) => {
            console.log("values", values);

            // let response = await postData('store_product', values);
            // if (response) {
            //     toast.success(response.data.message);
            //     navigate('/admin/customer_report', { replace: true });
            // } else {
            //     toast.error(response.data.message);
            // }

        },
    });

    useEffect(async () => {
        if (params && params.id) {
            let url = 'edit_product/' + params.id;
            let responseData = await getData(url);
            console.log("sfsdfsdfsdfsdf", responseData.data.customer)
            if (responseData && responseData.data.customer) {
                const { name, product_details, product_image, product_id } = responseData.data.customer;
                formik.setFieldValue("product_id", product_id);
                formik.setFieldValue("name", name);
                formik.setFieldValue("product_details", product_details);
                formik.setFieldValue("product_image", product_image);
            }
        }
    }, []);

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, initialValues } = formik;
    return (
        <Page title={params && params.id ? "Edit Product" : "Add Product"}>
            <RootStyle>
                <Container>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            {params && params.id ? "Edit Product" : "Add Product"}
                        </Typography>
                    </Stack>

                    <Card>
                        <FormikProvider value={formik}>
                            <Form autoComplete="off" encType="multipart/form-data" noValidate onSubmit={handleSubmit}>
                                <Stack spacing={3} sx={{ my: 4 }}>

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Product Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />


                                    <TextField
                                        fullWidth
                                        type="file"
                                        label="Product Image"
                                        name="product_image"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => {
                                            setFieldValue("product_image", event.currentTarget.files[0])
                                        }}
                                        error={Boolean(touched.product_image && errors.product_image)}
                                        helperText={touched.product_image && errors.product_image}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Product Details"
                                        multiline
                                        rows={3}
                                        {...getFieldProps('product_details')}
                                        error={Boolean(touched.product_details && errors.product_details)}
                                        helperText={touched.product_details && errors.product_details}
                                    />

                                    <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
                                        <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}> Submit </LoadingButton>
                                        <Button sx={{ m: 2 }} variant="contained" color="error" component={RouterLink} to="/admin/product_report">
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
