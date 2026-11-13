import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {CardItem} from "../components/CardItem";
import {theme} from "../theme/theme";
import {InputPesquisar} from "../components/InputPesquisar";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {Ponto} from "../types/ponto";
import {listarPontos} from "../services/pontosService";
import {ApiError} from "../types/api";
import {EmptyState} from "../components/EmptyState";
import Empty from '../../assets/svg/empty.svg'
import NoResult from '../../assets/svg/no-result.svg'
import Toast from "react-native-toast-message";
import {getMensagemErro} from "../utils/erros";
import {ErroState} from "../components/ErroState";
import {ehUltimaPagina} from "../services/api";

const TAMANHO_PAGINA = 10;

type TelaListaPontosProps = {
    onNovoPonto?: () => void;
    atualizacaoKey: number;
}

export function TelaListaPontos({onNovoPonto, atualizacaoKey}: TelaListaPontosProps) {
    const navigation = useNavigation<any>();
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;
    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<ApiError | null>(null);

    const [pagina, setPagina] = useState(0);
    const [ultima, setUltima] = useState(false);
    const [busca, setBusca] = useState('');

    const buscandoMaisRef = useRef(false);
    const requestSeqRef = useRef(0);
    const primeiraMontagemRef = useRef(true);
    const buscaRef = useRef('');
    const temPontosRef = useRef(false);

    useEffect(() => {
        buscaRef.current = busca;
        temPontosRef.current = pontos.length > 0;
    }, [busca, pontos]);

    const carregarPontos = useCallback(async (
        paginaAlvo: number,
        termoBusca: string,
        resetar: boolean = false
    ) => {
        const requestId = ++requestSeqRef.current;

        if (resetar && !temPontosRef.current) {
            setCarregando(true);
        }

        try {
            const response = await listarPontos(termoBusca.trim() || undefined, paginaAlvo, TAMANHO_PAGINA);

            if (requestId !== requestSeqRef.current) return;

            setPontos(prev => resetar ? response.content : [...prev, ...response.content]);
            setPagina(response.page.number);
            setUltima(ehUltimaPagina(response));
            setErro(null);
        } catch (err) {
            if (requestId !== requestSeqRef.current) return;

            console.error(err);
            const apiError = err instanceof ApiError ? err : new ApiError(-1, 'Erro desconhecido');

            if (!resetar && paginaAlvo > 0) {
                Toast.show({
                    type: 'error',
                    text1: getMensagemErro(err, {fallback: 'Não foi possível carregar mais pontos.'}),
                    position: 'bottom',
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
    }, [paddingInferior]);

    useEffect(() => {
        if (atualizacaoKey && atualizacaoKey > 0) {
            setBusca('');
            setErro(null);
            carregarPontos(0, '', true);
        }
    }, [atualizacaoKey, carregarPontos])

    useEffect(() => {
        if (primeiraMontagemRef.current) {
            primeiraMontagemRef.current = false;
            return;
        }

        const timer = setTimeout(async () => {
            setErro(null);
            await carregarPontos(0, busca, true);
        }, 300);

        return () => clearTimeout(timer);
    }, [busca, carregarPontos]);

    useFocusEffect(
        useCallback(() => {
            if (!buscaRef.current.trim()) {
                setErro(null);
                carregarPontos(0, '', true);
            }
        }, [carregarPontos])
    );

    const onRefresh = useCallback(async () => {
        setAtualizando(true);
        try {
            await carregarPontos(0, busca, true);
        } finally {
            setAtualizando(false);
        }
    }, [busca, carregarPontos]);

    const carregarProximaPagina = useCallback(async () => {
        if (buscandoMaisRef.current || carregandoMais || carregando || atualizando || ultima || erro) {
            return;
        }

        buscandoMaisRef.current = true;
        setCarregandoMais(true);
        try {
            await carregarPontos(pagina + 1, busca, false);
        } finally {
            setCarregandoMais(false);
            buscandoMaisRef.current = false;
        }
    }, [carregandoMais, carregando, atualizando, ultima, erro, pagina, busca, carregarPontos]);

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
                    fallback="Ocorreu um erro ao carregar os pontos."
                />
            );
        }

        if (busca.trim()) {
            return (
                <EmptyState
                    icon={<NoResult width={250} height={250}/>}
                    mensagem={`Nenhum ponto encontrado para "${busca}"`}
                    subtitulo="Verifique a ortografia ou tente outro termo."
                />
            );
        }

        if (!carregando) {
            return (
                <EmptyState
                    icon={<Empty width={300} height={250}/>}
                    mensagem="Nenhum ponto de coleta cadastrado"
                    subtitulo="Puxe para baixo para verificar novamente ou utilize o botão para adicionar um."
                    botaoTexto={"Adicionar ponto"}
                    onBotaoPress={onNovoPonto}
                />
            );
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Pontos de Coleta</Text>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardContainer}
            >
                <InputPesquisar placeholder="Buscar pontos" busca={busca} setBusca={setBusca}/>

                {carregando && pontos.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
                    </View>
                ) : (
                    <FlatList
                        data={pontos}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        ListEmptyComponent={renderEmptyComponent}
                        ListFooterComponent={renderFooter}
                        onEndReached={carregarProximaPagina}
                        onEndReachedThreshold={0.5}
                        renderItem={({item}) => (
                            <CardItem
                                ponto={item}
                                onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                            />
                        )}
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
                            styles.listaContainer,
                            pontos.length === 0 && styles.listaVaziaContainer,
                            {paddingBottom: paddingInferior}
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
    listaContainer: {
        padding: theme.spacing['2xl'],
    },
    listaVaziaContainer: {
        flexGrow: 1,
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
