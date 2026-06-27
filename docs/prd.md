# Product Requirements Document (PRD) - Smart farm

**Projeto:** Smart-farm-api
**Versão:** 1.0.0

---

## 1. Visão Geral e Objetivo

O setor de agronegócio sempre busca soluções que maximizem a produção no campo. Cada variavel importa na tomada de decisão e cada decisão tem um impacto significativo no resultado final. Acompanhar o desenvolvimento da lavoura desde o plantio da semente até a colheita envolve muitos parâmetros e fatores climáticos como umidade do solo, temperatura, luminosidade, chuva e vento e poder ter esses dados em tempo real aumenta e muito o poder de decisão dos envolvidos.
A smart farm é uma solução desenvolvida com o propósito de acompanhar e analisar em tempo real a mudança dessas variáveis através de dados coletados por sensores IoT espalhados pela lavoura(dados simulados no momomento), esses dados são enviados em tempo real para aplicação smart farm e o agricultor pode tomar decisões mais conscientes em relação a sua lavoura.

## 2. Glossário Ubíquo

- **Usuário (Produtor Rural):** Responsável por gerenciar uma ou mais lavouras.
- **Administrador:** Responsável por gerenciar usuários do sistema
- **Lavoura:** Área agrícola monitorada, associada a um usuário e contendo sensores IoT.
- **Sensor:** Dispositivo responsável por coletar dados ambientais (temperatura, umidade, luminosidade).
- **Medição:** Registro de dados coletados por um sensor em um determinado momento.
- **Alerta:** Evento gerado pelo sistema quando uma medição ultrapassa limites configurados.
- **Configuração de Parâmetros:** Limites definidos pelo usuário para geração de alertas.

## 3. Atores e Permissões

**Administrador:**
  - Gerencia usuários do sistema
  - Acesso total a todos os recursos

**Produtor Rural:**
  - Gerencia lavouras
  - Consulta dados e alertas

**Sensor IoT:**
  - Envia dados para o sistema

**Sistema (Automático):**
  - Processa medições
  - Gera alertas
  - Monitora status dos sensores

## 4. Escopo Funcional, Histórias de Usuário e Critérios de Aceitação (MoSCoW)

**Instrução para a IA/Desenvolvedor:** Cada bloco abaixo representa uma necessidade de negócio. Uma história só é considerada "Done" quando todos os seus critérios de aceitação forem atendidos no sistema.

### US00 - Cadastro de Usuário (Must Have)
**Ator:** Produtor rural | **História:** Como usuário, quero me cadastrar no sistema via e-mail e senha ou conta Google para que eu possa acessar e gerenciar as informações da minha lavoura.

**Critérios de Aceitação:**
- [x] Cadastro via email/senha
- [x] Cadastro via Google OAuth2
- [x] Retornar erro para e-mail já cadastrado
- [x] Senha armazenada com hash seguro
- [x] Retornar os dados do usuário criado sem expor a senha

### US01 - Autenticação por E-mail ou login social (Must Have)

**Ator:** Produtor rural | **História:** Como usuário, quero fazer login via Google Auth ou email e senha para que o sistema confirme minha identidade cruzando minhas credenciais para que somente eu tenha acesso as informações referentes a minha lavoura.

**Critérios de Aceitação:**

- [x] Login via email/senha ou Google
- [x] Retornar erro para credenciais inválidas
- [x] Gerar sessão autenticada

### US02 - Dados organizados e em tempo real (Must Have)

**Ator:** Produtor rural | **História:** Como usuário, quero que os dados coletados pelos sensores sejam organizados por fator climatico, lavoura e período na interface da aplicação para que eu possa ver todo o cenário da minha lavoura e tomar decisões caso necessário.

**Critérios de Aceitação:**

- [x] Listar medições
- [x] Filtrar por lavoura
- [x] Filtrar por período (data inicial/final)

### US03 - Alerta de sensores inativos ou com defeito (Must Have)

**Ator:** Produtor rural | **História:** Como usuário, quero receber alertas de sensores inativos ou com defeitos para que eu possa substituir por outros sensores

**Critérios de Aceitação:**

- [x] Sensor é considerado inativo se não enviar dados por um período configurável
- [x] Sistema deve registrar status do sensor (ativo/inativo)

### US04 - Geração de alertas (Must Have)

**Ator:** Sistema | **História:** Como sistema, quero enviar alertas ao usuário para que problemas futuros possam ser evitados

**Critérios de Aceitação:**

- [x] Comparar medições com parâmetros configurados
- [x] Gerar alerta quando limite for ultrapassado
- [x] Associar alerta à medição

### US05 - Analise de un sensor específico (Should Have)

**Ator:** Produtor rural | **História:** Como usuário, quero acompanhar dados de um sensor específico para analisar seu comportamento ao longo do tempo.

**Critérios de Aceitação:**

- [x] Filtrar medições por sensor
- [x] Ordenar por data

### US06 - Alertas organizados por tipo (Could Have)

**Ator:** Produtor rural | **História:** Como usuário, quero que os alertas emitidos sejam classificados conforme a gravidade do caso

**Critérios de Aceitação:**

- [x] Alerta NORMAL, casos onde não necessita providencia imediata
- [x] Alerta MODERADO, casos onde a providencia nao precisa ser imediata mas a longo prazo pode piorar
- [x] Alerta CRITICO, casos onde necessita uma atitude rapida

### US07 - Funcionalidades Fora de Escopo (Won't Have)

- Integração com sensores reais
- Integração com APIs externas
- Controle automático de irrigação
- Dashboard frontend completo

### US08 - Gerenciamento de Usuários (Must Have)
**Ator:** Administrador | **História:** Como administrador, quero gerenciar os usuários do sistema para controlar quem tem acesso à plataforma.

**Critérios de Aceitação:**
- [x] Listar todos os usuários
- [x] Buscar usuário por ID
- [x] Atualizar dados de um usuário
- [x] Remover um usuário
- [x] Somente ADMIN pode acessar essas operações

### US09 - Telas do sistema (Must Have)
**Ator:** User | **História:** Como usuário, quero ver as telas do sistema para ter uma visão geral da aplicação.

**Critérios de Aceitação:**
- [ ] Tela de Login
- [ ] Tela de Cadastro
- [ ] Tela de Autenticação
- [ ] Tela de Dashboard
- [ ] Tela de Sensores
- [ ] Tela de Medições
- [ ] Tela de Alertas
- [ ] Tela de Usuários

## 🛡️ 5. Regras de Negócio (Constraints)

- **RN01 (Autenticação):** Usuários devem estar autenticados para acessar dados.
- **RN02 (Relacionamento):** Cada usuário possui uma ou mais lavouras.
- **RN03 (Sensores):** Cada lavoura possui um ou mais sensores.
- **RN04 (Medições):** Cada sensor gera múltiplas medições ao longo do tempo.
- **RN05 (Timestamp):** Toda medição deve conter data e hora de registro.
- **RN06 (Parâmetros):** Limites de alerta são configurados por lavoura.
- **RN07 (Alertas):** Um alerta é gerado quando uma medição ultrapassa limites configurados.
- **RN08 (Sensor Inativo):** Sensor é considerado inativo se não enviar dados dentro de um intervalo definido.
- **RN09 (Gravidade):** Alertas podem ser classificados como NORMAL, MODERADO ou CRÍTICO.
- **RN10 (Autorização):** O sistema possui dois níveis de acesso: USER e ADMIN. O role padrão ao registrar é USER.
- **RN11 (Senha):** Senhas devem ser armazenadas com hash bcrypt, nunca em texto puro.
- **RN12 (Gerenciamento de Usuários):** Somente ADMIN pode gerenciar usuários.
- **RN13 (Permissões):** Usuário autenticado pode gerenciar suas próprias lavouras, sensores, medições e alertas. Somente ADMIN pode listar, atualizar e remover usuários.


## 🚫 6. Fora de Escopo (Non-goals)

- Controle de dispositivos físicos
- Integração com hardware real
- Aplicações mobile ou web completas

## ⚙️ 7. Requisitos Não Funcionais (Qualidade)

- **Desempenho:** Resposta da API em até 500ms
- **Escalabilidade:** Arquitetura preparada para crescimento horizontal
- **Segurança:** Autenticação via JWT, autorização por roles (RBAC), hash de senhas com bcrypt, validação de dados via DTO.
- **Manutenibilidade:** Código modular (Controller, Service, DTO)
- **Disponibilidade:** Sistema deve tratar erros sem interromper funcionamento
- **Testabilidade:** Regras isoladas em services
