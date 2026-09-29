import React from "react";
import {
    FlatList,
    Platform,
    Pressable,
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
import {useNavigation} from "@react-navigation/native";

type TelaDoacoesProps = {
    doacoes: Doacao[];
    onNovaDoacao?: () => void;
};

export function TelaDoacoes({doacoes, onNovaDoacao}: TelaDoacoesProps) {
    const navigation = useNavigation<any>();
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>
                Doações
            </Text>

            <FlatList
                data={doacoes}
                keyExtractor={(item) => item.id.toString()}
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
                                name="hand-heart-outline"
                                size={40}
                                color={theme.colors.primaryVibrant}
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            Nenhuma doação registrada ainda
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Que tal começar a fazer o bem? Registre a primeira doação!
                        </Text>

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
                    </View>
                )}
            />
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
        marginBottom: theme.spacing.md,
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
