import React, {useCallback, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    useWindowDimensions
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
import Empty from '../../assets/empty.svg'
import NoResult from '../../assets/no-result.svg'

export function TelaListaPontos({navigation}: any) {
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [pontos, setPontos] = useState<Ponto[]>([])
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [busca, setBusca] = useState('');
    const pontosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return pontos.filter(ponto => ponto.nome?.toLowerCase().includes(termo) ?? false);
    }, [pontos, busca]);

    const carregarDados = useCallback(async () => {
        setErro(null);
        try {
            const response = await listarPontos(0, 20);
            setPontos(response.content);
        } catch (err) {
            if (err instanceof ApiError && err.status === 0) {
                setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                setErro('Ocorreu um erro ao carregar os pontos.');
                console.error(err);
            }
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setAtualizando(true)
        await carregarDados();
        setAtualizando(false)
    }, [carregarDados]);

    useFocusEffect(
        useCallback(() => {
            let ativo = true

            async function carregarInicial() {
                setCarregando(true);
                await carregarDados();
                if (ativo) setCarregando(false);
            }

            carregarInicial();

            return () => {
                ativo = false
            }
        }, [carregarDados])
    )

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Pontos de Coleta</Text>
            {carregando ? (
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardContainer}
                >
                    <InputPesquisar placeholder="Buscar pontos" busca={busca} setBusca={setBusca}/>
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
                        ListEmptyComponent={() => (
                            <EmptyState
                                icon={busca.trim()
                                    ? <NoResult width={250} height={250}/>
                                    : <Empty width={300} height={250}/>
                                }
                                mensagem={
                                    busca.trim()
                                        ? `Nenhum ponto encontrado para "${busca}"`
                                        : 'Nenhum ponto de coleta cadastrado'
                                }
                                subtitulo={
                                    busca.trim()
                                        ? 'Verifique a ortografia ou tente outro termo.'
                                        : 'Puxe para baixo para verificar novamente.'
                                }
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
    floatingButton: {
        backgroundColor: theme.colors.primary,
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        right: 20,
        elevation: 5,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 999,
    },
});
