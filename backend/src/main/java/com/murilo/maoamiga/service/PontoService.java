package com.murilo.maoamiga.service;

import com.murilo.maoamiga.entity.Ponto;
import com.murilo.maoamiga.entity.dto.PontoResponseDTO;
import com.murilo.maoamiga.repository.PontoRepository;
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

    public List<PontoResponseDTO> listar() {
        List<Ponto> pontos = pontoRepository.findAll();
        return pontos.stream().map(PontoResponseDTO::new).toList();
    }

    public Ponto buscarPorId(Long id) {
        return pontoRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Ponto não encontrado")
        );
    }
}
