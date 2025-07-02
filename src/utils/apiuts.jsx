const BASE_URL = "http://127.0.0.1:5000";

import { jwtStorage } from "./jwt_storage"; // Pastikan kamu punya modul ini

export const loadImage = (image_path) => {
  return BASE_URL + "/public" + image_path;
};

export const getDataUTS = async (url) => {
  return fetch(BASE_URL + url)
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const sendDataUTS = async (url, data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return fetch(BASE_URL + url, options)
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const deleteDataUTS = async (url, data) => {
  return fetch(BASE_URL + url, {
    method: "DELETE",
    body: data,
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

// Tambahan: fetch data dengan JWT token
export const getDataPrivate = async (url) => {
  const token = await jwtStorage.retrieveToken();

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(BASE_URL + url, options)
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};
