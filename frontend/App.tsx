import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TelaDetalhePonto} from './src/screens/TelaDetalhePonto';
import {theme} from './src/theme/theme';
import {BottomBar} from "./src/components/BottomBar";
import {TelaDetalheDoacao} from "./src/screens/TelaDetalheDoacao";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="light"/>
            <Stack.Navigator
                initialRouteName="Abas"
                screenOptions={{
                    headerStyle: {backgroundColor: theme.colors.background},
                    headerTintColor: theme.colors.primary,
                    headerTitleStyle: {fontWeight: 'bold'},
                    contentStyle: {backgroundColor: theme.colors.background},
                }}
            >
                <Stack.Screen
                    name="Abas"
                    component={BottomBar}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TelaDetalhePonto"
                    component={TelaDetalhePonto}
                    options={{title: 'Detalhes do Ponto'}}
                />
                <Stack.Screen
                    name={"TelaDetalheDoacao"}
                    component={TelaDetalheDoacao}
                    options={{title: 'Detalhes da Doação'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

