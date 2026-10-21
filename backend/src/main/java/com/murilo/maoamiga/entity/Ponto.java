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

    private String nome;

    private String endereco;

    private String diasHorarios;

    private String funcionamento;
}
