import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, TextInput, useWindowDimensions} from 'react-native';
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {pontosMock} from "../mocks/pontosMock";
import {PontoItem} from "../components/PontoItem";
import {theme} from "../theme/theme";
import {NovaDoacaoModal} from "../components/NovaDoacaoModal";
import {Doacao} from "../types/doacao";
import {salvarDoacao} from "../services/doacoesStorage";

export function TelaListaPontos({navigation}: any) {
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [busca, setBusca] = useState('')
    const pontosFiltrados = useMemo(() => {
        return pontosMock.filter(ponto => ponto.nome.toLowerCase().includes(busca.toLowerCase()))
    }, [busca])

    const [modalVisible, setModalVisible] = useState(false);

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
            <NovaDoacaoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(doacao: Doacao) => {
                    salvarDoacao(doacao)
                }}
            />
            <FAB onPress={() => setModalVisible(true)}/>
            <FlatList
                data={pontosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <PontoItem
                        ponto={item}
                        onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                    />
                )}
                contentContainerStyle={[
                    styles.listaContainer,
                    {paddingBottom: paddingInferior}
                ]}
            />
        </SafeAreaView>
    );
}

export function FAB({onPress}: { onPress: () => void }) {
    return (
        <Pressable
            style={styles.floatingButton}
            onPress={onPress}
        >
            <MaterialDesignIcons name='plus' color='white' size={32}/>
        </Pressable>
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
    inputBusca: {
        backgroundColor: theme.colors.cardBackground,
        color: theme.colors.text,
        height: 50,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing['2xl'],
        fontSize: theme.fontSize.xl,
        marginHorizontal: theme.spacing['2xl'],
        marginTop: theme.spacing['2xl'],
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
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
