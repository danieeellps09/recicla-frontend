import axios from "axios";

//TODO: DARIA PRA COLOCAR AINDA EM UMA VARIAVEL DE AMBIENTE ESSA URL, ISSO EVITARIA
//A URL FICAR EXPOSTA NO CODIGO E NO GITHUB
const API = axios.create({ baseURL: "http://3.129.19.7:3000/api/v1" });

export { API };
