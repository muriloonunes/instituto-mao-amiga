import {Ponto} from "../types/produto";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {theme} from "../theme/theme";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import React, {useState} from "react";
import {pontosMock} from "../mocks/pontosMock";
import {Doacao} from "../types/doacao";

type NovoPontoModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: (doacao: Doacao) => void;
};

type ErrosForm = {
    nomeItem?: string,
    qtdItem?: string,
    ponto?: string,
}

export function NovaDoacaoModal(
    {visible, onClose, onSave}: NovoPontoModalProps
) {
    const [nomeItem, setNomeItem] = useState('')
    const [qtdItem, setQtdItem] = useState('')
    const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null)
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [erros, setErros] = useState<ErrosForm>({});

    function limparFormulario() {
        setNomeItem('')
        setQtdItem('')
        setPontoSelecionado(null)
        setDropdownAberto(false)
        setErros({})
    }

    function fechar() {
        limparFormulario();
        onClose();
    }

    function validar(): boolean {
        const novosErros: ErrosForm = {}
        if (!nomeItem.trim()) {
            novosErros.nomeItem = 'O nome do item é obrigatório.';
        }
        if (!qtdItem.trim()) {
            novosErros.qtdItem = 'A quantidade é obrigatória.';
        } else if (isNaN(Number(qtdItem)) || Number(qtdItem) <= 0) {
            novosErros.qtdItem = 'Informe uma quantidade válida maior que zero.';
        } else if (!Number.isInteger(Number(qtdItem))) {
            novosErros.qtdItem = 'A quantidade deve ser um número inteiro.';
        }

        if (!pontoSelecionado) {
            novosErros.ponto = 'Selecione o ponto de destino.';
        }

        setErros(novosErros)
        return Object.keys(novosErros).length === 0;
    }

    function salvar() {
        if (!validar()) return
        onSave({
            id: Date.now(),
            nome: nomeItem.trim(),
            quantidade: Number(qtdItem),
            pontoId: pontoSelecionado!.id,
            criadoEm: new Date().toISOString(),
        })
        fechar()
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={fechar}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalBackdrop}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={fechar}
                />
                <View style={styles.modalCard}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderTitleGroup}>
                            <View style={styles.modalHeaderIconContainer}>
                                <MaterialDesignIcons
                                    name="package-variant-closed-plus"
                                    size={20}
                                    color={theme.colors.primaryVibrant}
                                />
                            </View>
                            <Text style={styles.modalTitle}>Registrar Nova Doação</Text>
                        </View>
                        <TouchableOpacity
                            onPress={fechar}
                            style={styles.closeButton}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <MaterialDesignIcons name="close" size={20} color={theme.colors.textMuted}/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.formScrollContainer}
                    >
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Item Doado*</Text>
                            <TextInput
                                style={[
                                    styles.modalInput,
                                    erros.nomeItem ? styles.inputError : null,
                                ]}
                                placeholder="Blusa de Frio"
                                placeholderTextColor={theme.colors.placeholder}
                                value={nomeItem}
                                onChangeText={(text) => {
                                    setNomeItem(text)
                                    if (erros.nomeItem) setErros((prev) => ({...prev, nomeItem: undefined}));
                                }}
                            />
                            {erros.nomeItem ? <Text style={styles.errorText}>{erros.nomeItem}</Text> : null}
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Quantidade*</Text>
                            <TextInput
                                style={[
                                    styles.modalInput,
                                    erros.qtdItem ? styles.inputError : null
                                ]}
                                keyboardType='number-pad'
                                placeholder="2"
                                placeholderTextColor={theme.colors.placeholder}
                                value={qtdItem}
                                onChangeText={(text) => {
                                    setQtdItem(text);
                                    if (!text) {
                                        setErros(prev => ({...prev, qtdItem: undefined}));
                                    } else if (!/^\d+$/.test(text)) {
                                        setErros(prev => ({
                                            ...prev,
                                            qtdItem: 'Apenas números inteiros positivos são permitidos.'
                                        }));
                                    } else {
                                        setErros(prev => ({...prev, qtdItem: undefined}));
                                    }
                                }}
                            />
                            {erros.qtdItem ? <Text style={styles.errorText}>{erros.qtdItem}</Text> : null}
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Ponto de Destino*</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.selectTrigger,
                                    erros.ponto ? styles.inputError : null
                                ]}
                                onPress={() => setDropdownAberto(prev => !prev)}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.selectTriggerText,
                                        !pontoSelecionado && styles.placeholderText
                                    ]}
                                >
                                    {pontoSelecionado ? pontoSelecionado.nome : 'Selecione um ponto'}
                                </Text>
                                <MaterialDesignIcons
                                    name={dropdownAberto ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={theme.colors.textMuted}
                                />
                            </TouchableOpacity>
                            {erros.ponto ? <Text style={styles.errorText}>{erros.ponto}</Text> : null}
                            {dropdownAberto && (
                                <View style={styles.dropdownContainer}>
                                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                                        {pontosMock.map(ponto => {
                                            const selecionado = pontoSelecionado?.id === ponto.id
                                            return (
                                                <TouchableOpacity
                                                    key={ponto.id}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selecionado && styles.dropdownItemSelected
                                                    ]}
                                                    onPress={() => {
                                                        setPontoSelecionado(ponto);
                                                        setDropdownAberto(false);
                                                        if (erros.ponto) setErros(prev => ({
                                                            ...prev,
                                                            ponto: undefined
                                                        }));
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropdownItemText,
                                                            selecionado && styles.dropdownItemTextSelected
                                                        ]}
                                                    >
                                                        {ponto.nome}
                                                    </Text>
                                                    {selecionado && (
                                                        <MaterialDesignIcons
                                                            name="check"
                                                            size={18}
                                                            color={theme.colors.primaryVibrant}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonCancel,
                                { opacity: pressed ? 0.7 : 1 }
                            ]}
                            onPress={fechar}
                        >
                            <Text style={styles.buttonCancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonSave,
                                { opacity: pressed ? 0.8 : 1 }
                            ]}
                            onPress={salvar}
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
    formScrollContainer: {
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    formGroup: {
        marginBottom: 14,
    },
    formRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    inputLabel: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        marginBottom: 6,
    },
    inputError: {
        borderColor: theme.colors.danger,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xs,
        marginTop: 4,
    },
    modalInput: {
        backgroundColor: theme.colors.surfaceInput,
        color: theme.colors.text,
        height: 46,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.fontSize.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    selectTrigger: {
        backgroundColor: theme.colors.surfaceInput,
        height: 46,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectTriggerText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        flex: 1,
        marginRight: 8,
    },
    placeholderText: {
        color: theme.colors.placeholder,
    },
    dropdownContainer: {
        backgroundColor: theme.colors.surfaceInput,
        borderColor: theme.colors.borderMedium,
        borderWidth: 1,
        borderRadius: theme.borderRadius.lg,
        marginTop: theme.spacing.xs,
        maxHeight: 180,
        overflow: 'hidden',
    },
    dropdownScroll: {
        flexGrow: 0,
    },
    dropdownItem: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderSubtle,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemSelected: {
        backgroundColor: theme.colors.surfaceElevated,
    },
    dropdownItemText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
        flex: 1,
    },
    dropdownItemTextSelected: {
        color: theme.colors.primaryVibrant,
        fontWeight: 'bold',
    },
    modalFooter: {
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
