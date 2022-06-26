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
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// Serive
import { postData, getData } from '../Services/apiservice';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export default function CustomerForm() {

    const navigate = useNavigate();
    const params = useParams();
    const [profile_picture, setProfile_picture] = useState('');


    const ustomerformSchema = Yup.object().shape({
        customer_id: '',
        profile_picture: '',
        name: Yup.string().required('Name is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        gst_no: Yup.string().required('Gst is required'),
        pan_no: Yup.string().required('Pan is required'),
        other_upload: '',
    });

    const formik = useFormik({
        initialValues: {
            customer_id: '',
            name: '',
            address: '',
            city: '',
            state: '',
            gst_no: '',
            pan_no: '',
            profile_picture: '',
            other_upload: ''
        },
        validationSchema: ustomerformSchema,
        onSubmit: async (values) => {

            let profile_picture = {};
            let other_upload = {};

            // params = values;
            // params.profile_picture = initialValues.profile_picture;

            if (values.profile_picture) {
                profile_picture.name = values.profile_picture.name;
                profile_picture.type = values.profile_picture.type;
                profile_picture.size = `${values.profile_picture.size} bytes`;
                // profile_picture.data = RNFetchBlob.wrap(fileContent)
                values.profile_picture = profile_picture;
            }

            if (values.other_upload) {
                other_upload.name = values.other_upload.name;
                other_upload.type = values.other_upload.type;
                other_upload.size = `${values.other_upload.size} bytes`;
                values.other_upload = other_upload;
            }

            console.log("values", values);

            let response = await postData('store_customer', values);
            if (response) {
                navigate('/admin/customer_report', { replace: true });
            }

        },
    });

    useEffect(async () => {
        if (params && params.id) {
            let url = 'edit_customer/' + params.id;
            let responseData = await getData(url);
            console.log("sfsdfsdfsdfsdf", responseData.data.customer)
            if (responseData && responseData.data.customer) {
                const { name, address, city, state, gst_no, pan_no, profile_picture, other_upload, customer_id } = responseData.data.customer;
                formik.setFieldValue("customer_id", customer_id);
                formik.setFieldValue("name", name);
                formik.setFieldValue("address", address);
                formik.setFieldValue("city", city);
                formik.setFieldValue("state", state);
                formik.setFieldValue("gst_no", gst_no);
                formik.setFieldValue("pan_no", pan_no);
                formik.setFieldValue("profile_picture", profile_picture);
                formik.setFieldValue("other_upload", other_upload);
            }
        }
    }, []);

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, initialValues } = formik;
    return (
        <Page title={params && params.id ? "Edit Customer" : "Add Customer"}>
            <RootStyle>
                <Container>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            {params && params.id ? "Edit Customer" : "Add Customer"}
                        </Typography>
                    </Stack>

                    <Card>
                        <FormikProvider value={formik}>
                            <Form autoComplete="off" encType="multipart/form-data" noValidate onSubmit={handleSubmit}>
                                <Stack spacing={3} sx={{ my: 4 }}>

                                    <TextField
                                        fullWidth
                                        type="file"
                                        InputLabelProps={{ shrink: true }}
                                        label="Profile Picture"
                                        name="profile_picture"
                                        onChange={(event) => {
                                            // initialValues.profile_picture = event.currentTarget.files[0]
                                            // setProfile_picture(event.currentTarget.files[0]);
                                            setFieldValue("profile_picture", event.currentTarget.files[0])
                                        }}
                                        error={Boolean(touched.profile_picture && errors.profile_picture)}
                                        helperText={touched.profile_picture && errors.profile_picture}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Address"
                                        multiline
                                        rows={3}
                                        {...getFieldProps('address')}
                                        error={Boolean(touched.address && errors.address)}
                                        helperText={touched.address && errors.address}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="City"
                                        {...getFieldProps('city')}
                                        error={Boolean(touched.city && errors.city)}
                                        helperText={touched.city && errors.city}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="State"
                                        {...getFieldProps('state')}
                                        error={Boolean(touched.state && errors.state)}
                                        helperText={touched.state && errors.state}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="GST"
                                        {...getFieldProps('gst_no')}
                                        error={Boolean(touched.gst_no && errors.gst_no)}
                                        helperText={touched.gst_no && errors.gst_no}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="PAN"
                                        {...getFieldProps('pan_no')}
                                        error={Boolean(touched.pan_no && errors.pan_no)}
                                        helperText={touched.pan_no && errors.pan_no}
                                    />


                                    <TextField
                                        fullWidth
                                        type="file"
                                        label="Other Upload"
                                        name="other_upload"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => {
                                            setFieldValue("other_upload", event.currentTarget.files[0])
                                        }}
                                        error={Boolean(touched.other_upload && errors.other_upload)}
                                        helperText={touched.other_upload && errors.other_upload}
                                    />

                                    <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>

                                        <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}> Submit </LoadingButton>

                                        <Button sx={{ m: 2 }} variant="contained" color="error" component={RouterLink} to="/admin/dashboard/customer_report">
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
