import {Ponto, PontoCadastro, PontoResumo} from "../types/ponto";
import {Page} from "../types/api";
import {del, get, post, put} from "./api";

export async function listarPontos(filtro?: string, page = 0, size = 10, sort?: string): Promise<Page<Ponto>> {
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

    return get<Page<Ponto>>(`/pontos/filtro?${params.toString()}`);
}

export async function buscarPontoPorId(id: number): Promise<Ponto> {
    return get<Ponto>(`/pontos/${id}`);
}

export async function listarPontosResumo(): Promise<PontoResumo[]> {
    return get<PontoResumo[]>('/pontos/resumo');
}

export async function criarPonto(ponto: PontoCadastro): Promise<Ponto> {
    return post<Ponto>('/pontos', ponto);
}

export async function atualizarPonto(id: number, ponto: PontoCadastro): Promise<Ponto> {
    return put<Ponto>(`/pontos/${id}`, ponto);
}

export async function deletarPonto(id: number): Promise<void> {
    return del<void>(`/pontos/${id}`);
}