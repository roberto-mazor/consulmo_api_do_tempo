const btnBuscar = document.getElementById('btnBuscar');
const inputCidade = document.getElementById('inputCidade');
const corpoTabela = document.getElementById('corpoTabela');
const statusCidade = document.getElementById('statusCidade');

// 1. Função para buscar Coordenadas (Latitude/Longitude)
async function buscarCoordenadas(nomeCidade) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) throw new Error("Cidade não encontrada");
    return data.results[0]; // Retorna {latitude, longitude, name, admin1}
}

// 2. Função principal para buscar o clima no seu Backend
async function carregarClima() {
    const cidadeQuery = inputCidade.value.trim();
    if (!cidadeQuery) return alert("Digite o nome de uma cidade!");

    // Feedback visual
    btnBuscar.innerText = "Buscando...";
    btnBuscar.disabled = true;

    try {
        // Passo A: Pegar coordenadas
        const local = await buscarCoordenadas(cidadeQuery);
        
        // Passo B: Chamar SEU backend Node.js
        const response = await fetch(`http://localhost:3001/clima?lat=${local.latitude}&lon=${local.longitude}`);
        const climaData = await response.json();

        exibirDados(climaData, local);

    } catch (error) {
        corpoTabela.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-red-400 font-bold">${error.message}</td></tr>`;
    } finally {
        btnBuscar.innerText = "Buscar Clima";
        btnBuscar.disabled = false;
    }
}

// 3. Renderiza os dados na tabela
function exibirDados(data, local) {
    statusCidade.innerText = `Exibindo clima para: ${local.name}, ${local.admin1 || ''} (${local.country})`;
    statusCidade.classList.remove('hidden');

    const { hourly } = data;
    // 1. Mostrar o container de destaque
    const cardDestaque = document.getElementById('cardDestaque');
    cardDestaque.classList.remove('hidden');

    // 2. Pegar valores para o destaque (usando as primeiras 24h)
    const tempsDoDia = hourly.temperature_2m.slice(0, 24);
    const atual = tempsDoDia[0]; // Temperatura da hora atual
    const maxima = Math.max(...tempsDoDia);
    const minima = Math.min(...tempsDoDia);

    // 3. Atualizar o DOM
    document.getElementById('tempAtual').innerText = `${atual}°C`;
    document.getElementById('tempMax').innerText = `${maxima}°C`;
    document.getElementById('tempMin').innerText = `${minima}°C`;

    statusCidade.innerText = `Exibindo clima para: ${local.name}, ${local.admin1 || ''}`;
    statusCidade.classList.remove('hidden');

    let rows = "";

    // Exibe as próximas 24 horas
    for (let i = 0; i < 24; i++) {
        const dataFormatada = new Date(hourly.time[i]).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        rows += `
            <tr class="hover:bg-gray-700/50 transition-colors">
                <td class="p-4 text-gray-300">${dataFormatada}</td>
                <td class="p-4 text-center font-bold text-orange-400">${hourly.temperature_2m[i]}°C</td>
                <td class="p-4 text-center font-bold text-blue-400">${hourly.apparent_temperature[i]}°C</td>
                <td class="p-4 text-center text-gray-400">${hourly.relative_humidity_2m[i]}%</td>
            </tr>
        `;
    }
    corpoTabela.innerHTML = rows;
}

// Eventos
btnBuscar.addEventListener('click', carregarClima);
inputCidade.addEventListener('keypress', (e) => { if (e.key === 'Enter') carregarClima(); });