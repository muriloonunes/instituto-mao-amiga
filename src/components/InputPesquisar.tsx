import {Pressable, StyleSheet, TextInput, View} from "react-native";
import {theme} from "../theme/theme";
import React from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export function InputPesquisar(
    {placeholder, busca, setBusca}: {placeholder: string, busca: string; setBusca: (value: string) => void}
) {
    return (
        <View style={styles.containerBusca}>
            <TextInput
                style={styles.inputBusca}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.placeholder}
                value={busca}
                onChangeText={setBusca}
                autoCorrect={false}
            />
            {busca.length > 0 && (
                <Pressable
                    style={({pressed}) => [
                        styles.botaoLimpar,
                        pressed && styles.botaoLimparPressionado,
                    ]}
                    onPress={() => setBusca('')}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar busca"
                >
                    <MaterialDesignIcons
                        name="close-circle"
                        size={20}
                        color={theme.colors.textMuted}
                    />
                </Pressable>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    containerBusca: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.cardBackground,
        height: 50,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing['2xl'],
        marginHorizontal: theme.spacing['2xl'],
        marginTop: theme.spacing['2xl'],
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    inputBusca: {
        flex: 1,
        height: '100%',
        color: theme.colors.text,
        fontSize: theme.fontSize.xl,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    botaoLimpar: {
        padding: theme.spacing.xs,
        marginLeft: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoLimparPressionado: {
        opacity: 0.6,
    },
})