package com.murilo.maoamiga.config;

import com.murilo.maoamiga.entity.Ponto;
import com.murilo.maoamiga.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 11/11/2026
 * @brief Class DataLoader
 */
@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner initDatabase(PontoRepository pontoRepository) {
        return _ -> {
            if (pontoRepository.count() == 0) {
                var pontos = List.of(
                        criarPonto(
                                "Sesc Faiçalville",
                                "Av. Ipanema, Qd. 234/236, 1600",
                                "Setor Faiçalville",
                                "Segunda a Sexta das 08:00 às 17:00",
                                "Coleta"
                        ),

                        criarPonto(
                                "Academia WeGYM",
                                "Rodovia Transbrasiliana",
                                "Vila Redenção",
                                "Todos os dias, aberto 24h",
                                "Coleta e Distribuição"
                        ),

                        criarPonto(
                                "Praça Cívica",
                                "Praça Cívica",
                                "Centro",
                                "Todos os dias, aberto 24h",
                                "Coleta"
                        ),

                        criarPonto(
                                "Passeio Das Águas Shopping",
                                "Av. Perimetral Norte",
                                "Jardim Diamantina",
                                "Seg. a Sex.: 10:00 às 20:00\nDomingo: 12:00 às 21:00",
                                "Coleta"
                        ),

                        criarPonto(
                                "Supermercado Tatico",
                                "Av. T7 Esquina com Av. C-205",
                                "Jardim América",
                                "Seg. a Sáb.: 07:00 às 00:00\nDomingo: 07:00 às 21:00",
                                "Coleta"
                        ),

                        criarPonto(
                                "Portal Shopping",
                                "Av. Anhanguera, 14404",
                                "Capuava",
                                "Seg. a Sex.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Coleta"
                        ),

                        criarPonto(
                                "Golden Lis Hotel Boutique",
                                "Av. das Indústrias, 75",
                                "Santa Genoveva",
                                "Segunda a Sábado das 07:00 às 18:00",
                                "Coleta"
                        ),

                        criarPonto(
                                "Sesi Jardim Colorado",
                                "R. Sc 29, 2-188",
                                "Jardim Colorado",
                                "Segunda a Sexta das 07:00 às 22:00",
                                "Coleta"
                        )
                );

                pontoRepository.saveAll(pontos);
            }
        };
    }

    private Ponto criarPonto(String nome, String endereco, String bairro, String horario, String tipo) {
        var ponto = new Ponto();
        ponto.setNome(nome);
        ponto.setEndereco(endereco);
        ponto.setBairro(bairro);
        ponto.setHorario(horario);
        ponto.setTipo(tipo);

        return ponto;
    }
}
