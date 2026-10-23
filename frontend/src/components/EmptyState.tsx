import {Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {theme} from "../theme/theme";
import Empty from '../../assets/empty.svg'
import React, {ReactNode} from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";


interface EmptyStateProps {
    icon?: ReactNode;
    mensagem: string;
    subtitulo?: string;
    botaoTexto?: string;
    onBotaoPress?: () => void;
}

export function EmptyState({icon, mensagem, subtitulo, botaoTexto, onBotaoPress}: EmptyStateProps) {
    return (
        <View style={styles.container}>
            {icon ?? <Empty width={300} height={250}/>}
            <Text style={styles.texto}>{mensagem}</Text>
            {subtitulo && <Text style={styles.subtexto}>{subtitulo}</Text>}

            {botaoTexto && onBotaoPress && (
                <Pressable
                    style={({pressed}) => [
                        styles.buttonCriar,
                        pressed && styles.buttonCriarPressed,
                    ]}
                    onPress={onBotaoPress}
                    accessibilityRole="button"
                    accessibilityLabel={botaoTexto}
                >
                    <MaterialDesignIcons
                        name="plus"
                        size={22}
                        color={theme.colors.textWhite}
                    />
                    <Text style={styles.buttonCriarText}>{botaoTexto}</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing['2xl'],
        paddingVertical: theme.spacing['3xl'],
    },
    imagem: {
        width: 220,
        height: 220,
        marginBottom: theme.spacing['xl'],
    },
    texto: {
        fontSize: theme.fontSize['xl'],
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
    },
    subtexto: {
        fontSize: theme.fontSize['lg'],
        color: theme.colors.textMuted || '#888',
        textAlign: 'center',
        marginTop: theme.spacing['xs'],
    },
    buttonCriar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 46,
        marginTop: 8,
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