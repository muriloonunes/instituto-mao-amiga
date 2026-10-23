import React, {useCallback, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ponto} from "../types/ponto";
import {theme} from "../theme/theme";
import {useFocusEffect} from "@react-navigation/native";
import {buscarPontoPorId} from "../services/pontosService";
import {ApiError} from "../types/api";

export function TelaDetalhePonto({route}: any) {
    const {pontoId} = route.params;
    const [ponto, setPonto] = React.useState<Ponto | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const carregarDados = useCallback(async () => {
        setErro(null);
        try {
            const response = await buscarPontoPorId(pontoId)
            setPonto(response)
        } catch (erro) {
            if (erro instanceof ApiError) {
                if (erro.status === 0) {
                    setErro('Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.')
                }
                if (erro.status === 404) {
                    setErro('Ponto de coleta não encontrado.')
                }
            } else {
                setErro('Ocorreu um erro ao carregar os pontos. Por favor, tente novamente mais tarde.')
                console.error(erro)
            }
        }
    }, [])

    const onRefresh = useCallback(async () => {
        setAtualizando(true)
        await carregarDados();
        setAtualizando(false)
    }, [carregarDados]);

    useFocusEffect(
        useCallback(() => {
            let ativo = true

            async function carregarInicial() {
                setCarregando(true)
                await carregarDados();
                if (ativo) setCarregando(false);
            }

            carregarInicial();

            return () => {
                ativo = false
            }
        }, [carregarDados])
    )

    if (carregando) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant} />
            </View>
        );
    }

    if (!ponto) {
        return (
            <View style={styles.container}>
                <Text style={styles.erroText}>Ponto de coleta não encontrado.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {carregando ? (
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
            ) : (
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
                    contentContainerStyle={styles.detalheScroll}
                >
                    <PontoDetalhe ponto={ponto}/>
                </ScrollView>
            )}
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
    erroText: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xl,
        textAlign: 'center',
        marginTop: theme.spacing['4xl'],
    },
});
