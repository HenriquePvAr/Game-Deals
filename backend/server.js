// Desabilita verificação SSL (IMPORTANTE: Mantenha no topo)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

// Configurações
app.use(cors());
app.use(router);

// Inicialização do servidor
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});