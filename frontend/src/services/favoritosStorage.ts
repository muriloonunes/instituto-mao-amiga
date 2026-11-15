import {lerJSON, removerItem, salvarJSON} from "./storage";

const CHAVE_FAVORITOS = '@mao_amiga:favoritos'

export const listarFavoritos = async (): Promise<number[]> => {
    return lerJSON<number[]>(CHAVE_FAVORITOS, []);
}

export const alternarFavorito = async (pontoId: number): Promise<number[]> => {
    const atuais = await listarFavoritos();
    const adicionado = atuais.some((id) => id === pontoId);

    const atualizados = adicionado
        ? atuais.filter((id) => id !== pontoId)
        : [...atuais, pontoId];

    await salvarJSON(CHAVE_FAVORITOS, atualizados);

    return atualizados;
}

export const limparFavoritos = async (): Promise<void> => {
    await removerItem(CHAVE_FAVORITOS);
};

export const isFavoritado = async (pontoId: number): Promise<boolean> => {
    const favoritos = await listarFavoritos();
    return favoritos.some((id) => id === pontoId);
}