# 🎮 Deals Hub - Central de Ofertas de Jogos

O **Deals Hub** é uma plataforma moderna e responsiva desenvolvida para gamers que buscam as melhores promoções de jogos em diversas lojas (Steam, Epic Games, PlayStation e Xbox). O projeto agrega ofertas em tempo real, exibe requisitos de sistema e permite favoritar os jogos desejados.

**🔗 Link do Projeto:** [https://game-deals-alpha.vercel.app](https://game-deals-alpha.vercel.app)

<img width="1484" height="882" alt="image" src="https://github.com/user-attachments/assets/45f8bb63-b198-462d-a829-3ee19375de81" />


## 🚀 Funcionalidades

- **Agregação em Tempo Real:** Busca ofertas via API e Scraper da Steam, Epic Games Store, PlayStation e Xbox.
- **Sistema de Busca:** Filtre jogos instantaneamente por nome.
- **Filtros por Loja:** Visualize ofertas específicas de cada plataforma.
- **Favoritos:** Salve seus jogos desejados (armazenados localmente no navegador).
- **Detalhes Avançados:** Ao clicar em um jogo, visualize requisitos mínimos/recomendados e o menor preço histórico.
- <img width="680" height="809" alt="image" src="https://github.com/user-attachments/assets/0557850a-0121-422d-9ff7-e5194ebd71fd" />

- **Interface** Design moderno com efeitos Neon, animações de Skeleton Loading e Glitch.
- **Totalmente Responsivo:** Adaptado para dispositivos móveis e desktop.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js**: Biblioteca principal.
- **Tailwind CSS**: Estilização moderna e utilitária.
- **Lucide Icons / Custom SVGs**: Ícones minimalistas e temáticos.
- **Vite**: Ferramenta de build rápida.

### Backend
- **Node.js & Express**: Servidor de API.
- **Node-Cache**: Otimização de performance para evitar consultas repetitivas.
- **Node-Fetch**: Comunicação com APIs externas.
- **Scraper Inteligente**: Bypass de Age Gate na Steam para capturar requisitos de jogos +18.

---

## 📦 Como rodar o projeto localmente

### Pré-requisitos
- Node.js instalado (versão 18 ou superior).
- Git para clonar o repositório.

### Passo 1: Clonar o repositório

git clone [https://github.com/HenriquePvAr/Game-Deals.git](https://github.com/HenriquePvAr/Game-Deals.git)
cd Game-Deals

Passo 2: Configurar o Backend

cd backend
npm install
npm start

Passo 3: Configurar o Frontend
Abra um novo terminal na pasta raiz do projeto:
# Caso esteja na pasta backend
cd ..
npm install
npm run dev

🛡️ API e Endpoints
O backend fornece os seguintes endpoints:

GET /api/pc: Retorna promoções gerais de PC.

GET /api/epic-free: Retorna jogos grátis da Epic Games.

GET /api/console: Retorna promoções de PlayStation e Xbox.

GET /api/specs?steamAppID=XXX: Retorna requisitos de sistema de um jogo específico.

👤 Autor
Desenvolvido por Henrique Paiva - GitHub: @HenriquePvAr


