import {Doacao} from "../types/doacao";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_DOACOES = '@mao_amiga:doacoes';

//https://blog.logrocket.com/guide-react-natives-asyncstorage/
//https://dev.to/quxegdsa/asyncstorage-data-storage-4n9a
export const listarDoacoes = async (): Promise<Doacao[]> => {
    try {
        const doacoesSalvas = await AsyncStorage.getItem(CHAVE_DOACOES);
        return doacoesSalvas ? JSON.parse(doacoesSalvas) : [];
    } catch (error) {
        console.error('Erro ao buscar doações:', error);
        return [];
    }
}

export const salvarDoacao = async (novaDoacao: Doacao): Promise<Doacao[]> => {
    if (!novaDoacao) return [];

    try {
        const doacoesAtuais = await listarDoacoes();
        const doacoesAtualizadas = [...doacoesAtuais, novaDoacao];
        await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(doacoesAtualizadas));
        return doacoesAtualizadas;
    } catch (error) {
        console.error('Erro ao salvar doação:', error);
        return [];
    }
}