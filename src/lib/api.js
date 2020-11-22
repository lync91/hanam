import axios from 'axios';
import Config from '../constants/config';
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Axios defaults
 */
axios.defaults.baseURL = Config.apiBaseUrl;

// Headers
// axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.headers.common.Accept = 'application/json';

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
    // let username = 'mr.lync91@gmail.com';
    // let password = 'oX7C 5368 1p2C 8dBu 1D49 RqrG';
    // let auth = base64.encode(`${username}:${password}`)
    // config.headers.common['Authorization'] = `Basic ${auth}`;
    let username = await AsyncStorage.getItem('@Auth:username');
    let password = await AsyncStorage.getItem('@Auth:password');
    if (username && password) {
      let auth = base64.encode(`${username}:${password}`);
      config.headers.common['Authorization'] = `Basic ${auth}`;
    }
    config.headers.common['Access-Control-Allow-Methods'] = 'POST, GET, PUT, OPTIONS, DELETE'  //'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
    return config;
  },  
  (error) => {
    throw error;
  },
);

/**
 * Response Interceptor
 */
axios.interceptors.response.use(
  (res) => {
    // Status code isn't a success code - throw error
    if (!`${res.status}`.startsWith('2')) {
      throw res.data;
    }

    // Otherwise just return the data
    return res;
  },
  (error) => {
    // Pass the response from the API, rather than a status code
    if (error && error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  },
);

export default axios;
