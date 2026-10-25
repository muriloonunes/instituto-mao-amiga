package com.murilo.maoamiga.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class Ponto
 */
@Entity
@Table(name = "pontos")
@Data
public class Ponto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String diasHorarios;

    @Column(nullable = false)
    private String funcionamento;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;
}
