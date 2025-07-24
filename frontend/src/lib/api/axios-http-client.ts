"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import { HttpClient } from './http-client';

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    console.log('Initializing AxiosHttpClient with baseURL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const accessToken = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

        if (accessToken) {
            config.headers.set('Authorization', `Bearer ${accessToken}`);
          }

      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if(response.status === 401){
          // write get me api call
        }
        console.log(`[Response]`, response);
        return response;
      },
      (error) => {
        console.error(`[Error]`, error);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, body: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, body);
    return response.data;
  }

  async put<T>(url: string, body: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, body);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url);
    return response.data;
  }
}
