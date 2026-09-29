import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {TelaListaPontos} from "../screens/TelaListaPontos";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {TelaDoacoes} from "../screens/TelaDoacoes";
import {Platform, useWindowDimensions, StyleSheet, View} from "react-native";
import {theme} from "../theme/theme";
import {BlurView} from "expo-blur";

const Tab = createBottomTabNavigator();

export function BottomBar() {
    const dimensions = useWindowDimensions();

    const telaLarga = dimensions.width >= 768;
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarPosition: dimensions.width >= 768 ? 'left' : 'bottom',
                tabBarVariant: telaLarga ? 'material' : 'uikit',
                tabBarLabelPosition: 'below-icon',
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarStyle: Platform.select({
                    ios: telaLarga
                        ? {
                            width: 88,
                            backgroundColor: "transparent",
                            borderRightWidth: 0.33,
                            borderRightColor: "rgba(60, 60, 67, 0.29)",
                        }
                        : {
                            position: "absolute",
                            backgroundColor: "transparent",
                            borderTopWidth: 0.33,
                            borderTopColor: "rgba(60, 60, 67, 0.29)",
                            elevation: 0,
                        },

                    android: telaLarga
                        ? {
                            width: 80,
                            backgroundColor: theme.colors.cardBackground,
                            borderRightWidth: 1,
                            borderRightColor: theme.colors.cardBorder,
                            paddingVertical: 16,
                            elevation: 2,
                        }
                        : {
                            position: "absolute",
                            bottom: 16,
                            left: 20,
                            right: 20,
                            height: 68,
                            backgroundColor: theme.colors.cardBackground,
                            borderRadius: 34,
                            borderWidth: 1,
                            borderColor: theme.colors.cardBorder,
                            elevation: 8,
                            paddingTop: 8,
                            paddingBottom: 8,
                            overflow: "hidden",
                        },

                    default: {
                        ...(telaLarga
                            ? {
                                width: 96,
                                borderRightWidth: 1,
                                borderRightColor: theme.colors.cardBorder,
                                backgroundColor: theme.colors.cardBackground,
                            }
                            : {
                                height: 68,
                                borderTopWidth: 1,
                                borderTopColor: theme.colors.cardBorder,
                                backgroundColor: theme.colors.cardBackground,
                            }),
                    },
                }),
                tabBarLabelStyle: {
                    fontSize: Platform.select({ ios: 10, android: 11, default: 11 }),
                    fontWeight: Platform.select({
                        ios: "500",
                        android: "600",
                        default: "500",
                    }),
                    marginTop: Platform.select({ ios: 1, android: 2, default: 2 }),
                },
                tabBarBackground: () =>
                    Platform.OS === 'ios' ? (
                        <BlurView
                            tint="systemChromeMaterial"
                            intensity={95}
                            style={StyleSheet.absoluteFill}
                        />
                    ) : null,
                tabBarIcon: ({focused, color, size}) => {
                    let iconName: string = '';

                    if (route.name === 'Pontos') {
                        iconName = focused ? 'map-marker' : 'map-marker-outline';
                    } else if (route.name === 'Doações') {
                        iconName = focused ? 'hand-heart' : 'hand-heart-outline';
                    }

                    if (Platform.OS === 'android') {
                        return (
                            <View
                                style={[
                                    styles.androidPill,
                                    focused && {
                                        backgroundColor: theme.colors.primaryLight || '#EADDFF',
                                    },
                                ]}
                            >
                                <MaterialDesignIcons
                                    name={iconName as any}
                                    color={focused ? theme.colors.primary : color}
                                    size={24}
                                />
                            </View>
                        );
                    }

                    return <MaterialDesignIcons name={iconName as any} color={color} size={size}/>
                },

            })}
        >
            <Tab.Screen
                name={"Pontos"}
                component={TelaListaPontos}
                options={{
                    tabBarLabel: "Pontos",
                }}
            />
            <Tab.Screen
                name={"Doações"}
                component={TelaDoacoes}
                options={{
                    tabBarLabel: "Doações",
                }}
            />

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    androidPill: {
        width: 64,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
});