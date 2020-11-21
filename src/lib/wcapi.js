import { AsyncStorage } from 'react-native';
import axios from 'axios';
import Config from '../constants/config';

/**
 * Axios defaults
 */
axios.defaults.baseURL = Config.WCapiBaseUrl;

// Headers
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async (inputConfig) => {
    const config = inputConfig;

    // Check for and add the stored Auth Token to the header request
    // let token = 'mifFKhdEIuHKBGUBMvaz4aVj8TGcsRQU';
    // try {
    //   token = await AsyncStorage.getItem('@Auth:token');
    // } catch (error) {
    //   /* Nothing */
    // }
      // config.headers.common.Authorization = `Bearer ${token}`;
    // config.auth = {
    //   username: "ck_8bdca0f0c1fb387b8b143cf6022d4b4146bd4a02",  //This could be your email
    //   password: "cs_352713eacaf8172fc6388ebaa3a8e05b072a8a34"
    // }
    return config;
  },
  (error) => {
    throw error;
  },
);

/**
 * Response Interceptor
 */
// axios.interceptors.response.use(
//   (res) => {
//     // Status code isn't a success code - throw error
//     if (!`${res.status}`.startsWith('2')) {
//       throw res.data;
//     }

//     // Otherwise just return the data
//     return res;
//   },
//   (error) => {
//     // Pass the response from the API, rather than a status code
//     if (error && error.response && error.response.data) {
//       throw error.response.data;
//     }
//     throw error;
//   },
// );

export default axios;
