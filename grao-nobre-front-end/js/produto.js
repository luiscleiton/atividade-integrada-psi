const mensagemProduto = document.querySelector('#mensagem-produto');
const detalheProduto = document.querySelector('#detalhe-produto');

const formatoPreco = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

// Mesmas cores utilizadas nos cards da vitrine.
const classesPorProduto = {
    1: 'produto-bourbon-amarelo',
    2: 'produto-bourbon-especial',
    3: 'produto-catuai-vermelho',
    4: 'produto-chocolate-intenso',
    5: 'produto-espresso-blend',
    6: 'produto-ethiopia-floral',
    7: 'produto-frutas-vermelhas',
    8: 'produto-honey-process',
    9: 'produto-kit-degustacao',
    10: 'produto-mantiqueira'
};

function obterIdProduto() {
    const parametros = new URLSearchParams(window.location.search);

    return parametros.get('id')?.trim();
}

function preencherDetalhes(produto) {
    const imagem = document.querySelector('#detalhe-imagem');
    const imagemProduto = document.querySelector('#detalhe-imagem-produto');

    const categoria = document.querySelector('#detalhe-categoria');
    const nome = document.querySelector('#detalhe-nome');
    const preco = document.querySelector('#detalhe-preco');
    const descricao = document.querySelector('#detalhe-descricao');
    const peso = document.querySelector('#detalhe-peso');
    const torra = document.querySelector('#detalhe-torra');
    const disponibilidade = document.querySelector(
        '#detalhe-disponibilidade'
    );

    const classeCor = classesPorProduto[produto.id];

    imagem.className = 'detalhe-imagem';

    if (classeCor) {
        imagem.classList.add(classeCor);
    }

    imagemProduto.src = produto.imagem;
    imagemProduto.alt = `Embalagem de ${produto.nome} Grão Nobre`;

    // Usa o nome da categoria incorporada, caso exista.
    // Caso contrário, utiliza as categorias atuais da vitrine.
    const categoriasPorId = {
        1: 'Em grãos',
        2: 'Moídos',
        3: 'Kits'
    };

    categoria.textContent =
        produto.categoria?.nome ||
        categoriasPorId[produto.categoriaId] ||
        'Café';

    nome.textContent = produto.nome;
    preco.textContent = formatoPreco.format(produto.preco);

    descricao.textContent =
        produto.descricao || 'Descrição não informada.';

    peso.textContent = produto.peso || 'Não informado';
    torra.textContent = produto.torra || 'Não informado';

    disponibilidade.textContent =
        Number(produto.estoque) > 0
            ? 'Disponível'
            : 'Esgotado';

    document.title = `${produto.nome} | Grão Nobre`;

    mensagemProduto.hidden = true;
    detalheProduto.classList.remove('detalhe-oculto');
}

async function carregarProduto() {
    detalheProduto.classList.add('detalhe-oculto');

    mensagemProduto.hidden = false;
    mensagemProduto.textContent = 'Carregando café...';

    const id = obterIdProduto();

    if (!id) {
        mensagemProduto.textContent =
            'Nenhum café selecionado. Volte para nossos cafés e escolha um produto.';
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/produtos/${encodeURIComponent(id)}`
        );

        if (resposta.status === 404) {
            mensagemProduto.textContent =
                'Café não encontrado. Volte para nossos cafés e escolha outro produto.';
            return;
        }

        if (!resposta.ok) {
            throw new Error(
                `Erro ao buscar produto: ${resposta.status}`
            );
        }

        const produto = await resposta.json();

        preencherDetalhes(produto);
    } catch (erro) {
        detalheProduto.classList.add('detalhe-oculto');

        mensagemProduto.hidden = false;
        mensagemProduto.textContent =
            'Não foi possível exibir este café. Tente recarregar a página.';

        console.error('Erro ao carregar o produto:', erro);
    }
}

carregarProduto();