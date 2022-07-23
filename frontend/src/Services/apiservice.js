import axios from "axios";

let token = localStorage.getItem("token");

//local
// var baseUrl = 'http://localhost:8000/api/admin/';

//live
var baseUrl = 'https://api.omsmdu.com/api/admin/';

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

var date = new Date();
var onedayBefore = new Date().setDate(new Date().getDate() - 1);
var twodayBefore = new Date().setDate(new Date().getDate() - 2);
var threedayBefore = new Date().setDate(new Date().getDate() - 3);
var fourdayBefore = new Date().setDate(new Date().getDate() - 4);
var onedayahed = new Date().setDate(new Date().getDate() + 1);

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

const orderReport = {

    total: 12,
    recordsFiltered: 12,
    data: {
        rows: [
            {
                "order_id": 1,
                "jc_number": 2678,
                "product_type": "Customized product",
                "category": "dollar",
                "name": 'dollar',
                "customer_name": 'gokul',
                "purity": 92,
                "product_weight": 6,
                "quantity": 1,
                "design_by": "sample designed by",
                "order_details": "sdfsf",
                "order_image": "---",
                "delivery_date": "29/07/2020",
                "user_status": '0',
                "status": '0',
                "metal_status": '1',
                "metal_status_date": date,
                "orderdue_date": date
            },

            {
                "order_id": 2,
                "jc_number": 2678,
                "product_type": "Customized product",
                "category": "dollar",
                "name": 'dollar',
                "customer_name": 'gokulsssss',
                "purity": 92,
                "product_weight": 6,
                "quantity": 1,
                "design_by": "sample designed by",
                "order_details": "sdfsf",
                "order_image": "---",
                "delivery_date": "29/07/2020",
                "user_status": '0',
                "status": '0',
                "metal_status": '1',
                "metal_status_date": date,
                "orderdue_date": twodayBefore
            },

            {
                "order_id": 3,
                "jc_number": 2678,
                "product_type": "Customized product",
                "category": "dollar",
                "name": 'dollar',
                "customer_name": 'gokulsssss',
                "purity": 92,
                "product_weight": 6,
                "quantity": 1,
                "design_by": "sample designed by",
                "order_details": "sdfsf",
                "order_image": "---",
                "delivery_date": "29/07/2020",
                "user_status": '0',
                "status": '0',
                "metal_status": '1',
                "metal_status_date": date,
                "orderdue_date": twodayBefore
            },

            {
                "order_id": 4,
                "jc_number": 2678,
                "product_type": "Customized product",
                "category": "dollar",
                "name": 'dollar',
                "customer_name": 'gokulsssss',
                "purity": 92,
                "product_weight": 6,
                "quantity": 1,
                "design_by": "sample designed by",
                "order_details": "sdfsf",
                "order_image": "---",
                "delivery_date": "29/07/2020",
                "user_status": '0',
                "status": '0',
                "metal_status": '1',
                "metal_status_date": date,
                "orderdue_date": threedayBefore
            },

            {
                "order_id": 5,
                "jc_number": 2678,
                "product_type": "Customized product",
                "category": "dollar",
                "name": 'dollar',
                "customer_name": 'gokulsssss',
                "purity": 92,
                "product_weight": 6,
                "quantity": 1,
                "design_by": "sample designed by",
                "order_details": "sdfsf",
                "order_image": "---",
                "delivery_date": "29/07/2020",
                "user_status": '0',
                "status": '0',
                "metal_status": '1',
                "metal_status_date": date,
                "orderdue_date": onedayahed
            },

        ]
    }
}


const addproducts = {
    data: {
        "category": [
            {
                "category_id": 4,
                "category_name": "necklace",
                "status": "0",
                "created_at": null,
                "updated_at": "2021-03-03 16:22:47",
                "deleted_at": null
            },
            {
                "category_id": 10,
                "category_name": "dollar",
                "status": "0",
                "created_at": null,
                "updated_at": "2021-03-04 08:14:13",
                "deleted_at": null
            },
        ]
    }

}

const addorder = {
    data: {
        products: [
            {
                "product_id": 2,
                "category": "2",
                "name": "ladies ring",
                "product_image": "",
                "product_details": null,
                "product_type": "Customized product",
                "status": "0",
                "created_at": null,
                "updated_at": "2021-03-03 16:24:01",
                "deleted_at": null
            },
            {
                "product_id": 3,
                "category": "4",
                "name": "necklace",
                "product_image": "",
                "product_details": null,
                "product_type": "Customized product",
                "status": "0",
                "created_at": null,
                "updated_at": "2021-03-03 16:24:32",
                "deleted_at": null
            },
        ],
        customers: [
            {
                "customer_id": 1,
                "profile_picture": null,
                "name": "Gokull",
                "address": "smk",
                "city": "madurai",
                "state": "TN",
                "gst_no": "6757575757675",
                "pan_no": "675765675677567",
                "other_upload": null,
                "status": "0",
                "created_date": null,
                "modified_date": "2022-06-18 13:24:31",
                "deleted_at": null
            },
        ],

        order_img: null,
    }



}



export async function getData(apiName) {

    // if (apiName == 'add_product') {
    //     return addproducts;
    // }
    // if (apiName == 'add_order') {
    //     return addorder;
    // }
    // if (apiName == 'category_details') {
    //     return categoryReport;
    // }
    // else if (apiName == 'product_details') {
    //     return productReport;
    // }
    // else if (apiName == 'customer_details') {
    //     return customerReport;
    // }

    let apiUrl = baseUrl + apiName;
    let responseData = await axios.get(apiUrl).then((response) => {
        return response;
    }, (error) => {
        return error;
    });
    return responseData;

}


export async function getorderData(apiName, data) {
    let params = {};

    if (apiName == 'order_details') {
        params.user_id = localStorage.getItem("user_id");
        params.user_role = localStorage.getItem("user_role");
        if (data) {
            console.log("data", data);
            params.from_date = data.from_date;
            params.to_date = data.to_date;
        }
        // return orderReport;
    }

    console.log("params", params);
    let apiUrl = baseUrl + apiName;
    let responseData = await axios.get(apiUrl, { params }).then((response) => {
        return response;
    }, (error) => {
        return error;
    });
    return responseData;

}



export async function postData(apiName, params) {
    if (apiName == "login/admin") {
        // var baseUrl = 'http://localhost:8000/api/';
        var baseUrl = 'https://api.omsmdu.com/api/';
    }
    else {
        // var baseUrl = 'http://localhost:8000/api/admin/';
        var baseUrl = 'https://api.omsmdu.com/api/admin/';
    }
    let apiUrl = baseUrl + apiName;
    let responseData = await axios.post(apiUrl, params, config).then((response) => {
        return response;
    }, (error) => {
        return error;
    });
    return responseData;
}