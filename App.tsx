import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="TelaListaPontos"
        screenOptions={{
          headerStyle: { backgroundColor: '#121214' },
          headerTintColor: '#00b37e',
          headerTitleStyle: { fontWeight: 'bold', color: '#f1f1f1' },
          cardStyle: { backgroundColor: '#121214' },
        }}
      >
        <Stack.Screen
          name="TelaListaPontos"
          component={TelaListaPontos}
          options={{ title: 'Pontos de Coleta' }}
        />
        <Stack.Screen
          name="TelaDetalhePonto"
          component={TelaDetalhePonto}
          options={{ title: 'Detalhes do Ponto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

