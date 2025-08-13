import axios from "axios";

const BACKEND_API_URL = "http://localhost:3000";

export const loginAxios = (url: string, payload: any) => {
  try {
    return axios.post(BACKEND_API_URL + url, payload);
  } catch (err) {
    console.log(err);
  }
};

export const postAxios = (url: string, payload: any) => {
  try {
    return axios.post(BACKEND_API_URL + url, payload);
  } catch (err) {
    console.log(err);
  }
};
