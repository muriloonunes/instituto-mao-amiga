package com.murilo.maoamiga.entity.dto;

import com.murilo.maoamiga.entity.Doacao;

import java.time.Instant;

public record DoacaoResponseDTO(
        Long id,
        String tipoItem,
        Integer quantidade,
        Instant criadoEm,
        Long pontoId,
        String pontoNome,
        String pontoEndereco,
        String pontoDiasHorarios,
        String pontoFuncionamento
) {
    public DoacaoResponseDTO(Doacao doacao) {
        this(
                doacao.getId(),
                doacao.getTipoItem(),
                doacao.getQuantidade(),
                doacao.getCriadoEm(),
                doacao.getPonto().getId(),
                doacao.getPonto().getNome(),
                doacao.getPonto().getEndereco(),
                doacao.getPonto().getDiasHorarios(),
                doacao.getPonto().getFuncionamento()
        );
    }
}
