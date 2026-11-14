package com.murilo.maoamiga.controller;

import com.murilo.maoamiga.entity.dto.DoacaoRequestDTO;
import com.murilo.maoamiga.entity.dto.DoacaoResponseDTO;
import com.murilo.maoamiga.service.DoacaoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class DoacaoController
 */
@RestController
@RequestMapping("/api/v1/doacoes")
public class DoacaoController {
    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @PostMapping
    public ResponseEntity<DoacaoResponseDTO> criar(@RequestBody @Valid DoacaoRequestDTO doacaoDto) {
        DoacaoResponseDTO doacaoCriada = doacaoService.criar(doacaoDto);
        return ResponseEntity.ok(doacaoCriada);
    }

    @GetMapping("/filtro")
    public ResponseEntity<Page<DoacaoResponseDTO>> listar(
            @RequestParam(required = false) String filtro,
            @PageableDefault(sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<DoacaoResponseDTO> doacoes;

        if (filtro != null && !filtro.trim().isEmpty()) {
            doacoes = doacaoService.listarComFiltro(filtro, pageable);
        } else {
            doacoes = doacaoService.listar(pageable);
        }

        return ResponseEntity.ok(doacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> getById(@PathVariable Long id) {
        DoacaoResponseDTO doacao = doacaoService.buscarPorId(id);
        return ResponseEntity.ok(doacao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid DoacaoRequestDTO doacaoDto) {
        DoacaoResponseDTO doacaoAtualizada = doacaoService.atualizar(id, doacaoDto);
        return ResponseEntity.ok(doacaoAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        doacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
