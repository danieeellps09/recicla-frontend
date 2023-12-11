import axios from "axios";


const API = axios.create({ baseURL: "http://3.129.19.7:3000/api/v1" });

export { API };
