# 🤝 Instituto Mão Amiga

Aplicação full-stack (Mobile + API REST) desenvolvida para a disciplina de **Construção de Software II**. O projeto tem como objetivo auxiliar o **Instituto Mão Amiga** a visualizar e gerenciar seus **pontos de coleta** e controlar o **histórico de doações recebidas**.

---

## 📂 Estrutura do Repositório

```text
instituto-mao-amiga/
├── backend/       # API REST em Java + Spring Boot (persistência em H2 Database)
└── frontend/      # Aplicativo Mobile / Web em React Native + Expo (TypeScript)
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
- Ou escaneie o **QR Code** exibido no terminal utilizando o aplicativo **Expo Go** no seu dispositivo físico (certifique-se de que o celular e o computador estejam na mesma rede Wi-Fi para que o app se conecte automaticamente ao IP da API na porta `8080`).

---

## 🔌 Endpoints da API REST

### Pontos de Coleta (`/pontos`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/pontos` | Lista os pontos de coleta de forma paginada (`?page=0&size=20&sort=id,asc`, máx. 50 por página) |
| `GET` | `/pontos/{id}` | Busca os detalhes completos de um ponto de coleta pelo seu ID |
| `GET` | `/pontos/resumo` | Retorna uma lista resumida (`id` e `nome`) de todos os pontos para preenchimento de seletores |

### Doações (`/doacoes`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/doacoes` | Registra uma nova doação (`tipoItem`, `quantidade`, `pontoId`) |
| `GET` | `/doacoes` | Lista todas as doações cadastradas |
| `GET` | `/doacoes/{id}` | Busca os detalhes de uma doação específica pelo ID |
| `GET` | `/doacoes/tipo/{tipoItem}` | Filtra doações pelo tipo de item (busca parcial e case-insensitive) |
| `PUT` | `/doacoes/{id}` | Atualiza os dados de uma doação existente |
| `DELETE` | `/doacoes/{id}` | Remove uma doação pelo ID |

#### Exemplo de Payload (`POST /doacoes` e `PUT /doacoes/{id}`):
```json
{
  "tipoItem": "Cesta Básica",
  "quantidade": 5,
  "pontoId": 1
}
```

---

## 📋 Roteiro Rápido de Teste no App

1. **Consultar Pontos de Coleta:** Na aba **Pontos**, visualize os pontos carregados da API, pesquise pelo nome ou toque em um card para ver endereço, horários e itens aceitos.
2. **Registrar uma Doação:** Toque no botão central **`+`** na barra inferior, preencha o **Tipo de Item Doado**, a **Quantidade** e selecione o **Ponto de Destino**. Toque em **Salvar**.
3. **Visualizar Histórico e Resumo:** Acesse a aba **Doações** para conferir o card de resumo geral e a lista de doações registradas.
4. **Filtrar, Editar e Excluir:** Use a barra de busca para filtrar itens em tempo real, ou toque sobre uma doação para abrir os detalhes e testar as opções de **Editar Doação** e **Excluir Doação**.

---

