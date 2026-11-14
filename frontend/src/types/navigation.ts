import {NativeStackScreenProps} from "@react-navigation/native-stack";

export type RootStackParamList = {
    Abas: undefined;
    TelaDetalhePonto: { pontoId: number };
    TelaDetalheDoacao: { doacaoId: number }
}

export type TelaDetalhePontoProps = NativeStackScreenProps<RootStackParamList, 'TelaDetalhePonto'>;
export type TelaDetalheDoacaoProps = NativeStackScreenProps<RootStackParamList, 'TelaDetalheDoacao'>;
