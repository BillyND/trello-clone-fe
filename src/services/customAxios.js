import axios from "axios";

export const baseURL = "https://trello-clone-be-navy.vercel.app";
// export const baseURL = "sad";

const instance = axios.create({
  baseURL: baseURL + "/v1/api/",
});

// let cancelTokenSource;

// try {
//   instance.interceptors.request.use(
//     (config) => {
//       if (cancelTokenSource) {
//         // cancel request if cancelTokenSource not null
//         cancelTokenSource.cancel();
//       }

//       cancelTokenSource = axios.CancelToken.source();

//       config.cancelToken = cancelTokenSource.token;

//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
// } catch (error) {
//   throw new Error(error);
// }

export default instance;
