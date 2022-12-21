import axios from "axios";
import authHeader from "./Authorization/auth.header";
import AuthService from "./Authorization/auth.service";

const API_URL = process.env.REACT_APP_API_URL;

class axiosTMS {
    static request(method: string, url: string, data: any) {
        let axios_config = {
            // `baseURL` is the server URL that will be used for the request
            baseURL: API_URL,
            // `method` is the request method to be used when making the request
            method: method,
            // `url` will be prepended to `baseURL` unless `baseURL` is absolute.
            url: url,
            headers: undefined,
            data: undefined
        }

        if (data) {
            // `data` allows changes to the request data before it is sent to the server
            // This is only applicable for request methods 'PUT', 'POST', and 'PATCH'
            axios_config.data = data
        }

        axios.interceptors.request
            .use(function (config) {
                if (config.url?.includes("api/v1/")) {
                    config.headers = authHeader()
                }
                return config;
            });

        axios.interceptors.response
            .use(function (response) {
                return response;
            }, async function (error) {
                if (error.response.status == 401) {
                    if (error.config.url == "api/token/refresh/") {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.location.assign("/login");
                        return Promise.reject(error);
                    }

                    await AuthService.refreshToken()
                    return axios(error.config);
                }
                return Promise.reject(error);
            });

        return axios(axios_config)
    }

    static get(url: string) {
        return this.request('get', url, null)
    }

    static post(url: string, data: any) {
        data = data || {}
        return this.request('post', url, data)
    }

    static patch(url: string, data: any) {
        data = data || {}
        return this.request('patch', url, data)
    }

    static put(url: string, data: any) {
        data = data || {}
        return this.request('put', url, data)
    }

    static delete(url: string) {
        return this.request('delete', url, null)
    }
}




export default axiosTMS