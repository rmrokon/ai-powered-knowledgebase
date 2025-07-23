/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpClient {
    get<T>(url: string, params?: any): Promise<T>;
    post<T>(url: string, data?: any): Promise<T>;
    put<T>(url: string, data?: any): Promise<T>;
    delete<T>(url: string): Promise<T>;
  }
  