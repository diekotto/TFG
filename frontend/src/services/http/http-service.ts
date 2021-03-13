import axios, { AxiosRequestConfig } from "axios";

export class HttpService {
  private baseUrl = "https://gentle-mesa-79280.herokuapp.com";

  get<T>(url: string): Promise<T> {
    const config: AxiosRequestConfig = {
      method: "GET",
      url,
      baseURL: this.baseUrl
    };
    return axios.request(config);
  }

  post<T>(url: string, data: any): Promise<T> {
    const config: AxiosRequestConfig = {
      method: "POST",
      url,
      baseURL: this.baseUrl,
      data
    };
    return axios.request(config);
  }
}

export const httpService = new HttpService();
