import axios from "axios";
import vmd from "../virtualmodel/VMD";

/**
 * Custom axios instance for better handling JWT access tokens
 */
const axiosCustom = axios.create();

// Handles fetching a new access token once the previous one is expired
axiosCustom.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

	// If the JWT access token expired, refreshes it
    if (
      error?.response?.status === 401 
	&& error?.response?.data?.message === "JWT expired"
    ) {
      axiosCustom.defaults.headers.common["Authorization"] = undefined;
      console.log("JWT access token expired, fetching a new one");
      const refreshTokenFuncAccessor = vmd.getFunctionAccessor(
        "meta",
        "token_refresh"
      );
      const response = await refreshTokenFuncAccessor.executeFunction({
        withCredentials: true,
      });
      console.log(response);
      const token = response.data.token;
      axiosCustom.defaults.headers.common["Authorization"] = `bearer ${token}`;
      prevRequest.headers["Authorization"] = `bearer ${token}`;
      return axiosCustom(prevRequest);
    }
	// Otherwise, just throw back the error
    return Promise.reject(error);
  }
);

export default axiosCustom;
