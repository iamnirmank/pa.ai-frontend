import axios,{AxiosInstance} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "https://paai.azurewebsites.net/api/",
});

export default axiosInstance;