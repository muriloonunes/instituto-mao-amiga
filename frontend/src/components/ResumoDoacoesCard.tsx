import {Pressable, View, Text, StyleSheet, Platform, ScrollView} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {theme} from "../theme/theme";
import {useState} from "react";
import {ResumoDoacoes} from "../screens/TelaDoacoes";

export function ResumoDoacoesCard({resumoDoacoes, totalDoacoes, totalItens}:{resumoDoacoes: ResumoDoacoes[], totalDoacoes: number, totalItens: number}) {
    const [resumoExpandido, setResumoExpandido] = useState(true);

    return (
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
    )
}

const styles = StyleSheet.create({
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
        minHeight: 44,
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
})