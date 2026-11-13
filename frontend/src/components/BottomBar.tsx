import React, {useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {TelaListaPontos} from "../screens/TelaListaPontos";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {TelaListaDoacoes} from "../screens/TelaListaDoacoes";
import {Platform, StyleSheet, useWindowDimensions, View, ViewStyle} from "react-native";
import {theme} from "../theme/theme";
import {BlurView} from "expo-blur";
import {ModalCadastro} from "./ModalCadastro";
import {salvarDoacao} from "../services/doacoesStorage";
import {Doacao} from "../types/doacao";
import {BottomBarFab} from "./BottomBarFab";
import {PontoCadastro} from "../types/ponto";
import {criarPonto} from "../services/pontosService";

const Tab = createBottomTabNavigator();

function getTabBarStyle(telaLarga: boolean): ViewStyle {
    if (Platform.OS === 'ios') {
        return telaLarga
            ? {
                width: 88,
                backgroundColor: "transparent",
                borderRightWidth: 0.33,
                borderRightColor: theme.colors.borderMedium,
            }
            : {
                position: "absolute",
                backgroundColor: "transparent",
                borderTopWidth: 0.33,
                borderTopColor: theme.colors.borderMedium,
                elevation: 0,
            };
    }

    if (Platform.OS === 'android') {
        return telaLarga
            ? {
                width: 80,
                backgroundColor: theme.colors.surfaceElevated,
                borderRightWidth: 1,
                borderRightColor: theme.colors.borderSubtle,
                paddingVertical: 16,
                elevation: 2,
            }
            : {
                position: "absolute",
                bottom: 18,
                left: 20,
                right: 20,
                height: 68,
                backgroundColor: theme.colors.surfaceElevated,
                borderRadius: 34,
                borderWidth: 1,
                borderColor: theme.colors.borderMedium,
                elevation: 8,
                paddingTop: 8,
                paddingBottom: 8,
                marginHorizontal: 8,
            };
    }

    return telaLarga
        ? {
            width: 96,
            borderRightWidth: 1,
            borderRightColor: theme.colors.borderSubtle,
            backgroundColor: theme.colors.surfaceElevated,
            paddingVertical: 16,
        }
        : {
            height: 68,
            borderTopWidth: 1,
            borderTopColor: theme.colors.borderMedium,
            backgroundColor: theme.colors.surfaceElevated,
        };
}

export function BottomBar() {
    const dimensions = useWindowDimensions();
    const [atualizacaoDoacaoKey, setAtualizacaoDoacaoKey] = useState(0);
    const [atualizacaoPontosKey, setAtualizacaoPontosKey] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const telaLarga = dimensions.width >= 768;

    const [abaAtiva, setAbaAtiva] = useState<'Pontos' | 'Doações'>('Pontos');

    return (
        <View style={styles.rootContainer}>
            <Tab.Navigator
                initialRouteName="Pontos"
                screenListeners={{
                    state: (e) => {
                        const state = e.data.state;
                        const rotaAtual = state.routes[state.index]?.name;
                        if (rotaAtual === 'Pontos' || rotaAtual === 'Doações') {
                            setAbaAtiva(rotaAtual);
                        }
                    }
                }}
                screenOptions={({route}) => ({
                    headerShown: false,
                    tabBarPosition: dimensions.width >= 768 ? 'left' : 'bottom',
                    tabBarVariant: telaLarga ? 'material' : 'uikit',
                    tabBarLabelPosition: 'below-icon',
                    tabBarActiveTintColor: theme.colors.primaryVibrant,
                    tabBarInactiveTintColor: theme.colors.textMuted,
                    tabBarStyle: getTabBarStyle(telaLarga),
                    tabBarLabelStyle: {
                        fontSize: Platform.select({ios: 10, android: 11, default: 11}),
                        fontWeight: Platform.select({
                            ios: "500",
                            android: "600",
                            default: "500",
                        }),
                        marginTop: Platform.select({ios: 1, android: 2, default: 2}),
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
                        } else {
                            return null;
                        }

                        if (Platform.OS === 'android') {
                            return (
                                <View
                                    style={[
                                        styles.androidPill,
                                        focused && {
                                            backgroundColor: theme.colors.primaryLight,
                                        },
                                    ]}
                                >
                                    <MaterialDesignIcons
                                        name={iconName as any}
                                        color={focused ? theme.colors.primaryVibrant : color}
                                        size={24}
                                    />
                                </View>
                            );
                        }

                        return <MaterialDesignIcons name={iconName as any} color={color} size={size}/>;
                    },
                })}
            >
                {telaLarga && (
                    <Tab.Screen
                        name={"NovaDoacao"}
                        component={View}
                        options={{
                            tabBarLabel: () => null,
                            tabBarItemStyle: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                            tabBarButton: (props) => (
                                <BottomBarFab
                                    {...props}
                                    onPress={() => setModalVisible(true)}
                                    telaLarga={telaLarga}
                                    abaAtiva={abaAtiva}
                                />
                            ),
                        }}
                        listeners={{
                            tabPress: (e) => {
                                e.preventDefault();
                                setModalVisible(true);
                            },
                        }}
                    />
                )}
                <Tab.Screen
                    name={"Pontos"}
                    options={{
                        tabBarLabel: "Pontos",
                    }}
                >
                    {() => <TelaListaPontos
                        onNovoPonto={() => setModalVisible(true)}
                        atualizacaoKey={atualizacaoPontosKey}
                    />}
                </Tab.Screen>
                {!telaLarga && (
                    <Tab.Screen
                        name={"NovaDoacao"}
                        component={View}
                        options={{
                            tabBarLabel: () => null,
                            tabBarItemStyle: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                            tabBarButton: (props) => (
                                <BottomBarFab
                                    {...props}
                                    onPress={() => setModalVisible(true)}
                                    telaLarga={telaLarga}
                                    abaAtiva={abaAtiva}
                                />
                            ),
                        }}
                        listeners={{
                            tabPress: (e) => {
                                e.preventDefault();
                                setModalVisible(true);
                            },
                        }}
                    />
                )}
                <Tab.Screen
                    name={"Doações"}
                    options={{
                        tabBarLabel: "Doações",
                    }}
                >
                    {() => <TelaListaDoacoes
                        onNovaDoacao={() => setModalVisible(true)}
                        atualizacaoKey={atualizacaoDoacaoKey}
                    />
                    }
                </Tab.Screen>
            </Tab.Navigator>

            <ModalCadastro
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                abaAberta={abaAtiva}
                onSaveDoacao={async (doacao: Doacao) => {
                    await salvarDoacao(doacao);
                    setAtualizacaoDoacaoKey(prev => prev + 1);
                }}
                onSavePonto={async (ponto: PontoCadastro) => {
                    await criarPonto(ponto);
                    setAtualizacaoPontosKey(prev => prev + 1);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    androidPill: {
        width: 64,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
});
