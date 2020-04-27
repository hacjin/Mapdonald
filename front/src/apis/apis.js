import axios from "axios";

export default axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  // baseURL: "http://13.124.143.208:8000/api",
  headers: {
    // "Access-Control-Allow-Origin": "*"
  }
});
