import {Ponto} from "../types/produto";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {theme} from "../theme/theme";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

type NovoPontoModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: (ponto: Ponto) => void;
};

export function NovaDoacaoModal(
    {visible, onClose, onSave}: NovoPontoModalProps
) {
    function handleClose() {
        // limparFormulario();
        onClose();
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.modalBackdrop}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={handleClose}
                />
                <View style={styles.modalCard}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderTitleGroup}>
                            <View style={styles.modalHeaderIconContainer}>
                                <MaterialDesignIcons
                                    name="package-variant-closed-plus"
                                    size={20}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text style={styles.modalTitle}>Registrar Nova Doação</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleClose}
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
                            <TextInput style={[styles.modalInput]}
                                       placeholder="Blusa de Frio"
                                       placeholderTextColor={theme.colors.placeholder}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Quantidade*</Text>
                            <TextInput style={[styles.inputLabel]}
                                       keyboardType='number-pad'
                            />
                        </View>
                    </ScrollView>
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
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
        padding: theme.spacing.xl,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder,
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
        color: theme.colors.text,
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.cardBorder,
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
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        height: 46,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.fontSize.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    textAreaInput: {
        height: 80,
        paddingTop: 10,
        paddingBottom: 10,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        marginTop: theme.spacing.md,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder,
    },
    buttonCancel: {
        paddingVertical: 10,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.cardBorder,
    },
    buttonCancelText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
    buttonSave: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary,
    },
    buttonSaveText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
});
