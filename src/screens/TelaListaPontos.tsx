import React, {useMemo, useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, useWindowDimensions} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {pontosMock} from "../mocks/pontosMock";
import {CardItem} from "../components/CardItem";
import {theme} from "../theme/theme";
import {InputPesquisar} from "../components/InputPesquisar";

export function TelaListaPontos({navigation}: any) {
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [busca, setBusca] = useState('');
    const pontosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return pontosMock.filter(ponto => ponto.nome.toLowerCase().includes(termo));
    }, [busca]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Pontos de Coleta</Text>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardContainer}
            >
                <InputPesquisar placeholder="Buscar pontos" busca={busca} setBusca={setBusca}/>
                <FlatList
                    data={pontosFiltrados}
                    keyExtractor={(item) => item.id.toString()}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    renderItem={({item}) => (
                        <CardItem
                            ponto={item}
                            onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                        />
                    )}
                    contentContainerStyle={[
                        styles.listaContainer,
                        {paddingBottom: paddingInferior}
                    ]}
                />
            </KeyboardAvoidingView>
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
    },
    keyboardContainer: {
        flex: 1,
    },
    listaContainer: {
        padding: theme.spacing['2xl'],
    },
    floatingButton: {
        backgroundColor: theme.colors.primary,
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        right: 20,
        elevation: 5,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 999,
    },
});
