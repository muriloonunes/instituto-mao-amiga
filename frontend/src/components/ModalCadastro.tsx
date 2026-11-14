import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import {theme} from "../theme/theme";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import React, {useEffect, useRef, useState} from "react";
import {Doacao, DoacaoCadastro} from "../types/doacao";
import {DoacaoCadastroForm, DoacaoFormHandle} from "./DoacaoCadastroForm";
import {PontoCadastroForm, PontoFormHandle} from "./PontoCadastroForm";
import {Ponto, PontoCadastro} from "../types/ponto";
import Toast from "react-native-toast-message";
import {getMensagemErro} from "../utils/erros";

type ModalCadastroProps = {
    visible: boolean;
    onClose: () => void;
    abaAberta: 'Pontos' | 'Doações';
    onSavePonto?: (ponto: PontoCadastro) => Promise<void> | void;
    onSaveDoacao?: (doacao: DoacaoCadastro) => Promise<void> | void;
    doacaoExistente?: Doacao;
    pontoExistente?: Ponto;
};

export function ModalCadastro(
    {visible, onClose, abaAberta, onSaveDoacao, onSavePonto, doacaoExistente, pontoExistente}: ModalCadastroProps
) {
    const [abaSelecionada, setAbaSelecionada] = useState<'Pontos' | 'Doações'>(abaAberta);
    const [carregandoForm, setCarregandoForm] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroSalvar, setErroSalvar] = useState<string | null>(null);
    const [tabContainerWidth, setTabContainerWidth] = useState(0);

    const tabPosition = useRef(new Animated.Value(abaAberta === 'Pontos' ? 0 : 1)).current;
    const formOpacity = useRef(new Animated.Value(1)).current;
    const formTranslateX = useRef(new Animated.Value(0)).current;

    const doacaoFormRef = useRef<DoacaoFormHandle>(null);
    const pontoFormRef = useRef<PontoFormHandle>(null);

    const {width} = useWindowDimensions();
    const telaLarga = width >= 768;
    const paddingInferior = (telaLarga ? theme.spacing['3xl'] : 65);

    useEffect(() => {
        if (visible) {
            setAbaSelecionada(abaAberta);
            setSalvando(false);
            setErroSalvar(null);
            tabPosition.setValue(abaAberta === 'Pontos' ? 0 : 1);
            formOpacity.setValue(1);
            formTranslateX.setValue(0);
        }
    }, [visible, abaAberta]);

    function trocarAba(novaAba: 'Pontos' | 'Doações') {
        if (novaAba === abaSelecionada) return;
        setErroSalvar(null);

        const offsetInicial = novaAba === 'Doações' ? 14 : -14;

        Animated.spring(tabPosition, {
            toValue: novaAba === 'Pontos' ? 0 : 1,
            tension: 70,
            friction: 10,
            useNativeDriver: true,
        }).start();

        formOpacity.setValue(0);
        formTranslateX.setValue(offsetInicial);
        setAbaSelecionada(novaAba);

        Animated.parallel([
            Animated.timing(formOpacity, {
                toValue: 1,
                duration: 160,
                useNativeDriver: true,
            }),
            Animated.timing(formTranslateX, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();
    }

    function handleSalvar() {
        if (salvando) return;
        if (abaSelecionada === 'Pontos') {
            pontoFormRef.current?.submit();
        } else if (abaSelecionada === 'Doações') {
            doacaoFormRef.current?.submit();
        }
    }

    async function handleSalvarPonto(ponto: PontoCadastro) {
        try {
            setSalvando(true);
            setErroSalvar(null);
            await onSavePonto?.(ponto);
            onClose();
            if (!pontoExistente) {
                Toast.show({
                    type: 'success',
                    text1: 'Ponto cadastrado com sucesso.',
                    bottomOffset: paddingInferior + 25
                })
            }
        } catch (error) {
            setErroSalvar(getMensagemErro(error, {fallback: 'Não foi possível cadastrar o ponto.'}));
        } finally {
            setSalvando(false);
        }
    }

    async function handleSalvarDoacao(doacao: DoacaoCadastro) {
        try {
            setSalvando(true);
            setErroSalvar(null);
            await onSaveDoacao?.(doacao);
            onClose();
            if (!doacaoExistente) {
                Toast.show({
                    type: 'success',
                    text1: 'Doação cadastrada com sucesso.',
                    bottomOffset: paddingInferior + 25
                })
            }
        } catch (error) {
            setErroSalvar(getMensagemErro(error, {fallback: 'Não foi possível salvar a doação.'}));
        } finally {
            setSalvando(false);
        }
    }

    const isEdicao = !!doacaoExistente || !!pontoExistente;
    let titulo = '';

    if (abaSelecionada === 'Pontos') {
        titulo = pontoExistente ? 'Editar Ponto' : 'Registrar Novo Ponto';
    } else if (abaSelecionada === 'Doações') {
        titulo = doacaoExistente ? 'Editar Doação' : 'Registrar Nova Doação';
    }

    const desabilitarSalvar = carregandoForm || salvando;

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalBackdrop}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />
                <View style={styles.modalCard}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderTitleGroup}>
                            <View style={styles.modalHeaderIconContainer}>
                                <MaterialDesignIcons
                                    name={isEdicao ? "pencil" : "plus-box-outline"}
                                    size={20}
                                    color={theme.colors.primaryVibrant}
                                />
                            </View>
                            <Text style={styles.modalTitle}>{titulo}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <MaterialDesignIcons name="close" size={20} color={theme.colors.textMuted}/>
                        </TouchableOpacity>
                    </View>

                    {!isEdicao && (
                        <View
                            style={styles.tabSelectorContainer}
                            onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
                        >
                            {tabContainerWidth > 0 && (
                                <Animated.View
                                    style={[
                                        styles.tabIndicator,
                                        {
                                            width: (tabContainerWidth - 8) / 2,
                                            transform: [
                                                {
                                                    translateX: tabPosition.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, (tabContainerWidth - 8) / 2],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                />
                            )}

                            <Pressable
                                style={styles.tabButton}
                                onPress={() => trocarAba('Pontos')}
                            >
                                <MaterialDesignIcons
                                    name="map-marker-outline"
                                    size={16}
                                    color={abaSelecionada === 'Pontos' ? theme.colors.primaryVibrant : theme.colors.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.tabButtonText,
                                        abaSelecionada === 'Pontos' && styles.tabButtonTextActive
                                    ]}
                                >
                                    Ponto
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.tabButton}
                                onPress={() => trocarAba('Doações')}
                            >
                                <MaterialDesignIcons
                                    name="hand-heart-outline"
                                    size={16}
                                    color={abaSelecionada === 'Doações' ? theme.colors.primaryVibrant : theme.colors.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.tabButtonText,
                                        abaSelecionada === 'Doações' && styles.tabButtonTextActive
                                    ]}
                                >
                                    Doações
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    <View style={styles.modalBody}>
                        <Animated.View
                            style={[
                                styles.animatedFormWrapper,
                                {
                                    opacity: formOpacity,
                                    transform: [{translateX: formTranslateX}],
                                },
                            ]}
                        >
                            {abaSelecionada === 'Pontos' ? (
                                <PontoCadastroForm
                                    pontoExistente={pontoExistente}
                                    onSave={handleSalvarPonto}
                                    ref={pontoFormRef}
                                />
                            ) : (
                                <DoacaoCadastroForm
                                    ref={doacaoFormRef}
                                    doacaoExistente={doacaoExistente}
                                    onCarregandoChange={setCarregandoForm}
                                    onSave={handleSalvarDoacao}
                                />
                            )}
                        </Animated.View>
                    </View>

                    {erroSalvar && (
                        <View style={styles.alertaErroModal}>
                            <MaterialDesignIcons name="alert-circle-outline" size={18} color={theme.colors.danger}/>
                            <Text style={styles.alertaErroTexto}>{erroSalvar}</Text>
                        </View>
                    )}

                    <View style={styles.modalFooter}>
                        <Pressable
                            style={({pressed}) => [
                                styles.buttonCancel,
                                {opacity: pressed ? 0.7 : 1}
                            ]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonCancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={({pressed}) => [
                                styles.buttonSave,
                                {opacity: pressed ? 0.8 : 1},
                                desabilitarSalvar && {opacity: 0.6}
                            ]}
                            disabled={desabilitarSalvar}
                            accessibilityRole="button"
                            accessibilityLabel={abaSelecionada === 'Pontos' ? "Salvar ponto" : "Salvar doação"}
                            accessibilityState={{disabled: desabilitarSalvar}}
                            onPress={handleSalvar}
                        >
                            {salvando ? (
                                <ActivityIndicator size="small" color={theme.colors.textWhite}/>
                            ) : (
                                <>
                                    <MaterialDesignIcons name="check" size={18} color={theme.colors.textWhite}/>
                                    <Text style={styles.buttonSaveText}>{isEdicao ? 'Salvar alterações' : 'Salvar'}</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: theme.colors.modalBackground,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    modalCard: {
        backgroundColor: theme.colors.surfaceModal,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.borderMedium,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
        padding: theme.spacing.xl,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.55,
        shadowRadius: 24,
        elevation: 12,
    },
    modalHeader: {
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderSubtle,
    },
    modalHeaderTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    modalHeaderIconContainer: {
        width: 32,
        height: 32,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.iconSurface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabSelectorContainer: {
        flexShrink: 0,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: theme.colors.surfaceInput,
        borderRadius: theme.borderRadius.lg,
        padding: 4,
        marginTop: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        position: 'relative',
    },
    tabIndicator: {
        position: 'absolute',
        top: 4,
        left: 4,
        bottom: 4,
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderMedium,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.md,
        zIndex: 1,
    },
    tabButtonText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
    },
    tabButtonTextActive: {
        color: theme.colors.textWhite,
        fontWeight: '700',
    },
    modalBody: {
        flexShrink: 1,
    },
    animatedFormWrapper: {
        flexShrink: 1,
        width: '100%',
    },
    alertaErroModal: {
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme.colors.dangerLight,
        borderColor: theme.colors.danger,
        borderWidth: 1,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 8,
        marginTop: theme.spacing.md,
    },
    alertaErroTexto: {
        flex: 1,
        color: theme.colors.danger,
        fontSize: theme.fontSize.sm,
        fontWeight: '500',
    },
    modalFooter: {
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        marginTop: theme.spacing.md,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderSubtle,
    },
    buttonCancel: {
        paddingVertical: 10,
        minHeight: 44,
        minWidth: 44,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    buttonCancelText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
    buttonSave: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minWidth: 44,
        minHeight: 44,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary,
    },
    buttonSaveText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
});
