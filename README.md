# consulmo_api_do_tempo

# 🌤️ Dashboard Climático - Full Stack (Senac)

Projeto desenvolvido para o curso técnico, focado no consumo de APIs meteorológicas em tempo real utilizando uma arquitetura **Proxy Backend** com Node.js e um **Frontend Dinâmico** com Tailwind CSS.

## 🚀 Funcionalidades

- **Busca por Cidade:** Integração com Geocoding API para converter nomes de cidades em coordenadas.
- **Previsão em Tempo Real:** Dados atuais de temperatura, sensação térmica e umidade.
- **Previsão da Semana:** Visualização dos próximos 7 dias com ícones e temperaturas máxima/mínima.
- **Histórico 24h:** Tabela detalhada com a variação horária.
- **Dark Mode:** Interface moderna e confortável para leitura.

## 🛠️ Tecnologias Utilizadas

### **Frontend**
* **HTML5 & JavaScript (ES6+):** Manipulação de DOM e consumo de API via Fetch.
* **Tailwind CSS:** Estilização utilitária e responsividade.
* **Open-Meteo API:** Provedor de dados climáticos e geocodificação.

### **Backend**
* **Node.js & Express:** Servidor para intermediação de requisições.
* **Axios:** Cliente HTTP para comunicação com a API externa.
* **CORS:** Configuração de segurança para permitir o acesso do frontend.

---

## 📦 Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone [https://github.com/seu-usuario/consulmo_api_do_tempo.git](https://github.com/seu-usuario/consulmo_api_do_tempo.git)
cd consulmo_api_do_tempo
```

# Entre na pasta do backend (se houver)
### 2️⃣ Configurar o Backend
```bash
# Instalar dependências
npm install

# Rodar o servidor
npm run dev
```

O servidor iniciará em:  
👉 http://localhost:3001

---

### 3️⃣ Abrir o Frontend

Basta abrir o arquivo `index.html` no seu navegador.

💡 **Recomendação:** Utilize a extensão **Live Server** do VS Code.

---

## 🛡️ Desafios Técnicos Superados

### 🔐 Certificado SSL (Self-signed certificate)

Durante o desenvolvimento em rede acadêmica/corporativa, houve um bloqueio de segurança do Node.js ao tentar acessar a API externa (SSL/TLS).

**Solução:**
```javascript
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

Essa configuração permitiu o tráfego através do proxy da instituição.

---

### 🔄 Tratamento de Dados (Arrays Paralelos)

A API Open-Meteo retorna os dados em arrays separados (tempo, temperatura e umidade).

**Solução:**  
Implementação de lógica utilizando o índice (`index`) para sincronizar e exibir corretamente os dados na tabela e nos cards.

---

## 👨‍💻 Autor

**Roberto Mazor**  
🔗 [LinkedIn](https://www.linkedin.com/in/roberto-mazor/)