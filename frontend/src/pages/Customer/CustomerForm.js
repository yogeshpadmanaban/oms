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
import { postData, getData, baseUrl} from '../../Services/apiservice';
import { toast } from 'react-toastify';
import '../common.css'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export default function CustomerForm() {

    const navigate = useNavigate();
    const params = useParams();

    const [temp_profile_picture, set_profile_picture_img] = useState('');
    const [temp_other_upload, set_other_upload_img] = useState('');

    const ustomerformSchema = Yup.object().shape({
        customer_id: '',
        profile_picture: '',
        temp_profile_picture: '',
        name: Yup.string().required('Customer Name is requried'),
        address: '',
        city: '',
        state: '',
        gst_no: Yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid Gst Number").nullable(),
        pan_no: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            "Invalid Pan Number").nullable(),
        other_upload: '',
        temp_other_upload: ''
    });


    const formik = useFormik({
        initialValues: {
            customer_id: '',
            profile_picture: '',
            temp_profile_picture: '',
            name: '',
            address: '',
            city: '',
            state: '',
            gst_no: '',
            pan_no: '',
            other_upload: '',
            temp_other_upload: ''
        },
        validationSchema: ustomerformSchema,
        onSubmit: async (values) => {

            let formData = new FormData();
            formData.append("customer_id", values.customer_id);
            formData.append("name", values.name);
            formData.append("address", values.address);
            formData.append("city", values.city);
            formData.append("state", values.state);
            formData.append("gst_no", values.gst_no);
            formData.append("pan_no", values.pan_no);

            if (values.profile_picture) {
                formData.append("profile_picture", values.profile_picture);
            } else {
                formData.append("temp_profile_picture", values.temp_profile_picture);
            }

            if (values.other_upload) {
                formData.append("other_upload", values.other_upload);
            } else {
                formData.append("temp_other_upload", values.temp_other_upload);
            }

            let response = await postData('store_customer', formData);
            if (response) {
                toast.success(response.data.message);
                navigate('/admin/customer_report', { replace: true });
            } else {
                toast.error(response.data.message);
            }

        },
    });

    useEffect(() => {
        const initData = async () => {
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

                    formik.setFieldValue("temp_profile_picture", profile_picture);
                    formik.setFieldValue("temp_other_upload", other_upload);
                    if (profile_picture) {
                        setImage("profile_picture", baseUrl + profile_picture);
                    }
                    if (other_upload) {
                        setImage("other_upload", baseUrl + other_upload);
                    }

                }
            }
        }
        initData();
    }, []);

    const onfileupload = async (name, value) => {

        if (value.size > 2000000) {
            toast.error("Max upload 2 Mb");
            return;
        }

        if (value.type === "image/png" || value.type === "image/jpeg") {
            formik.setFieldValue(name, value);
            let reader = new FileReader();
            reader.onloadend = () => {
                setImage(name, reader.result);
            };
            reader.readAsDataURL(value);
        }

        else {
            toast.error("Invalid File Format");
        }

    }

    const setImage = async (fieldName, image) => {
        if (fieldName === 'profile_picture') {
            set_profile_picture_img(image);
        } else {
            set_other_upload_img(image);
        }
    }

    const onDeleteImg = async (fieldName) => {
        if (fieldName === 'profile_picture') {
            set_profile_picture_img('');
            formik.setFieldValue("temp_profile_picture", '');
        } else {
            set_other_upload_img('');
            formik.setFieldValue("temp_other_upload", '');
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
                                        temp_profile_picture &&
                                        <div className="image-area">
                                            <img src={temp_profile_picture} alt="Preview" />
                                            <a onClick={(event) => {
                                                onDeleteImg('profile_picture')
                                            }} className="remove-image" href="javascript:void(0)" style={{ display: "Inline" }}>&#215;</a>
                                        </div>
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
                                        temp_other_upload &&
                                        <div className="image-area">
                                            <img src={temp_other_upload} alt="Preview" />
                                            <a onClick={(event) => {
                                                onDeleteImg('other_upload')
                                            }} className="remove-image" href="javascript:void(0)" style={{ display: "Inline" }}>&#215;</a>
                                        </div>
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
        </Page >
    );
} 