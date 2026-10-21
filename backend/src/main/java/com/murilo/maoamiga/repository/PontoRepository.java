package com.murilo.maoamiga.repository;

import com.murilo.maoamiga.entity.Ponto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Interface PontoRepository
 */
@Repository
public interface PontoRepository extends JpaRepository<Ponto, Long> {
}
