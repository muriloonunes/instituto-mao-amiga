import {Doacao} from "./doacao";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export type RootStackParamList = {
    Abas: undefined;
    TelaDetalhePonto: { pontoId: number };
    TelaDetalheDoacao: { doacao: Doacao }
}

export type TelaDetalhePontoProps = NativeStackScreenProps<RootStackParamList, 'TelaDetalhePonto'>;
export type TelaDetalheDoacaoProps = NativeStackScreenProps<RootStackParamList, 'TelaDetalheDoacao'>;
