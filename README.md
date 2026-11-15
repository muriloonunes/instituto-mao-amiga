# 🤝 Instituto Mão Amiga

Aplicação full-stack (Mobile + API REST) desenvolvida para a disciplina de **Construção de Software II**. O projeto tem como objetivo auxiliar o **Instituto Mão Amiga** a visualizar e gerenciar seus **pontos de coleta** e controlar o **histórico de doações recebidas**.

---

## 📂 Estrutura do Repositório

```text
instituto-mao-amiga/
├── backend/       # API REST em Java + Spring Boot (veja backend/README.md para detalhes e prints)
└── frontend/      # Aplicativo Mobile / Web em React Native + Expo (veja frontend/README.md)
```

---

## 🛠️ Tecnologias Utilizadas

### Backend (`backend/`)
- **Java 25** (compatível com JDK 25+)
- **Spring Boot 4.1.1**
  - Spring Web MVC
  - Spring Data JPA
  - Bean Validation (`jakarta.validation`)
- **H2 Database** (banco de dados em arquivo local com auto-server e seed inicial em `data.sql`)
- **SpringDoc OpenAPI (Swagger UI)** para documentação interativa da API
- **Lombok** & **Maven Wrapper (`mvnw`)**

### Frontend (`frontend/`)
- **React Native 0.88** com **Expo SDK 58** e **React 19**
- **TypeScript**
- **React Navigation v7** (Bottom Tabs e Native Stack Navigator)
- **AsyncStorage** (`@react-native-async-storage/async-storage`) para armazenamento local de doações
- **Fetch API** com suporte a timeout e tratamento de erros para consumo dos pontos de coleta no backend
- **React Native SVG** & **Material Design Icons**

---

## ✨ Funcionalidades Principais

- **Listagem e Detalhamento de Pontos de Coleta:** Consulta paginada de pontos de coleta integrados ao backend, exibindo endereço, dias/horários de atendimento, itens aceitos e localização geográfica.
- **Busca e Filtragem Dinâmica:** Filtro em tempo real tanto para pontos de coleta quanto para o histórico de doações.
- **Gestão Completa de Doações (CRUD):**
  - Registro de novas doações informando tipo de item, quantidade e ponto de coleta de destino.
  - Visualização de histórico detalhado com **Card de Resumo Geral** (total de doações, total de itens acumulados e contagem agrupada por tipo de item).
  - Edição e exclusão de doações com confirmação.
- **API REST Documentada:** Endpoints para gerenciamento de pontos de coleta e doações no servidor, acompanhados de Swagger UI e console do banco H2.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Java JDK 25+** (ou gerenciamento via SDKMAN com `.sdkmanrc`)
- **Node.js 20+** e **npm**
- **Expo Go** no celular (Android/iOS) ou emulador Android/iOS configurado

---

### 1. Executando o Backend (API Spring Boot)

Na raiz do projeto ou dentro da pasta `backend/`:

```bash
cd backend
./mvnw spring-boot:run
```
*(No Windows PowerShell/CMD, você pode usar `.\mvnw.cmd spring-boot:run`)*

A API estará disponível em `http://localhost:8080`.

#### Links Úteis do Backend:
- **Swagger UI (Documentação da API):** `http://localhost:8080/swagger-ui.html`
- **H2 Console (Banco de Dados):** `http://localhost:8080/h2-console`
  - **JDBC URL:** `jdbc:h2:file:./backend/data/mao-amiga-db;AUTO_SERVER=TRUE;`
  - **User Name:** `sa`
  - **Password:** *(deixe em branco)*

---

### 2. Executando o Frontend (React Native / Expo)

Em outro terminal, acesse a pasta `frontend/`:

```bash
cd frontend
npm install
npx expo start
```

No terminal do Expo, escolha como deseja abrir o aplicativo:
- Pressione **`a`** para abrir no **Emulador Android** (`npx expo start --android`)
- Pressione **`i`** para abrir no **Simulador iOS** (`npx expo start --ios`)
- Pressione **`w`** para abrir no **Navegador Web** (`npx expo start --web`)
- Ou escaneie o **QR Code** exibido no terminal utilizando o aplicativo **Expo Go** no seu dispositivo físico.

#### ⚙️ Onde trocar o IP do Servidor no App:
Por padrão, o app detecta o IP da sua máquina automaticamente via Expo (`Constants.expoConfig.hostUri`). Caso esteja em dispositivo físico ou precise apontar para outro IP manual:
1. Abra o arquivo [**`frontend/src/services/api.ts`**](frontend/src/services/api.ts).
2. Na função `getBaseUrl()` (linhas 5 a 23), substitua a URL base pelo IP local da sua máquina:
   ```typescript
   // Exemplo para apontar manualmente:
   return `http://192.168.1.100:8080/api/v1`;
   ```
*(Lembre-se de manter seu celular e computador conectados na mesma rede Wi-Fi).*

---

## 🔌 Endpoints da API REST

> 📖 **Documentação completa e evidências de teste:**  
> A lista de URLs completas, regras de validação e todos os **prints das respostas no Swagger UI (incluindo os cenários 400 Bad Request e 404 Not Found)** estão documentados em [**`backend/README.md`**](backend/README.md).

### Pontos de Coleta (`/api/v1/pontos`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/pontos/filtro` | Busca paginada de pontos com filtro por nome ou bairro (`?filtro=...&page=0&size=10&sort=nome,asc`) |
| `GET` | `/api/v1/pontos/{id}` | Busca os detalhes completos de um ponto pelo ID (responde 404 se não existir) |
| `GET` | `/api/v1/pontos/resumo` | Lista resumida (`id` e `nome`) para preenchimento de seletores |
| `POST` | `/api/v1/pontos` | Cadastra novo ponto com validação Bean Validation (responde 400 se campo vazio) |
| `PUT` | `/api/v1/pontos/{id}` | Atualiza dados do ponto (responde 400 se campo vazio e 404 se não existir) |
| `DELETE` | `/api/v1/pontos/{id}` | Remove um ponto pelo ID (responde 404 se não existir) |

### Doações (`/api/v1/doacoes`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/doacoes/filtro` | Busca paginada filtrando por tipo de item (`?filtro=...&page=0&size=10&sort=criadoEm,desc`) |
| `GET` | `/api/v1/doacoes/{id}` | Busca os detalhes de uma doação por ID |
| `POST` | `/api/v1/doacoes` | Registra uma nova doação com validação Bean Validation |
| `PUT` | `/api/v1/doacoes/{id}` | Atualiza uma doação existente |
| `DELETE` | `/api/v1/doacoes/{id}` | Remove uma doação por ID |

#### Exemplo de Payload (`POST /doacoes` e `PUT /doacoes/{id}`):
```json
{
  "tipoItem": "Cesta Básica",
  "quantidade": 5,
  "pontoId": 1
}
```

---

## ⏱️ Roteiro de Demonstração

### 1. Pontos de Coleta (Buscar, Cadastrar, Editar e Excluir)
1. **Buscar:** Na aba **Pontos**, utilize a barra de pesquisa para filtrar pontos existentes em tempo real.
2. **Cadastrar:** Abra o modal pelo botão **`+`**, selecione a aba **Ponto**, preencha todos os campos obrigatórios (Nome, Endereço, Bairro, Horário e Tipo Coleta/Distribuição) e toque em **Salvar**. O novo ponto surgirá imediatamente na lista sem recarregar o app.
3. **Editar:** Toque no ponto recém-criado para abrir os detalhes, clique no ícone de **Lápis** no topo direito, altere um campo (ex: Horário ou Nome) e toque em **Salvar alterações**. O detalhe e a listagem exibirão o novo valor.
4. **Excluir:** No detalhe do ponto, toque no ícone de **Lixeira**, confirme a exclusão no alerta (`Alert.alert`) e veja o ponto sumir da listagem.

### 2. Favoritar um Ponto
1. **Favoritar:** Na lista de pontos ou nos detalhes, toque no botão de coração (**♡**) de um ponto. O ícone mudará para preenchido (**♥**).
2. **Meus Pontos:** Toque no botão **Meus pontos** no topo da tela para acessar a tela dedicada. O ponto aparecerá listado (buscado diretamente na API pelo ID).
3. **Persistência & Desmarcar:** Desmarque o favorito tocando no coração na tela **Meus pontos** (o card sumirá na hora do estado e do `AsyncStorage`). Ao fechar e reabrir o app, os favoritos permanecem preservados no aparelho.

### 3. Doações (Cadastrar, Editar e Excluir)
1. **Cadastrar:** Toque no botão **`+`**, selecione a aba **Doações**, preencha o tipo de item, quantidade (> 0), selecione um ponto e salve. Acesse a aba **Doações** para ver o item no topo do histórico e o card de resumo atualizado.
2. **Editar:** Toque na doação para ver os detalhes, abra a edição pelo ícone de **Lápis**, altere a quantidade ou tipo e salve. A data original de criação permanece intacta.
3. **Excluir:** Toque na **Lixeira**, confirme a exclusão e verifique a remoção da doação do histórico.

### 4. Demonstração de Erros da API (400 e 404)
1. **Cenário 400 (Bad Request):** No Swagger (`/swagger-ui.html`) ou pelo app (tentando salvar uma doação com quantidade 0 ou campos em branco via API), mostre a resposta HTTP 400 com as mensagens de validação do Bean Validation. No app, demonstre que o formulário não é fechado e mantém o que foi digitado.
2. **Cenário 404 (Not Found):** No Swagger ou abrindo uma rota com ID inexistente (ex: `GET /api/v1/pontos/999999` ou `GET /api/v1/doacoes/999999`), mostre a resposta HTTP 404 ("Ponto não encontrado" / "Doação não encontrada"). Na tela de detalhes do app, mostre o estado de erro com a mensagem amigável.

---


