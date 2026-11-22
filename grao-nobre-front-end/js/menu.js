const menuBotao = document.querySelector('.menu-botao');
const menuLista = document.querySelector('.menu-lista');

if (menuBotao && menuLista) {
    menuBotao.addEventListener('click', () => {
        const estaAberto = menuLista.classList.toggle('aberto');

        menuBotao.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
    });

    document.addEventListener('click', (evento) => {
        if (
            menuLista.classList.contains('aberto') &&
            !menuLista.contains(evento.target) &&
            !menuBotao.contains(evento.target)
        ) {
            menuLista.classList.remove('aberto');
            menuBotao.setAttribute('aria-expanded', 'false');
        }
    });
}