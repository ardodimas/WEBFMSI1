import { jwtStorage } from "./jwt_storage";

const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const getDataPublic = (url) => {
  return fetch(url)
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};
export const getData = async (url) => {
  return fetch(REACT_APP_API_URL + url)
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};

export const getDataPrivate = async (url) => {
  let token = await jwtStorage.retrieveToken();
  console.log("Token dipakai:", token);
  return fetch(REACT_APP_API_URL + url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

export const sendData = async (url, data) => {
  console.log("URL: ", REACT_APP_API_URL + url);
  console.log("Payload: ", data);
  return fetch(REACT_APP_API_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
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

export const sendDataPrivate = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above

  let token = await jwtStorage.retrieveToken();
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Add body only if data exists
  if (data) {
    options.body = data;
  }
  console.log(options);

  return fetch(REACT_APP_API_URL + url, options)
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

export const deleteData = async (url, data) => {
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
    body: data,
  })
    .then((response) => response)
    .catch((err) => console.log(err));
};

export const editDataPrivatePut = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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

export const editDataPrivateURLEncoded = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  // var token = localStorage.getItem("token_auth");
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
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

export const deleteDataPrivateURLEncoded = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  // var token = localStorage.getItem("token_auth");
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
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

export const deleteDataPrivateJSON = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  // var token = localStorage.getItem("token_auth");
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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

export const logoutAPI = async () => {
  try {
    let token = await jwtStorage.retrieveToken();
    
    // Jika tidak ada token, langsung return success
    if (!token) {
      return { isLoggedOut: true };
    }
    
    let formData = new FormData();
    formData.append("logout", "Logout");
    
    const response = await fetch(REACT_APP_API_URL + "/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    console.log("Logout API response status:", response.status);
    
    // Bersihkan token lokal terlepas dari response server
    jwtStorage.removeItem();
    
    if (response.status === 200 || response.status === 204) {
      return { isLoggedOut: true };
    } else {
      console.warn("Logout API returned non-success status:", response.status);
      // Tetap return success karena token sudah dibersihkan
      return { isLoggedOut: true };
    }
  } catch (error) {
    console.error("Logout API error:", error);
    // Bersihkan token lokal meskipun ada error
    jwtStorage.removeItem();
    return { isLoggedOut: true };
  }
};

export const getImage = (url_image) => {
  const imgDefault = "/storage/images/userpng_1717846018.png";
  let imgResult = url_image ? url_image : imgDefault;
  return REACT_APP_API_URL + imgResult;
};

// Fungsi untuk mengirim data FormData (biasanya untuk upload file)
export const sendDataWithFile = async (endpoint, formData, token = null) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Gagal mengirim data dengan file");
    }

    return await response.json();
  } catch (error) {
    console.error("sendDataWithFile error:", error);
    throw error;
  }
};

export const returnOrderPrivate = async (orderId, data = {}) => {
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + `/api/orders/${orderId}/return`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
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