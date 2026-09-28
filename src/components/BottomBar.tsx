import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {TelaListaPontos} from "../screens/TelaListaPontos";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {TelaDoacoes} from "../screens/TelaDoacoes";
import {useWindowDimensions} from "react-native";
import {theme} from "../theme/theme";

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
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarStyle: {
                    backgroundColor: theme.colors.cardBackground,
                    borderTopColor: theme.colors.cardBorder,
                    borderTopWidth: 1,
                    height: telaLarga ? undefined : 70,
                    paddingBottom: telaLarga ? undefined : 15,
                },
                tabBarLabelStyle: {
                    fontSize: theme.fontSize.xs,
                    fontWeight: '600',
                },
                tabBarIcon: ({focused, color, size}) => {
                    let iconName: string = '';

                    if (route.name === 'Pontos') {
                        iconName = focused ? 'map-marker' : 'map-marker-outline';
                    } else if (route.name === 'Doações') {
                        iconName = focused ? 'hand-heart' : 'hand-heart-outline';
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