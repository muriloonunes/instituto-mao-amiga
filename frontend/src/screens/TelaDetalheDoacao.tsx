import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
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
import {theme} from '../theme/theme';
import {Doacao, DoacaoCadastro} from '../types/doacao';
import {ModalCadastro} from "../components/ModalCadastro";
import {ApiError} from "../types/api";
import {buscarPontoPorId} from "../services/pontosService";
import {useFocusEffect} from "@react-navigation/native";
import {Ponto} from "../types/ponto";
import Toast from "react-native-toast-message";
import {getMensagemErro} from "../utils/erros";
import {TelaDetalheDoacaoProps} from "../types/navigation";
import {StatusAcao} from "../types/utils";
import {atualizarDoacao, buscarDoacaoPorId, deletarDoacao} from "../services/doacoesService";
import {ErroState} from "../components/ErroState";

interface SecaoPontoDoacaoProps {
    ponto: Ponto | null;
    erro: ApiError | null;
    carregando: boolean;
    pontoId?: number;
    onVerPonto?: (pontoId: number) => void;
}

interface LinhaInfoProps {
    label: string;
    valor?: string | number;
    icone?: any;
    temDivisor?: boolean;
}

export function TelaDetalheDoacao({navigation, route}: TelaDetalheDoacaoProps) {
    const {doacaoId} = route.params;

    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;
    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 40;

    const [doacao, setDoacao] = useState<Doacao | undefined>(undefined);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<ApiError | null>(null);

    const [ponto, setPonto] = useState<Ponto | null>(null);
    const [carregandoPonto, setCarregandoPonto] = useState(true);
    const [erroPonto, setErroPonto] = useState<ApiError | null>(null);

    const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [statusAcao, setStatusAcao] = useState<StatusAcao>('idle');

    const estaOcupado = statusAcao !== 'idle';

    const carregarDadosCompletos = useCallback(async () => {
        const doacaoApi = await buscarDoacaoPorId(doacaoId);
        setDoacao(doacaoApi);
        setErro(null);

        if (doacaoApi.pontoId) {
            try {
                setCarregandoPonto(true);
                const pontoApi = await buscarPontoPorId(doacaoApi.pontoId);
                setPonto(pontoApi);
                setErroPonto(null);
            } catch (errPonto) {
                setErroPonto(errPonto instanceof ApiError ? errPonto : new ApiError(-1, 'Erro ao buscar ponto'));
            } finally {
                setCarregandoPonto(false);
            }
        }
    }, [doacaoId]);

    useFocusEffect(
        useCallback(() => {
            let ativo = true;

            async function inicializar() {
                setCarregando(true);
                setErro(null);
                try {
                    await carregarDadosCompletos();
                } catch (error: any) {
                    if (ativo) {
                        setErro(error instanceof ApiError ? error : new ApiError(-1, 'Erro desconhecido'));
                    }
                } finally {
                    if (ativo) setCarregando(false);
                }
            }

            inicializar();

            return () => {
                ativo = false;
            };
        }, [carregarDadosCompletos])
    );

    const onRefresh = useCallback(async () => {
        setAtualizando(true);
        try {
            await carregarDadosCompletos();
        } catch (err: any) {
            console.error(err);
            const apiError = err instanceof ApiError ? err : new ApiError(-1, 'Erro desconhecido');

            if (doacao) {
                Toast.show({
                    type: 'error',
                    text1: getMensagemErro(err, {fallback: 'Não foi possível atualizar os detalhes da doação.'}),
                    position: 'bottom',
                    bottomOffset: paddingInferior + 25,
                });
            } else {
                setErro(apiError);
            }
        } finally {
            setAtualizando(false);
        }
    }, [carregarDadosCompletos, doacao, paddingInferior]);

    async function onConfirmEditar(novaDoacao: DoacaoCadastro) {
        if (!novaDoacao || !doacao) return;

        try {
            setStatusAcao('editando');
            const doacaoApi = await atualizarDoacao(doacao.id, novaDoacao);
            setDoacao(doacaoApi);
            navigation.setParams({doacaoId: doacaoApi.id});

            if (doacaoApi.pontoId && doacaoApi.pontoId !== ponto?.id) {
                try {
                    setCarregandoPonto(true);
                    const pontoApi = await buscarPontoPorId(doacaoApi.pontoId);
                    setPonto(pontoApi);
                    setErroPonto(null);
                } catch (errPonto) {
                    setErroPonto(errPonto instanceof ApiError ? errPonto : new ApiError(-1, 'Erro ao buscar ponto'));
                } finally {
                    setCarregandoPonto(false);
                }
            }

            Toast.show({
                type: 'success',
                text1: 'Doação atualizada com sucesso.',
                position: 'bottom',
                bottomOffset: paddingInferior + 25,
            });
        } catch (error) {
            throw error;
        } finally {
            setStatusAcao('idle');
        }
    }

    async function onConfirmExcluir() {
        if (!doacao) return;

        try {
            setStatusAcao('excluindo');
            await deletarDoacao(doacao.id);
            Toast.show({
                type: 'success',
                text1: 'Doação excluída com sucesso.',
                position: 'bottom',
                bottomOffset: paddingInferior + 25,
            });
            try {
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Abas', params: {screen: 'Doações'}}],
                });
            } catch {
                navigation.goBack();
            }
        } catch {
            setStatusAcao('idle');
            Toast.show({
                type: "error",
                text1: 'Ocorreu um erro ao excluir a doação.',
                position: 'bottom',
                bottomOffset: paddingInferior + 25,
            });
        }
    }

    function onExcluirClick() {
        Alert.alert(
            'Excluir Doação',
            'Deseja realmente excluir esta doação? Esta ação não pode ser desfeita.',
            [
                {text: 'Cancelar', style: 'cancel'},
                {text: 'Excluir', style: 'destructive', onPress: onConfirmExcluir},
            ],
            {cancelable: true}
        );
    }

    useLayoutEffect(() => {
        if (!doacao) return;

        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerAcoes}>
                    <Pressable
                        style={({pressed}) => [
                            styles.headerBotaoAcao,
                            pressed && styles.headerBotaoAcaoPressionado,
                            statusAcao === 'editando' && styles.headerBotaoDesabilitado,
                        ]}
                        onPress={() => setModalEditarVisivel(true)}
                        disabled={estaOcupado}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        android_ripple={{
                            color: theme.colors.primaryLight,
                            borderless: true,
                            radius: 20,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Editar Doação"
                    >
                        {statusAcao === 'editando' ? (
                            <ActivityIndicator size="small" color={theme.colors.primaryVibrant}/>
                        ) : (
                            <MaterialDesignIcons name="pencil-outline" size={24} color={theme.colors.primaryVibrant}/>
                        )}
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            styles.headerBotaoAcao,
                            pressed && styles.headerBotaoAcaoPressionado,
                            statusAcao === 'excluindo' && styles.headerBotaoDesabilitado,
                        ]}
                        onPress={onExcluirClick}
                        disabled={estaOcupado}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        android_ripple={{
                            color: 'rgba(247, 90, 104, 0.25)',
                            borderless: true,
                            radius: 20,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Excluir Doação"
                    >
                        {statusAcao === 'excluindo' ? (
                            <ActivityIndicator size="small" color={theme.colors.danger}/>
                        ) : (
                            <MaterialDesignIcons name="trash-can-outline" size={24} color={theme.colors.danger}/>
                        )}
                    </Pressable>
                </View>
            ),
        });
    }, [navigation, doacao, statusAcao, estaOcupado]);

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
            </View>
        );
    }

    if (erro || !doacao) {
        return (
            <View style={styles.containerVazio}>
                <ErroState
                    erro={erro ?? new ApiError(404, 'Doação não encontrada')}
                    naoEncontrado="Doação não encontrada."
                    fallback="Não foi possível carregar os detalhes da doação."
                />
            </View>
        );
    }

    const dataFormatada = formatarDataLegivel(doacao.criadoEm);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={atualizando}
                    onRefresh={onRefresh}
                    colors={[theme.colors.primaryVibrant]}
                    progressBackgroundColor={theme.colors.surfaceModal}
                    tintColor={theme.colors.primaryVibrant}
                />
            }
        >
            <ModalCadastro
                visible={modalEditarVisivel}
                abaAberta={'Doações'}
                onClose={() => setModalEditarVisivel(false)}
                doacaoExistente={doacao}
                onSaveDoacao={onConfirmEditar}
            />

            <View style={styles.conteudoCentral}>
                <View style={styles.secao}>
                    <Text style={styles.secaoTitulo}>INFORMAÇÕES DA DOAÇÃO</Text>
                    <View style={styles.card}>
                        <View style={styles.headerIntegrado}>
                            <View style={styles.headerIntegradoIcone}>
                                <MaterialDesignIcons
                                    name="hand-heart-outline"
                                    size={22}
                                    color={theme.colors.primaryVibrant}
                                />
                            </View>
                            <Text style={styles.headerIntegradoNome} numberOfLines={2}>
                                {doacao.tipoItem}
                            </Text>
                        </View>
                        <View style={styles.divisor}/>
                        <LinhaInfo
                            label="Quantidade:"
                            valor={`${doacao.quantidade} ${doacao.quantidade === 1 ? 'unidade' : 'unidades'}`}
                            icone="package-variant-closed"
                        />
                        <LinhaInfo
                            label="Data de Registro:"
                            valor={dataFormatada}
                            icone="calendar-clock-outline"
                            temDivisor={false}
                        />
                    </View>
                </View>

                <SecaoPontoDoacao
                    ponto={ponto}
                    erro={erroPonto}
                    carregando={carregandoPonto}
                    pontoId={doacao.pontoId}
                    onVerPonto={(id) => navigation.navigate('TelaDetalhePonto', {pontoId: id})}
                />

                <View style={styles.secaoBotao}>
                    <Pressable
                        style={({pressed}) => [
                            styles.botaoEditar,
                            pressed && styles.botaoEditarPressionado,
                            estaOcupado && styles.botaoDesabilitado,
                        ]}
                        onPress={() => setModalEditarVisivel(true)}
                        disabled={estaOcupado}
                        android_ripple={{color: theme.colors.primaryLight}}
                        accessibilityRole="button"
                        accessibilityLabel="Editar Doação"
                    >
                        {statusAcao === 'editando' ? (
                            <ActivityIndicator size="small" color={theme.colors.primaryVibrant}/>
                        ) : (
                            <>
                                <MaterialDesignIcons name="pencil-outline" size={20}
                                                     color={theme.colors.primaryVibrant}/>
                                <Text style={styles.botaoEditarTexto}>Editar Doação</Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        style={({pressed}) => [
                            styles.botaoExcluir,
                            pressed && styles.botaoExcluirPressionado,
                            estaOcupado && styles.botaoDesabilitado,
                        ]}
                        onPress={onExcluirClick}
                        disabled={estaOcupado}
                        android_ripple={{color: 'rgba(247, 90, 104, 0.2)'}}
                        accessibilityRole="button"
                        accessibilityLabel="Excluir Doação"
                    >
                        {statusAcao === 'excluindo' ? (
                            <ActivityIndicator size="small" color={theme.colors.danger}/>
                        ) : (
                            <>
                                <MaterialDesignIcons name="trash-can-outline" size={20} color={theme.colors.danger}/>
                                <Text style={styles.botaoExcluirTexto}>Excluir Doação</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

function LinhaInfo({label, valor, icone, temDivisor = true}: LinhaInfoProps) {
    return (
        <>
            <View style={styles.linhaInfo}>
                {icone && (
                    <MaterialDesignIcons name={icone} size={18} color={theme.colors.primaryVibrant}
                                         style={{marginTop: 2}}/>
                )}
                <View style={styles.linhaConteudo}>
                    <Text style={styles.linhaLabel}>{label}</Text>
                    <Text style={styles.linhaValor}>{valor ?? '-'}</Text>
                </View>
            </View>
            {temDivisor && <View style={styles.divisor}/>}
        </>
    );
}

function SecaoPontoDoacao({ponto, erro, carregando, pontoId, onVerPonto}: SecaoPontoDoacaoProps) {
    return (
        <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>PONTO DE DESTINO</Text>
            <View style={styles.card}>
                <View style={styles.pontoCabecalho}>
                    <MaterialDesignIcons name="map-marker-outline" size={22} color={theme.colors.primaryVibrant}/>
                    <Text style={styles.pontoNome} numberOfLines={2}>
                        {ponto ? ponto.nome : `Ponto de coleta`}
                    </Text>
                </View>
                {carregando && !ponto && (
                    <View style={styles.pontoEstadoContainer}>
                        <ActivityIndicator size="small" color={theme.colors.primaryVibrant}/>
                        <Text style={styles.pontoEstadoTexto}>Buscando dados do ponto...</Text>
                    </View>
                )}

                {erro && !ponto && (
                    <View style={styles.pontoEstadoContainer}>
                        <MaterialDesignIcons
                            name={erro.status === 0 ? 'wifi-off' : erro.status === 404 ? 'map-marker-off-outline' : 'alert-circle-outline'}
                            size={22}
                            color={theme.colors.textMuted}
                        />
                        <View style={{flex: 1}}>
                            <Text style={styles.pontoEstadoTitulo}>
                                {erro.status === 0
                                    ? 'Ponto indisponível (offline)'
                                    : erro.status === 404
                                        ? 'Ponto não encontrado'
                                        : 'Não foi possível carregar os dados do ponto'}
                            </Text>
                            <Text style={styles.pontoEstadoSubtitulo}>
                                {erro.status === 404
                                    ? 'Este ponto pode ter sido removido.'
                                    : 'Puxe a tela para baixo para tentar novamente.'}
                            </Text>
                        </View>
                    </View>
                )}

                {ponto && (
                    <>
                        <View style={styles.divisor}/>
                        <LinhaInfo
                            label="Endereço:"
                            valor={ponto.bairro ? `${ponto.endereco} • ${ponto.bairro}` : ponto.endereco}
                            icone="map-marker-outline"
                        />
                        <LinhaInfo
                            label="Dias e Horários:"
                            valor={ponto.horario}
                            icone="clock-outline"
                            temDivisor={false}
                        />

                        {onVerPonto && (
                            <>
                                <View style={styles.divisor}/>
                                <View style={styles.pontoRodapeAcoes}>
                                    <Pressable
                                        style={({pressed}) => [
                                            styles.botaoVerPonto,
                                            pressed && styles.botaoVerPontoPressionado
                                        ]}
                                        onPress={() => onVerPonto(ponto.id)}
                                        accessibilityRole="button"
                                        accessibilityLabel="Ver detalhes do ponto"
                                    >
                                        <Text style={styles.botaoVerPontoTexto}>Ver detalhes do ponto</Text>
                                        <MaterialDesignIcons
                                            name="chevron-right"
                                            size={18}
                                            color={theme.colors.primaryVibrant}
                                        />
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}

function formatarDataLegivel(dataValor: Date | string | number | undefined): string {
    if (!dataValor) return 'Data não informada';

    try {
        const data = new Date(dataValor);
        if (isNaN(data.getTime())) return 'Data não informada';

        const dataFormatada = data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        const horaFormatada = data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return `${dataFormatada} às ${horaFormatada}`;
    } catch {
        return String(dataValor);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing['2xl'],
        paddingBottom: theme.spacing['4xl'],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    headerBotaoDesabilitado: {
        opacity: 0.4,
    },
    headerIntegrado: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        paddingBottom: theme.spacing.xs,
    },
    headerIntegradoIcone: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: theme.colors.iconSurface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIntegradoNome: {
        flex: 1,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        lineHeight: 24,
    },
    secao: {
        marginBottom: theme.spacing['2xl'],
    },
    secaoTitulo: {
        fontSize: theme.fontSize.xs,
        fontWeight: '700',
        letterSpacing: 0.8,
        color: theme.colors.textMuted,
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
    pontoCabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    pontoNome: {
        flex: 1,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        lineHeight: 24,
    },
    pontoEstadoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        paddingTop: theme.spacing.lg,
        marginTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderSubtle,
    },
    pontoEstadoTexto: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textMuted,
    },
    pontoEstadoTitulo: {
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    pontoEstadoSubtitulo: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    pontoRodapeAcoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 2,
    },
    botaoVerPonto: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 4,
    },
    botaoVerPontoPressionado: {
        opacity: 0.6,
    },
    botaoVerPontoTexto: {
        color: theme.colors.primaryVibrant,
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        includeFontPadding: false,
        textAlignVertical: 'center',
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
    botaoDesabilitado: {
        opacity: 0.6,
    },
    botaoExcluirTexto: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.danger,
    },
    containerVazio: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing['2xl'],
    },
});
