import axios from "axios";

const BACKEND_API_URL = "https://gvcbackend.onrender.com";

export const loginAxios = (url: string, payload: any) => {
  try {
    return axios.post(BACKEND_API_URL + url, payload);
  } catch (err) {
    console.log(err);
  }
};

export const postAxios = (url: string, payload?: any,headers?:any) => {
  try {
    return axios.post(BACKEND_API_URL + url, payload, {
      headers: headers||{
        "Content-Type": "application/json",

      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAxios = (url: string, payload?: any) => {
  try {
    return axios.get(BACKEND_API_URL + url, {
      headers: {
        "Content-Type": "application/json",
      },
      params: payload,
    });
  } catch (err) {
    console.log(err);
  }
};


export const putAxios = (url: string, payload?: any) => {
  try {
    return axios.put(BACKEND_API_URL + url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteAxios = (url: string, payload?: any) => {
  try {
    return axios.delete(BACKEND_API_URL + url, {
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
  } catch (err) {
    console.log(err);
  }
};
