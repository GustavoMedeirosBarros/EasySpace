# EasySpace

![EasySpace Logo](src/assets/images/logo.png)

## Plataforma de Compartilhamento de Espaços para Locação em Sorocaba

EasySpace é uma aplicação web desenvolvida em Angular que facilita a conexão entre proprietários de espaços (locadores) e pessoas ou empresas que necessitam desses espaços temporariamente (locatários) na cidade de Sorocaba, São Paulo.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Melhorias Futuras](#melhorias-futuras)
- [Contribuidores](#contribuidores)

## 📝 Visão Geral

O EasySpace é uma plataforma que permite aos proprietários de espaços em Sorocaba cadastrarem seus locais para aluguel por hora, dia, semana ou mês. Os usuários podem buscar, filtrar, visualizar detalhes e reservar esses espaços de acordo com suas necessidades.

A aplicação foi desenvolvida como um projeto frontend em Angular, utilizando serviços de simulação para demonstrar as funcionalidades sem a necessidade de um backend real. Os dados são persistidos localmente através do localStorage do navegador.

## 🛠️ Tecnologias Utilizadas

- **Angular 15**: Framework para desenvolvimento frontend
- **TypeScript**: Linguagem de programação
- **HTML5 & CSS3**: Estrutura e estilização
- **Angular Material**: Biblioteca de componentes UI
- **RxJS**: Biblioteca para programação reativa
- **LocalStorage API**: Para persistência de dados local
- **Power BI**: Para análise e visualização de dados

## 🚀 Instalação

1. **Pré-requisitos**
   - Node.js (v14.x ou superior)
   - npm (v6.x ou superior)
   - Angular CLI (v15.x)

2. **Clone o repositório**
   ```bash
   git clone https://github.com/GustavoMedeirosBarros/EasySpace.git
   cd easyspace

3. **Instale as Dependencias**
    ```bash
    npm install

4. **Execute a aplicação localmente**
    ```bash
    ng serve

5. ****Acesse a aplicação**
Abra seu navegador e acesse `http://localhost:4200`

## 💻 Uso

### Para Usuários (Locatários)

1. Crie uma conta ou faça login
2. Explore os espaços disponíveis
3. Use filtros para encontrar espaços específicos
4. Visualize detalhes dos espaços
5. Adicione espaços aos favoritos
6. Faça reservas selecionando datas e horários
7. Visualize suas reservas
8. Avalie espaços após utilizá-los


### Para Proprietários (Locadores)

1. Crie uma conta ou faça login
2. Acesse "Criar Anúncio" para cadastrar um novo espaço
3. Gerencie seus anúncios em "Meus Anúncios"
4. Visualize e responda às reservas recebidas
5. Edite informações e disponibilidade dos seus espaços
6. Visualize estatísticas dos seus anúncios

## ✨ Funcionalidades

- **Registro e Autenticação**: Sistema de cadastro e login com diferentes perfis
- **Gerenciamento de Espaços**: Cadastro, edição e remoção de espaços
- **Busca e Filtros**: Sistema de busca avançada com múltiplos filtros
- **Sistema de Reservas**: Processo completo de reserva com seleção de datas no formato brasileiro
- **Simulação de Pagamentos**: Interface para processamento de pagamentos
- **Avaliações e Comentários**: Sistema de avaliação de espaços
- **Notificações**: Sistema de notificações para informar usuários
- **Favoritos**: Funcionalidade para salvar espaços favoritos
- **Persistência Local**: Dados salvos no localStorage do navegador

## 🔮 Melhorias Futuras

- **Implementação de Backend**: Desenvolvimento de uma API RESTful com Node.js e MongoDB
- **Autenticação Avançada**: Implementação de JWT e OAuth para autenticação segura
- **Integração com Mapas**: Adição de visualização geográfica dos espaços
- **Sistema de Recomendação**: Implementação de algoritmos de recomendação personalizada
- **Pagamentos Reais**: Integração com gateways de pagamento como Stripe ou PayPal
- **Aplicativo Móvel**: Desenvolvimento de versões para iOS e Android
- **Expansão Geográfica**: Adição de suporte para outras cidades além de Sorocab

## 👥 Contribuidores

- [Gustavo Medeiros](https://github.com/GustavoMedeirosBarros)
- [Luccas Abreu](https://github.com/Luckvers)