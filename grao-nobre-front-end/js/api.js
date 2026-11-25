'use strict';

const API_URL = 'https://grao-nobre-api-vbk5.onrender.com';

async function buscarProdutos() {
    const resposta = await fetch(`${API_URL}/produtos`);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar produtos: ${resposta.status}`);
    }

    return resposta.json();
}

// Operações demonstrativas: a API publicada não possui autenticação.
async function enviarOperacaoProduto(metodo, caminho, dados) {
    const opcoes = { method: metodo };

    if (dados !== undefined) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(`${API_URL}${caminho}`, opcoes);

    if (!resposta.ok) {
        throw new Error(`A API recusou a operação (HTTP ${resposta.status}).`);
    }

    if (metodo === 'DELETE') {
        return;
    }

    return resposta.json();
}

async function cadastrarProduto(dados) {
    return enviarOperacaoProduto('POST', '/produtos', dados);
}

async function atualizarProduto(id, dados) {
    return enviarOperacaoProduto(
        'PATCH',
        `/produtos/${encodeURIComponent(id)}`,
        dados
    );
}

async function excluirProduto(id) {
    return enviarOperacaoProduto(
        'DELETE',
        `/produtos/${encodeURIComponent(id)}`
    );
}