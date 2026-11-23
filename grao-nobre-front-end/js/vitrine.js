const listaProdutos = document.querySelector('#lista-produtos');
const mensagemProdutos = document.querySelector('#mensagem-produtos');
const campoBusca = document.querySelector('#busca-produtos');

const botoesCategorias = document.querySelectorAll(
    '.categorias [data-categoria]'
);

let produtosCarregados = [];
let categoriaSelecionada = 'todos';

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

function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function aplicarFiltros() {
    const termoBusca = normalizarTexto(campoBusca.value);

    const produtosFiltrados = produtosCarregados.filter((produto) => {
        const correspondeAoNome = normalizarTexto(produto.nome)
            .includes(termoBusca);

        const correspondeACategoria =
            categoriaSelecionada === 'todos' ||
            String(produto.categoriaId) === categoriaSelecionada;

        return correspondeAoNome && correspondeACategoria;
    });

    renderizarProdutos(produtosFiltrados);

    if (produtosCarregados.length === 0) {
        mensagemProdutos.textContent =
            'Nenhum café cadastrado no momento.';
        mensagemProdutos.hidden = false;
        return;
    }

    if (produtosFiltrados.length === 0) {
        mensagemProdutos.textContent =
            'Nenhum café encontrado para essa busca ou categoria.';
        mensagemProdutos.hidden = false;
        return;
    }

    mensagemProdutos.hidden = true;
}

campoBusca.addEventListener('input', aplicarFiltros);

botoesCategorias.forEach((botao) => {
    botao.addEventListener('click', () => {
        categoriaSelecionada = botao.dataset.categoria;

        botoesCategorias.forEach((item) => {
            const estaAtivo = item === botao;

            item.classList.toggle('categoria-ativa', estaAtivo);
            item.setAttribute('aria-pressed', String(estaAtivo));
        });

        aplicarFiltros();
    });
});

async function carregarVitrine() {
    mensagemProdutos.hidden = false;
    mensagemProdutos.textContent = 'Carregando cafés...';

    try {
        produtosCarregados = await buscarProdutos();

        aplicarFiltros();

        campoBusca.disabled = false;

        botoesCategorias.forEach((botao) => {
            botao.disabled = false;
        });
    } catch (erro) {
        mensagemProdutos.textContent =
            'Não foi possível carregar os cafés. Verifique se a API está em execução.';

        console.error('Erro ao carregar a vitrine:', erro);
    }
}

carregarVitrine();