package com.murilo.maoamiga.service;

import com.murilo.maoamiga.entity.Ponto;
import com.murilo.maoamiga.entity.dto.PontoRequestDTO;
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

    public PontoResponseDTO criar(PontoRequestDTO dto) {
        Ponto ponto = Ponto.builder()
                .nome(dto.nome())
                .endereco(dto.endereco())
                .bairro(dto.bairro())
                .horario(dto.horario())
                .tipo(dto.tipo())
                .build();

        Ponto novoPonto = pontoRepository.save(ponto);
        return new PontoResponseDTO(novoPonto);
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

    public PontoResponseDTO atualizar(Long id, PontoRequestDTO dto) {
        var pontoExistente = buscarPorId(id);

        pontoExistente.setNome(dto.nome());
        pontoExistente.setEndereco(dto.endereco());
        pontoExistente.setBairro(dto.bairro());
        pontoExistente.setHorario(dto.horario());
        pontoExistente.setTipo(dto.tipo());

        Ponto pontoAtualizado = pontoRepository.save(pontoExistente);
        return new PontoResponseDTO(pontoAtualizado);
    }

    public void deletar(Long id) {
        if (!pontoRepository.existsById(id)) {
            throw new EntityNotFound("Ponto não encontrado");
        }
        pontoRepository.deleteById(id);
    }
}
