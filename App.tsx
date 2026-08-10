import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';

type Ponto = {
    id: number
    nome: string,
    endereco: string,
    diasHorarios: string,
    funcionamento: string
};

const pontoMock: Ponto[] = [
    {
        id: 1,
        nome: "Catedral Bom Jesus",
        endereco: "Rua Feliz Numero 32 Bairro Capelinha",
        diasHorarios: "Segunda - Sexta, das 6h as 22h\nSabado e Domingo das 10h as 20h",
        funcionamento: "Recebe: roupas"
    },
    {
        id: 2,
        nome: "Escola Joao Afonso",
        endereco: "Rua das Palmeiras Numero 1 Bairro Marajo",
        diasHorarios: "Segunda - Sexta, das 8h as 18h",
        funcionamento: "Recebe: Roupas e calçados\nEntregam: Roupas e calçados"
    },
    {
        id: 3,
        nome: "Loja Do Xandao",
        endereco: "Avenida Felicidade Numero 3 Centro",
        diasHorarios: "Segunda - Sexta, das 8h as 18h",
        funcionamento: "Recebe: Roupas, calçados, brinquedos"
    }
]

function PontoItem({ponto}: { ponto: Ponto }) {
    return (
        <View style={styles.card}>
            <Text style={styles.nome}>{ponto.nome}</Text>
            <Text style={styles.endereco}>📍 {ponto.endereco}</Text>
            <Text style={styles.diasHorarios}>🕒 {ponto.diasHorarios}</Text>
            <View style={styles.tagFuncionamento}>
                <Text style={styles.funcionamento}>{ponto.funcionamento}</Text>
            </View>
        </View>
    );
}

export function TelaListaPontos() {
    return (<View style={styles.listaContainer}>
        {pontoMock.map((ponto) => (
            <PontoItem key={ponto.id} ponto={ponto}/>
        ))}
    </View>)
}

function DetalhePonto({ponto}: { ponto: Ponto }) {
    return (
        <View style={styles.cardDetalhe}>
            <Text style={styles.nome}>{ponto.nome}</Text>
            <Text style={styles.endereco}>📍 {ponto.endereco}</Text>
            <Text style={styles.diasHorarios}>🕒 {ponto.diasHorarios}</Text>
            <View style={styles.tagFuncionamento}>
                <Text style={styles.funcionamento}>{ponto.funcionamento}</Text>
            </View>
        </View>
    );
}

export function TelaDetalhePonto() {
    return <DetalhePonto ponto={pontoMock[0]}/>;
}

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="light"/>
            <TelaListaPontos/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121214',
        paddingTop: 60,
        paddingHorizontal: 16,
    },
    listaContainer: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#202024',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#29292e',
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
