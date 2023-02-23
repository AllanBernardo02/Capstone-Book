import axios from "axios";
// const API = axios.create({ baseURL: "http://localhost:5000" });
// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("profile")) {
//     req.headers.Authorization = `Bearer ${
//       JSON.parse(localStorage.getItem("profile")).token
//     }`;
//   }

//   return req;
// });

export const createChat = (data) => axios.post("/api/chat/", data);

export const userChats = (id) => axios.get(`/api/chat/${id}`);

export const findChat = (firstId, secondId) =>
  axios.get(`/chat/find/${firstId}/${secondId}`);

export const getUser = (userId) =>
  axios.get(`/api/chat/get/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
