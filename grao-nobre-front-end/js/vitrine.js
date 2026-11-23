const listaProdutos = document.querySelector('#lista-produtos');
const mensagemProdutos = document.querySelector('#mensagem-produtos');

const formatoPreco = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

// Configuração visual temporária, até adicionarmos corFundo aos produtos.
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

function criarCardProduto(produto) {
    const card = document.createElement('article');
    card.className = 'produto';

    const areaImagem = document.createElement('div');
    areaImagem.className = 'produto-imagem';

    const classeCor = classesPorProduto[produto.id];

    if (classeCor) {
        areaImagem.classList.add(classeCor);
    }

    const imagem = document.createElement('img');
    imagem.src = produto.imagem;
    imagem.alt = `Embalagem de ${produto.nome} Grão Nobre`;
    imagem.loading = 'lazy';

    areaImagem.append(imagem);

    if (Number(produto.estoque) === 0) {
        const selo = document.createElement('span');
        selo.className = 'produto-selo';
        selo.textContent = 'Esgotado';

        areaImagem.append(selo);
    }

    const informacoes = document.createElement('div');
    informacoes.className = 'produto-informacoes';

    const nome = document.createElement('h2');
    nome.className = 'produto-nome';
    nome.textContent = produto.nome;

    const preco = document.createElement('p');
    preco.className = 'produto-preco';
    preco.textContent = formatoPreco.format(produto.preco);

    informacoes.append(nome, preco);
    card.append(areaImagem, informacoes);

    return card;
}

function renderizarProdutos(produtos) {
    listaProdutos.replaceChildren();

    const fragmento = document.createDocumentFragment();

    produtos.forEach((produto) => {
        fragmento.append(criarCardProduto(produto));
    });

    listaProdutos.append(fragmento);
}

async function carregarVitrine() {
    mensagemProdutos.hidden = false;
    mensagemProdutos.textContent = 'Carregando cafés...';

    try {
        const produtos = await buscarProdutos();

        renderizarProdutos(produtos);

        if (produtos.length === 0) {
            mensagemProdutos.textContent = 'Nenhum café cadastrado no momento.';
            return;
        }

        mensagemProdutos.hidden = true;
    } catch (erro) {
        mensagemProdutos.textContent =
            'Não foi possível carregar os cafés. Verifique se a API está em execução.';

        console.error('Erro ao carregar a vitrine:', erro);
    }
}

carregarVitrine();