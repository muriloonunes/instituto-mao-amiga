package com.murilo.maoamiga.entity;

import com.murilo.maoamiga.entity.dto.PontoRequestDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class Ponto
 */
@Entity
@Table(name = "pontos")
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Ponto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String bairro;

    @Column(nullable = false)
    private String horario;

    @Column(nullable = false)
    private String tipo;

    public Ponto(String nome, String endereco, String bairro, String horario, String tipo) {
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.horario = horario;
        this.tipo = tipo;
    }

    public Ponto(PontoRequestDTO dto) {
        this(dto.nome(), dto.endereco(), dto.bairro(), dto.horario(), dto.tipo());
    }
}
