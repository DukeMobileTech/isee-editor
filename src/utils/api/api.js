import axios from "axios";

export const instance = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: `${process.env.REACT_APP_BASE_URL}/api/v4/`,
  responseType: "json",
});

// Request interceptor that adds params expected by the backend api
instance.interceptors.request.use(
  function (config) {
    config["headers"]["Authorization"] =
      "Bearer " + sessionStorage.getItem("jwt");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor that renders the login page for a response with status code 401
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      window.location = "/";
    }
    return Promise.reject(error.response);
  }
);
