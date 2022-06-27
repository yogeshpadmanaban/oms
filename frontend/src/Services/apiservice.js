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


const productReport = {
    total: 12,
    recordsFiltered: 12,
    data: {
        rows: [
            {
                "product_id": 1,
                "category": "1",
                "name": "ladies ring",
                "product_image": "-",
                "product_details": "-",
                "product_type": "Customized product",
                "status": "0",
                "category_name": "rings",
            },
            {
                "product_id": 2,
                "category": "2",
                "name": "ladies ring",
                "product_image": "-",
                "product_details": "-",
                "product_type": "Customized product",
                "status": "1",
                "category_name": "ringssss",
            }
        ]
    }

}



export async function getData(apiName) {
    console.log("apiName", apiName);
    // if (apiName == 'category_details') {
    //     return categoryReport;
    // }
    // else if (apiName == 'product_datails') {
    //     return productReport;
    // }
    // else if (apiName == 'customer_details') {
    //     return customerReport;
    // }
    // else {
        let apiUrl = baseUrl + apiName;
        let responseData = await axios.get(apiUrl).then((response) => {
            return response;
        },
            (error) => {
                return error;
            });
        return responseData;
    // }
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