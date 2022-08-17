import axios from "axios";

let token = localStorage.getItem("token");

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export const baseUrl = 'http://localhost:8000/';

let environment = {};

if (window.location.origin === 'https://omsmdu.com') {
    environment.baseUrl = 'https://api.omsmdu.com/api/admin/';
    environment.loginUrl = 'https://api.omsmdu.com/api/';
} else {

    // environment.baseUrl = 'https://api.omsmdu.com/api/admin/';
    // environment.loginUrl = 'https://api.omsmdu.com/api/';

    environment.baseUrl = 'http://localhost:8000/api/admin/';
    environment.loginUrl = 'http://localhost:8000/api/';

}


export async function getData(apiName) {

    let apiUrl = environment.baseUrl + apiName;
    let responseData = await axios.get(apiUrl).then((response) => {
        return response;
    }, (error) => {
        return error;
    });
    return responseData;

}


export async function getorderData(apiName, data) {
    let params = {};

    if (apiName === 'order_details') {
        params.user_id = localStorage.getItem("user_id");
        params.user_role = localStorage.getItem("user_role");
        if (data) {
            params.from_date = data.from_date;
            params.to_date = data.to_date;
        }
    }

    let apiUrl = environment.baseUrl + apiName;
    let responseData = await axios.get(apiUrl, { params }).then((response) => {
        return response;
    }, (error) => {
        return error;
    });
    return responseData;

}



export async function postData(apiName, params) {
    let apiUrl;

    if (apiName === "login/admin") {
        apiUrl = environment.loginUrl + apiName;
    }
    else {
        apiUrl = environment.baseUrl + apiName;
    };
    let responseData = await axios.post(apiUrl, params, config).then((response) => {
        return response;
    }, (error) => {
        return error;
    });
    return responseData;
}