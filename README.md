# 📋 API de Mapeamento de Processos Empresariais

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.5.0-orange)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)

API para gestão hierárquica de processos e subprocessos organizacionais, com cadastro por áreas e detalhamento completo de cada processo.

## 🚀 Recursos

- **Cadastro de Áreas** (departamentos/setores)
- **Gestão de Processos Hierárquicos** (árvore ilimitada de subprocessos)
- **Detalhamento Completo**:
  - Ferramentas/sistemas utilizados
  - Responsáveis
  - Documentação associada
- **Visualização em Árvore** dos processos

## 📦 Tecnologias

- **Backend**: Node.js + Express
- **Banco de Dados**: MongoDB (com Prisma ORM)
- **Linguagem**: TypeScript
- **Autenticação**: (A ser implementado)

## ⚙️ Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/NickolasFchinni/prj_processManagement_stage.git
   cd prj_processManagement_stage

2. **Instale as dependências**:
   ```bash
   npm install

3. **Configure o ambiente**:
   Crie um arquivo .env na raiz com:
   ```env
   MONGODB_URI="sua_uri_mongodb"
   PORT=5000

3. **Execute o servidor**:
   ```bash
   npm run dev

## 📡 Endpoints Principais
A definir

## 🗄️ Estrutura do Banco de Dados
  ```prisma
  model Area {
      id          String
      name        String  @unique
      description String?
      processes   Process[]
  }

  model Process {
      id            String
      name          String
      description   String?
      area          Area
      parentProcess Process?
      subprocesses  Process[]
      isSystem      Boolean
      status        String
      priority      String
      tools         String[]
      responsible   Json[]  // {name, email, role}
      documentation Json[]  // {title, url, type}
  }
```
## 📜 Licença

[MIT](https://opensource.org/licenses/MIT)

> **Nota:** Este projeto está em fase de desenvolvimento. Documentação será atualizada conforme novas funcionalidades forem implementadas.
  
