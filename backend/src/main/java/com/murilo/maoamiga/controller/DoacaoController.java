package com.murilo.maoamiga.controller;

import com.murilo.maoamiga.entity.dto.CriarDoacaoDTO;
import com.murilo.maoamiga.entity.dto.DoacaoResponseDTO;
import com.murilo.maoamiga.service.DoacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class DoacaoController
 */
@RestController
@RequestMapping("/doacoes")
public class DoacaoController {
    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @PostMapping
    public ResponseEntity<DoacaoResponseDTO> criar(@RequestBody @Valid CriarDoacaoDTO doacaoDto) {
        DoacaoResponseDTO doacaoCriada = doacaoService.criar(doacaoDto);
        return ResponseEntity.ok(doacaoCriada);
    }

    @GetMapping
    public ResponseEntity<List<DoacaoResponseDTO>> listar() {
        return ResponseEntity.ok(doacaoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> getById(@PathVariable Long id) {
        DoacaoResponseDTO doacao = doacaoService.buscarPorId(id);
        return ResponseEntity.ok(doacao);
    }

    @GetMapping("/tipo/{tipoItem}")
    public ResponseEntity<List<DoacaoResponseDTO>> listarPorTipoItem(@PathVariable String tipoItem) {
        List<DoacaoResponseDTO> doacoes = doacaoService.listarPorTipoItem(tipoItem);
        return ResponseEntity.ok(doacoes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid CriarDoacaoDTO doacaoDto) {
        DoacaoResponseDTO doacaoAtualizada = doacaoService.atualizar(id, doacaoDto);
        return ResponseEntity.ok(doacaoAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        doacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
