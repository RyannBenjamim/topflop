import { isAxiosError } from "axios";
import { api } from "../api/api";
import { getHeaders } from "./getHeaders";
import { RequestError } from "./requestError";
import { translateApiMessage } from "./translateApiMessage";

type ApiErrorBody = {
  message?: string | string[];
  errorType?: string;
  errorCode?: string;
}

const handleUnauthorized = () => {
  if (!localStorage.getItem('user_access_data')) return;

  localStorage.removeItem('user_access_data');
  if (window.location.pathname !== '/login') window.location.assign('/login');
}

export const genericRequest = async <T>(url: string, method: string, data?: unknown): Promise<T> => {
  try {
    const response = await api.request<T>({
      url,
      method,
      data,
      headers: getHeaders()
    });
    return response.data;
  } catch (error: unknown) {
    if (!isAxiosError<ApiErrorBody>(error) || !error.response) {
      throw new RequestError('Não foi possível conectar ao servidor do TopFlop.', 0);
    }

    const { status, data: body } = error.response;

    if (status === 401 && body?.errorType !== 'EmailNotVerified' && !url.startsWith('/auth')) {
      handleUnauthorized();
    }

    throw new RequestError(
      translateApiMessage(body?.message),
      status,
      body?.errorCode,
      body?.errorType
    );
  }
}
