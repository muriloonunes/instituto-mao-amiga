import React, {useCallback, useMemo, useState} from 'react';
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
import {useFocusEffect} from "@react-navigation/native";
import {Ponto} from "../types/ponto";
import {listarPontos} from "../services/pontosService";
import {ApiError} from "../types/api";
import {EmptyState} from "../components/EmptyState";
import Empty from '../../assets/svg/empty.svg'
import NoResult from '../../assets/svg/no-result.svg'
import Toast from "react-native-toast-message";
import {getMensagemErro} from "../utils/erros";
import {ErroState} from "../components/ErroState";

export function TelaListaPontos({navigation}: any) {
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [pontos, setPontos] = useState<Ponto[]>([])
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<ApiError | null>(null);

    const [busca, setBusca] = useState('');
    const pontosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return pontos;
        return pontos.filter(ponto => ponto.nome?.toLowerCase().includes(termo) ?? false);
    }, [pontos, busca]);

    const carregarDados = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setErro(null);

        try {
            const response = await listarPontos(0, 20);
            setPontos(response.content);
            setErro(null);
        } catch (err) {
            console.error(err);
            const apiError = err instanceof ApiError ? err : new ApiError(-1, 'Erro desconhecido');

            if (isRefresh && pontos.length > 0) {
                Toast.show({
                    type: 'error',
                    text1: getMensagemErro(err, {
                        fallback: 'Ocorreu um erro ao carregar os pontos. Tente novamente mais tarde.'
                    }),
                    position: 'bottom',
                    bottomOffset: paddingInferior + 25
                });
            } else {
                setErro(apiError);
            }
        }
    }, [pontos.length]);

    const onRefresh = useCallback(async () => {
        setAtualizando(true);
        try {
            await carregarDados(true);
        } finally {
            setAtualizando(false);
        }
    }, [carregarDados]);

    useFocusEffect(
        useCallback(() => {
            let ativo = true;

            async function carregarInicial() {
                setCarregando(true);
                await carregarDados(false);
                if (ativo) setCarregando(false);
            }

            carregarInicial();

            return () => {
                ativo = false;
            };
        }, [carregarDados])
    );

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
                    subtitulo="Puxe para baixo para verificar novamente."
                />
            );
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Pontos de Coleta</Text>
            {carregando ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
                </View>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardContainer}
                >
                    {(pontos.length > 0) &&
                        <InputPesquisar placeholder="Buscar pontos" busca={busca} setBusca={setBusca}/>}

                    <FlatList
                        data={pontosFiltrados}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        renderItem={({item}) => (
                            <CardItem
                                ponto={item}
                                onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                            />
                        )}
                        ListEmptyComponent={renderEmptyComponent}
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
                            pontosFiltrados.length === 0 && styles.listaVaziaContainer,
                            {paddingBottom: paddingInferior}
                        ]}
                    />
                </KeyboardAvoidingView>
            )}
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
    }
});
