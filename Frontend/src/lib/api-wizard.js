import { WIZARD_BASE_PATH } from "./app-base-path";
import axios from 'axios';

export const Run = (data) => {
    return axios.post(`${WIZARD_BASE_PATH}/run`,data);
};

export const Registor = (data) => {
    return axios.post(`${WIZARD_BASE_PATH}/registor`,data);
};

export const login = (data) => {
    return axios.post(`${WIZARD_BASE_PATH}/login`,data);
};

export const getUserName = () => {
    return axios.get(`${WIZARD_BASE_PATH}/getusername`);
};
export const saveCode = (data) =>{
    console.log(data);
    return axios.post(`${WIZARD_BASE_PATH}/savecode`,data);
}

export const getFiles = (data) =>{
    return axios.post(`${WIZARD_BASE_PATH}/getfiles`,data);
}
export const getFileData = (data) =>{
    return axios.post(`${WIZARD_BASE_PATH}/getfiledata`,data);
}
export const UpdateCode = (data) =>{
    console.log("Data : ",data);
    return axios.post(`${WIZARD_BASE_PATH}/updatecode`,data);
}

export const updateFileName = (data) =>{
    console.log("Data : ",data);
    return axios.post(`${WIZARD_BASE_PATH}/updatefilename`,data);
}

export const deleteFile = (data) =>{
    console.log("Data : ",data);
    return axios.post(`${WIZARD_BASE_PATH}/deletefile`,data);
}
export const AiCode = (data) =>{
    console.log("Data : ",data);
    return axios.post(`${WIZARD_BASE_PATH}/ai`,data);
}