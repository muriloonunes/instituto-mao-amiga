package com.murilo.maoamiga.service;

import com.murilo.maoamiga.entity.Doacao;
import com.murilo.maoamiga.entity.Ponto;
import com.murilo.maoamiga.entity.dto.DoacaoRequestDTO;
import com.murilo.maoamiga.entity.dto.DoacaoResponseDTO;
import com.murilo.maoamiga.exception.EntityNotFound;
import com.murilo.maoamiga.repository.DoacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class DoacaoService
 */
@Service
public class DoacaoService {
    private final DoacaoRepository doacaoRepository;
    private final PontoService pontoService;


    public DoacaoService(DoacaoRepository doacaoRepository, PontoService pontoService) {
        this.doacaoRepository = doacaoRepository;
        this.pontoService = pontoService;
    }

    public DoacaoResponseDTO criar(DoacaoRequestDTO doacaoDto) {
        Ponto ponto = pontoService.buscarPorId(doacaoDto.pontoId());
        Doacao doacao = new Doacao();
        doacao.setTipoItem(doacaoDto.tipoItem());
        doacao.setQuantidade(doacaoDto.quantidade());
        doacao.setPonto(ponto);

        Doacao doacaoSalva = doacaoRepository.save(doacao);

        return new DoacaoResponseDTO(doacaoSalva);
    }

    public Page<DoacaoResponseDTO> listar(Pageable pageable) {
        Page<Doacao> doacoes = doacaoRepository.findAll(pageable);
        return doacoes.map(DoacaoResponseDTO::new);
    }

    public Page<DoacaoResponseDTO> listarComFiltro(String filtro, Pageable pageable) {
        Page<Doacao> doacoes = doacaoRepository.listarComFiltro(filtro, pageable);
        return doacoes.map(DoacaoResponseDTO::new);
    }


    public DoacaoResponseDTO buscarPorId(Long id) {
        Doacao doacao = doacaoRepository.findById(id).orElseThrow(
                () -> new EntityNotFound("Doação não encontrada")
        );
        return new DoacaoResponseDTO(doacao);
    }

    public DoacaoResponseDTO atualizar(Long id, DoacaoRequestDTO doacaoDto) {
        Doacao doacao = doacaoRepository.findById(id).orElseThrow(
                () -> new EntityNotFound("Doação não encontrada")
        );
        Ponto ponto = pontoService.buscarPorId(doacaoDto.pontoId());
        doacao.setTipoItem(doacaoDto.tipoItem());
        doacao.setQuantidade(doacaoDto.quantidade());
        doacao.setPonto(ponto);

        Doacao doacaoAtualizada = doacaoRepository.save(doacao);

        return new DoacaoResponseDTO(doacaoAtualizada);
    }

    public void deletar(Long id) {
        Doacao doacao = doacaoRepository.findById(id).orElseThrow(
                () -> new EntityNotFound("Doação não encontrada")
        );
        doacaoRepository.delete(doacao);
    }
}
