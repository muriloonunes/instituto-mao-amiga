import {ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {theme} from "../theme/theme";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Picker} from "@react-native-picker/picker";
import {Doacao} from "../types/doacao";
import {PontoResumo} from "../types/ponto";
import {listarPontosResumo} from "../services/pontosService";
import {ApiError} from "../types/api";

export type DoacaoFormHandle = {
    submit: () => void;
};

export type DoacaoCadastroFormProps = {
    doacaoExistente?: Doacao;
    onSave: (doacao: Doacao) => void;
    onCarregandoChange?: (carregando: boolean) => void;
};

type ErrosForm = {
    nomeItem?: string;
    qtdItem?: string;
    ponto?: string;
};

export const DoacaoCadastroForm = forwardRef<DoacaoFormHandle, DoacaoCadastroFormProps>(
    ({doacaoExistente, onSave, onCarregandoChange}, ref) => {
        const [tipoItem, setTipoItem] = useState('');
        const [qtdItem, setQtdItem] = useState('');
        const [pontoSelecionadoId, setPontoSelecionadoId] = useState<number | null>(null);
        const [erros, setErros] = useState<ErrosForm>({});
        const [pontos, setPontos] = useState<PontoResumo[]>([]);
        const [carregandoPontos, setCarregandoPontos] = useState(false);
        const [erroPontos, setErroPontos] = useState<string | null>(null);
        const [tentativa, setTentativa] = useState(0);

        useEffect(() => {
            if (doacaoExistente) {
                setTipoItem(doacaoExistente.tipoItem);
                setQtdItem(doacaoExistente.quantidade.toString());
                setPontoSelecionadoId(doacaoExistente.pontoId);
                setErros({});
            }
        }, [doacaoExistente]);

        useEffect(() => {
            let ativo = true;
            setCarregandoPontos(true);
            onCarregandoChange?.(true);
            setErroPontos(null);

            listarPontosResumo()
                .then((resposta) => {
                    if (ativo) setPontos(resposta);
                })
                .catch((erro) => {
                    if (!ativo) return;
                    if (erro instanceof ApiError && erro.status === 0) {
                        setErroPontos('Sem conexão com o servidor.');
                    } else {
                        setErroPontos('Não foi possível carregar os pontos.');
                    }
                })
                .finally(() => {
                    if (ativo) {
                        setCarregandoPontos(false);
                        onCarregandoChange?.(false);
                    }
                });

            return () => {
                ativo = false;
            };
        }, [tentativa]);

        function validar(): boolean {
            const novosErros: ErrosForm = {};
            if (!tipoItem.trim()) {
                novosErros.nomeItem = 'O nome do item é obrigatório.';
            }
            if (tipoItem.trim().length > 50) {
                novosErros.nomeItem = 'O nome do item deve ter no máximo 50 caracteres.';
            }
            if (!qtdItem.trim()) {
                novosErros.qtdItem = 'A quantidade é obrigatória.';
            } else if (isNaN(Number(qtdItem)) || Number(qtdItem) <= 0) {
                novosErros.qtdItem = 'Informe uma quantidade válida maior que zero.';
            } else if (!Number.isInteger(Number(qtdItem))) {
                novosErros.qtdItem = 'A quantidade deve ser um número inteiro.';
            }

            if (!pontoSelecionadoId) {
                novosErros.ponto = 'Selecione o ponto de destino.';
            }

            setErros(novosErros);
            return Object.keys(novosErros).length === 0;
        }

        useImperativeHandle(ref, () => ({
            submit() {
                if (!validar() || carregandoPontos || erroPontos) return;
                onSave({
                    id: doacaoExistente ? doacaoExistente.id : Date.now(),
                    tipoItem: tipoItem.trim(),
                    quantidade: Number(qtdItem),
                    pontoId: pontoSelecionadoId!,
                    criadoEm: doacaoExistente ? doacaoExistente.criadoEm : new Date().toISOString(),
                });
            }
        }))

        return (
            <ScrollView
                style={{flexGrow: 1}}
                contentContainerStyle={styles.formScrollContainer}
                keyboardShouldPersistTaps="handled"
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
                        value={tipoItem}
                        onChangeText={(text) => {
                            setTipoItem(text);
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
                    {carregandoPontos ? (
                        <View style={[styles.pickerContainer, styles.pickerEstado]}>
                            <ActivityIndicator size="small" color={theme.colors.primaryVibrant}/>
                            <Text style={styles.pickerEstadoTexto}>Carregando pontos...</Text>
                        </View>
                    ) : erroPontos ? (
                        <View style={[styles.pickerContainer, styles.pickerEstado, styles.inputError]}>
                            <MaterialDesignIcons
                                name="alert-circle-outline"
                                size={18}
                                color={theme.colors.danger}
                            />
                            <Text style={[styles.pickerEstadoTexto, styles.pickerEstadoTextoFlex]}>
                                {erroPontos}
                            </Text>
                            <Pressable
                                onPress={() => setTentativa(t => t + 1)}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel="Tentar carregar os pontos novamente"
                            >
                                <Text style={styles.pickerEstadoAcao}>Tentar novamente</Text>
                            </Pressable>
                        </View>
                    ) : pontos.length === 0 ? (
                        <View style={[styles.pickerContainer, styles.pickerEstado]}>
                            <Text style={styles.pickerEstadoTexto}>Nenhum ponto cadastrado.</Text>
                        </View>
                    ) : (
                        <View
                            style={[
                                styles.pickerContainer,
                                erros.ponto ? styles.inputError : null,
                            ]}
                        >
                            <Picker
                                prompt="Selecione o Ponto de Destino"
                                selectedValue={pontoSelecionadoId}
                                onValueChange={(itemValue) => {
                                    setPontoSelecionadoId(itemValue);
                                    if (erros.ponto) {
                                        setErros((prev) => ({...prev, ponto: undefined}));
                                    }
                                }}
                                dropdownIconColor={theme.colors.textMuted}
                                style={[
                                    styles.picker,
                                    !pontoSelecionadoId && styles.pickerPlaceholder,
                                ]}
                                itemStyle={styles.pickerItem}
                            >
                                <Picker.Item
                                    label="Selecione um ponto"
                                    value={null}
                                    color={theme.colors.placeholder}
                                    style={{fontSize: theme.fontSize.sm}}
                                />
                                {pontos.map(ponto => (
                                    <Picker.Item
                                        key={ponto.id}
                                        label={ponto.nome}
                                        value={ponto.id}
                                        color={Platform.OS === 'android' ? '#1f1f26' : theme.colors.text}
                                        style={{fontSize: theme.fontSize.sm}}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                    {erros.ponto && !erroPontos ? <Text style={styles.errorText}>{erros.ponto}</Text> : null}
                </View>
            </ScrollView>
        )
    }
)

const styles = StyleSheet.create({
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
    pickerContainer: {
        backgroundColor: theme.colors.surfaceInput,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        justifyContent: 'center',
        overflow: 'hidden',
        ...(Platform.OS === 'android' ? {height: 48} : {}),
    },
    picker: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        backgroundColor: 'transparent',
        ...(Platform.OS === 'android' ? {height: 60} : {}),
    },
    pickerPlaceholder: {
        color: theme.colors.placeholder,
    },
    pickerItem: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
    },
    pickerEstado: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        minHeight: 48,
    },
    pickerEstadoTexto: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.sm,
    },
    pickerEstadoTextoFlex: {
        flex: 1,
    },
    pickerEstadoAcao: {
        color: theme.colors.primaryVibrant,
        fontSize: theme.fontSize.sm,
        fontWeight: '700',
    },
})