import axios from "axios";

let token = localStorage.getItem("token");

const baseUrl = 'http://localhost:8000/api/admin/';

const config = {
    headers: { Authorization: `Bearer ${token}` }
};


const customerReport = {
    total: 7,
    recordsFiltered: 7,
    rows: [
        {
            customer_id: 1,
            profile_picture: `/static/mock-images/avatars/avatar_.jpg`,
            name: 'Customer Name 1',
            address: 'Sample Address',
            city: 'Sample City',
            state: 'Sample State ',
            gst_no: 'Sample gst',
            pan_no: 'Sample Pan',
            other_upload: '-',
            status: true,
            Action: ''
        },
        {
            customer_id: 2,
            profile_picture: `/static/mock-images/avatars/avatar_.jpg`,
            name: 'Customer Name 1',
            address: 'Sample Address',
            city: 'Sample City',
            state: 'Sample State ',
            gst_no: 'Sample gst',
            pan_no: 'Sample Pan',
            other_upload: '-',
            status: true,
            Action: ''
        },
        {
            customer_id: 3,
            profile_picture: `/static/mock-images/avatars/avatar_.jpg`,
            name: 'Customer Name 1',
            address: 'Sample Address',
            city: 'Sample City',
            state: 'Sample State ',
            gst_no: 'Sample gst',
            pan_no: 'Sample Pan',
            other_upload: '-',
            status: true,
            Action: ''
        },
        {
            customer_id: 4,
            profile_picture: `/static/mock-images/avatars/avatar_.jpg`,
            name: 'Customer Name 1',
            address: 'Sample Address',
            city: 'Sample City',
            state: 'Sample State ',
            gst_no: 'Sample gst',
            pan_no: 'Sample Pan',
            other_upload: '-',
            status: false,
            Action: ''
        },
    ]

};

const editCustomerRecord = {
    "customer": {
        "customer_id": 23,
        "profile_picture": "/static/mock-images/avatars/avatar_.jpg",
        "name": "gokul",
        "address": "anna nagar",
        "city": "chennai",
        "cus_state": "TN",
        "gst_no": "234433424334",
        "pan_no": "3423434ER676",
        "other_upload": "/static/mock-images/avatars/avatar_.jpg",
    },
    "menu": "customer_list"
}

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
    // let apiUrl = 'https://randomuser.me/api/';

    if (apiName == 'categoryReport') {
        return categoryReport;
    }

    else if (apiName == 'productReport') {
        return productReport;
    }
    // else if (apiName == 'customer_details') {
    //     return customerReport;
    // }
    else {
        let apiUrl = baseUrl + apiName;
        let responseData = await axios.get(apiUrl).then((response) => {
            return response;
        },
            (error) => {
                return error;
            });
        return responseData;
    }
}

// export async function getData(apiName) {
//     console.log("apiName", apiName);
//     // let apiUrl = baseUrl + apiName;
//     let apiUrl = 'https://randomuser.me/api/';
//     if (apiName == 'customer_details') {
//         return customerReport;
//     } else if (apiName == 'edit_customer/1') {
//         return editCustomerRecord;
//     } else if (apiName == 'categoryReport') {
//         return categoryReport;
//     } else if (apiName == 'productReport') {
//         return productReport;
//     }
// }


export async function postData(apiName, params) {
    if (apiName == "login") {
        return 'sampleToken';
    }
    let apiUrl = baseUrl + apiName;
    let responseData = await axios.post(apiUrl, params, config).then((response) => {
        return response;
    },
    (error) => {
        return error;
    });
    return responseData;
}