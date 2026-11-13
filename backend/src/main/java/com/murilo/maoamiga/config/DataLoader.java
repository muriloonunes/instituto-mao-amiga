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
                                "Praça Cívica",
                                "Praça Dr. Pedro Ludovico Teixeira",
                                "Centro",
                                "Todos os dias, aberto 24h",
                                "Coleta"
                        ),
                        criarPonto(
                                "Araguaia Shopping",
                                "Rua 44, 399",
                                "Centro",
                                "Todos os dias: 08:30 às 22:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "Mercado Municipal de Campinas",
                                "Rua 10, s/n",
                                "Setor Campinas",
                                "Seg. a Sáb.: 07:00 às 18:00\nDomingo: 07:00 às 12:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "Praça Universitária",
                                "Av. Universitária, s/n",
                                "Setor Leste Universitário",
                                "Todos os dias, aberto 24h",
                                "Coleta"
                        ),
                        criarPonto(
                                "Shopping Cerrado",
                                "Av. Anhanguera, 10790",
                                "Setor Aeroviário",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Goiânia Shopping",
                                "Av. T-10, 1300",
                                "Setor Bueno",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Parque Vaca Brava",
                                "Av. T-10, s/n",
                                "Setor Bueno",
                                "Todos os dias, aberto 24h",
                                "Coleta"
                        ),
                        criarPonto(
                                "Alameda Ricardo Paranhos",
                                "Alameda Ricardo Paranhos, 1200",
                                "Setor Marista",
                                "Todos os dias, aberto 24h",
                                "Coleta"
                        ),
                        criarPonto(
                                "Supermercado Tatico",
                                "Av. T-7 Esquina com Av. C-205",
                                "Jardim América",
                                "Seg. a Sáb.: 07:00 às 00:00\nDomingo: 07:00 às 21:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Terminal Isidória",
                                "Praça da Bíblia / Av. 2ª Radial",
                                "Setor Pedro Ludovico",
                                "Todos os dias: 05:00 às 23:30",
                                "Distribui"
                        ),
                        criarPonto(
                                "Academia WeGYM",
                                "Rodovia Transbrasiliana",
                                "Vila Redenção",
                                "Todos os dias, aberto 24h",
                                "Coleta"
                        ),
                        criarPonto(
                                "Flamboyant Shopping Center",
                                "Av. Dep. Jamel Cecílio, 3300",
                                "Jardim Goiás",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Paço Municipal de Goiânia",
                                "Av. do Cerrado, 999",
                                "Park Lozandes",
                                "Segunda a Sexta das 08:00 às 18:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "Sesc Faiçalville",
                                "Av. Ipanema, Qd. 234/236, 1600",
                                "Setor Faiçalville",
                                "Segunda a Sexta das 08:00 às 17:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Shopping Cidade Jardim",
                                "Av. Nero Macedo, 400",
                                "Cidade Jardim",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "Plaza D'Oro Shopping",
                                "Av. Nápoli, 500",
                                "Residencial Eldorado",
                                "Todos os dias: 10:00 às 22:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Portal Sul Shopping",
                                "Rodovia GO-040, Km 6",
                                "Jardins Lisboa",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Portal Shopping",
                                "Av. Anhanguera, 14404",
                                "Capuava",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Terminal Padre Pelágio",
                                "Av. Anhanguera, s/n",
                                "Bairro Ipiranga",
                                "Todos os dias: 04:30 às 00:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "América Shopping",
                                "Rodovia dos Romeiros (GO-060)",
                                "Conjunto Vera Cruz",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 14:00 às 20:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Sesi Jardim Colorado",
                                "R. Sc 29, 2-188",
                                "Jardim Colorado",
                                "Segunda a Sexta das 07:00 às 22:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Hospital Estadual de Urgências (HUGOL)",
                                "Av. Anhanguera, 14527",
                                "Setor Santos Dumont",
                                "Todos os dias, aberto 24h",
                                "Distribui"
                        ),
                        criarPonto(
                                "Supermercado Bretas Perimetral",
                                "Av. Perimetral Norte, 3673",
                                "Vila João Vaz",
                                "Seg. a Sáb.: 07:00 às 22:00\nDomingo: 07:00 às 20:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Passeio das Águas Shopping",
                                "Av. Perimetral Norte, 8303",
                                "Jardim Diamantina",
                                "Seg. a Sáb.: 10:00 às 22:00\nDomingo: 12:00 às 21:00",
                                "Coleta"
                        ),
                        criarPonto(
                                "Golden Lis Hotel Boutique",
                                "Av. das Indústrias, 75",
                                "Santa Genoveva",
                                "Segunda a Sábado das 07:00 às 18:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "Ecoponto Jardim Guanabara",
                                "Rua GB-5 com Rua GB-6",
                                "Jardim Guanabara II",
                                "Todos os dias: 07:00 às 22:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "Campus Samambaia - UFG",
                                "Alameda Palmeiras, s/n",
                                "Chácaras Califórnia",
                                "Segunda a Sexta das 07:00 às 22:00",
                                "Distribui"
                        ),
                        criarPonto(
                                "Ecoponto Jardim São José",
                                "Rua Frei Nazareno Confaloni",
                                "Jardim São José",
                                "Todos os dias: 07:00 às 19:00",
                                "Distribui"
                        )
                );

                pontoRepository.saveAll(pontos);
            }
        };
    }

    private Ponto criarPonto(String nome, String endereco, String bairro, String horario, String tipo) {
        return new Ponto(
                nome,
                endereco,
                bairro,
                horario,
                tipo
        );
    }
}
