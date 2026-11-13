import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {theme} from "../theme/theme";
import {Ponto, PontoCadastro} from "../types/ponto";

export type PontoFormHandle = {
    submit: () => void;
};

export type PontoCadastroFormProps = {
    pontoExistente?: Ponto;
    onSave: (ponto: PontoCadastro) => void;
};

type TipoPonto = 'Coleta' | 'Distribui';

type ErrosForm = {
    nomePonto?: string;
    endereco?: string;
    bairro?: string;
    dias?: string;
    horaAbertura?: string;
    horaFechamento?: string;
    tipo?: string;
};

type DiaSemana = {
    id: number;
    sigla: string;
    nome: string;
    isDomingo?: boolean;
};

type HorarioParseado = {
    dias: number[];
    is24h: boolean;
    horaAbertura: string;
    horaFechamento: string;
};

const DIAS_SEMANA: DiaSemana[] = [
    {id: 7, sigla: 'D', nome: 'Dom', isDomingo: true},
    {id: 1, sigla: 'S', nome: 'Seg'},
    {id: 2, sigla: 'T', nome: 'Ter'},
    {id: 3, sigla: 'Q', nome: 'Qua'},
    {id: 4, sigla: 'Q', nome: 'Qui'},
    {id: 5, sigla: 'S', nome: 'Sex'},
    {id: 6, sigla: 'S', nome: 'Sáb'},
];

function formatarDiasSelecionados(selecionados: number[]): string {
    if (selecionados.length === 0) return '';
    if (selecionados.length === 7) return 'Todos os dias';

    const ordenados = [...selecionados].sort((a, b) => a - b);
    const chave = ordenados.join(',');

    if (chave === '1,2,3,4,5') return 'Segunda a Sexta';
    if (chave === '1,2,3,4,5,6') return 'Segunda a Sábado';
    if (chave === '6,7') return 'Finais de Semana';

    const isSequencial = ordenados.every((dia, i, arr) => i === 0 || dia === arr[i - 1] + 1);
    if (isSequencial && ordenados.length >= 3) {
        const primeiro = DIAS_SEMANA.find(d => d.id === ordenados[0])!.nome;
        const ultimo = DIAS_SEMANA.find(d => d.id === ordenados[ordenados.length - 1])!.nome;
        return `${primeiro}. a ${ultimo}.`;
    }

    const nomes = ordenados.map(id => DIAS_SEMANA.find(d => d.id === id)!.nome);
    if (nomes.length === 1) return nomes[0];
    return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

function desmontarTextoHorario(horarioStr: string): HorarioParseado {
    if (!horarioStr || typeof horarioStr !== 'string') return {
        dias: [1, 2, 3, 4, 5],
        is24h: false,
        horaAbertura: '08:00',
        horaFechamento: '18:00',
    };

    const texto = horarioStr.toLowerCase().trim()

    const is24h = texto.includes('24h')

    let horaAbertura = '08:00';
    let horaFechamento = '18:00';

    if (!is24h) {
        const matchesHoras = texto.match(/(\d{1,2}:\d{2})/g);
        if (matchesHoras && matchesHoras.length >= 2) {
            horaAbertura = matchesHoras[0].padStart(5, '0');
            horaFechamento = matchesHoras[1].padStart(5, '0');
        }
    }

    let dias: number[] = [];

    if (texto.includes('todos os dias')) {
        dias = [1, 2, 3, 4, 5, 6, 7];
    } else if (texto.includes('segunda a sexta') || texto.includes('seg. a sex.')) {
        dias = [1, 2, 3, 4, 5]
    } else if (texto.includes('segunda a sábado') || texto.includes('segunda a sabado') || texto.includes('seg. a sab.') || texto.includes('seg. a sáb.')) {
        dias = [1, 2, 3, 4, 5, 6]
    } else if (texto.includes('final de semana') || texto.includes('finais de semana')) {
        dias = [6, 7];
    } else {
        const mapaDias: { [chave: string]: number } = {
            'seg': 1,
            'ter': 2,
            'qua': 3,
            'qui': 4,
            'sex': 5,
            'sáb': 6,
            'sab': 6,
            'dom': 7,
        };

        Object.entries(mapaDias).forEach(([termo, id]) => {
            if (texto.includes(termo) && !dias.includes(id)) {
                dias.push(id);
            }
        });

        dias.sort((a, b) => a - b);
    }

    return {
        dias: dias.length > 0 ? dias : [1, 2, 3, 4, 5],
        is24h,
        horaAbertura,
        horaFechamento,
    };
}

export const PontoCadastroForm = forwardRef<PontoFormHandle, PontoCadastroFormProps>(
    ({pontoExistente, onSave}, ref) => {
        const [nomePonto, setNomePonto] = useState(pontoExistente?.nome ?? '');
        const [endereco, setEndereco] = useState(pontoExistente?.endereco ?? '');
        const [bairro, setBairro] = useState(pontoExistente?.bairro ?? '');

        const [tipo, setTipo] = useState<TipoPonto>('Coleta');

        const [diasSelecionados, setDiasSelecionados] = useState<number[]>([1, 2, 3, 4, 5]);
        const [aberto24h, setAberto24h] = useState(false);
        const [horaAbertura, setHoraAbertura] = useState('08:00');
        const [horaFechamento, setHoraFechamento] = useState('18:00');

        const [erros, setErros] = useState<ErrosForm>({});

        useEffect(() => {
            if (pontoExistente) {
                setNomePonto(pontoExistente.nome);
                setEndereco(pontoExistente.endereco);
                setBairro(pontoExistente.bairro);
                setTipo(pontoExistente.tipo === 'Distribui' ? 'Distribui' : 'Coleta');

                const horario = desmontarTextoHorario(pontoExistente.horario);
                setDiasSelecionados(horario.dias);
                setAberto24h(horario.is24h);
                setHoraAbertura(horario.horaAbertura);
                setHoraFechamento(horario.horaFechamento);
            }
        }, [pontoExistente]);

        function toggleDia(diaId: number) {
            setDiasSelecionados(prev => {
                const novos = prev.includes(diaId)
                    ? prev.filter(id => id !== diaId)
                    : [...prev, diaId];
                if (erros.dias && novos.length > 0) {
                    setErros(e => ({...e, dias: undefined}));
                }
                return novos;
            });
        }

        function aplicarMascaraHora(valor: string): string {
            const apenasNumeros = valor.replace(/\D/g, '').slice(0, 4);
            if (apenasNumeros.length <= 2) {
                return apenasNumeros;
            }
            return `${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2)}`;
        }

        function montarTextoHorario(): string {
            const diasTexto = formatarDiasSelecionados(diasSelecionados);
            if (!diasTexto) return '';

            if (aberto24h) {
                return diasTexto === 'Todos os dias'
                    ? 'Todos os dias, aberto 24h'
                    : `${diasTexto}, aberto 24h`;
            }

            const abertura = horaAbertura.trim() || '08:00';
            const fechamento = horaFechamento.trim() || '18:00';

            return `${diasTexto} das ${abertura} às ${fechamento}`;
        }

        function validar(): boolean {
            const novosErros: ErrosForm = {};

            if (!nomePonto.trim()) {
                novosErros.nomePonto = 'O nome do ponto é obrigatório.';
            } else if (nomePonto.trim().length > 60) {
                novosErros.nomePonto = 'O nome deve ter no máximo 60 caracteres.';
            }

            if (!endereco.trim()) {
                novosErros.endereco = 'O endereço é obrigatório.';
            }

            if (!bairro.trim()) {
                novosErros.bairro = 'O bairro é obrigatório.';
            }

            if (diasSelecionados.length === 0) {
                novosErros.dias = 'Selecione ao menos um dia de funcionamento.';
            }

            if (!aberto24h) {
                const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
                if (!horaAbertura.trim() || !regexHora.test(horaAbertura.trim())) {
                    novosErros.horaAbertura = 'Hora inválida (HH:MM).';
                }
                if (!horaFechamento.trim() || !regexHora.test(horaFechamento.trim())) {
                    novosErros.horaFechamento = 'Hora inválida (HH:MM).';
                }
            }

            setErros(novosErros);
            return Object.keys(novosErros).length === 0;
        }

        useImperativeHandle(ref, () => ({
            submit() {
                if (!validar()) return;

                onSave({
                    nome: nomePonto.trim(),
                    endereco: endereco.trim(),
                    bairro: bairro.trim(),
                    horario: montarTextoHorario(),
                    tipo: tipo,
                });
            },
        }));

        return (
            <ScrollView
                style={{flexGrow: 1}}
                contentContainerStyle={styles.formScrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Tipo de Atividade do Ponto*</Text>
                    <View style={styles.tipoContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tipoCard,
                                tipo === 'Coleta' && styles.tipoCardAtivo,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setTipo('Coleta')}
                        >
                            <View
                                style={[
                                    styles.tipoIconCircle,
                                    tipo === 'Coleta' && styles.tipoIconCircleAtivo,
                                ]}
                            >
                                <MaterialDesignIcons
                                    name="inbox-arrow-down"
                                    size={18}
                                    color={tipo === 'Coleta' ? theme.colors.primaryVibrant : theme.colors.textMuted}
                                />
                            </View>
                            <View style={styles.tipoTextos}>
                                <Text
                                    style={[
                                        styles.tipoTitulo,
                                        tipo === 'Coleta' && styles.tipoTituloAtivo,
                                    ]}
                                >
                                    Coleta
                                </Text>
                            </View>
                            {tipo === 'Coleta' && (
                                <MaterialDesignIcons
                                    name="check-circle"
                                    size={18}
                                    color={theme.colors.primaryVibrant}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tipoCard,
                                tipo === 'Distribui' && styles.tipoCardAtivo,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setTipo('Distribui')}
                        >
                            <View
                                style={[
                                    styles.tipoIconCircle,
                                    tipo === 'Distribui' && styles.tipoIconCircleAtivo,
                                ]}
                            >
                                <MaterialDesignIcons
                                    name="truck-delivery-outline"
                                    size={18}
                                    color={tipo === 'Distribui' ? theme.colors.primaryVibrant : theme.colors.textMuted}
                                />
                            </View>
                            <View style={styles.tipoTextos}>
                                <Text
                                    style={[
                                        styles.tipoTitulo,
                                        tipo === 'Distribui' && styles.tipoTituloAtivo,
                                    ]}
                                >
                                    Distribui
                                </Text>
                            </View>
                            {tipo === 'Distribui' && (
                                <MaterialDesignIcons
                                    name="check-circle"
                                    size={18}
                                    color={theme.colors.primaryVibrant}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Nome do Ponto*</Text>
                    <TextInput
                        style={[
                            styles.modalInput,
                            erros.nomePonto ? styles.inputError : null,
                        ]}
                        placeholder="Ex: Praça Cívica, Paróquia São José..."
                        placeholderTextColor={theme.colors.placeholder}
                        value={nomePonto}
                        onChangeText={(text) => {
                            setNomePonto(text);
                            if (erros.nomePonto) setErros((prev) => ({...prev, nomePonto: undefined}));
                        }}
                    />
                    {erros.nomePonto ? <Text style={styles.errorText}>{erros.nomePonto}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Endereço*</Text>
                    <TextInput
                        style={[
                            styles.modalInput,
                            erros.endereco ? styles.inputError : null,
                        ]}
                        placeholder="Ex: Av. Anhanguera, 10790"
                        placeholderTextColor={theme.colors.placeholder}
                        value={endereco}
                        onChangeText={(text) => {
                            setEndereco(text);
                            if (erros.endereco) setErros((prev) => ({...prev, endereco: undefined}));
                        }}
                    />
                    {erros.endereco ? <Text style={styles.errorText}>{erros.endereco}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Bairro*</Text>
                    <TextInput
                        style={[
                            styles.modalInput,
                            erros.bairro ? styles.inputError : null,
                        ]}
                        placeholder="Ex: Centro, Setor Bueno..."
                        placeholderTextColor={theme.colors.placeholder}
                        value={bairro}
                        onChangeText={(text) => {
                            setBairro(text);
                            if (erros.bairro) setErros((prev) => ({...prev, bairro: undefined}));
                        }}
                    />
                    {erros.bairro ? <Text style={styles.errorText}>{erros.bairro}</Text> : null}
                </View>


                <View style={styles.formGroup}>
                    <View style={styles.diasLabelLinha}>
                        <Text style={styles.inputLabel}>Dias de Funcionamento*</Text>
                        <Text style={styles.diasResumoTexto}>
                            {formatarDiasSelecionados(diasSelecionados) || 'Nenhum dia'}
                        </Text>
                    </View>

                    <View style={styles.diasContainer}>
                        {DIAS_SEMANA.map((dia) => {
                            const ativo = diasSelecionados.includes(dia.id);
                            return (
                                <TouchableOpacity
                                    key={dia.id}
                                    activeOpacity={0.7}
                                    onPress={() => toggleDia(dia.id)}
                                    style={[
                                        styles.diaCirculo,
                                        ativo && styles.diaCirculoAtivo,
                                        dia.isDomingo && !ativo && styles.diaDomingoInativo,
                                        dia.isDomingo && ativo && styles.diaDomingoAtivo,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.diaTexto,
                                            ativo && styles.diaTextoAtivo,
                                            dia.isDomingo && !ativo && styles.diaTextoDomingoInativo,
                                        ]}
                                    >
                                        {dia.sigla}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {erros.dias ? <Text style={styles.errorText}>{erros.dias}</Text> : null}
                </View>

                <View style={styles.formRow}>
                    <View style={[styles.formGroup, {flex: 1}]}>
                        <Text style={styles.inputLabel}>Abre às*</Text>
                        <TextInput
                            style={[
                                styles.modalInput,
                                styles.inputHora,
                                erros.horaAbertura ? styles.inputError : null,
                                aberto24h ? {opacity: 0.65} : null
                            ]}
                            placeholder="08:00"
                            placeholderTextColor={theme.colors.placeholder}
                            keyboardType="number-pad"
                            editable={!aberto24h}
                            maxLength={5}
                            value={horaAbertura}
                            onChangeText={(text) => {
                                setHoraAbertura(aplicarMascaraHora(text));
                                if (erros.horaAbertura) setErros((prev) => ({...prev, horaAbertura: undefined}));
                            }}
                        />
                        {erros.horaAbertura ? <Text style={styles.errorText}>{erros.horaAbertura}</Text> : null}
                    </View>

                    <View style={[styles.formGroup, {flex: 1}]}>
                        <Text style={styles.inputLabel}>Fecha às*</Text>
                        <TextInput
                            style={[
                                styles.modalInput,
                                styles.inputHora,
                                erros.horaFechamento ? styles.inputError : null,
                                aberto24h ? {opacity: 0.65} : null
                            ]}
                            placeholder="18:00"
                            placeholderTextColor={theme.colors.placeholder}
                            keyboardType="number-pad"
                            editable={!aberto24h}
                            maxLength={5}
                            value={horaFechamento}
                            onChangeText={(text) => {
                                setHoraFechamento(aplicarMascaraHora(text));
                                if (erros.horaFechamento) setErros((prev) => ({
                                    ...prev,
                                    horaFechamento: undefined
                                }));
                            }}
                        />
                        {erros.horaFechamento ? <Text style={styles.errorText}>{erros.horaFechamento}</Text> : null}
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.toggle24h,
                        aberto24h && styles.toggle24hAtivo
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setAberto24h(!aberto24h)}
                >
                    <MaterialDesignIcons
                        name={aberto24h ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                        size={18}
                        color={aberto24h ? theme.colors.primaryVibrant : theme.colors.textMuted}
                    />
                    <Text style={[styles.toggle24hText, aberto24h && styles.toggle24hTextAtivo]}>
                        Ponto aberto 24 horas por dia
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
);

const styles = StyleSheet.create({
    formScrollContainer: {
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
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
    inputHora: {
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: 1,
    },
    tipoContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    tipoCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.surfaceInput,
        borderWidth: 1.5,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
    },
    tipoCardAtivo: {
        borderColor: theme.colors.borderFocus,
        backgroundColor: theme.colors.iconSurface,
    },
    tipoIconCircle: {
        width: 28,
        height: 28,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipoIconCircleAtivo: {
        backgroundColor: 'rgba(0, 179, 126, 0.22)',
    },
    tipoTextos: {
        flex: 1,
    },
    tipoTitulo: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
    tipoTituloAtivo: {
        color: theme.colors.textWhite,
        fontWeight: '700',
    },
    tipoDescricao: {
        color: theme.colors.textMuted,
        fontSize: 11,
        marginTop: 1,
    },
    secaoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
        marginBottom: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderSubtle,
    },
    diasLabelLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    diasResumoTexto: {
        color: theme.colors.primaryVibrant,
        fontSize: theme.fontSize.xs,
        fontWeight: '600',
    },
    diasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2,
    },
    diaCirculo: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1.5,
        borderColor: theme.colors.borderSubtle,
        alignItems: 'center',
        justifyContent: 'center',
    },
    diaCirculoAtivo: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primaryVibrant,
    },
    diaDomingoInativo: {
        borderColor: 'rgba(247, 90, 104, 0.35)',
        backgroundColor: 'rgba(247, 90, 104, 0.05)',
    },
    diaDomingoAtivo: {
        backgroundColor: theme.colors.danger,
        borderColor: theme.colors.danger,
    },
    diaTexto: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
    },
    diaTextoAtivo: {
        color: theme.colors.textWhite,
    },
    diaTextoDomingoInativo: {
        color: theme.colors.danger,
    },
    toggle24h: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 4,
    },
    toggle24hAtivo: {
        opacity: 1,
    },
    toggle24hText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.sm,
    },
    toggle24hTextAtivo: {
        color: theme.colors.textWhite,
        fontWeight: '600',
    },
});