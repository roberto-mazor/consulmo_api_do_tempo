process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/clima', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        // LOG 1: Verificar o que chegou do frontend
        console.log(`--- Nova Requisição ---`);
        console.log(`Lat recebida: ${lat}`);
        console.log(`Lon recebida: ${lon}`);

        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude ou Longitude faltando" });
        }

        // Construindo a URL com crases (template literals)
        // No seu server.js, dentro da rota /clima:
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;        
        // LOG 2: Verificar a URL final antes de disparar
        console.log(`URL de destino: ${url}`);

        const response = await axios.get(url);
        
        // Se chegou aqui, deu certo
        console.log("Sucesso: Dados recebidos da Open-Meteo");
        res.json(response.data);

    } catch (error) {
        // LOG 3: O erro detalhado
        console.error("!!! ERRO NO BACKEND !!!");
        
        if (error.response) {
            // A API respondeu, mas com erro (ex: coordenadas inválidas)
            console.error("Status da API:", error.response.status);
            console.error("Mensagem da API:", error.response.data);
        } else {
            // Erro de rede ou erro no código (ex: variável errada)
            console.error("Mensagem de erro:", error.message);
        }

        res.status(500).json({ 
            error: "Falha interna", 
            message: error.message 
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));