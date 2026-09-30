import {Doacao} from "../types/doacao";
import {pontosMock} from "../mocks/pontosMock";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {theme} from "../theme/theme";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export function CardDoacao({doacao, onPress}: { doacao: Doacao, onPress: () => void }) {
    const ponto = pontosMock.find(ponto => ponto.id === doacao.pontoId);

    const dataFormatada = new Date(doacao.criadoEm).toLocaleDateString();

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <View style={styles.itemInfo}>
                    <View style={styles.iconWrapper}>
                        <MaterialDesignIcons
                            name="heart-outline"
                            size={18}
                            color={theme.colors.primaryVibrant}
                        />
                    </View>
                    <Text style={styles.tipoItem} numberOfLines={1}>
                        {doacao.tipoItem}
                    </Text>
                </View>
                <View style={styles.badgeQtd}>
                    <Text style={styles.badgeQtdText}>
                        {doacao.quantidade} {doacao.quantidade === 1 ? 'item' : 'itens'}
                    </Text>
                </View>
            </View>
            <View style={styles.divisor}/>
            <View style={styles.footer}>
                <View style={styles.metaRow}>
                    <MaterialDesignIcons
                        name="map-marker-outline"
                        size={16}
                        color={theme.colors.textMuted}
                    />
                    <Text style={styles.metaText} numberOfLines={1}>
                        {ponto ? ponto.nome : 'Ponto não identificado'}
                    </Text>
                </View>
                <View style={styles.metaRow}>
                    <MaterialDesignIcons
                        name="calendar-outline"
                        size={16}
                        color={theme.colors.textMuted}
                    />
                    <Text style={styles.metaText}>
                        {dataFormatada}
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing['2xl'],
        marginBottom: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        flex: 1,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.iconSurface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipoItem: {
        fontSize: theme.fontSize['2xl'],
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        flex: 1,
    },
    badgeQtd: {
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    badgeQtdText: {
        color: theme.colors.primaryVibrant,
        fontSize: theme.fontSize.sm,
        fontWeight: '700',
    },
    divisor: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginVertical: theme.spacing.md,
    },
    footer: {
        gap: theme.spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        flex: 1,
    },
});