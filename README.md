Monitore.me - Sistema de Gerenciamento de Monitoria
1. Descrição
Monitore.me é uma plataforma web desenvolvida para otimizar a conexão entre alunos e monitores no ambiente acadêmico. O sistema permite que monitores gerenciem disciplinas, salas e aulas, enquanto os alunos podem visualizar perfis, receber notificações e avaliar as monitorias, criando um ecossistema de aprendizado colaborativo e eficiente.

Este projeto foi desenvolvido como parte do portfólio para a conclusão do curso de Engenharia de Software do Centro Universitário - Católica de Santa Catarina em Joinville.

2. Status do Projeto
O projeto está em desenvolvimento ativo. A fundação da aplicação, incluindo a arquitetura de backend, frontend e banco de dados, está estabelecida. As funcionalidades essenciais de autenticação e gerenciamento de perfis para alunos e monitores foram implementadas e testadas.

Funcionalidades Implementadas:

✅ Sistema de Registro e Login com autenticação via JWT.

✅ Distinção de papéis (aluno, monitor) com redirecionamento específico.

✅ Visualização de perfil para Alunos e Monitores.

✅ Criação e listagem de Disciplinas e Salas de Aula (funcionalidade do Monitor).

✅ Sistema de Avaliação de Monitores (iniciado).

✅ Sistema de Controle de Presença (iniciado).

3. Arquitetura da Aplicação
O projeto segue uma arquitetura moderna e desacoplada, garantindo a separação de responsabilidades e a escalabilidade.

Backend (API RESTful): Construído com Node.js e Express.js, é responsável por toda a lógica de negócio, segurança e comunicação com o banco de dados.

Frontend (Single Page Application - SPA): Construído com React, consome a API do backend para criar uma interface de usuário dinâmica e interativa. A navegação é gerenciada pela biblioteca React Router.

Banco de Dados: Utiliza MySQL para persistência e integridade dos dados.

4. Stack Tecnológica
Categoria

Tecnologia/Ferramenta

Propósito

Backend

Node.js, Express.js

Criação do servidor e da API RESTful

Frontend

React, React Router DOM

Construção da interface de usuário e navegação

Banco de Dados

MySQL

Armazenamento persistente dos dados

Segurança

bcrypt, jsonwebtoken (JWT)

Criptografia de senhas e autenticação baseada em token

Testes (Backend)

Jest, Supertest

Testes de unidade e integração para a API

Testes (API)

Postman

Testes manuais e validação dos endpoints da API

Qualidade de Código

SonarQube, SonarScanner

Análise estática de código para identificar bugs e vulnerabilidades

Ambiente

VS Code, Git/GitHub, Java 17

Editor de código, controle de versão e runtime para SonarQube

5. Como Executar o Projeto Localmente
Siga os passos abaixo para configurar e rodar a aplicação no seu ambiente de desenvolvimento.

Pré-requisitos
Node.js (versão 16 ou superior)

MySQL (servidor local ou remoto)

SonarQube (servidor local rodando, requer Java 17)

Git

5.1. Backend
Clone o repositório:

git clone https://github.com/j0SE12/monitore_me.git
cd monitore_me/backend 

Instale as dependências:

npm install

Configure o Banco de Dados:

Crie um banco de dados MySQL para o projeto.

Execute os scripts SQL (localizados no apêndice da documentação completa) para criar as tabelas usuarios, disciplinas, salas_de_aula, etc.

Renomeie o arquivo .env.example para .env e preencha com as suas credenciais do banco de dados.

Inicie o servidor backend:

npm start

O servidor estará rodando em http://localhost:9000.

5.2. Frontend
Abra um novo terminal e navegue até a pasta do frontend:

cd ../frontend 

Instale as dependências:

npm install

Configure as Variáveis de Ambiente:

Renomeie o arquivo .env.example para .env.

Certifique-se de que a variável REACT_APP_BACKEND_URL está apontando para o seu servidor backend:

REACT_APP_BACKEND_URL=http://localhost:9000

Inicie a aplicação React:

npm start

A aplicação estará acessível em http://localhost:3000.

6. Testes e Qualidade de Código
A qualidade do código é garantida através de uma suíte de testes automatizados para o backend e análise estática contínua.

Testes de Backend: Utilizando Jest e Supertest, os testes cobrem todos os endpoints da API, simulando dependências para garantir testes de unidade rápidos e confiáveis. Para rodar os testes:

# No diretório do backend
npm test

Análise Estática: O SonarQube está integrado ao fluxo de trabalho para inspecionar o código em busca de bugs, vulnerabilidades e "code smells", garantindo que o código se mantenha limpo e seguro.


