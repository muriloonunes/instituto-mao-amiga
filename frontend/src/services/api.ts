import Constants from "expo-constants";
import {Platform} from "react-native";
import {ApiError} from "../types/api";

const getBaseUrl = (): string => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:8080`;
    }

    if (Platform.OS === 'web') {
        return 'http://localhost:8080';
    }

    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }

    return 'http://localhost:8080';
};

export const BASE_URL = getBaseUrl();

export interface FetchOptions extends RequestInit {
    timeoutMs?: number;
}

export async function apiFetch<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const timeoutMs = options?.timeoutMs ?? 10000;
    const timeoutSignal = AbortSignal.timeout(timeoutMs);

    const signal = options?.signal
        ? AbortSignal.any([options.signal, timeoutSignal])
        : timeoutSignal;

    let response: Response;

    try {
        response = await fetch(url, {
            ...options,
            signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(options?.headers || {}),
            }
        });
    } catch (error: any) {
        if (error.name === 'TimeoutError' || timeoutSignal.aborted) {
            throw new ApiError(408, `Tempo limite de requisição excedido (${timeoutMs}ms) para ${url}`);
        }
        if (error.name === 'AbortError') {
            throw new ApiError(499, `Requisição cancelada para ${url}`);
        }

        throw new ApiError(0, `Erro ao fazer a requisição para ${url}: ${error.message || error}`);
    }

    if (!response.ok) {
        const errorText = await response.text();
        const message = errorText || `Erro ${response.status}`;
        throw new ApiError(response.status, message);
    }

    return response.json() as Promise<T>;
}