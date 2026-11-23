'use strict';

const API_URL = 'http://localhost:3000';

async function buscarProdutos() {
    const resposta = await fetch(`${API_URL}/produtos`);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar produtos: ${resposta.status}`);
    }

    return resposta.json();
}