# Smart-farm-api

**Link em Produção:** [Aguardando Deploy na Nuvem]
**Autor:** [Tiago Sampaio]

---

## 1. Visão Geral

Sistema de monitoramento inteligente para lavouras baseado em IoT, desenvolvido com NestJS. A aplicação simula a coleta de dados de sensores agrícolas, como umidade do solo e temperatura, processa essas informações por meio de regras de negócio e gera alertas para auxiliar na tomada de decisão no agronegócio.-mail institucional do Google, e a presença é validada e preenchida automaticamente na pauta.

## 2. Documentação Oficial (Docs as Code)

Toda a especificação do sistema está versionada na pasta `/docs`:

- **[PRD (Product Requirements Document)](./docs/prd.md):** Visão do produto e User Stories.
- **[SDD (Software Design Document)](./docs/sdd.md):** Diagrama de banco de dados e contratos de API.
- **[Checklist de Avaliação](./docs/checklist.md):** Controle de entrega dos IDs e RAs.

## 3. Stack Tecnológica

- **Arquitetura:** Monorepo (Back, Front e Extensão no mesmo repositório).
- **Backend (API):** NestJS, TypeScript, JWT, Google OAuth.
- **Banco de Dados:** PostgreSQL gerenciado via Prisma ORM.
- **Frontend (Web/Mobile):** reactJs e Tailwindcss.
- **Integração:** Extensão de Navegador (Chrome) com manipulação de DOM.

## 4. Link com o protótipo da aplicação

[Link com o protótipo ](https://stitch.withgoogle.com/projects/12173586994224868144
)


## 4. Quick Start (Como Executar)

**1. Clone o repositório:**

```bash
git clone https://github.com/tiago-sampaio-cordeiro/smart-farm-api.git
cd smart-farm-api
```
