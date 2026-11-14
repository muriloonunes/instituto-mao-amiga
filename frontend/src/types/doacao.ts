export type Doacao = {
    id: number;
    tipoItem: string;
    quantidade: number;
    pontoId: number;
    criadoEm: string;
}

export type DoacaoCadastro = Omit<Doacao, 'id' | 'criadoEm'>;