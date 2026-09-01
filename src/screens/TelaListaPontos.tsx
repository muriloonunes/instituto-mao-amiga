import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {pontosMock} from "../mocks/pontosMock";
import {PontoItem} from "../components/PontoItem";
import {theme} from "../theme/theme";

function TelaListaPontos({navigation}: any) {
    const [busca, setBusca] = useState('')
    const pontosFiltrados = useMemo(() => {
        return pontosMock.filter(ponto => ponto.nome.toLowerCase().includes(busca.toLowerCase()))
    }, [busca])

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Pontos de Coleta</Text>
            <TextInput
                style={styles.inputBusca}
                placeholder="Buscar pontos..."
                placeholderTextColor={theme.colors.placeholder}
                value={busca}
                onChangeText={setBusca}
                autoCorrect={false}
            />
            <FlatList
                data={pontosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <PontoItem
                        ponto={item}
                        onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                    />
                )}
                contentContainerStyle={styles.listaContainer}
            />
        </SafeAreaView>
    );
}

export default TelaListaPontos;

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
    inputBusca: {
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        height: 50,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing['2xl'],
        fontSize: theme.fontSize.xl,
        marginHorizontal: theme.spacing['2xl'],
        marginTop: theme.spacing['2xl'],
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    listaContainer: {
        padding: theme.spacing['2xl'],
        paddingBottom: theme.spacing['3xl'],
    },
});
