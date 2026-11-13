import {KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {theme} from "../theme/theme";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import React, {useEffect, useRef, useState} from "react";
import {Doacao} from "../types/doacao";
import {DoacaoCadastroForm, DoacaoFormHandle} from "./DoacaoCadastroForm";
import {PontoCadastroForm, PontoFormHandle} from "./PontoCadastroForm";
import {Ponto, PontoCadastro} from "../types/ponto";

type ModalCadastroProps = {
    visible: boolean;
    onClose: () => void;
    abaAberta: 'Pontos' | 'Doações';
    onSavePonto: (ponto: PontoCadastro) => void;
    onSaveDoacao: (doacao: Doacao) => void;
    doacaoExistente?: Doacao;
    pontoExistente?: Ponto;
};

export function ModalCadastro(
    {visible, onClose, abaAberta, onSaveDoacao, onSavePonto, doacaoExistente, pontoExistente}: ModalCadastroProps
) {
    const [abaSelecionada, setAbaSelecionada] = useState<'Pontos' | 'Doações'>(abaAberta)
    const [carregandoForm, setCarregandoForm] = useState(false);

    const doacaoFormRef = useRef<DoacaoFormHandle>(null);
    const pontoFormRef = useRef<PontoFormHandle>(null);

    useEffect(() => {
        if (visible) {
            setAbaSelecionada(abaAberta);
        }
    }, [visible, abaAberta]);

    function handleSalvar() {
        if (abaSelecionada === 'Pontos') {
            pontoFormRef.current?.submit();
        } else if (abaSelecionada === 'Doações') {
            doacaoFormRef.current?.submit();
        }
    }

    const isEdicao = !!doacaoExistente;
    let titulo = '';

    if (abaSelecionada === 'Pontos') {
        titulo = pontoExistente ? 'Editar Ponto' : 'Registrar Novo Ponto';
    } else if (abaSelecionada === 'Doações') {
        titulo = doacaoExistente ? 'Editar Doação' : 'Registrar Nova Doação';
    }

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
                        <View style={styles.tabSelectorContainer}>
                            <Pressable
                                style={[
                                    styles.tabButton,
                                    abaSelecionada === 'Pontos' && styles.tabButtonActive
                                ]}
                                onPress={() => setAbaSelecionada('Pontos')}
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
                                style={[
                                    styles.tabButton,
                                    abaSelecionada === 'Doações' && styles.tabButtonActive
                                ]}
                                onPress={() => setAbaSelecionada('Doações')}
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
                        {abaSelecionada === 'Pontos' ? (
                            <PontoCadastroForm
                                onSave={(ponto) => {
                                    onSavePonto(ponto)
                                    onClose();
                                }}
                                ref={pontoFormRef}
                            />
                        ) : (
                            <DoacaoCadastroForm
                                ref={doacaoFormRef}
                                doacaoExistente={doacaoExistente}
                                onCarregandoChange={setCarregandoForm}
                                onSave={(doacao) => {
                                    onSaveDoacao(doacao);
                                    onClose();
                                }}
                            />
                        )}
                    </View>

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
                                carregandoForm && {opacity: 0.6}
                            ]}
                            disabled={carregandoForm}
                            accessibilityRole="button"
                            accessibilityLabel="Salvar doação"
                            accessibilityState={{disabled: carregandoForm}}
                            onPress={handleSalvar}
                        >
                            <MaterialDesignIcons name="check" size={18} color={theme.colors.textWhite}/>
                            <Text style={styles.buttonSaveText}>Salvar</Text>
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
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.md,
    },
    tabButtonActive: {
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.borderMedium,
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
