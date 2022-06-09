import axios from "axios";
let token = 'sdfsdfsdf';

const baseUrl = 'http://localhost:8000/api/v1/';

const config = {
    headers: { Authorization: `Bearer ${token}` }
};


const customerReport = [
    {
        id: '1',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 1',
        address: 'Sample Address',
        city: 'Sample City',
        state: 'Sample State ',
        gst: 'Sample gst',
        pan: 'Sample Pan',
        otherupload: '-',
        status: true,
        Action: ''
    },

    {
        id: '2',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 2',
        address: 'Sample Address 2',
        city: 'Sample City 2',
        state: 'Sample State 2 ',
        gst: 'Sample gst 2',
        pan: 'Sample Pan 2',
        otherupload: '-',
        status: false,
        Action: ''
    },
    {
        id: '3',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 1',
        address: 'Sample Address',
        city: 'Sample City',
        state: 'Sample State ',
        gst: 'Sample gst',
        pan: 'Sample Pan',
        otherupload: '-',
        status: true,
        Action: ''
    },

    {
        id: '4',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 2',
        address: 'Sample Address 2',
        city: 'Sample City 2',
        state: 'Sample State 2 ',
        gst: 'Sample gst 2',
        pan: 'Sample Pan 2',
        otherupload: '-',
        status: false,
        Action: ''
    },
    {
        id: '5',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 1',
        address: 'Sample Address',
        city: 'Sample City',
        state: 'Sample State ',
        gst: 'Sample gst',
        pan: 'Sample Pan',
        otherupload: '-',
        status: true,
        Action: ''
    },

    {
        id: '6',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 2',
        address: 'Sample Address 2',
        city: 'Sample City 2',
        state: 'Sample State 2 ',
        gst: 'Sample gst 2',
        pan: 'Sample Pan 2',
        otherupload: '-',
        status: false,
        Action: ''
    },
    {
        id: '7',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 1',
        address: 'Sample Address',
        city: 'Sample City',
        state: 'Sample State ',
        gst: 'Sample gst',
        pan: 'Sample Pan',
        otherupload: '-',
        status: true,
        Action: ''
    },

    {
        id: '8',
        profilePic: `/static/mock-images/avatars/avatar_.jpg`,
        customerName: 'Customer Name 2',
        address: 'Sample Address 2',
        city: 'Sample City 2',
        state: 'Sample State 2 ',
        gst: 'Sample gst 2',
        pan: 'Sample Pan 2',
        otherupload: '-',
        status: false,
        Action: ''
    }


];

const categoryReport = [
    {
        id: '1',
        categoryName: 'categoryName 1',
        status: true,
        Action: ''
    },
    {
        id: '2',
        categoryName: 'categoryName 21',
        status: false,
        Action: ''
    },
    {
        id: '3',
        categoryName: 'categoryName 3',
        status: true,
        Action: ''
    },

];

const productReport = [

    {
        id: '1',
        productType: 'productType 1',
        productCategory: 'productCategory 1',
        productName: 'productName 1',
        productImage: '`/static/mock-images/avatars/avatar_.jpg`',
        productDetails: 'productDetails 1',
        status: true,
        Action: ''
    },

    {
        id: '2',
        productType: 'productType 2',
        productCategory: 'productCategory 2',
        productName: 'productName 2',
        productImage: '`/static/mock-images/avatars/avatar_.jpg`',
        productDetails: 'productDetails 2',
        status: true,
        Action: ''
    },


];

export async function getData(apiName) {
    console.log("apiName", apiName);
    // let apiUrl = baseUrl + apiName;
    let apiUrl = 'https://randomuser.me/api/';
    let responseData = await axios.get(apiUrl).then((response) => {
        if (apiName == 'categoryReport') {
            return categoryReport;
        } else if (apiName == 'customerReport') {
            return customerReport;
        } else if (apiName == 'productReport') {
            return productReport;
        }
    }, (error) => {
        return error;
    });
    return responseData;
}


export async function postData(apiName, params) {
    console.log("apiName", apiName);
    console.log("params", params);
    // let apiUrl = baseUrl + apiName;
    let apiUrl = 'https://randomuser.me/api/';
    return params;

    // let responseData = await axios.post(apiUrl, params, config).then((response) => {
    //     return customerReport;
    // }, (error) => {
    //     return customerReport;
    // });
    // return responseData;
}