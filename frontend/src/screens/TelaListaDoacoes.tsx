import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {theme} from "../theme/theme";
import {Doacao} from "../types/doacao";
import {CardDoacao} from "../components/CardDoacao";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {listarDoacoes} from "../services/doacoesService";
import {InputPesquisar} from "../components/InputPesquisar";
import {ResumoDoacoesCard} from "../components/ResumoDoacoesCard";
import {EmptyState} from "../components/EmptyState";
import {ErroState} from "../components/ErroState";
import Donate from "../../assets/svg/donate.svg";
import NoResult from "../../assets/svg/no-result.svg";
import {PontoResumo} from "../types/ponto";
import {listarPontosResumo} from "../services/pontosService";
import {ApiError} from "../types/api";
import Toast from "react-native-toast-message";
import {getMensagemErro} from "../utils/erros";
import {ehUltimaPagina} from "../services/api";

const TAMANHO_PAGINA = 10;

type TelaListaDoacoesProps = {
    onNovaDoacao?: () => void;
    atualizacaoKey?: number;
};

export type ResumoDoacoes = {
    tipoItem: string;
    quantidadeTotal: number;
    quantidadeDoacoes: number;
};

export function TelaListaDoacoes({onNovaDoacao, atualizacaoKey}: TelaListaDoacoesProps) {
    const navigation = useNavigation<any>();
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<ApiError | null>(null);

    const [pagina, setPagina] = useState(0);
    const [ultima, setUltima] = useState(false);
    const [busca, setBusca] = useState('');

    const [pontos, setPontos] = useState<PontoResumo[]>([]);
    const [erroPontos, setErroPontos] = useState<ApiError | null>(null);

    const buscandoMaisRef = useRef(false);
    const requestSeqRef = useRef(0);
    const primeiraMontagemRef = useRef(true);
    const buscaRef = useRef('');
    const temDoacoesRef = useRef(false);

    useEffect(() => {
        buscaRef.current = busca;
        temDoacoesRef.current = doacoes.length > 0;
    }, [busca, doacoes]);

    const mapaPontos = useMemo(() => {
        return new Map(pontos.map(ponto => [ponto.id, ponto.nome]));
    }, [pontos]);

    const carregarPontosReferencia = useCallback(async () => {
        try {
            const respostaPontos = await listarPontosResumo();
            setPontos(respostaPontos);
            setErroPontos(null);
        } catch (error) {
            console.error('Falha ao sincronizar pontos na TelaDoacoes:', error);
            const apiError = error instanceof ApiError
                ? error
                : new ApiError(-1, 'Erro ao carregar pontos');
            setErroPontos(apiError);
        }
    }, []);

    const carregarDoacoes = useCallback(async (
        paginaAlvo: number,
        termoBusca: string,
        resetar: boolean = false
    ) => {
        const requestId = ++requestSeqRef.current;

        if (resetar && !temDoacoesRef.current) {
            setCarregando(true);
        }

        try {
            const response = await listarDoacoes(
                termoBusca.trim() || undefined,
                paginaAlvo,
                TAMANHO_PAGINA
            );

            if (requestId !== requestSeqRef.current) return;

            setDoacoes(prev => resetar ? response.content : [...prev, ...response.content]);
            setPagina(response.page.number);
            setUltima(ehUltimaPagina(response));
            setErro(null);

            carregarPontosReferencia();
        } catch (err) {
            if (requestId !== requestSeqRef.current) return;

            console.error(err);
            const apiError = err instanceof ApiError ? err : new ApiError(-1, 'Erro desconhecido');

            if (!resetar && paginaAlvo > 0) {
                Toast.show({
                    type: 'error',
                    text1: getMensagemErro(err, {fallback: 'Não foi possível carregar mais doações.'}),
                    bottomOffset: paddingInferior + 25
                });
            } else {
                setErro(apiError);
            }
        } finally {
            if (requestId === requestSeqRef.current) {
                setCarregando(false);
            }
        }
    }, [paddingInferior, carregarPontosReferencia]);

    useEffect(() => {
        if (atualizacaoKey !== undefined && atualizacaoKey > 0) {
            setErro(null);
            carregarDoacoes(0, buscaRef.current, true);
        }
    }, [atualizacaoKey, carregarDoacoes]);

    useEffect(() => {
        if (primeiraMontagemRef.current) {
            primeiraMontagemRef.current = false;
            return;
        }

        const timer = setTimeout(async () => {
            setErro(null);
            await carregarDoacoes(0, busca, true);
        }, 300);

        return () => clearTimeout(timer);
    }, [busca, carregarDoacoes]);

    useFocusEffect(
        useCallback(() => {
            if (!buscaRef.current.trim()) {
                setErro(null);
                carregarDoacoes(0, '', true);
            }
        }, [carregarDoacoes])
    );

    const onRefresh = useCallback(async () => {
        setAtualizando(true);
        try {
            await carregarDoacoes(0, busca, true);
        } finally {
            setAtualizando(false);
        }
    }, [busca, carregarDoacoes]);

    const carregarProximaPagina = useCallback(async () => {
        if (buscandoMaisRef.current || carregandoMais || carregando || atualizando || ultima || erro) {
            return;
        }

        buscandoMaisRef.current = true;
        setCarregandoMais(true);
        try {
            await carregarDoacoes(pagina + 1, busca, false);
        } finally {
            setCarregandoMais(false);
            buscandoMaisRef.current = false;
        }
    }, [carregandoMais, carregando, atualizando, ultima, erro, pagina, busca, carregarDoacoes]);

    const totalDoacoes = doacoes.length;

    const totalItens = useMemo(() => {
        return doacoes.reduce((acc, curr) => acc + (Number(curr?.quantidade) || 0), 0);
    }, [doacoes]);

    const resumoDoacoes = useMemo<ResumoDoacoes[]>(() => {
        const mapaResumo = new Map<string, { quantidadeTotal: number; quantidadeDoacoes: number }>();

        doacoes.forEach(doacao => {
            if (!doacao) return;
            const tipo = doacao.tipoItem?.trim() || 'Outro';
            const atual = mapaResumo.get(tipo) || {quantidadeTotal: 0, quantidadeDoacoes: 0};

            mapaResumo.set(tipo, {
                quantidadeTotal: atual.quantidadeTotal + (Number(doacao.quantidade) || 0),
                quantidadeDoacoes: atual.quantidadeDoacoes + 1
            });
        });

        return Array.from(mapaResumo.entries())
            .map(([tipoItem, dados]) => ({
                tipoItem,
                quantidadeTotal: dados.quantidadeTotal,
                quantidadeDoacoes: dados.quantidadeDoacoes
            }))
            .sort((a, b) => b.quantidadeTotal - a.quantidadeTotal || a.tipoItem.localeCompare(b.tipoItem));
    }, [doacoes]);

    const renderFooter = () => {
        if (!carregandoMais) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.colors.primaryVibrant}/>
            </View>
        );
    };

    const renderEmptyComponent = () => {
        if (erro) {
            return (
                <ErroState
                    erro={erro}
                    fallback="Não foi possível carregar as doações."
                />
            );
        }

        if (busca.trim()) {
            return (
                <EmptyState
                    icon={<NoResult width={250} height={250}/>}
                    mensagem={`Nenhuma doação encontrada para "${busca}"`}
                    subtitulo="Verifique a ortografia ou tente outro tipo de item."
                />
            );
        }

        if (!carregando) {
            return (
                <EmptyState
                    icon={<Donate width={300} height={180}/>}
                    mensagem="Nenhuma doação registrada ainda."
                    subtitulo="Que tal começar a fazer o bem? Registre a primeira doação!"
                    botaoTexto="Registrar doação"
                    onBotaoPress={onNovaDoacao}
                />
            );
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Doações</Text>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardContainer}
            >
                {busca.length === 0 && doacoes.length > 0 && (
                    <ResumoDoacoesCard
                        resumoDoacoes={resumoDoacoes}
                        totalDoacoes={totalDoacoes}
                        totalItens={totalItens}
                    />
                )}

                <InputPesquisar
                    placeholder="Buscar por tipo de item"
                    busca={busca}
                    setBusca={setBusca}
                />

                {carregando && doacoes.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
                    </View>
                ) : (
                    <FlatList
                        data={doacoes}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        ListEmptyComponent={renderEmptyComponent}
                        ListFooterComponent={renderFooter}
                        onEndReached={carregarProximaPagina}
                        onEndReachedThreshold={0.5}
                        renderItem={({item}) => {
                            const nomeOuStatus = mapaPontos.get(item.pontoId) ?? (
                                erroPontos
                                    ? 'Ponto indisponível (offline)'
                                    : 'Ponto de coleta'
                            );

                            return (
                                <CardDoacao
                                    doacao={item}
                                    nomePonto={nomeOuStatus}
                                    onPress={() => navigation.navigate('TelaDetalheDoacao', {doacao: item})}
                                />
                            );
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={atualizando}
                                onRefresh={onRefresh}
                                colors={[theme.colors.primaryVibrant]}
                                progressBackgroundColor={theme.colors.surfaceModal}
                                tintColor={theme.colors.primaryVibrant}
                            />
                        }
                        contentContainerStyle={[
                            styles.listContent,
                            doacoes.length === 0 && styles.emptyListContent,
                            {paddingBottom: paddingInferior},
                        ]}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    titleText: {
        color: theme.colors.text,
        fontSize: theme.fontSize['4xl'],
        fontWeight: 'bold',
        marginLeft: theme.spacing['2xl'],
        marginTop: theme.spacing['2xl'],
    },
    keyboardContainer: {
        flex: 1,
    },
    listContent: {
        padding: theme.spacing['2xl'],
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        paddingVertical: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

