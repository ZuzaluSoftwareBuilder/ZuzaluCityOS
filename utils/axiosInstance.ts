import axios, { AxiosInstance } from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for server-side rendering
  return 'https://www.zuzalu.city/';
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ceramic:eth_did');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Router.push('/');
          break;
        case 403:
          // Router.push('/');
          break;
        // case 500:

        //     alert('Server error. Please try again later.');
        //     break;
        // default:

        //     alert('Something went wrong.');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
