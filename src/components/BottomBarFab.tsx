import {Platform, Pressable, StyleSheet, View, Text} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {theme} from "../theme/theme";

export function BottomBarFab({onPress, telaLarga}: {
    onPress?: () => void;
    telaLarga: boolean;
}) {
    const isAndroid = Platform.OS === 'android';
    const isIOS = Platform.OS === 'ios';

    return (
        <View
            style={[
                styles.fabContainer,
                telaLarga ? styles.fabContainerRail : styles.fabContainerBottom,
            ]}
            pointerEvents="box-none"
        >
            <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel="Registrar Nova Doação"
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                style={({pressed, hovered}: any) => [
                    styles.fabButton,
                    isAndroid && styles.fabButtonAndroid,
                    isIOS && styles.fabButtonIOS,
                    telaLarga && styles.fabButtonRail,
                    hovered && styles.fabHovered,
                    pressed && styles.fabPressed,
                ]}
            >
                <MaterialDesignIcons name="plus" color={theme.colors.textWhite} size={28}/>
            </Pressable>
            {telaLarga && (
                <Text style={styles.fabRailLabel}>Doar</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabContainerBottom: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabContainerRail: {
        marginVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabButton: {
        width: 50,
        height: 50,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: {
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 179, 126, 0.4)',
                transition: 'all 0.15s ease-in-out',
            } as any,
        }),
    },
    fabButtonAndroid: {
        borderRadius: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabButtonIOS: {
        borderRadius: 25,
        shadowColor: theme.colors.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.45,
        shadowRadius: 6,
    },
    fabButtonRail: {
        width: 48,
        height: 48,
        borderRadius: 16,
    },
    fabHovered: {
        backgroundColor: '#00c78c',
        transform: [{scale: 1.06}],
    },
    fabPressed: {
        transform: [{scale: 0.94}],
        opacity: 0.9,
    },
    fabRailLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.textMuted,
        marginTop: 4,
    },
})