import * as Yup from 'yup';
import React, { useEffect, useState, useRef } from "react";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import { LoadingButton } from '@mui/lab';


// @mui
import { styled } from '@mui/material/styles';

// material
import { Stack, Card, Container, TextField, Typography, Button } from '@mui/material';

// components
import Page from '../../components/Page';
import UploadComponent from '../../components/UploadComponent';

// Serive
import { postData, getData, baseUrl } from '../../Services/apiservice';
import { toast } from 'react-toastify';

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
    const [workernameList, setworkernameList] = useState([]);
    const [temp_order_img, set_orderImage] = useState('');

    const purity_options = [
        { label: '95', value: '95' },
        { label: '96', value: '96' },
    ];

    const metalstatus_options = [
        { label: 'Yes', value: "1" },
        { label: 'No', value: "0" },
    ];

    const design_options = [
        { label: 'Stone', value: 'stone' },
        { label: 'Enamel', value: 'enamel' },
        { label: 'Radium', value: 'radium' },
        { label: 'Cutting', value: 'cutting' },
    ];

    const ustomerformSchema = Yup.object().shape({

        id: '',
        order_id: '',
        product_id: Yup.string().required('Product Name is requried'),
        customer_id: Yup.string().required('Customer Name is requried'),
        worker_id: Yup.string().required('Worker Name is requried'),
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
        order_details: '',
        temp_order_img: '',

        // multi:'',
        // files:'',
        // hdn_rdm_order_id: '',
        // hidden_order_count: ''

    });

    const formik = useFormik({
        initialValues: {
            id: '',
            order_id: '',
            product_id: '',
            worker_id: '',
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
            order_details: '',
            temp_order_img: '',

            // files: '',
            // multi: '',
            // hdn_rdm_order_id: '',
            // hidden_order_count: 1

        },
        validationSchema: ustomerformSchema,
        onSubmit: async (values) => {

            let formData = new FormData();
            formData.append("id", values.id);
            formData.append("hdn_rdm_order_id", values.order_id);
            formData.append("product_id", values.product_id);
            formData.append("worker_id", values.worker_id);
            formData.append("customer_id", values.customer_id);
            formData.append("purity", values.purity);
            formData.append("metal_provided", values.metal_provided);
            formData.append("metal_provided_date", values.metal_provided_date);
            formData.append("order_due_date", values.order_due_date);
            formData.append("jc_number", values.jc_number);
            formData.append("weight", values.weight);
            formData.append("quantity", values.quantity);
            formData.append("design_by", values.design_by);
            formData.append("delivery_date", values.delivery_date);
            formData.append("order_details", values.order_details);

            // formData.append("hidden_order_count", values.hidden_order_count);
            // formData.append("multi", values.files);

            // if (values.order_image && values.order_image.length > 0) {
            //     console.log("values.order_image", values.order_image);
            //     formData.append("order_image", values.order_image);
            // } else {
            //     formData.append("temp_order_img", values.temp_order_img);
            // }

            if (values.order_image) {
                formData.append("order_image", values.order_image);
            } else {
                formData.append("temp_order_img", values.temp_order_img);
            }

            let response = await postData('store_order', formData);
            if (response) {
                toast.success(response.data.message);
                navigate('/admin/order_report', { replace: true });
            } else {
                toast.error(response.data.message);
            }
        },
    });

    useEffect(() => {

        const initData = async () => {
            await getdropdownRecords();
            if (params && params.id) {
                let url = 'edit_order/' + params.id;
                let responseData = await getData(url);
                if (responseData && responseData.data.orders) {
                    console.log(responseData.data.orders);
                    const { id, product_id, customer_id, purity, jc_number, weight,
                        quantity, design_by, delivery_date, order_image, order_details, metal_provided, metal_provided_date, order_due_date, order_id, worker_id } = responseData.data.orders;

                    formik.setFieldValue("id", id ? id : null);
                    formik.setFieldValue("product_id", product_id ? product_id : null);
                    formik.setFieldValue("worker_id", worker_id ? worker_id : null);
                    formik.setFieldValue("customer_id", customer_id ? customer_id : null);
                    formik.setFieldValue("purity", purity ? purity : null);
                    formik.setFieldValue("metal_provided", metal_provided ? metal_provided : null);
                    formik.setFieldValue("metal_provided_date", metal_provided_date ? metal_provided_date : null);
                    formik.setFieldValue("order_due_date", order_due_date ? order_due_date : null);
                    formik.setFieldValue("jc_number", jc_number ? jc_number : null);
                    formik.setFieldValue("weight", weight ? weight : null);
                    formik.setFieldValue("quantity", quantity ? quantity : null);
                    formik.setFieldValue("design_by", design_by ? design_by : null);
                    formik.setFieldValue("delivery_date", delivery_date ? delivery_date : null);
                    formik.setFieldValue("order_details", order_details ? order_details : null);
                    formik.setFieldValue("order_id", order_id ? order_id : null);
                    formik.setFieldValue("temp_order_img", order_image ? order_image : null);

                    if (order_image) {
                        setImage("order_image", baseUrl + order_image);
                    }

                }
            }
        }
        initData();
    }, []);

    const getdropdownRecords = async () => {

        let responseData = await getData("add_order");
        let productnameList = responseData.data.products;
        let customernameList = responseData.data.customers;
        let workernameList = responseData.data.workers ? responseData.data.workers : [];

        productnameList.unshift({
            "product_id": '',
            "name": "Select Product",
        })

        customernameList.unshift({
            "customer_id": '',
            "name": "Select Customer",
        })

        workernameList.unshift({
            "worker_id": '',
            "name": "Select Worker",
        })


        if (params.id === null || params.id === '') {
            formik.setFieldValue("product_id", productnameList[0].product_id);
            formik.setFieldValue("customer_id", customernameList[0].customer_id);
            formik.setFieldValue("worker_id", customernameList[0].worker_id);
        }
        setproductnameList(productnameList);
        setcustomernameList(customernameList);
        setworkernameList(workernameList);
    }


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
        if (fieldName === 'order_image') {
            set_orderImage(image);
        }
    }


    const onDeleteImg = async (fieldName) => {
        if (fieldName === 'order_image') {
            set_orderImage('');
            formik.setFieldValue("temp_order_img", '');
        }
    }

    // const setImage = async (fieldName, images) => {
    //     if (fieldName === 'order_image' && images.length > 0) {
    //         let array = [];
    //         if (images && images.length < 0) {
    //             images.forEach((data, index) => {
    //                 array.push(baseUrl + data);
    //                 if (images.length == index + 1) {
    //                     set_orderImage(array);
    //                 }
    //             });
    //         }
    //     }
    // }

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

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


                                    <div className="required lbl">Customer Name:</div>
                                    <select name="customer_id" value={values.customer_id}
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


                                    <div className="required lbl">Worker Name:</div>
                                    <select name="worker_id" value={values.worker_id}
                                        onChange={(event) => {
                                            setFieldValue("worker_id", event.target.value)
                                        }}
                                        className="selectfield"
                                    >
                                        {
                                            workernameList &&
                                            workernameList.map((list, index) => {
                                                return (
                                                    <option className="seloptionfield" value={list.worker_id} label={list.name}> </option>
                                                )
                                            })

                                        }
                                    </select>
                                    {errors.worker_id && touched.worker_id &&
                                        <div className="selerr">{errors.worker_id}</div>
                                    }

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Weight"
                                        {...getFieldProps('weight')}
                                        error={Boolean(touched.jc_number && errors.jc_number)}
                                        helperText={touched.jc_number && errors.jc_number}
                                    />

                                    <TextField
                                        fullWidth
                                        type="file"
                                        label="Upload Order Image"
                                        name="order_image"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => {
                                            console.log(event.currentTarget.files[0]);
                                            onfileupload('order_image', event.currentTarget.files[0]);
                                        }}
                                        error={Boolean(touched.order_image && errors.order_image)}
                                        helperText={touched.order_image && errors.order_image}
                                    />

                                    {/* {
                                        temp_order_img &&
                                        <img src={temp_order_img}
                                            alt={'Other Upload'}
                                            className="img-thumbnail mt-2"
                                            height={200}
                                            width={300} />
                                    } */}

                                    {
                                        temp_order_img &&
                                        <div className="image-area">
                                            <img src={temp_order_img} alt="Preview" />
                                            <a onClick={(event) => {
                                                onDeleteImg('order_image')
                                            }} className="remove-image" href="javascript:void(0)" style={{ display: "Inline" }}>&#215;</a>
                                        </div>
                                    }

                                    {/* <div className="required lbl">Upload Order Image:</div>
                                    <UploadComponent setFieldValue={setFieldValue} set_orderImage={set_orderImage} />

                                    {temp_order_img &&
                                        temp_order_img.map((data, i) => (
                                            // <li key={i}>
                                            <img src={data}
                                                alt={'Other Upload'}
                                                className="img-thumbnail mt-2"
                                                height={100}
                                                width={100} />
                                            // </li>

                                        ))} */}

                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Order Date"
                                        {...getFieldProps('delivery_date')}
                                        InputLabelProps={{ shrink: true }}
                                        error={Boolean(touched.delivery_date && errors.delivery_date)}
                                        helperText={touched.delivery_date && errors.delivery_date}
                                    />


                                    {/* <div className="lbl">Metal Status:</div>
                                    <div role="group" aria-labelledby="my-radio-group1">
                                        {
                                            metalstatus_options &&
                                            metalstatus_options.map((option, index) => {
                                                return (
                                                    <div className="ml10">
                                                        <label className='mb-2'><Field type="radio" name="metal_provided" value={option.value} /> {option.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> */}


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
                                        type="number"
                                        label="Jc Number"
                                        {...getFieldProps('jc_number')}
                                        error={Boolean(touched.jc_number && errors.jc_number)}
                                        helperText={touched.jc_number && errors.jc_number}
                                    />


                                    <TextField
                                        fullWidth
                                        type="number"
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
                                                        <label className='mb-2'><Field type="checkbox" name="design_by" value={option.value} /> {option.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>



                                    {/* <TextField
                                        fullWidth
                                        type="text"
                                        label="Order Details"
                                        multiline
                                        rows={3}
                                        {...getFieldProps('order_details')}
                                        error={Boolean(touched.product_details && errors.product_details)}
                                        helperText={touched.product_details && errors.product_details}
                                    /> */}


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