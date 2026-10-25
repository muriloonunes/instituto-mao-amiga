import AsyncStorage from "@react-native-async-storage/async-storage";

export async function lerJSON<T>(chave: string, fallback: T): Promise<T> {
    try {
        const valor = await AsyncStorage.getItem(chave);

        if (valor === null) {
            return fallback;
        }
        return JSON.parse(valor) as T;
    } catch (error) {
        console.error(`[storage] Erro ao ler JSON da chave "${chave}":`, error);
        return fallback;
    }
}

export async function salvarJSON<T>(chave: string, valor: T): Promise<void> {
    try {
        const json = JSON.stringify(valor);
        await AsyncStorage.setItem(chave, json);
    } catch (error) {
        console.error(`[storage] Erro ao salvar JSON na chave "${chave}":`, error);
        throw error;
    }
}

export async function removerItem(chave: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(chave);
    } catch (error) {
        console.error(`[storage] Erro ao remover item da chave "${chave}":`, error);
        throw error;
    }
}