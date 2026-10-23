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

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    let response: Response;

    try {
        response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(options?.headers || {}),
            }
        });
    } catch (error) {
        throw new ApiError(0, `Erro ao fazer a requisição para ${url}: ${error}`);
    }

    if (!response.ok) {
        const errorText = await response.text();
        const message = errorText || `Erro ${response.status}`;
        throw new ApiError(response.status, message);
    }

    return response.json() as Promise<T>;
}