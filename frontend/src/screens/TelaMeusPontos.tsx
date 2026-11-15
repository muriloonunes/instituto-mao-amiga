import {ActivityIndicator, FlatList, StyleSheet, View} from "react-native";
import React, {useCallback, useState} from "react";
import {Ponto} from "../types/ponto";
import {alternarFavorito, listarFavoritos} from "../services/favoritosStorage";
import {buscarPontoPorId} from "../services/pontosService";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {ErroState} from "../components/ErroState";
import NoFavorites from '../../assets/svg/no-favorites.svg'
import {EmptyState} from "../components/EmptyState";
import {theme} from "../theme/theme";
import {CardPonto} from "../components/CardPonto";
import {ApiError} from "../types/api";
import Toast from "react-native-toast-message";


export function TelaMeusPontos() {
    const navigation = useNavigation<any>()

    const [pontosFavoritos, setPontosFavoritos] = useState<Ponto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<ApiError | null>(null);

    useFocusEffect(
        useCallback(() => {
            let ativo = true;

            async function carregar() {
                setCarregando(true);
                setErro(null)
                const ids = await listarFavoritos();

                if (ids.length === 0) {
                    if (ativo) {
                        setPontosFavoritos([]);
                        setCarregando(false)
                    }
                    return;
                }

                try {
                    const resultados = await Promise.allSettled(
                        ids.map((id) => buscarPontoPorId(id))
                    );

                    const pontosCarregados = resultados
                        .filter((res): res is PromiseFulfilledResult<Ponto> => res.status === 'fulfilled')
                        .map((res) => res.value);

                    if (ativo) {
                        setPontosFavoritos(pontosCarregados);
                    }
                } catch (error) {
                    console.error("Erro ao carregar favoritos:", error);
                    if (ativo) {
                        setErro(error instanceof ApiError ? error : new ApiError(-1, "Não foi possível carregar os favoritos."));
                    }
                } finally {
                    if (ativo) {
                        setCarregando(false);
                    }
                }
            }

            carregar();

            return () => {
                ativo = false;
            };
        }, [])
    );

    async function onDesmarcarFavorito(pontoId: number) {
        setPontosFavoritos(prev => prev.filter(p => p.id !== pontoId));

        try {
            await alternarFavorito(pontoId);
            Toast.show({
                type: 'info',
                text1: 'Ponto desfavoritado com sucesso.'

            })
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Não foi possível desfavoritar o ponto.'
            })
        }
    }

    const renderEmptyComponent = () => {
        if (erro) {
            return (
                <ErroState
                    erro={erro}
                    fallback={'Ocorreu um erro ao carregar os favoritos.'}
                />
            )
        }

        if (pontosFavoritos.length === 0) {
            return (
                <EmptyState
                    icon={<NoFavorites width={140} height={210}/>}
                    mensagem={'Nenhum ponto favorito'}
                    subtitulo="Você ainda não favoritou nenhum ponto de coleta."
                />
            )
        }
    }

    return (
        <View style={styles.container}>
            {carregando ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primaryVibrant}/>
                </View>
            ) : (
                <FlatList
                    data={pontosFavoritos}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({item}) => (
                        <CardPonto
                            ponto={item}
                            onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                            isFavorito={true}
                            onToggleFavorito={() => onDesmarcarFavorito(item.id)}

                        />
                    )}
                    contentContainerStyle={pontosFavoritos.length === 0 ? styles.listaVazia : undefined}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing['2xl'],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listaVazia: {
        flexGrow: 1,
        justifyContent: 'center',
    },
})