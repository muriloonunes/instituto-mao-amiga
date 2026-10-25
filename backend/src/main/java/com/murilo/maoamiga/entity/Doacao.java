package com.murilo.maoamiga.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class Doacao
 */
@Entity
@Table(name = "doacoes")
@Data
public class Doacao {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String tipoItem;

    @Column(nullable = false)
    private Integer quantidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ponto_id", nullable = false)
    private Ponto ponto;

    @CreationTimestamp
    @Column(name = "criado_em", updatable = false, nullable = false)
    private Instant criadoEm;
}

