/**
 * GET 요청을 보내는 함수
 * @param url 요청할 API 경로 (예: /todos/1)
 * @param config Axios 설정 객체 (선택)
 * @returns 응답 데이터
 */

import { api } from './client';
import type { AxiosRequestConfig } from 'axios';

export const getRequest = async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  const response = await api.get<T>(url, config);
  return response.data;
};

export const postRequest = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

export const patchRequest = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => {
  const response = await api.patch<T>(url, data, config);
  return response.data;
};

export const deleteRequest = async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  const response = await api.delete<T>(url, config);
  return response.data;
};
