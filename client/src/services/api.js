import axios from 'axios';

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/login') &&
            !originalRequest.url?.includes('/register') &&
            !originalRequest.url?.includes('/refresh')
        ) {
            originalRequest._retry = true;

            try {
                // Call the refresh endpoint to obtain a new accessToken cookie
                await api.post('/refresh');

                // Retry original request with the new cookie
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
