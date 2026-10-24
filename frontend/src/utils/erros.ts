import { ApiError } from "../types/api";

export interface OpcoesMensagemErro {
    /** Mensagem exibida para erro 404 (ex: "Ponto não encontrado", "Doação não encontrada") */
    naoEncontrado?: string;
    /** Mensagem para erro 400 de validação (caso o backend não envie uma mensagem amigável) */
    requisicaoInvalida?: string;
    /** Mensagem para erro desconhecido/genérico (ex: "Ocorreu um erro ao carregar os pontos") */
    fallback?: string;
}

export function getMensagemErro(err: unknown, opcoes?: OpcoesMensagemErro): string {
    if (err instanceof ApiError) {
        // 1. Rede / Conectividade (Universal)
        if (err.status === 0) {
            return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        }

        // 2. Timeout / Cancelamento (Universal)
        if (err.status === 408 || err.status === 499) {
            return 'O servidor demorou para responder.';
        }

        // 3. 404 Recurso Não Encontrado (Contextual)
        if (err.status === 404) {
            return opcoes?.naoEncontrado ?? 'Item não encontrado.';
        }

        // 4. 400 Validação / Erro de Requisição (Contextual ou do Backend)
        if (err.status === 400) {
            // Se o backend mandou uma mensagem legível e não um JSON cru, usa ela
            if (err.message && !err.message.startsWith('{')) {
                return err.message;
            }
            return opcoes?.requisicaoInvalida ?? 'Dados inválidos enviados ao servidor.';
        }

        // 5. Erro interno do servidor 500, 502, 503 (Universal)
        if (err.status >= 500) {
            return 'Erro interno no servidor. Tente novamente mais tarde.';
        }

        // Se for outro status com mensagem tratada
        if (err.message && !err.message.startsWith('{')) {
            return err.message;
        }
    }

    // 6. Fallback final para erros não-ApiError (Contextual)
    return opcoes?.fallback ?? 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
}
