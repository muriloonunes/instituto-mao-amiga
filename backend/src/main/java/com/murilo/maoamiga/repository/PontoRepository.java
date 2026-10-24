package com.murilo.maoamiga.repository;

import com.murilo.maoamiga.entity.Ponto;
import com.murilo.maoamiga.entity.dto.PontoResumoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Interface PontoRepository
 */
@Repository
public interface PontoRepository extends JpaRepository<Ponto, Long> {
    @Query("SELECT new com.murilo.maoamiga.entity.dto.PontoResumoDTO(p.id, p.nome) FROM Ponto p")
    List<PontoResumoDTO> findAllResumo();
}
