import Constants from "expo-constants";
import {Platform} from "react-native";

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

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Erro ao fazer a requisição para ${url}: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}