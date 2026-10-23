import {Ponto} from "../types/ponto";
import {Page} from "../types/api";
import {apiFetch} from "./api";

export async function listarPontos(page = 0, size = 20, sort = 'id,asc'): Promise<Page<Ponto>> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sort,
    })

    return apiFetch<Page<Ponto>>(`/pontos?${params.toString()}`);
}

export async function buscarPontoPorId(id: number): Promise<Ponto> {
    return apiFetch<Ponto>(`/pontos/${id}`);
}