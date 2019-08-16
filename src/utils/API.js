import axios from "axios";

const deleteUserInfo = () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("authenticationToken");
};

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
      deleteUserInfo();
      window.location = "/";
    }
    return Promise.reject(error);
  }
);

/*
Project
*/
export const getProjects = () => {
  return instance.get("/projects");
};

export const getInstruments = () => {
  return instance.get("/instruments");
};

/*
Instrument
*/

export const getInstrument = (projectId, id) => {
  return instance.get(`/projects/${projectId}/instruments/${id}`);
};

export const createInstrument = (projectId, instrument) => {
  return instance.post(`/projects/${projectId}/instruments`, instrument);
};

export const updateInstrument = (projectId, id, instrument) => {
  return instance.put(`/projects/${projectId}/instruments/${id}`, instrument);
};

export const deleteInstrument = (projectId, id) => {
  return instance.delete(`/projects/${projectId}/instruments/${id}`);
};

/*
Section
*/
export const getSections = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/sections`
  );
};

export const getSection = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`
  );
};

export const createSection = (projectId, instrumentId, section) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/sections`,
    section
  );
};

export const updateSection = (projectId, instrumentId, id, section) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`,
    section
  );
};

export const deleteSection = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`
  );
};

/*
Display
*/
export const getDisplay = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`
  );
};

export const createDisplay = (projectId, instrumentId, display) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/displays`,
    display
  );
};

export const updateDisplay = (projectId, instrumentId, id, display) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`,
    display
  );
};

export const deleteDisplay = (projectId, instrumentId, id) => {
  return instance.delete(
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
      deleteUserInfo();
    });
};
