package com.murilo.maoamiga.controller;

import com.murilo.maoamiga.entity.dto.PontoResponseDTO;
import com.murilo.maoamiga.entity.dto.PontoResumoDTO;
import com.murilo.maoamiga.service.PontoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 20/10/2026
 * @brief Class PontoController
 */
@RestController
@RequestMapping("/pontos")
public class PontoController {
    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public ResponseEntity<Page<PontoResponseDTO>> listar(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        if (pageable.getPageSize() > 50) {
            pageable = PageRequest.of(pageable.getPageNumber(), 50, pageable.getSort());
        }

        return ResponseEntity.ok(pontoService.listar(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PontoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(new PontoResponseDTO(pontoService.buscarPorId(id)));
    }

    @GetMapping("/resumo")
    public ResponseEntity<List<PontoResumoDTO>> listarResumo() {
        return ResponseEntity.ok(pontoService.listarResumo());
    }

}
