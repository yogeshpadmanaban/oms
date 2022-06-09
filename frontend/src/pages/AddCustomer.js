import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

// @mui
import { styled } from '@mui/material/styles';

// material
import { Link, Stack, Card, Container, TextField, IconButton, FormControlLabel, Typography, Button } from '@mui/material';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// Serive
import { postData } from '../Services/apiservice';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export default function AddCustomer() {


    const uploadfile = (event) => {
        console.log("event", event);
    };

    const navigate = useNavigate();

    const addcustomerSchema = Yup.object().shape({
        profilePicture: Yup.string().required('Profile Picture is required'),
        name: Yup.string().required('Name is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        gst: Yup.string().required('Gst is required'),
        pan: Yup.string().required('Pan is required'),
        otherUpload: '',
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            city: '',
            state: '',
            gst: '',
            pan: '',
            profilePicture: '',
            otherUpload: ''
        },
        validationSchema: addcustomerSchema,
        onSubmit: async (values) => {
            console.log("values", values);
            let response = await postData('login', values);
            console.log("response", response);
            // if (response) {
            //     navigate('/dashboard/app', { replace: true });
            // }
        },
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;


    return (
        <Page title="Add Customer">
            <RootStyle>
                <Container>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Add Customer
                        </Typography>

                        <Button variant="contained" color="error" component={RouterLink} to="/dashboard/customer_report">
                            Cancel
                        </Button>
                    </Stack>

                    <Card>
                        <FormikProvider value={formik}>
                            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Stack spacing={3} sx={{ my: 4 }}>

                                    <TextField
                                        fullWidth
                                        type="file"
                                        onSelect={uploadfile}
                                        // label="Profile Picture"
                                        {...getFieldProps('profilePicture')}
                                        error={Boolean(touched.profilePicture && errors.profilePicture)}
                                        helperText={touched.profilePicture && errors.profilePicture}
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
                                        {...getFieldProps('gst')}
                                        error={Boolean(touched.gst && errors.gst)}
                                        helperText={touched.gst && errors.gst}
                                    />

                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="PAN"
                                        {...getFieldProps('pan')}
                                        error={Boolean(touched.pan && errors.pan)}
                                        helperText={touched.pan && errors.pan}
                                    />


                                    <TextField
                                        fullWidth
                                        type="file"
                                        // label="Profile Picture"
                                        {...getFieldProps('otherUpload')}
                                        error={Boolean(touched.otherUpload && errors.otherUpload)}
                                        helperText={touched.otherUpload && errors.otherUpload}
                                    />


                                </Stack>

                                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}> Submit </LoadingButton>

                            </Form>
                        </FormikProvider>
                    </Card>
                </Container>
            </RootStyle>
        </Page>
    );
}
