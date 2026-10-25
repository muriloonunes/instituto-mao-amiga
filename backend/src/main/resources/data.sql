MERGE INTO pontos (id, nome, endereco, dias_horarios, funcionamento, latitude, longitude) KEY (id)
    VALUES (1, 'Sesc Faiçalville', 'Av. Ipanema, Qd. 234/236, 1600 - St. Faiçalville',
            'Segunda a Sexta das 08:00 às 17:00',
            'Recebe: Roupas, agasalhos e mantas', -16.7365, -49.3050),

           (2, 'Academia WeGYM', 'Rodovia Transbrasiliana - Vila Redenção', 'Todos os dias, aberto 24h',
            'Recebe: Material escolar, uniformes e calçados' || CHAR(10) ||
            'Entrega: Kits escolares e roupas', -16.7179, -49.2358),

           (3, 'Praça Cívica', 'Praça Cívica - Centro', 'Todos os dias, aberto 24h',
            'Recebe: Cobertores, agasalhos e itens de higiene pessoal', -16.6799, -49.2563),

           (4, 'Passeio Das Águas Shopping', 'Av. Perimetral Norte',
            'Seg. a Sex.: 10:00 às 20:00' || CHAR(10) ||
            'Domingo: 12:00 às 21:00',
            'Recebe: Alimentos não perecíveis, brinquedos e agasalhos', -16.6294, -49.2779),

           (5, 'Supermercado Tatico', 'Av. T7 Esquina com Av. C-205 - Jardim América',
            'Seg. a Sáb.: 07:00 às 00:00' || CHAR(10) ||
            'Domingo: 07:00 às 21:00',
            'Recebe: Eletrônicos, pilhas, baterias e tampinhas plásticas', -16.6965, -49.2828),

           (6, 'Portal Shopping', 'Av. Anhanguera, 14404 - Capuava',
            'Seg. a Sex.: 10:00 às 22:00' || CHAR(10) ||
            'Domingo: 14:00 às 20:00',
            'Recebe: Alimentos, roupas, móveis e eletrodomésticos', -16.6540, -49.3285),

           (7, 'Golden Lis Hotel Boutique', 'Av. das Indústrias, 75 - Santa Genoveva',
            'Segunda a Sábado das 07:00 às 18:00 ',
            'Recebe: Roupas, acessórios e utensílios domésticos', -16.6413, -49.2396),

           (8, 'Sesi Jardim Colorado', 'R. Sc 29, 2-188 - Jardim Colorado', 'Segunda a Sexta das 07:00 às 22:00',
            'Recebe: Livros, brinquedos pedagógicos e instrumentos musicais',
            -16.6281, -49.3327);