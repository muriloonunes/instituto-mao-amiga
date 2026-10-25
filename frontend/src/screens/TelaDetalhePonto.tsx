import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ponto} from "../types/ponto";
import {theme} from "../theme/theme";
import {buscarPontoPorId} from "../services/pontosService";
import {ApiError} from "../types/api";
import Toast from "react-native-toast-message";
import {getMensagemErro} from "../utils/erros";
import {ErroState} from "../components/ErroState";
import {TelaDetalhePontoProps} from "../types/navigation";

export function TelaDetalhePonto({route}: TelaDetalhePontoProps) {
    const {pontoId} = route.params;
    const [ponto, setPonto] = useState<Ponto | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<ApiError | null>(null);

    const carregarPonto = useCallback(async () => {
        const response = await buscarPontoPorId(pontoId);
        setPonto(response);
        setErro(null);
    }, [pontoId]);

    const onRefresh = useCallback(async () => {
        setAtualizando(true);
        try {
            await carregarPonto();
        } catch (err) {
            console.error(err);
            const apiError = err instanceof ApiError ? err : new ApiError(-1, 'Erro desconhecido');
            if (ponto) {
                Toast.show({
                    type: 'error',
                    text1: getMensagemErro(err, {
                        naoEncontrado: 'Ponto não encontrado.',
                        fallback: 'Não foi possível atualizar os detalhes do ponto.'
                    }),
                    position: 'bottom',
                });
            } else {
                setErro(apiError);
            }
        } finally {
            setAtualizando(false);
        }
    }, [carregarPonto, ponto]);

    useEffect(() => {
        let ativo = true;

        async function carregarInicial() {
            setErro(null);
            try {
                await carregarPonto();
            } catch (err) {
                if (ativo) {
                    setErro(err instanceof ApiError ? err : new ApiError(-1, 'Erro desconhecido'));
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarInicial();
        return () => {
            ativo = false;
        };
    }, [carregarPonto]);


    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
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
                    styles.detalheScroll,
                    (erro || !ponto) && styles.scrollVazio
                ]}
            >
                {erro || !ponto ? (
                    <ErroState
                        erro={erro ?? new ApiError(404, 'Ponto não encontrado')}
                        naoEncontrado="Ponto de coleta não encontrado."
                        fallback="Não foi possível carregar os detalhes do ponto."
                    />
                ) : (
                    <PontoDetalhe ponto={ponto}/>
                )}
            </ScrollView>
        </View>
    );
}

function PontoDetalhe({ponto}: { ponto: Ponto }) {
    return (
        <View style={styles.cardDetalhe}>
            <Text style={styles.nome}>{ponto.nome}</Text>

            <View style={styles.divisor}/>

            <Text style={styles.label}>📍 Endereço</Text>
            <Text style={styles.endereco}>{ponto.endereco}</Text>

            <Text style={styles.label}>🕒 Dias e Horários</Text>
            <Text style={styles.diasHorarios}>{ponto.diasHorarios}</Text>

            <Text style={styles.label}>📦 Atendimento</Text>
            <Text style={styles.funcionamento}>{ponto.funcionamento}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    scrollVazio: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    detalheScroll: {
        padding: theme.spacing['2xl'],
        paddingBottom: theme.spacing['3xl'],
    },
    cardDetalhe: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing['2xl'],
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        width: '100%',
    },
    nome: {
        fontSize: theme.fontSize['3xl'],
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        marginBottom: theme.spacing.md,
    },
    divisor: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
    },
    label: {
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        color: theme.colors.primaryVibrant,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xs,
    },
    endereco: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
    diasHorarios: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        lineHeight: 20,
    },
    funcionamento: {
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        color: theme.colors.text,
        lineHeight: 18,
    },
});
