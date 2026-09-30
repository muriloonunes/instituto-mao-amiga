import React, {useCallback, useMemo, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {theme} from "../theme/theme";
import {Doacao} from "../types/doacao";
import {CardDoacao} from "../components/CardDoacao";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {listarDoacoes} from "../services/doacoesStorage";
import {InputPesquisar} from "../components/InputPesquisar";

type TelaDoacoesProps = {
    onNovaDoacao?: () => void;
};

type ResumoDoacoes = {
    tipoItem: string;
    quantidadeTotal: number;
    quantidadeDoacoes: number;
};

export function TelaDoacoes({onNovaDoacao}: TelaDoacoesProps) {
    const navigation = useNavigation<any>();
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [resumoExpandido, setResumoExpandido] = useState(true);

    const [busca, setBusca] = useState('');
    const doacoesFiltradas = useMemo(() => {
        const termo = (busca || '').trim().toLowerCase();
        return doacoes.filter(doacao =>
            (doacao?.tipoItem ?? '').toLowerCase().includes(termo)
        );
    }, [doacoes, busca]);

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

    useFocusEffect(
        useCallback(() => {
            let ativo = true;

            async function carregar() {
                const doacoes = await listarDoacoes();
                if (ativo && doacoes) {
                    setDoacoes(doacoes);
                    setCarregando(false);
                }
            }

            carregar();

            return () => {
                ativo = false;
            };
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>
                Doações
            </Text>

            {carregando ? (
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardContainer}
                >
                    {busca.length === 0 && (
                        <View style={styles.resumoCard}>
                            <Pressable
                                style={styles.resumoHeader}
                                onPress={() => setResumoExpandido(prev => !prev)}
                                accessibilityRole="button"
                                accessibilityLabel={resumoExpandido ? "Recolher resumo de doações" : "Expandir resumo de doações"}
                                accessibilityState={{expanded: resumoExpandido}}
                            >
                                <View style={styles.resumoTituloContainer}>
                                    <View style={styles.resumoIconWrapper}>
                                        <MaterialDesignIcons
                                            name="chart-box-outline"
                                            size={18}
                                            color={theme.colors.primaryVibrant}
                                        />
                                    </View>
                                    <Text style={styles.resumoTitulo}>Resumo de Doações</Text>
                                </View>

                                <View style={styles.resumoAcoesDireita}>
                                    <View style={styles.resumoBadges}>
                                        <View style={styles.badgeTotalDoacoes}>
                                            <Text style={styles.badgeTotalDoacoesTexto}>
                                                {totalDoacoes} {totalDoacoes === 1 ? 'doação' : 'doações'}
                                            </Text>
                                        </View>
                                        <View style={styles.badgeTotalItens}>
                                            <Text style={styles.badgeTotalItensTexto}>
                                                {totalItens} {totalItens === 1 ? 'item' : 'itens'}
                                            </Text>
                                        </View>
                                    </View>
                                    <MaterialDesignIcons
                                        name={resumoExpandido ? "chevron-up" : "chevron-down"}
                                        size={22}
                                        color={theme.colors.textMuted}
                                    />
                                </View>
                            </Pressable>

                            {resumoExpandido && (
                                <>
                                    <View style={styles.divisorResumo}/>

                                    {totalDoacoes === 0 ? (
                                        <View style={styles.resumoVazio}>
                                            <MaterialDesignIcons
                                                name="information-outline"
                                                size={16}
                                                color={theme.colors.textMuted}
                                            />
                                            <Text style={styles.resumoVazioTexto}>
                                                Nenhuma doação registrada ainda.
                                            </Text>
                                        </View>
                                    ) : (
                                        <ScrollView
                                            style={styles.resumoListaScroll}
                                            nestedScrollEnabled
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {resumoDoacoes.map((item) => (
                                                <View key={item.tipoItem} style={styles.resumoLinha}>
                                                    <View style={styles.resumoLinhaBullet}/>
                                                    <Text style={styles.resumoLinhaTexto} numberOfLines={2}>
                                                        <Text style={styles.resumoTipoItem}>{item.tipoItem}: </Text>
                                                        <Text style={styles.resumoDetalheTexto}>
                                                            {item.quantidadeTotal} {item.quantidadeTotal === 1 ? 'unidade' : 'unidades'} em{' '}
                                                            {item.quantidadeDoacoes} {item.quantidadeDoacoes === 1 ? 'doação' : 'doações'}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    )}
                                </>
                            )}
                        </View>
                    )}
                    <InputPesquisar placeholder="Buscar doações" busca={busca} setBusca={setBusca}/>
                    <FlatList
                        data={doacoesFiltradas}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        renderItem={({item}) => CardDoacao({
                            doacao: item,
                            onPress: () => navigation.navigate('TelaDetalheDoacao', {doacao: item})
                        })}
                        contentContainerStyle={[
                            styles.listContent,
                            doacoes.length === 0 && styles.emptyListContent,
                            {paddingBottom: paddingInferior},
                        ]}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyCard}>
                                <View style={styles.iconContainer}>
                                    <MaterialDesignIcons
                                        name={doacoes.length === 0 ? "hand-heart-outline" : "magnify"}
                                        size={40}
                                        color={theme.colors.primaryVibrant}
                                    />
                                </View>

                                <Text style={styles.emptyTitle}>
                                    {doacoes.length === 0
                                        ? "Nenhuma doação registrada ainda"
                                        : "Nenhuma doação encontrada"}
                                </Text>

                                <Text style={styles.emptySubtitle}>
                                    {doacoes.length === 0
                                        ? "Que tal começar a fazer o bem? Registre a primeira doação!"
                                        : `Não encontramos resultados para "${busca}".`}
                                </Text>

                                {doacoes.length === 0 && (
                                    <Pressable
                                        style={({pressed}) => [
                                            styles.buttonCriar,
                                            pressed && styles.buttonCriarPressed,
                                        ]}
                                        onPress={onNovaDoacao}
                                        accessibilityRole="button"
                                        accessibilityLabel="Registrar Nova Doação"
                                    >
                                        <MaterialDesignIcons
                                            name="plus"
                                            size={22}
                                            color={theme.colors.textWhite}
                                        />
                                        <Text style={styles.buttonCriarText}>Registrar doação</Text>
                                    </Pressable>
                                )}
                            </View>
                        )}
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
    resumoCard: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing['2xl'],
        marginHorizontal: theme.spacing['2xl'],
        marginTop: theme.spacing.md,
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
            default: {},
        }),
    },
    resumoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    resumoTituloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    resumoIconWrapper: {
        width: 28,
        height: 28,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.iconSurface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resumoTitulo: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
    },
    resumoAcoesDireita: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    resumoBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    badgeTotalDoacoes: {
        backgroundColor: theme.colors.surfaceElevated,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    badgeTotalDoacoesTexto: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    badgeTotalItens: {
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    badgeTotalItensTexto: {
        color: theme.colors.primaryVibrant,
        fontSize: theme.fontSize.xs,
        fontWeight: '700',
    },
    divisorResumo: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginVertical: theme.spacing.md,
    },
    resumoVazio: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    resumoVazioTexto: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textMuted,
    },
    resumoListaScroll: {
        maxHeight: 120,
    },
    resumoLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
        gap: theme.spacing.sm,
    },
    resumoLinhaBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primaryVibrant,
    },
    resumoLinhaTexto: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    resumoTipoItem: {
        fontWeight: 'bold',
        color: theme.colors.textWhite,
    },
    resumoDetalheTexto: {
        color: theme.colors.textSecondary,
    },
    listContent: {
        paddingHorizontal: theme.spacing['2xl'],
        flexGrow: 1,
    },
    emptyListContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCard: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing['3xl'],
        paddingHorizontal: theme.spacing['2xl'],
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.iconSurface,
        borderWidth: 1,
        borderColor: theme.colors.borderMedium,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing['2xl'],
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.primary,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.25,
                shadowRadius: 10,
            },
            android: {
                elevation: 3,
            },
            default: {},
        }),
    },
    emptyTitle: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize['2xl'],
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    emptySubtitle: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
        lineHeight: 22,
        textAlign: 'center',
        maxWidth: 340,
        marginBottom: theme.spacing['3xl'],
    },
    buttonCriar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 46,
        paddingHorizontal: theme.spacing['3xl'],
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary,
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.primary,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
            web: {
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, transform 0.1s ease',
            } as any,
        }),
    },
    buttonCriarPressed: {
        backgroundColor: theme.colors.primaryPressed,
        opacity: Platform.OS === 'ios' ? 0.85 : 1,
        transform: [{scale: 0.98}],
    },
    buttonCriarText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
});
