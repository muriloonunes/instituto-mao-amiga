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

export const atualizarDoacao = async (doacaoAtualizada: Doacao): Promise<Doacao[]> => {
    if (!doacaoAtualizada) return [];

    try {
        const doacoesAtuais = await listarDoacoes();
        const doacoesAtualizadas = doacoesAtuais.map(doacao => {
            if (doacao.id === doacaoAtualizada.id) {
                return doacaoAtualizada;
            }
            return doacao;
        });

        await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(doacoesAtualizadas));
        return doacoesAtualizadas;
    } catch (error) {
        console.error('Erro ao atualizar doação:', error);
        return [];
    }
}

export const excluirDoacao = async (id: number): Promise<Doacao[]> => {
    try {
        const doacoesAtuais = await listarDoacoes();
        const doacoesAtualizadas = doacoesAtuais.filter(doacao => doacao.id !== id);

        if (doacoesAtuais.length === doacoesAtualizadas.length) {
            console.warn(`Doação com ID ${id} não encontrada para exclusão.`);
            return doacoesAtuais;
        }

        await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(doacoesAtualizadas));
        return doacoesAtualizadas;
    } catch (error) {
        console.error('Erro ao deletar doação:', error);
        throw error;
    }
}