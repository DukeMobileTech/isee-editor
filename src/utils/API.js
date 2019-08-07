import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v4/",
  responseType: "json"
});
// Request interceptor that adds params expected by the backend api
instance.interceptors.request.use(
  function(config) {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authenticationToken");
    config.url = `${config.url}?user_email=${email}&authentication_token=${token}`;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
// Response interceptor that renders the login page for a response with status code 401
instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      window.location = "/login";
    }
    return Promise.reject(error);
  }
);

export const getInstruments = () => {
  return instance.get("/instruments");
};

export const getInstrument = (projectId, id) => {
  return instance.get(`/projects/${projectId}/instruments/${id}`);
};

export const getDisplay = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`
  );
};

// Instance without interceptors
const authInstance = axios.create({
  baseURL: "http://localhost:3000/api/v4/",
  responseType: "json"
});

export const login = user => {
  localStorage.setItem("userEmail", user.email);
  return authInstance
    .post("/login", {
      user
    })
    .then(res => {
      localStorage.setItem(
        "authenticationToken",
        res.data.authentication_token
      );
      window.location = "/";
    });
};

export const logout = () => {
  const token = localStorage.getItem("authenticationToken");
  return authInstance
    .delete(`/logout?authentication_token=${token}`)
    .then(() => {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("authenticationToken");
    });
};
