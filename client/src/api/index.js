import axios from "axios";
import request from "../utils/request";
//user
export const authLogin = (payload) =>
  axios.post(`${process.env.REACT_APP_API}/api/auth/login`, payload);
export const authUser = () =>
  axios.get(`${process.env.REACT_APP_API}/api/auth`);


export const registerUser = (payload) => {
  return request(`${process.env.REACT_APP_API}/api/auth/register`, {
    method: "POST",
    data: payload,
  });
};

//device
export const getDevices = (payload) => {
  return request(`${process.env.REACT_APP_API}/api/device/getDevice`, {
    method: "POST",
    data: payload,
  });
};
export const createDevice = (payload) => {
  return request(`${process.env.REACT_APP_API}/api/device/add`, {
    method: "POST",
    data: payload,
  });
};
export const updateDevice = (payload) => {
  return request(`${process.env.REACT_APP_API}/api/device/update`, {
    method: "PUT",
    data: payload,
  });
};
export const delDevice = (deviceID) => {
  return request(`${process.env.REACT_APP_API}/api/device/delete/${deviceID}`, {
    method: "DELETE",
  });
};
export const getDetailDevice = (deviceID) => {
  return request(
    `${process.env.REACT_APP_API}/api/device/getDetail/${deviceID}`,
    {
      method: "GET",
    }
  );
};

//rfid
export const scanRfid = () => {
  return request(
    `${process.env.REACT_APP_API}/api/rfid/scan`,
    {
      method: "GET",
    }
  );
};
export const addRfid = () => {
  return request(
    `${process.env.REACT_APP_API}/api/rfid/add`,
    {
      method: "GET",
    }
  );
};