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
        console.log(`--- Requisição recebida para Lat: ${lat}, Lon: ${lon} ---`);

        // URL COMPLETA - Certifique-se de que TODAS estas palavras estão aí:
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const response = await axios.get(url);
        console.log("Dados obtidos com sucesso da API externa!");
        res.json(response.data);

    } catch (error) {
        // ESSA PARTE É VITAL: Olhe o terminal do VS Code para ler o que aparecer aqui
        console.error("!!! ERRO NO SERVER.JS !!!");
        console.error("Causa:", error.message);
        
        if (error.response) {
            console.error("Detalhes da API:", error.response.data);
        }

        res.status(500).json({ error: "Erro interno no servidor Node" });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));