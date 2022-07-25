import * as Yup from 'yup';
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';


// @mui
import { styled } from '@mui/material/styles';

// material
import { Stack, Card, Container, TextField, Typography, Button } from '@mui/material';

// components
import Page from '../../components/Page';

// Serive
import { postData, getData } from '../../Services/apiservice';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export default function CustomerForm() {

    const navigate = useNavigate();
    const params = useParams();

    const [profile_picture_img, set_profile_picture_img] = useState('');
    const [other_upload_img, set_other_upload_img] = useState('');

    const ustomerformSchema = Yup.object().shape({
        customer_id: '',
        profile_picture: '',
        name: Yup.string().required('Customer Name is requried'),
        address: '',
        city: '',
        state: '',
        gst_no: '',
        pan_no: '',
        other_upload: '',
    });


    const formik = useFormik({
        initialValues: {
            customer_id: '',
            profile_picture: '',
            name: '',
            address: '',
            city: '',
            state: '',
            gst_no: '',
            pan_no: '',
            other_upload: ''
        },
        validationSchema: ustomerformSchema,
        onSubmit: async (values) => {

            let formData = new FormData();
            formData.append("customer_id", values.customer_id);
            formData.append("profile_picture", values.profile_picture);
            formData.append("name", values.name);
            formData.append("address", values.address);
            formData.append("city", values.city);
            formData.append("state", values.state);
            formData.append("gst_no", values.gst_no);
            formData.append("pan_no", values.pan_no);
            formData.append("other_upload", values.other_upload);

            let response = await postData('store_customer', formData);
            if (response) {
                toast.success(response.data.message);
                navigate('/admin/customer_report', { replace: true });
            } else {
                toast.error(response.data.message);
            }

        },
    });

    useEffect(async () => {
        if (params && params.id) {
            let url = 'edit_customer/' + params.id;
            let responseData = await getData(url);
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
                setImage("profile_picture", profile_picture);
                setImage("other_upload", other_upload);
            }
        }
    }, []);

    const onfileupload = async (name, value) => {
        formik.setFieldValue(name, value);
        let reader = new FileReader();
        reader.onloadend = () => {
            setImage(name, reader.result);
        };
        reader.readAsDataURL(value);

    }

    const setImage = async (fieldName, image) => {
        if (fieldName === 'profile_picture') {
            set_profile_picture_img(image);
        } else {
            set_other_upload_img(image);
        }
    }

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

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
                                        label="profile_picture"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => {
                                            onfileupload('profile_picture', event.currentTarget.files[0]);
                                        }}
                                        error={Boolean(touched.profile_picture && errors.profile_picture)}
                                        helperText={touched.profile_picture && errors.profile_picture}
                                    />

                                    {
                                        profile_picture_img &&
                                        <img src={profile_picture_img}
                                            alt={'Profile Picture'}
                                            className="img-thumbnail mt-2"
                                            height={200}
                                            width={300} />
                                    }


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
                                            onfileupload('other_upload', event.currentTarget.files[0]);
                                        }}
                                        error={Boolean(touched.other_upload && errors.other_upload)}
                                        helperText={touched.other_upload && errors.other_upload}
                                    />

                                    {
                                        other_upload_img &&
                                        <img src={other_upload_img}
                                            alt={'Other Upload'}
                                            className="img-thumbnail mt-2"
                                            height={200}
                                            width={300} />
                                    }

                                    <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>

                                        <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}> Submit </LoadingButton>

                                        <Button sx={{ m: 2 }} variant="contained" color="error" component={RouterLink} to="/admin/customer_report">
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