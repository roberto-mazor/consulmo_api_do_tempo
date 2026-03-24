const btnBuscar = document.getElementById('btnBuscar');
const inputCidade = document.getElementById('inputCidade');
const corpoTabela = document.getElementById('corpoTabela');
const statusCidade = document.getElementById('statusCidade');

// 1. Função para buscar Coordenadas
async function buscarCoordenadas(nomeCidade) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) throw new Error("Cidade não encontrada");
    return data.results[0]; 
}

// 2. Função principal (Consome seu Backend)
async function carregarClima() {
    const cidadeQuery = inputCidade.value.trim();
    if (!cidadeQuery) return alert("Digite o nome de uma cidade!");

    btnBuscar.innerText = "Buscando...";
    btnBuscar.disabled = true;

    try {
        const local = await buscarCoordenadas(cidadeQuery);
        const response = await fetch(`http://localhost:3001/clima?lat=${local.latitude}&lon=${local.longitude}`);
        
        if (!response.ok) throw new Error("Erro ao consultar o servidor backend.");
        
        const climaData = await response.json();
        console.log("Dados recebidos:", climaData);

        exibirDados(climaData, local);

    } catch (error) {
        // Exibe o erro visualmente na tabela para o usuário
        corpoTabela.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-red-400 font-bold">${error.message}</td></tr>`;
    } finally {
        btnBuscar.innerText = "Buscar Clima";
        btnBuscar.disabled = false;
    }
}

// Dicionário de Tradução (WMO Codes)
const tradutorClima = {
    0: { txt: "Céu Limpo", icon: "☀️" },
    1: { txt: "Limpo", icon: "🌤️" },
    2: { txt: "Parcial. Nublado", icon: "⛅" },
    3: { txt: "Nublado", icon: "☁️" },
    45: { txt: "Nevoeiro", icon: "🌫️" },
    61: { txt: "Chuva Leve", icon: "🌦️" },
    80: { txt: "Pancadas", icon: "🌧️" }
};

// 3. Renderiza os dados na tela
function exibirDados(data, local) {
    // PROTEÇÃO: Verifica se os objetos principais existem
    if (!data.hourly || !data.daily) {
        throw new Error("Dados incompletos recebidos do servidor.");
    }

    const { hourly, daily } = data;
    const cardDestaque = document.getElementById('cardDestaque');
    const containerSemana = document.getElementById('containerSemana');

    // Cabeçalho de Status
    statusCidade.innerText = `Exibindo clima para: ${local.name}, ${local.admin1 || ''} (${local.country})`;
    statusCidade.classList.remove('hidden');

    // Lógica do Card de Destaque
    cardDestaque.classList.remove('hidden');
    
    // PROTEÇÃO: Garante que o array de temperatura existe antes de fazer o slice
    const tempsDoDia = (hourly.temperature_2m || []).slice(0, 24);
    
    if (tempsDoDia.length > 0) {
        const atual = tempsDoDia[0];
        const maxima = Math.max(...tempsDoDia);
        const minima = Math.min(...tempsDoDia);

        document.getElementById('tempAtual').innerText = `${atual}°C`;
        document.getElementById('tempMax').innerText = `${maxima}°C`;
        document.getElementById('tempMin').innerText = `${minima}°C`;
    }

    // Lógica da Previsão da Semana
    let cardsHtml = "";
    daily.time.forEach((dia, i) => {
        const info = tradutorClima[daily.weather_code[i]] || { txt: "Variável", icon: "🌡️" };
        const dataFormatada = new Date(dia + "T00:00").toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: 'numeric' 
        });

        cardsHtml += `
            <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center hover:border-blue-500 transition duration-300">
                <span class="text-xs font-bold text-gray-400 uppercase">${dataFormatada}</span>
                <span class="text-3xl my-2">${info.icon}</span>
                <span class="text-sm font-semibold text-gray-200">${info.txt}</span>
                <div class="flex gap-2 mt-2 text-xs">
                    <span class="text-orange-400 font-bold">${Math.round(daily.temperature_2m_max[i])}°</span>
                    <span class="text-blue-400 font-bold">${Math.round(daily.temperature_2m_min[i])}°</span>
                </div>
            </div>
        `;
    });
    containerSemana.innerHTML = cardsHtml;

    // Lógica da Tabela (Próximas 24 horas)
    let rows = "";
    for (let i = 0; i < 24; i++) {
        // PROTEÇÃO: Verifica se o campo existe antes de renderizar a linha
        if (hourly.time && hourly.time[i]) {
            const dataHora = new Date(hourly.time[i]).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            });

            // Usando fallback || 0 para evitar o erro de undefined na tela
            const temp = hourly.temperature_2m ? hourly.temperature_2m[i] : 0;
            const sensacao = hourly.apparent_temperature ? hourly.apparent_temperature[i] : 0;
            const umidade = hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : 0;

            rows += `
                <tr class="hover:bg-gray-700/50 transition-colors border-b border-gray-700/50">
                    <td class="p-4 text-gray-300">${dataHora}</td>
                    <td class="p-4 text-center font-bold text-orange-400">${temp}°C</td>
                    <td class="p-4 text-center font-bold text-blue-400">${sensacao}°C</td>
                    <td class="p-4 text-center text-gray-400">${umidade}%</td>
                </tr>
            `;
        }
    }
    corpoTabela.innerHTML = rows;
}

// Eventos
btnBuscar.addEventListener('click', carregarClima);
inputCidade.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') carregarClima(); 
});