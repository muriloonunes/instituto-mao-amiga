import {Page} from "../types/api";
import {Doacao, DoacaoCadastro} from "../types/doacao";
import {del, get, post, put} from "./api";

export async function listarDoacoes(filtro?: string, page = 0, size = 10, sort?: string): Promise<Page<Doacao>> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    })

    if (filtro) {
        params.append('filtro', filtro);
    }

    if (sort) {
        params.append('sort', sort);
    }

    return get<Page<Doacao>>(`/doacoes/filtro?${params.toString()}`);
}

export async function buscarDoacaoPorId(id: number): Promise<Doacao> {
    return get<Doacao>(`/doacoes/${id}`);
}

export async function criarDoacao(doacao: DoacaoCadastro): Promise<Doacao> {
    return post<Doacao>('/doacoes', doacao);
}

export async function atualizarDoacao(id: number, doacao: DoacaoCadastro): Promise<Doacao> {
    return put<Doacao>(`/doacoes/${id}`, doacao);
}

export async function deletarDoacao(id: number): Promise<void> {
    return del<void>(`/doacoes/${id}`);
}