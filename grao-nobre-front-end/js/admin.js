'use strict';

const adminBusca = document.querySelector('#admin-busca-produtos');
const adminLista = document.querySelector('#admin-lista-produtos');
const adminMensagem = document.querySelector('#admin-mensagem');
const adminTabelaArea = document.querySelector('#admin-tabela-area');

const adminTotal = document.querySelector('#admin-total');
const adminComEstoque = document.querySelector('#admin-com-estoque');
const adminEsgotados = document.querySelector('#admin-esgotados');

let adminProdutos = [];

const adminFormatoPreco = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

// Categorias atuais do catálogo.
const adminCategoriasPorId = {
    1: 'Em grãos',
    2: 'Moídos',
    3: 'Kits'
};

function normalizarBuscaAdmin(texto) {
    return String(texto ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function obterEstoqueAdmin(produto) {
    const valor = produto.estoque;

    if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ''
    ) {
        return null;
    }

    const quantidade = Number(valor);

    if (!Number.isFinite(quantidade) || quantidade < 0) {
        return null;
    }

    return quantidade;
}

function formatarPrecoAdmin(valor) {
    if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ''
    ) {
        return 'Não informado';
    }

    const preco = Number(valor);

    return Number.isFinite(preco)
        ? adminFormatoPreco.format(preco)
        : 'Não informado';
}

function atualizarResumoAdmin() {
    const comEstoque = adminProdutos.filter((produto) => {
        const estoque = obterEstoqueAdmin(produto);

        return estoque !== null && estoque > 0;
    }).length;

    const esgotados = adminProdutos.filter((produto) => {
        return obterEstoqueAdmin(produto) === 0;
    }).length;

    adminTotal.textContent = String(adminProdutos.length);
    adminComEstoque.textContent = String(comEstoque);
    adminEsgotados.textContent = String(esgotados);
}

function criarCelulaAdmin(texto) {
    const celula = document.createElement('td');
    celula.textContent = texto;

    return celula;
}

function criarBotaoAdmin(texto, classe, nomeProduto) {
    const botao = document.createElement('button');

    botao.type = 'button';
    botao.className = `admin-botao ${classe}`;
    botao.textContent = texto;
    botao.disabled = texto !== 'Editar';

    botao.setAttribute(
        'aria-label',
        texto === 'Editar'
            ? `Abrir prévia de edição de ${nomeProduto}`
            : `${texto} ${nomeProduto} — disponível em uma próxima etapa`
    );

    return botao;
}

function criarLinhaAdmin(produto) {
    const linha = document.createElement('tr');
    const nomeProduto = produto.nome || 'Produto sem nome';

    // Produto: imagem, nome e peso.
    const celulaProduto = document.createElement('td');

    const blocoProduto = document.createElement('div');
    blocoProduto.className = 'admin-produto';

    const areaImagem = document.createElement('div');
    areaImagem.className = 'admin-produto-imagem';
    areaImagem.setAttribute('aria-hidden', 'true');

    if (produto.imagem) {
        const imagem = document.createElement('img');

        imagem.src = produto.imagem;
        imagem.alt = '';
        imagem.loading = 'lazy';

        imagem.addEventListener('error', () => {
            areaImagem.textContent = 'Sem imagem';
        }, { once: true });

        areaImagem.append(imagem);
    } else {
        areaImagem.textContent = 'Sem imagem';
    }

    const informacoes = document.createElement('div');

    const nome = document.createElement('p');
    nome.className = 'admin-produto-nome';
    nome.textContent = nomeProduto;

    const peso = document.createElement('p');
    peso.className = 'admin-produto-detalhe';
    peso.textContent = produto.peso || 'Peso não informado';

    informacoes.append(nome, peso);
    blocoProduto.append(areaImagem, informacoes);
    celulaProduto.append(blocoProduto);

    // Categoria e preço.
    const nomeCategoria =
        produto.categoria?.nome ||
        adminCategoriasPorId[produto.categoriaId] ||
        'Não informada';

    const celulaCategoria = criarCelulaAdmin(nomeCategoria);

    const celulaPreco = criarCelulaAdmin(
        formatarPrecoAdmin(produto.preco)
    );

    // Estoque e situação.
    const estoque = obterEstoqueAdmin(produto);

    const celulaEstoque = criarCelulaAdmin(
        estoque === null ? 'Não informado' : String(estoque)
    );

    const celulaSituacao = document.createElement('td');

    const situacao = document.createElement('span');
    situacao.className = 'admin-situacao';

    if (estoque === null) {
        situacao.textContent = 'Não informada';
    } else if (estoque > 0) {
        situacao.textContent = 'Disponível';
    } else {
        situacao.textContent = 'Esgotado';
    }

    celulaSituacao.append(situacao);

    // Ações ainda indisponíveis nesta etapa.
    const celulaAcoes = document.createElement('td');

    const acoes = document.createElement('div');
    acoes.className = 'admin-acoes';

    const botaoEditar = criarBotaoAdmin(
        'Editar',
        'admin-botao-secundario',
        nomeProduto
    );

    const botaoExcluir = criarBotaoAdmin(
        'Excluir',
        'admin-botao-excluir',
        nomeProduto
    );

    botaoEditar.setAttribute('aria-controls', 'admin-editor');
    botaoEditar.addEventListener('click', () => {
        abrirFormularioAdmin(produto, botaoEditar);
    });

    acoes.append(botaoEditar, botaoExcluir);
    celulaAcoes.append(acoes);

    linha.append(
        celulaProduto,
        celulaCategoria,
        celulaPreco,
        celulaEstoque,
        celulaSituacao,
        celulaAcoes
    );

    return linha;
}

function renderizarListaAdmin(produtos) {
    const fragmento = document.createDocumentFragment();

    produtos.forEach((produto) => {
        fragmento.append(criarLinhaAdmin(produto));
    });

    adminLista.replaceChildren(fragmento);
}

function aplicarBuscaAdmin() {
    const termo = normalizarBuscaAdmin(adminBusca.value);

    const produtosFiltrados = adminProdutos.filter((produto) => {
        return normalizarBuscaAdmin(produto.nome).includes(termo);
    });

    renderizarListaAdmin(produtosFiltrados);

    adminMensagem.hidden = false;

    if (adminProdutos.length === 0) {
        adminMensagem.textContent =
            'Nenhum café cadastrado no momento.';
        return;
    }

    if (produtosFiltrados.length === 0) {
        adminMensagem.textContent =
            'Nenhum café encontrado para essa busca.';
        return;
    }

    const quantidade = produtosFiltrados.length;

    adminMensagem.textContent = quantidade === 1
        ? '1 café listado.'
        : `${quantidade} cafés listados.`;
}

async function carregarPainelAdmin() {
    adminBusca.disabled = true;
    adminMensagem.hidden = false;
    adminMensagem.textContent = 'Carregando cafés...';

    adminTabelaArea.setAttribute('aria-busy', 'true');

    try {
        const produtos = await buscarProdutos();

        if (!Array.isArray(produtos)) {
            throw new Error(
                'A API não retornou uma lista de produtos.'
            );
        }

        adminProdutos = produtos;

        atualizarResumoAdmin();
        aplicarBuscaAdmin();

        adminBusca.disabled = false;
    } catch (erro) {
        adminLista.replaceChildren();

        adminTotal.textContent = '—';
        adminComEstoque.textContent = '—';
        adminEsgotados.textContent = '—';

        adminMensagem.hidden = false;
        adminMensagem.textContent =
            'Não foi possível carregar os cafés. Tente recarregar a página.';

        console.error(
            'Erro ao carregar o painel administrativo:',
            erro
        );
    } finally {
        adminTabelaArea.setAttribute('aria-busy', 'false');
    }
}

adminBusca.addEventListener('input', aplicarBuscaAdmin);

carregarPainelAdmin();

// Prévia do formulário: não envia POST, PUT, PATCH ou DELETE.
const adminEditor = document.querySelector('#admin-editor');
const adminFormulario = document.querySelector('#admin-formulario');
const adminEditorTitulo = document.querySelector('#admin-editor-titulo');
const adminCadastrar = document.querySelector('#admin-cadastrar');
const adminCancelar = document.querySelector('#admin-cancelar');
let adminOrigemFormulario = null;

const adminCoresAtuais = {
    1: '#bcebe9', 2: '#d9c8ef', 3: '#f8d1e2', 4: '#dce5f5',
    5: '#f5b1b1', 6: '#d9c8ef', 7: '#f5cdb8', 8: '#f5e5bd',
    9: '#bcebe9', 10: '#c9efd5'
};

function abrirFormularioAdmin(produto = null, origem = adminCadastrar) {
    adminOrigemFormulario = origem;
    adminFormulario.reset();
    adminEditorTitulo.textContent = produto ? 'Editar café' : 'Cadastrar café';

    if (produto) {
        const campos = ['nome', 'descricao', 'categoriaId', 'preco', 'peso', 'torra', 'estoque', 'imagem'];
        campos.forEach((campo) => {
            adminFormulario.elements.namedItem(campo).value = produto[campo] ?? '';
        });
        const cor = produto.corFundo || adminCoresAtuais[produto.id] || '#f1ede7';
        adminFormulario.elements.namedItem('corFundo').value =
            /^#[0-9a-f]{6}$/i.test(cor) ? cor : '#f1ede7';
    }

    adminEditor.hidden = false;
    adminCadastrar.setAttribute('aria-expanded', 'true');
    adminFormulario.elements.namedItem('nome').focus({ preventScroll: true });
    adminEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

adminCadastrar.addEventListener('click', () => {
    abrirFormularioAdmin();
});

adminCancelar.addEventListener('click', () => {
    adminFormulario.reset();
    adminEditor.hidden = true;
    adminCadastrar.setAttribute('aria-expanded', 'false');
    const destino = adminOrigemFormulario?.isConnected
        ? adminOrigemFormulario
        : adminCadastrar;
    destino.focus();
});

adminFormulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
});
