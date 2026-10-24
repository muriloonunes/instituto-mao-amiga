package com.murilo.maoamiga.service;

import com.murilo.maoamiga.entity.Ponto;
import com.murilo.maoamiga.entity.dto.PontoResponseDTO;
import com.murilo.maoamiga.entity.dto.PontoResumoDTO;
import com.murilo.maoamiga.exception.EntityNotFound;
import com.murilo.maoamiga.repository.PontoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class PontoService
 */
@Service
public class PontoService {
    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public Page<PontoResponseDTO> listar(Pageable pageable) {
        Page<Ponto> pontos = pontoRepository.findAll(pageable);
        return pontos.map(PontoResponseDTO::new);
    }

    public Ponto buscarPorId(Long id) {
        return pontoRepository.findById(id).orElseThrow(
                () -> new EntityNotFound("Ponto não encontrado")
        );
    }

    public List<PontoResumoDTO> listarResumo() {
        return pontoRepository.findAllResumo();
    }
}
