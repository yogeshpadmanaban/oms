import * as Yup from 'yup';
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider, Field } from 'formik';
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


//css
import '../common.css';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export default function ProductForm() {

    const navigate = useNavigate();
    const params = useParams();

    const [category, setCategoryList] = useState([]);
    const [temp_pdf_img, set_product_image_img] = useState('');

    const radioOptions = [
        { label: 'Vigat Product', value: 'Vigat Product' },
        { label: 'Customized product', value: 'Customized product' },
    ];


    const ustomerformSchema = Yup.object().shape({
        product_id: '',
        product_type: Yup.string().required('Product type is required'),
        category: Yup.string().required('Product category is required'),
        name: Yup.string().required('Name is required'),
        product_image: '',
        temp_pdf_img: '',
        product_details: ''
    });

    const formik = useFormik({
        initialValues: {
            product_id: '',
            product_type: '',
            category: '',
            name: '',
            product_image: '',
            temp_pdf_img: '',
            product_details: ''
        },
        validationSchema: ustomerformSchema,
        onSubmit: async (values) => {

            let formData = new FormData();
            formData.append("product_id", values.product_id);
            formData.append("product_type", values.product_type);
            formData.append("name", values.name);
            formData.append("category", values.category);
            formData.append("product_details", values.product_details);

            if (values.product_image) {
                formData.append("product_image", values.product_image);
            } else {
                formData.append("temp_pdf_img", values.temp_pdf_img);
            }
            let response = await postData('store_product', formData);
            console.log(response, 'response');
            if (response) {
                toast.success(response.data.message);
                navigate('/admin/product_report', { replace: true });
            } else {
                toast.error(response.data.message);
            }

        },
    });

    useEffect(() => {
        const initData = async () => {
            await getcategory();
            if (params && params.id) {
                let url = 'edit_product/' + params.id;
                let responseData = await getData(url);
                if (responseData && responseData.data.products) {
                    const { name, product_details, product_image, product_id, product_type, category } = responseData.data.products;
                    formik.setFieldValue("product_id", product_id);
                    formik.setFieldValue("product_type", product_type);
                    formik.setFieldValue("category", category);
                    formik.setFieldValue("name", name);
                    formik.setFieldValue("product_details", product_details);
                    
                    formik.setFieldValue("temp_pdf_img", product_image);
                    setImage("product_image", 'https://api.omsmdu.com/' + product_image);
                }
            }
        }
        initData();
    }, []);

    const getcategory = async () => {
        let responseData = await getData("add_product");
        let categoryList = responseData.data.category;
        categoryList.unshift({
            "category_id": '',
            "category_name": "Select Category",
        })
        if (params.id === null || params.id === '') {
            formik.setFieldValue("category", categoryList[0].category_id);
        }
        setCategoryList(categoryList);
    }

    const onfileupload = async (name, value) => {
        formik.setFieldValue(name, value);
        let reader = new FileReader();
        reader.onloadend = () => {
            setImage(name, reader.result);
        };
        reader.readAsDataURL(value);

    }

    const setImage = async (fieldName, image) => {
        if (fieldName === 'product_image') {
            set_product_image_img(image);
        }
    }


    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;
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

                                    <div className="required lbl">Product Type:</div>
                                    <div role="group" aria-labelledby="my-radio-group">
                                        {
                                            radioOptions &&
                                            radioOptions.map((option, index) => {
                                                return (
                                                    <div className='ml10'>
                                                        <label className='mb-2'><Field key={index} type="radio" name="product_type" value={option.value} /> {option.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {errors.product_type && touched.product_type &&
                                        <div className="selerr">{errors.product_type}</div>
                                    }

                                    <div className="required lbl">Product Category:</div>
                                    <select name="category" value={values.category}
                                        onChange={(event) => {
                                            setFieldValue("category", event.target.value)
                                        }}

                                        className="selectfield"
                                    >
                                        {
                                            category &&
                                            category.map((list, index) => {
                                                return (
                                                    <option className="seloptionfield" value={list.category_id} label={list.category_name}> </option>
                                                )
                                            })
                                        }

                                    </select>

                                    {errors.category && touched.category &&
                                        <div className="selerr">{errors.category}</div>
                                    }


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
                                            onfileupload('product_image', event.currentTarget.files[0]);
                                        }}
                                        error={Boolean(touched.product_image && errors.product_image)}
                                        helperText={touched.product_image && errors.product_image}
                                    />

                                    {
                                        temp_pdf_img &&
                                        <img src={temp_pdf_img}
                                            alt={'Product Image'}
                                            className="img-thumbnail mt-2"
                                            height={200}
                                            width={300} />
                                    }


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
