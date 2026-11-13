import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Ponto} from '../types/ponto';
import {theme} from '../theme/theme';
import {buscarPontoPorId} from '../services/pontosService';
import {ApiError} from '../types/api';
import Toast from 'react-native-toast-message';
import {getMensagemErro} from '../utils/erros';
import {ErroState} from '../components/ErroState';
import {TelaDetalhePontoProps} from '../types/navigation';

export function TelaDetalhePonto({navigation, route}: TelaDetalhePontoProps) {
    const {pontoId} = route.params;
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;
    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 40;

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
                        fallback: 'Não foi possível atualizar os detalhes do ponto.',
                    }),
                    position: 'bottom',
                    bottomOffset: paddingInferior + 25,
                });
            } else {
                setErro(apiError);
            }
        } finally {
            setAtualizando(false);
        }
    }, [carregarPonto, ponto, paddingInferior]);

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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerAcoes}>
                    <Pressable
                        style={({pressed}) => [
                            styles.headerBotaoAcao,
                            pressed && styles.headerBotaoAcaoPressionado,
                        ]}
                        onPress={() => {}}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        android_ripple={{
                            color: theme.colors.primaryLight,
                            borderless: true,
                            radius: 20,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Editar Ponto"
                    >
                        <MaterialDesignIcons name="pencil-outline" size={24} color={theme.colors.primaryVibrant} />
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            styles.headerBotaoAcao,
                            pressed && styles.headerBotaoAcaoPressionado,
                        ]}
                        onPress={() => {}}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        android_ripple={{
                            color: 'rgba(247, 90, 104, 0.25)',
                            borderless: true,
                            radius: 20,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Excluir Ponto"
                    >
                        <MaterialDesignIcons name="trash-can-outline" size={24} color={theme.colors.danger} />
                    </Pressable>
                </View>
            ),
        });
    }, [navigation]);

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant} />
            </View>
        );
    }

    const tipoLower = (ponto?.tipo || '').toLowerCase();
    const isAmbos = tipoLower.includes('coleta') && tipoLower.includes('distribui');
    const isDistribuiApenas = !isAmbos && tipoLower.includes('distribui');

    let badgeLabel = ponto?.tipo || '';
    let badgeIcon: any = "inbox-arrow-down";
    let badgeStyle: any = styles.badgeRecebe;
    let badgeTextStyle: any = styles.badgeRecebeTexto;
    let badgeIconColor: string = theme.colors.primaryVibrant;

    if (isAmbos) {
        badgeLabel = "Coleta e Distribui";
        badgeIcon = "swap-horizontal-bold";
        badgeStyle = styles.badgeAmbos;
        badgeTextStyle = styles.badgeAmbosTexto;
        badgeIconColor = "#38bdf8";
    } else if (isDistribuiApenas) {
        badgeLabel = "Distribui";
        badgeIcon = "truck-delivery-outline";
        badgeStyle = styles.badgeDistribui;
        badgeTextStyle = styles.badgeDistribuiTexto;
        badgeIconColor = theme.colors.warning;
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
                    {paddingBottom: paddingInferior},
                    (erro || !ponto) && styles.scrollVazio,
                ]}
            >
                {erro || !ponto ? (
                    <ErroState
                        erro={erro ?? new ApiError(404, 'Ponto não encontrado')}
                        naoEncontrado="Ponto não encontrado."
                        fallback="Não foi possível carregar os detalhes do ponto."
                    />
                ) : (
                    <View style={styles.conteudoCentral}>
                        <View style={styles.heroCard}>
                            <View style={styles.heroIconWrapper}>
                                <MaterialDesignIcons
                                    name="map-marker-radius"
                                    size={36}
                                    color={theme.colors.primaryVibrant}
                                />
                            </View>

                            <Text style={styles.heroNome}>{ponto.nome}</Text>

                            <View style={styles.heroBadges}>
                                <View style={[styles.badgeTipo, badgeStyle]}>
                                    <MaterialDesignIcons
                                        name={badgeIcon}
                                        size={14}
                                        color={badgeIconColor}
                                    />
                                    <Text style={[styles.badgeTipoTexto, badgeTextStyle]}>
                                        {badgeLabel}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.secao}>
                            <Text style={styles.secaoTitulo}>LOCALIZAÇÃO</Text>
                            <View style={styles.card}>
                                <LinhaInfo label="Endereço:" valor={ponto.endereco} icone="map-marker-outline" />
                                <LinhaInfo label="Bairro:" valor={ponto.bairro || 'Não informado'} icone="city-variant-outline" temDivisor={false} />
                            </View>
                        </View>

                        <View style={styles.secao}>
                            <Text style={styles.secaoTitulo}>FUNCIONAMENTO</Text>
                            <View style={styles.card}>
                                <LinhaInfo label="Dias e Horários:" valor={ponto.horario} icone="clock-outline" />
                                <LinhaInfo
                                    label="Atividade do Ponto:"
                                    valor={
                                        isAmbos
                                            ? "Ponto de Coleta e Distribuição (Recebe doações da comunidade e entrega mantimentos às famílias)"
                                            : isDistribuiApenas
                                            ? "Ponto de Distribuição (Entrega de mantimentos para famílias)"
                                            : "Ponto de Coleta (Recebe doações de itens da comunidade)"
                                    }
                                    icone="information-outline"
                                    temDivisor={false}
                                />
                            </View>
                        </View>

                        <View style={styles.secaoBotao}>
                            <Pressable
                                style={({pressed}) => [
                                    styles.botaoEditar,
                                    pressed && styles.botaoEditarPressionado,
                                ]}
                                onPress={() => {}}
                                android_ripple={{color: theme.colors.primaryLight}}
                                accessibilityRole="button"
                                accessibilityLabel="Editar Ponto"
                            >
                                <MaterialDesignIcons name="pencil-outline" size={20} color={theme.colors.primaryVibrant} />
                                <Text style={styles.botaoEditarTexto}>Editar Ponto</Text>
                            </Pressable>

                            <Pressable
                                style={({pressed}) => [
                                    styles.botaoExcluir,
                                    pressed && styles.botaoExcluirPressionado,
                                ]}
                                onPress={() => {}}
                                android_ripple={{color: 'rgba(247, 90, 104, 0.2)'}}
                                accessibilityRole="button"
                                accessibilityLabel="Excluir Ponto"
                            >
                                <MaterialDesignIcons name="trash-can-outline" size={20} color={theme.colors.danger} />
                                <Text style={styles.botaoExcluirTexto}>Excluir Ponto</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function LinhaInfo({label, valor, icone, temDivisor = true}: {
    label: string;
    valor: string;
    icone?: any;
    temDivisor?: boolean;
}) {
    return (
        <>
            <View style={styles.linhaInfo}>
                {icone && (
                    <MaterialDesignIcons name={icone} size={18} color={theme.colors.primaryVibrant} style={{marginTop: 2}} />
                )}
                <View style={styles.linhaConteudo}>
                    <Text style={styles.linhaLabel}>{label}</Text>
                    <Text style={styles.linhaValor}>{valor}</Text>
                </View>
            </View>
            {temDivisor && <View style={styles.divisor} />}
        </>
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
    },
    conteudoCentral: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    headerAcoes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        marginRight: Platform.OS === 'ios' ? -4 : 4,
    },
    headerBotaoAcao: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBotaoAcaoPressionado: {
        opacity: 0.6,
    },
    heroCard: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing['2xl'],
        alignItems: 'center',
        marginBottom: theme.spacing['2xl'],
    },
    heroIconWrapper: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: theme.colors.iconSurface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
    },
    heroNome: {
        fontSize: theme.fontSize['3xl'],
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    heroBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeTipo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    badgeRecebe: {
        backgroundColor: theme.colors.primaryLight,
    },
    badgeDistribui: {
        backgroundColor: 'rgba(251, 169, 76, 0.15)',
    },
    badgeAmbos: {
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
    },
    badgeTipoTexto: {
        fontSize: theme.fontSize.sm,
        fontWeight: '700',
    },
    badgeRecebeTexto: {
        color: theme.colors.primaryVibrant,
    },
    badgeDistribuiTexto: {
        color: theme.colors.warning,
    },
    badgeAmbosTexto: {
        color: '#38bdf8',
    },
    secao: {
        marginBottom: theme.spacing['2xl'],
    },
    secaoTitulo: {
        fontSize: theme.fontSize.xs,
        fontWeight: '700',
        color: theme.colors.textMuted,
        letterSpacing: 0.8,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.xs,
    },
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing['2xl'],
    },
    linhaInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
    },
    linhaConteudo: {
        flex: 1,
    },
    linhaLabel: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textMuted,
        marginBottom: 2,
    },
    linhaValor: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textWhite,
        fontWeight: '500',
        lineHeight: 20,
    },
    divisor: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginVertical: theme.spacing.md,
    },
    secaoBotao: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing['2xl'],
        gap: theme.spacing.md,
    },
    botaoEditar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 50,
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.borderMedium,
        borderRadius: theme.borderRadius.xl,
        paddingHorizontal: theme.spacing['2xl'],
    },
    botaoEditarPressionado: {
        opacity: Platform.OS === 'ios' ? 0.75 : 1,
        backgroundColor: theme.colors.surfaceHover,
    },
    botaoEditarTexto: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.primaryVibrant,
    },
    botaoExcluir: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 50,
        backgroundColor: theme.colors.dangerLight,
        borderWidth: 1,
        borderColor: 'rgba(247, 90, 104, 0.3)',
        borderRadius: theme.borderRadius.xl,
        paddingHorizontal: theme.spacing['2xl'],
    },
    botaoExcluirPressionado: {
        opacity: Platform.OS === 'ios' ? 0.75 : 1,
        backgroundColor: 'rgba(247, 90, 104, 0.25)',
    },
    botaoExcluirTexto: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.danger,
    },
});
