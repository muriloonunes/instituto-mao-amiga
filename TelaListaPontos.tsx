import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export type Ponto = {
    id: number;
    nome: string;
    endereco: string;
    diasHorarios: string;
    funcionamento: string;
};

export const pontoMock: Ponto[] = [
    {
        id: 1,
        nome: "Catedral Bom Jesus",
        endereco: "Praça Dom José, 120 - Bairro Capelinha",
        diasHorarios: "Segunda a Sexta, das 07h às 19h\nSábado e Domingo, das 08h às 18h",
        funcionamento: "Recebe: Roupas, agasalhos e mantas"
    },
    {
        id: 2,
        nome: "Escola Estadual João Afonso",
        endereco: "Rua das Palmeiras, 450 - Bairro Marajó",
        diasHorarios: "Segunda a Sexta, das 08h às 17h",
        funcionamento: "Recebe: Material escolar, uniformes e calçados\nEntrega: Kits para alunos necessitados"
    },
    {
        id: 3,
        nome: "Centro Comunitário Dona Xanda",
        endereco: "Avenida da Solidariedade, 300 - Centro",
        diasHorarios: "Segunda a Sábado, das 08h às 18h",
        funcionamento: "Recebe: Alimentos não perecíveis, brinquedos e agasalhos"
    },
    {
        id: 4,
        nome: "EcoPonto Amigo da Terra",
        endereco: "Rua dos Pinheiros, 88 - Bairro Jardim América",
        diasHorarios: "Segunda a Sexta, das 08h às 17h\nSábado, das 08h às 12h",
        funcionamento: "Recebe: Eletrônicos, pilhas, baterias e tampinhas plásticas"
    },
    {
        id: 5,
        nome: "Instituto Mão Amiga - Sede Central",
        endereco: "Rua da Esperança, 1500 - Bairro Boa Vista",
        diasHorarios: "Segunda a Sexta, das 08h às 19h\nSábado, das 09h às 14h",
        funcionamento: "Recebe: Alimentos, roupas, móveis e eletrodomésticos"
    },
    {
        id: 6,
        nome: "Bazar Solidário Esperança",
        endereco: "Alameda das Hortênsias, 72 - Bairro das Flores",
        diasHorarios: "Terça a Domingo, das 09h às 17h",
        funcionamento: "Recebe: Roupas, acessórios e utensílios domésticos"
    },
    {
        id: 7,
        nome: "Paróquia São Francisco de Assis",
        endereco: "Rua Frei Galvão, 55 - Bairro São Luiz",
        diasHorarios: "Segunda a Sexta, das 08h às 18h\nSábado, das 08h às 12h",
        funcionamento: "Recebe: Cobertores, agasalhos e itens de higiene pessoal"
    },
    {
        id: 8,
        nome: "Espaço Cultural Sol Nascente",
        endereco: "Avenida Brasil, 2040 - Bairro Novo Horizonte",
        diasHorarios: "Quarta a Domingo, das 10h às 20h",
        funcionamento: "Recebe: Livros, brinquedos pedagógicos e instrumentos musicais"
    }
];

function PontoItem({ponto, onPress}: { ponto: Ponto; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <Text style={styles.nome}>{ponto.nome}</Text>
            <Text style={styles.endereco}>📍 {ponto.endereco}</Text>
            <Text style={styles.diasHorarios}>🕒 {ponto.diasHorarios}</Text>
            <View style={styles.tagFuncionamento}>
                <Text style={styles.funcionamento}>{ponto.funcionamento}</Text>
            </View>
        </TouchableOpacity>
    );
}

function TelaListaPontos({navigation}: any) {
    return (
        <View style={styles.container}>
            <FlatList
                data={pontoMock}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <PontoItem
                        ponto={item}
                        onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                    />
                )}
                contentContainerStyle={styles.listaContainer}
            />
        </View>
    );
}

export default TelaListaPontos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121214',
    },
    listaContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#202024',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#29292e',
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f1f1f1',
        marginBottom: 8,
    },
    endereco: {
        fontSize: 14,
        color: '#c4c4cc',
        marginBottom: 6,
        lineHeight: 20,
    },
    diasHorarios: {
        fontSize: 13,
        color: '#8d8d99',
        marginBottom: 12,
        lineHeight: 18,
    },
    tagFuncionamento: {
        backgroundColor: '#121214',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        borderLeftWidth: 3,
        borderLeftColor: '#00b37e',
    },
    funcionamento: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00b37e',
    },
});
