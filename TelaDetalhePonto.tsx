import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Ponto, pontoMock} from './TelaListaPontos';

function PontoDetalhe({ponto}: { ponto: Ponto }) {
    return (
        <View style={styles.cardDetalhe}>
            <Text style={styles.nome}>{ponto.nome}</Text>

            <View style={styles.divisor}/>

            <Text style={styles.label}>📍 Endereço</Text>
            <Text style={styles.endereco}>{ponto.endereco}</Text>

            <Text style={styles.label}>🕒 Dias e Horários</Text>
            <Text style={styles.diasHorarios}>{ponto.diasHorarios}</Text>

            <Text style={styles.label}>📦 Atendimento</Text>
            <View style={styles.tagFuncionamento}>
                <Text style={styles.funcionamento}>{ponto.funcionamento}</Text>
            </View>
        </View>
    );
}

function TelaDetalhePonto({route}: any) {
    const {pontoId} = route.params;
    const ponto = pontoMock.find((item) => item.id === pontoId);

    if (!ponto) {
        return (
            <View style={styles.container}>
                <Text style={styles.erroText}>Ponto de coleta não encontrado.</Text>
            </View>
        );
    }

    return (
        <View>
            <PontoDetalhe ponto={ponto}/>
        </View>
    );
}

export default TelaDetalhePonto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121214',
    },
    detalheScroll: {
        padding: 16,
        paddingBottom: 32,
    },
    cardDetalhe: {
        backgroundColor: '#202024',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#29292e',
        width: '100%',
    },
    nome: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f1f1f1',
        marginBottom: 8,
    },
    divisor: {
        height: 1,
        backgroundColor: '#29292e',
        marginVertical: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00b37e',
        marginTop: 12,
        marginBottom: 4,
    },
    endereco: {
        fontSize: 15,
        color: '#c4c4cc',
        lineHeight: 22,
    },
    diasHorarios: {
        fontSize: 14,
        color: '#8d8d99',
        lineHeight: 20,
    },
    tagFuncionamento: {
        backgroundColor: '#121214',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 6,
        alignSelf: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: '#00b37e',
    },
    funcionamento: {
        fontSize: 13,
        fontWeight: '600',
        color: '#00b37e',
        lineHeight: 18,
    },
    erroText: {
        color: '#f75a68',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
    },
});
