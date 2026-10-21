package com.murilo.maoamiga.repository;

import com.murilo.maoamiga.entity.Doacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Interface DoacaoRepository
 */
@Repository
public interface DoacaoRepository extends JpaRepository<Doacao, Long> {
    List<Doacao> findAllByTipoItemIgnoreCase(String tipoItem);
}
