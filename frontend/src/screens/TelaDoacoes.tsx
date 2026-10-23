import React, {useCallback, useMemo, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    useWindowDimensions,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {theme} from "../theme/theme";
import {Doacao} from "../types/doacao";
import {CardDoacao} from "../components/CardDoacao";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {listarDoacoes} from "../services/doacoesStorage";
import {InputPesquisar} from "../components/InputPesquisar";
import {ResumoDoacoesCard} from "../components/ResumoDoacoesCard";
import {EmptyState} from "../components/EmptyState";
import Donate from "../../assets/donate.svg";
import NoResult from "../../assets/no-result.svg";

type TelaDoacoesProps = {
    onNovaDoacao?: () => void;
    atualizacaoKey?: number;
};

export type ResumoDoacoes = {
    tipoItem: string;
    quantidadeTotal: number;
    quantidadeDoacoes: number;
};

export function TelaDoacoes({onNovaDoacao, atualizacaoKey}: TelaDoacoesProps) {
    const navigation = useNavigation<any>();
    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;

    const paddingInferior = telaLarga ? theme.spacing['3xl'] : 65;

    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState('');
    const doacoesFiltradas = useMemo(() => {
        const termo = (busca || '').trim().toLowerCase();
        return doacoes.filter(doacao =>
            (doacao?.tipoItem ?? '').toLowerCase().includes(termo)
        );
    }, [doacoes, busca]);

    const totalDoacoes = doacoes.length;

    const totalItens = useMemo(() => {
        return doacoes.reduce((acc, curr) => acc + (Number(curr?.quantidade) || 0), 0);
    }, [doacoes]);

    const resumoDoacoes = useMemo<ResumoDoacoes[]>(() => {
        const mapaResumo = new Map<string, { quantidadeTotal: number; quantidadeDoacoes: number }>();

        doacoes.forEach(doacao => {
            if (!doacao) return;
            const tipo = doacao.tipoItem?.trim() || 'Outro';
            const atual = mapaResumo.get(tipo) || {quantidadeTotal: 0, quantidadeDoacoes: 0};

            mapaResumo.set(tipo, {
                quantidadeTotal: atual.quantidadeTotal + (Number(doacao.quantidade) || 0),
                quantidadeDoacoes: atual.quantidadeDoacoes + 1
            });
        });

        return Array.from(mapaResumo.entries())
            .map(([tipoItem, dados]) => ({
                tipoItem,
                quantidadeTotal: dados.quantidadeTotal,
                quantidadeDoacoes: dados.quantidadeDoacoes
            }))
            .sort((a, b) => b.quantidadeTotal - a.quantidadeTotal || a.tipoItem.localeCompare(b.tipoItem));
    }, [doacoes]);

    useFocusEffect(
        useCallback(() => {
            let ativo = true;

            async function carregar() {
                const doacoes = await listarDoacoes();
                if (ativo && doacoes) {
                    setDoacoes(doacoes);
                    setCarregando(false);
                }
            }

            carregar();

            return () => {
                ativo = false;
            };
        }, [atualizacaoKey])
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>
                Doações
            </Text>

            {carregando ? (
                <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardContainer}
                >
                    {busca.length === 0 && (
                        <ResumoDoacoesCard resumoDoacoes={resumoDoacoes} totalDoacoes={totalDoacoes}
                                           totalItens={totalItens}/>
                    )}
                    <InputPesquisar placeholder="Buscar doações" busca={busca} setBusca={setBusca}/>
                    <FlatList
                        data={doacoesFiltradas}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        renderItem={({item}) => CardDoacao({
                            doacao: item,
                            onPress: () => navigation.navigate('TelaDetalheDoacao', {doacao: item})
                        })}
                        contentContainerStyle={[
                            styles.listContent,
                            doacoes.length === 0 && styles.emptyListContent,
                            {paddingBottom: paddingInferior},
                        ]}
                        ListEmptyComponent={() => (
                            <EmptyState
                                icon={doacoes.length === 0
                                    ? <Donate width={300} height={180}/>
                                    : <NoResult width={250} height={250}/>
                                }
                                mensagem={
                                    doacoes.length === 0
                                        ? "Nenhuma doação registrada ainda."
                                        : "Nenhuma doação encontrada."
                                }
                                subtitulo={
                                    doacoes.length === 0
                                        ? "Que tal começar a fazer o bem? Registre a primeira doação!"
                                        : `Não encontramos resultados para "${busca}".`
                                }
                                botaoTexto={doacoes.length === 0 ? "Registrar doação" : undefined}
                                onBotaoPress={doacoes.length === 0 ? onNovaDoacao : undefined}
                            />
                        )}
                    />
                </KeyboardAvoidingView>
            )}
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
    listContent: {
        padding: theme.spacing['2xl'],
        flexGrow: 1,
    },
    emptyListContent: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
