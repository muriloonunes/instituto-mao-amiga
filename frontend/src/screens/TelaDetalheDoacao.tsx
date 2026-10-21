import React, {useEffect, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View,} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {theme} from '../theme/theme';
import {Doacao} from '../types/doacao';
import {pontosMock} from '../mocks/pontosMock';
import {atualizarDoacao, excluirDoacao} from '../services/doacoesStorage';
import {NovaDoacaoModal} from "../components/NovaDoacaoModal";

export function TelaDetalheDoacao({navigation, route}: any) {
    const [carregandoExclusao, setCarregandoExclusao] = useState(false);
    const [editarModalVisible, setEditarModalVisible] = useState(false);
    const [carregandoEdicao, setCarregandoEdicao] = useState(false);
    const [doacao, setDoacao] = useState<Doacao | undefined>(route?.params?.doacao);

    useEffect(() => {
        if (route?.params?.doacao) {
            setDoacao(route.params.doacao);
        }
    }, [route?.params?.doacao]);

    async function onConfirmEditar(novaDoacao: Doacao) {
        if (!novaDoacao) return;

        try {
            setCarregandoEdicao(true);
            await atualizarDoacao(novaDoacao);
            setDoacao(novaDoacao);
            navigation.setParams({doacao: novaDoacao});
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível editar a doação.');
        } finally {
            setCarregandoEdicao(false);
        }
    }

    async function onConfirmExcluir() {
        if (!doacao) return;

        try {
            setCarregandoExclusao(true);
            await excluirDoacao(doacao.id);
            try {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Abas',
                            params: {screen: 'Doações'},
                        },
                    ],
                });
            } catch {
                navigation.goBack();
            }
        } catch (error) {
            setCarregandoExclusao(false);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir a doação.');
        }
    }

    function onExcluirClick() {
        Alert.alert(
            'Excluir Doação',
            'Deseja realmente excluir esta doação? Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: onConfirmExcluir,
                },
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
                            carregandoEdicao && styles.headerBotaoDesabilitado,
                        ]}
                        onPress={() => setEditarModalVisible(true)}
                        disabled={carregandoEdicao || carregandoExclusao}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        android_ripple={{
                            color: theme.colors.primaryLight,
                            borderless: true,
                            radius: 20,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Editar Doação"
                    >
                        {carregandoEdicao ? (
                            <ActivityIndicator size="small" color={theme.colors.primaryVibrant}/>
                        ) : (
                            <MaterialDesignIcons
                                name="pencil-outline"
                                size={24}
                                color={theme.colors.primaryVibrant}
                            />
                        )}
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            styles.headerBotaoAcao,
                            pressed && styles.headerBotaoAcaoPressionado,
                            carregandoExclusao && styles.headerBotaoDesabilitado,
                        ]}
                        onPress={onExcluirClick}
                        disabled={carregandoExclusao || carregandoEdicao}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        android_ripple={{
                            color: 'rgba(247, 90, 104, 0.25)',
                            borderless: true,
                            radius: 20,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Excluir Doação"
                    >
                        {carregandoExclusao ? (
                            <ActivityIndicator size="small" color={theme.colors.danger}/>
                        ) : (
                            <MaterialDesignIcons
                                name="trash-can-outline"
                                size={24}
                                color={theme.colors.danger}
                            />
                        )}
                    </Pressable>
                </View>
            ),
        });
    }, [navigation, doacao, carregandoExclusao, carregandoEdicao]);

    if (!doacao) {
        return (
            <View style={styles.containerVazio}>
                <MaterialDesignIcons
                    name="alert-circle-outline"
                    size={48}
                    color={theme.colors.danger}
                />
                <Text style={styles.textoErro}>Doação não encontrada.</Text>
                <Pressable
                    style={({pressed}) => [
                        styles.botaoVoltar,
                        pressed && styles.botaoPressionado,
                    ]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.botaoVoltarTexto}>Voltar</Text>
                </Pressable>
            </View>
        );
    }

    const ponto = pontosMock.find((p) => p.id === doacao.pontoId);
    const dataFormatada = formatarDataLegivel(doacao.criadoEm);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <NovaDoacaoModal
                visible={editarModalVisible}
                onClose={() => setEditarModalVisible(false)}
                doacaoExistente={doacao}
                onSave={async (novaDoacao) => {
                    await onConfirmEditar(novaDoacao);
                }}
            />
            <View style={styles.conteudoCentral}>
                <View style={styles.heroCard}>
                    <View style={styles.heroIconWrapper}>
                        <MaterialDesignIcons
                            name="hand-heart"
                            size={36}
                            color={theme.colors.primaryVibrant}
                        />
                    </View>

                    <Text style={styles.heroNome}>{doacao.tipoItem}</Text>

                    <View style={styles.heroBadges}>
                        <View style={styles.badgeQtd}>
                            <MaterialDesignIcons
                                name="package-variant-closed"
                                size={14}
                                color={theme.colors.primaryVibrant}
                            />
                            <Text style={styles.badgeQtdTexto}>
                                {doacao.quantidade} {doacao.quantidade === 1 ? 'item' : 'itens'}
                            </Text>
                        </View>

                        <View style={styles.badgeCodigo}>
                            <Text style={styles.badgeCodigoTexto}>#{doacao.id}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.secao}>
                    <Text style={styles.secaoTitulo}>INFORMAÇÕES DA DOAÇÃO</Text>
                    <View style={styles.card}>
                        <View style={styles.campoLinha}>
                            <Text style={styles.campoLabel}>Item:</Text>
                            <Text style={styles.campoValor}>{doacao.tipoItem}</Text>
                        </View>

                        <View style={styles.divisor}/>

                        <View style={styles.campoLinha}>
                            <Text style={styles.campoLabel}>Quantidade:</Text>
                            <Text style={styles.campoValor}>
                                {doacao.quantidade} {doacao.quantidade === 1 ? 'unidade' : 'unidades'}
                            </Text>
                        </View>

                        <View style={styles.divisor}/>

                        <View style={styles.campoLinha}>
                            <Text style={styles.campoLabel}>Data de Registro:</Text>
                            <Text style={styles.campoValor}>{dataFormatada}</Text>
                        </View>

                        <View style={styles.divisor}/>

                        <View style={styles.campoLinha}>
                            <Text style={styles.campoLabel}>Identificador:</Text>
                            <Text style={styles.campoValor}>#{doacao.id}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.secao}>
                    <Text style={styles.secaoTitulo}>PONTO DE DESTINO</Text>
                    <View style={styles.card}>
                        <View style={styles.pontoCabecalho}>
                            <MaterialDesignIcons
                                name="map-marker"
                                size={20}
                                color={theme.colors.primaryVibrant}
                            />
                            <Text style={styles.pontoNome}>
                                {ponto ? ponto.nome : 'Ponto não identificado'}
                            </Text>
                        </View>

                        <Text style={styles.pontoIdTexto}>ID do Ponto: #{doacao.pontoId}</Text>

                        {ponto ? (
                            <>
                                <View style={styles.divisor}/>

                                <Text style={styles.pontoSublabel}>Endereço</Text>
                                <Text style={styles.pontoSubvalor}>{ponto.endereco}</Text>

                                <Text style={styles.pontoSublabel}>Dias e Horários</Text>
                                <Text style={styles.pontoSubvalor}>{ponto.diasHorarios}</Text>

                                {ponto.funcionamento ? (
                                    <>
                                        <Text style={styles.pontoSublabel}>Atendimento</Text>
                                        <Text style={styles.pontoSubvalor}>{ponto.funcionamento}</Text>
                                    </>
                                ) : null}
                            </>
                        ) : null}
                    </View>
                </View>

                <View style={styles.secaoBotao}>
                    <Pressable
                        style={({pressed}) => [
                            styles.botaoEditar,
                            pressed && styles.botaoEditarPressionado,
                            (carregandoEdicao || carregandoExclusao) && styles.botaoDesabilitado,
                        ]}
                        onPress={() => setEditarModalVisible(true)}
                        disabled={carregandoEdicao || carregandoExclusao}
                        android_ripple={{color: theme.colors.primaryLight}}
                        accessibilityRole="button"
                        accessibilityLabel="Editar Doação"
                    >
                        {carregandoEdicao ? (
                            <ActivityIndicator size="small" color={theme.colors.primaryVibrant}/>
                        ) : (
                            <>
                                <MaterialDesignIcons
                                    name="pencil-outline"
                                    size={20}
                                    color={theme.colors.primaryVibrant}
                                />
                                <Text style={styles.botaoEditarTexto}>Editar Doação</Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        style={({pressed}) => [
                            styles.botaoExcluir,
                            pressed && styles.botaoExcluirPressionado,
                            (carregandoExclusao || carregandoEdicao) && styles.botaoDesabilitado,
                        ]}
                        onPress={onExcluirClick}
                        disabled={carregandoExclusao || carregandoEdicao}
                        android_ripple={{color: 'rgba(247, 90, 104, 0.2)'}}
                        accessibilityRole="button"
                        accessibilityLabel="Excluir Doação"
                    >
                        {carregandoExclusao ? (
                            <ActivityIndicator size="small" color={theme.colors.danger}/>
                        ) : (
                            <>
                                <MaterialDesignIcons
                                    name="trash-can-outline"
                                    size={20}
                                    color={theme.colors.danger}
                                />
                                <Text style={styles.botaoExcluirTexto}>Excluir Doação</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        </ScrollView>
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
    heroCard: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing['2xl'],
        alignItems: 'center',
        marginBottom: theme.spacing['2xl'],
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.shadow,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    heroIconWrapper: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: theme.colors.iconSurface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
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
        gap: theme.spacing.sm,
    },
    badgeQtd: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    badgeQtdTexto: {
        color: theme.colors.primaryVibrant,
        fontSize: theme.fontSize.sm,
        fontWeight: '700',
    },
    badgeCodigo: {
        backgroundColor: theme.colors.surfaceElevated,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    badgeCodigoTexto: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.xs,
        fontWeight: '600',
    },
    secao: {
        marginBottom: theme.spacing['2xl'],
    },
    secaoTitulo: {
        fontSize: theme.fontSize.xs,
        fontWeight: '700',
        letterSpacing: 1,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.sm,
        marginLeft: theme.spacing.xs,
    },
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing['2xl'],
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.shadow,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    campoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
    },
    campoLabel: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    campoValor: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        fontWeight: '600',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: theme.spacing.md,
    },
    divisor: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginVertical: theme.spacing.md,
    },

    // Ponto
    pontoCabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    pontoNome: {
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        flex: 1,
    },
    pontoIdTexto: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textMuted,
        marginTop: 4,
        marginLeft: 28,
    },
    pontoSublabel: {
        fontSize: theme.fontSize.xs,
        fontWeight: '700',
        color: theme.colors.primaryVibrant,
        marginTop: theme.spacing.md,
        marginBottom: 2,
    },
    pontoSubvalor: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    secaoBotao: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing['2xl'],
        gap: theme.spacing.md, // Espaçamento consistente entre Editar e Excluir
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
    textoErro: {
        fontSize: theme.fontSize.xl,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing['2xl'],
    },
    botaoVoltar: {
        backgroundColor: theme.colors.surfaceElevated,
        paddingHorizontal: theme.spacing['2xl'],
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        minHeight: 44,
        justifyContent: 'center'
    },
    botaoVoltarTexto: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
    botaoPressionado: {
        opacity: 0.7,
    },
});
