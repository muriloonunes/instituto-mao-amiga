import {Doacao} from "../types/doacao";
import {lerJSON, salvarJSON} from "./storage";

const CHAVE_DOACOES = '@mao_amiga:doacoes';

//https://blog.logrocket.com/guide-react-natives-asyncstorage/
//https://dev.to/quxegdsa/asyncstorage-data-storage-4n9a
export const listarDoacoes = async (): Promise<Doacao[]> => {
    return lerJSON<Doacao[]>(CHAVE_DOACOES, []);
}

export const salvarDoacao = async (novaDoacao: Doacao): Promise<Doacao[]> => {
    if (!novaDoacao) return [];
    const doacoesAtuais = await listarDoacoes();
    const doacoesAtualizadas = [...doacoesAtuais, novaDoacao];
    await salvarJSON(CHAVE_DOACOES, doacoesAtualizadas);
    return doacoesAtualizadas;
}

export const atualizarDoacao = async (doacaoAtualizada: Doacao): Promise<Doacao[]> => {
    if (!doacaoAtualizada) return [];
    const doacoesAtuais = await listarDoacoes();
    const doacoesAtualizadas = doacoesAtuais.map(doacao =>
        doacao.id === doacaoAtualizada.id ? doacaoAtualizada : doacao
    );
    await salvarJSON(CHAVE_DOACOES, doacoesAtualizadas);
    return doacoesAtualizadas;
}

export const excluirDoacao = async (id: number): Promise<Doacao[]> => {
    const doacoesAtuais = await listarDoacoes();
    const doacoesAtualizadas = doacoesAtuais.filter(doacao => doacao.id !== id);
    if (doacoesAtuais.length === doacoesAtualizadas.length) {
        console.warn(`Doação com ID ${id} não encontrada para exclusão.`);
        return doacoesAtuais;
    }
    await salvarJSON(CHAVE_DOACOES, doacoesAtualizadas);
    return doacoesAtualizadas;
}