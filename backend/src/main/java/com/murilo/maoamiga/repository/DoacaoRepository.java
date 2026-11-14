package com.murilo.maoamiga.repository;

import com.murilo.maoamiga.entity.Doacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Interface DoacaoRepository
 */
@Repository
public interface DoacaoRepository extends JpaRepository<Doacao, Long> {
    @Query("SELECT d FROM Doacao d WHERE LOWER(d.tipoItem) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    Page<Doacao> listarComFiltro(String filtro, Pageable pageable);
}
