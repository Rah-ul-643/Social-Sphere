import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL

const userApi = axios.create(
    {
        baseURL: `${BASE_URL}/user`,
        withCredentials: true
    }
)

const chatApi = axios.create(
    {
        baseURL: `${BASE_URL}/chat`,
        withCredentials: true
    }
)

export {userApi, chatApi};