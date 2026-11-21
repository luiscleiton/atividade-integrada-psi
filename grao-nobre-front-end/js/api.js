'use strict';

const API_URL = 'http://localhost:3000';

async function listarProdutos() {
    const resposta = await fetch(`${API_URL}/produtos`);
    return resposta.json();
}