package com.murilo.maoamiga.controller;

import com.murilo.maoamiga.entity.dto.PontoResponseDTO;
import com.murilo.maoamiga.service.PontoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
    public ResponseEntity<List<PontoResponseDTO>> listar() {
        return ResponseEntity.ok(pontoService.listar());
    }
}
