## Medidor de conta de Água e Gás através de imagem

Este projeto é um back-end para um serviço de leitura automatizada de medidores de água e gás utilizando IA. 

###  Começando

**Pré-requisitos:**

* Docker
* Docker Compose
* Uma chave de API do Google Gemini 

**Rodando o projeto:**

1. Clone o repositório: `git clone https://github.com/ca-madureira/teste-backend`
2. Configure o arquivo `.env` na raiz do projeto com sua string de conexão do MongoDB Atlas.
3. Inicie os containers: `docker compose up -d`

###  Endpoints

* **POST /upload:**
    * Recebe uma imagem em base64 de um medidor.
    * Extrai o valor da leitura usando o Google Gemini.
    * Salva a leitura.
* **PATCH /confirm:**
    * Permite confirmar ou corrigir o valor da leitura obtida pelo Gemini.
* **GET /{customer code}/list:**
    * Lista as leituras realizadas por um cliente específico, podendo ser filtradas por tipo (água ou gás).
* **GET /upload/:id:**
    * Retorna um link temporário (válido por 1 hora) para acessar a leitura realizada. 


###  API do Google Gemini

Este projeto usa o Google Gemini para extrair a leitura dos medidores. 

* **Documentação:**
    * Chave de API: https://ai.google.dev/gemini-api/docs/api-key
    * Visão computacional: https://ai.google.dev/gemini-api/docs/vision
* **Obtenha uma chave de API gratuita:**  https://ai.google.dev/gemini-api/docs/api-key

### Tecnologias

* Node.js
* TypeScript
* Mongoose
* Docker
* Docker Compose




