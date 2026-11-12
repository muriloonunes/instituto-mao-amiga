package com.murilo.maoamiga.entity.dto;

import com.murilo.maoamiga.entity.Ponto;

public record PontoResponseDTO(
        Long id,
        String nome,
        String endereco,
        String bairro,
        String horario,
        String tipo
) {
    public PontoResponseDTO(Ponto ponto) {
        this(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getBairro(),
                ponto.getHorario(),
                ponto.getTipo()
        );
    }
}
