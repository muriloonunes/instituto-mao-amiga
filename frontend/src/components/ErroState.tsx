import {OpcoesMensagemErro} from "../utils/erros";
import {ApiError} from "../types/api";
import {EmptyState} from "./EmptyState";
import NoConnection from '../../assets/svg/no-connection.svg'
import ServerDown from '../../assets/svg/server-down.svg'
import Void from '../../assets/svg/void.svg'
import NotFound from '../../assets/svg/not-found.svg'

interface ErroStateProps extends OpcoesMensagemErro {
    erro: ApiError;
    subtitulo404?: string;
}

export function ErroState({
                              erro,
                              naoEncontrado = 'Item não encontrado.',
                              fallback, subtitulo404
                          }: ErroStateProps
) {
    if (erro.status === 0) {
        return (
            <EmptyState
                icon={<NoConnection width={250} height={200}/>}
                mensagem="Não foi possível conectar ao servidor."
                subtitulo="Verifique sua conexão e puxe para baixo para tentar novamente."
            />
        );
    }

    if (erro.status === 408 || erro.status === 499) {
        return (
            <EmptyState
                icon={<ServerDown width={250} height={200}/>}
                mensagem="O servidor demorou para responder."
                subtitulo="Aguarde um momento e puxe para baixo para tentar novamente."
            />
        );
    }

    if (erro.status === 404) {
        return (
            <EmptyState
                icon={<NotFound width={250} height={200}/>}
                mensagem={naoEncontrado}
                subtitulo={subtitulo404}
            />
        );
    }

    return (
        <EmptyState
            icon={<Void width={250} height={200}/>}
            mensagem={fallback ?? 'Algo deu errado do nosso lado.'}
            subtitulo="Estamos trabalhando para resolver. Tente novamente em instantes."
        />
    );

}