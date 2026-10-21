package com.murilo.maoamiga.service;

import com.murilo.maoamiga.entity.Doacao;
import com.murilo.maoamiga.entity.Ponto;
import com.murilo.maoamiga.entity.dto.CriarDoacaoDTO;
import com.murilo.maoamiga.entity.dto.DoacaoResponseDTO;
import com.murilo.maoamiga.repository.DoacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public DoacaoResponseDTO criar(CriarDoacaoDTO doacaoDto) {
        Ponto ponto = pontoService.buscarPorId(doacaoDto.pontoId());
        Doacao doacao = new Doacao();
        doacao.setTipoItem(doacaoDto.tipoItem());
        doacao.setQuantidade(doacaoDto.quantidade());
        doacao.setPonto(ponto);

        Doacao doacaoSalva = doacaoRepository.save(doacao);

        return new DoacaoResponseDTO(doacaoSalva);
    }

    public List<DoacaoResponseDTO> listar() {
        List<Doacao> doacoes = doacaoRepository.findAll();
        return doacoes.stream().map(DoacaoResponseDTO::new).toList();
    }

    public List<DoacaoResponseDTO> listarPorTipoItem(String tipoItem) {
        List<Doacao> doacoes = doacaoRepository.findAllByTipoItemIgnoreCase(tipoItem);
        return doacoes.stream().map(DoacaoResponseDTO::new).toList();
    }

    public DoacaoResponseDTO buscarPorId(Long id) {
        Doacao doacao = doacaoRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Doação não encontrada")
        );
        return new DoacaoResponseDTO(doacao);
    }

    public DoacaoResponseDTO atualizar(Long id, CriarDoacaoDTO doacaoDto) {
        Doacao doacao = doacaoRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Doação não encontrada")
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
                () -> new RuntimeException("Doação não encontrada")
        );
        doacaoRepository.delete(doacao);
    }
}
