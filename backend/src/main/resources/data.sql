INSERT INTO PONTOS (id, nome, endereco, dias_horarios, funcionamento, latitude, longitude)
VALUES (1, 'Sesc Faiçalville', 'Av. Ipanema, Qd. 234/236, 1600 - St. Faiçalville', 'Segunda a Sexta', '08:00 às 17:00',
        -16.7365,
        -49.3050),

       (2, 'Academia WeGYM', 'Rodovia Transbrasiliana - Vila Redenção', 'Todos os dias', '24h', -16.7179, -49.2358),

       (3, 'Praça Cívica', 'Praça Cívica - Centro', 'Todos os dias', '24h', -16.6799, -49.2563),

       (4, 'Passeio Das Águas Shopping', 'Av. Perimetral Norte', 'Todos os dias',
        'Seg. a Sex.: 10:00 às 20:00\nDomingo: 12:00 às 21:00',
        -16.6294, -49.2779),

       (5, 'Supermercado Tatico', 'Av. T7 Esquina com Av. C-205 - Jardim América', 'Todos os dias',
        'Seg. a Sáb.: 07:00 às 00:00\nDomingo: 07:00 às 21:00', -16.6965, -49.2828),

       (6, 'Portal Shopping', 'Av. Anhanguera, 14404 - Capuava', 'Todos os dias',
        'Seg. a Sex.: 10:00 às 22:00\nDomingo: 14:00 às 20:00', -16.6540, -49.3285),

       (7, 'Golden Lis Hotel Boutique', 'Av. das Indústrias, 75 - Santa Genoveva', 'Segunda a Sábado', '07:00 às 18:00',
        -16.6413, -49.2396),

       (8, 'Sesi Jardim Colorado', 'R. Sc 29, 2-188 - Jardim Colorado', 'Segunda a Sexta', '07:00 às 22:00', -16.6281,
        -49.3327);

ALTER SEQUENCE PONTOS_SEQ RESTART WITH 9;