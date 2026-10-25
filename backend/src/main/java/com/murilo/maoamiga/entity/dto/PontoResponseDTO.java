package com.murilo.maoamiga.entity.dto;

import com.murilo.maoamiga.entity.Ponto;

public record PontoResponseDTO(
        Long id,
        String nome,
        String endereco,
        String diasHorarios,
        String funcionamento,
        Double latitude,
        Double longitude
) {
    public PontoResponseDTO(Ponto ponto) {
        this(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getDiasHorarios(),
                ponto.getFuncionamento(),
                ponto.getLatitude(),
                ponto.getLongitude()
        );
    }
}
