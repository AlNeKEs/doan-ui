import axios from "axios";
import {getCookie} from "./index"
const request = axios.create({
    timeout: 60000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});

const handleError = (error) => {
    const { response = {} } = error;
    const { data, status, statusText } = response;
    return { data, status, statusText };
};

request.interceptors.request.use((config) => {
    const token = getCookie("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

request.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

request.interceptors.response.use((response) => {
    return response;
}, handleError);

export default request;
