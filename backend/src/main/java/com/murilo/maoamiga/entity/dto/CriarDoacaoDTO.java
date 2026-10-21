package com.murilo.maoamiga.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CriarDoacaoDTO(
        @NotBlank(message = "O tipo do item é obrigatório")
        @Size(max = 50, message = "O tipo do item deve ter no máximo 50 caracteres")
        String tipoItem,

        @NotNull(message = "A quantidade é obrigatória")
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer quantidade,

        @NotNull(message = "O ponto de coleta é obrigatório")
        Long pontoId
) {
}