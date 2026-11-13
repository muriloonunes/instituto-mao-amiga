import React from "react";
import {Ponto} from "../types/ponto";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {theme} from "../theme/theme";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export function CardItem({ponto, onPress}: { ponto: Ponto; onPress: () => void }) {
    const enderecoCompleto = ponto.bairro
        ? `${ponto.endereco} • ${ponto.bairro}`
        : ponto.endereco;

    const isDistribui = (ponto.tipo || '').toLowerCase().includes('distribui');
    const badgeLabel = isDistribui ? "Distribui" : "Coleta";

    return (
        <Pressable
            style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
            onPress={onPress}
        >
            <View style={styles.header}>
                <View style={styles.pontoInfo}>
                    <View style={styles.iconWrapper}>
                        <MaterialDesignIcons
                            name="map-marker"
                            size={18}
                            color={theme.colors.primaryVibrant}
                        />
                    </View>
                    <Text style={styles.nome} numberOfLines={1}>
                        {ponto.nome}
                    </Text>
                </View>
                <View style={[styles.badgeTipo, isDistribui ? styles.badgeDistribui : styles.badgeColeta]}>
                    <Text style={[styles.badgeTipoTexto, isDistribui ? styles.badgeDistribuiTexto : styles.badgeColetaTexto]}>
                        {badgeLabel}
                    </Text>
                </View>
            </View>

            <View style={styles.divisor}/>

            <View style={styles.footer}>
                <View style={styles.metaRow}>
                    <MaterialDesignIcons
                        name="map-marker-outline"
                        size={15}
                        color={theme.colors.textMuted}
                    />
                    <Text style={styles.metaText} numberOfLines={1}>
                        {enderecoCompleto}
                    </Text>
                </View>

                <View style={styles.metaRow}>
                    <MaterialDesignIcons
                        name="clock-outline"
                        size={15}
                        color={theme.colors.textMuted}
                    />
                    <Text style={styles.metaText} numberOfLines={1}>
                        {ponto.horario}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing['2xl'],
        marginBottom: theme.spacing['2xl'],
    },
    cardPressed: {
        opacity: 0.85,
        transform: [{scale: 0.99}],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    pontoInfo: {
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
    nome: {
        fontSize: theme.fontSize['2xl'],
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        flex: 1,
    },
    badgeTipo: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 3,
        borderRadius: theme.borderRadius.full,
    },
    badgeColeta: {
        backgroundColor: 'rgba(45, 212, 191, 0.14)',
    },
    badgeDistribui: {
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
    },
    badgeTipoTexto: {
        fontSize: 11,
        fontWeight: '700',
    },
    badgeColetaTexto: {
        color: '#2dd4bf',
    },
    badgeDistribuiTexto: {
        color: '#38bdf8',
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
        gap: 8,
    },
    metaText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        flex: 1,
    },
});
