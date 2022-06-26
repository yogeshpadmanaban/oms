import axios from "axios";

let token = localStorage.getItem("token");

var baseUrl = 'http://localhost:8000/api/admin/';

const config = {
    headers: { Authorization: `Bearer ${token}` }
};


const customerReport = {
    total: 7,
    recordsFiltered: 7,
    data: {
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
    }


};


const categoryReport = {
    total: 13,
    recordsFiltered: 13,
    data: {
        rows: [
            {
                "category_id": 1,
                "category_name": "vigat rings",
                "status": "0",
            },
            {
                "category_id": 2,
                "category_name": "vigat ringsssss",
                "status": "1",
            }
        ]
    }

}


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
    if (apiName == 'category_details') {
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


export async function postData(apiName, params) {
    console.log(apiName);
    if (apiName == "login/admin") {
        var baseUrl = 'http://localhost:8000/api/';
    }
    else {
        var baseUrl = 'http://localhost:8000/api/admin/';
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