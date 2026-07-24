// Aguarda o HTML ser totalmente carregado pelo navegador
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Captura os campos de interação do usuário
    const inputBusca = document.getElementById('input-busca');
    const filtroAno = document.getElementById('filtro-ano');
    const filtroTopico = document.getElementById('filtro-topico');
    
    // 2. Captura todos os cards de publicação que configuramos
    const artigos = document.querySelectorAll('.artigo-publicacao');

    // 3. Função que executa a lógica de filtragem
    function aplicarFiltros() {
        // Pega os valores atuais dos inputs e converte para minúsculo
        const termoBuscado = inputBusca.value.toLowerCase();
        const anoSelecionado = filtroAno.value.toLowerCase();
        const topicoSelecionado = filtroTopico.value.toLowerCase();

        // Faz um loop por todos os cards capturados
        artigos.forEach(artigo => {
            
            // Busca o título de forma segura (evita o erro de null pointer)
            const elementoTitulo = artigo.querySelector('h3');
            const titulo = elementoTitulo ? elementoTitulo.textContent.toLowerCase() : ""; 
            
            // Lê as informações dos atributos data-ano e data-topico
            const anoDoArtigo = (artigo.getAttribute('data-ano') || "").toLowerCase();
            const topicoDoArtigo = (artigo.getAttribute('data-topico') || "").toLowerCase();

            // Analisa as regras lógicas: 
            // O título inclui o termo digitado?
            const bateNome = titulo.includes(termoBuscado);
            // O filtro está em 'todos' ou o ano do artigo é igual ao ano selecionado?
            const bateAno = (anoSelecionado === 'todos') || (anoDoArtigo === anoSelecionado);
            // O filtro está em 'todos' ou o tópico do artigo é igual ao selecionado?
            const bateTopico = (topicoSelecionado === 'todos') || (topicoDoArtigo === topicoSelecionado);

            // Se o card passar nas 3 condições, ele aparece. Se falhar em uma, ele some.
            if (bateNome && bateAno && bateTopico) {
                artigo.style.display = ''; 
            } else {
                artigo.style.display = 'none'; 
            }
        });
    // NOVA ETAPA: Limpeza das seções vazias
        // 1. Captura todas as seções (os blocos de cada ano)
        const secoes = document.querySelectorAll('section');

        // 2. Faz um loop por cada seção
        secoes.forEach(secao => {
            // Pega todos os artigos APENAS dentro desta seção específica
            const artigosDestaSecao = secao.querySelectorAll('.artigo-publicacao');
            
            // Variável de controle: assume que não tem nada visível no início
            let temAlgoVisivel = false;

            // Verifica card por card desta seção
            artigosDestaSecao.forEach(artigo => {
                // Se o display NÃO for 'none', significa que ele está visível na tela
                if (artigo.style.display !== 'none') {
                    temAlgoVisivel = true;
                }
            });

            // Se depois de verificar tudo, não achou nada visível, esconde a seção (e o título do ano junto)
            if (!temAlgoVisivel) {
                secao.style.display = 'none';
            } else {
                secao.style.display = ''; // Mostra a seção se tiver algo
            }
        });
    }

    // 4. Adiciona os "espiões" para rodar a função toda vez que o usuário interagir
    inputBusca.addEventListener('input', aplicarFiltros);
    filtroAno.addEventListener('change', aplicarFiltros);
    filtroTopico.addEventListener('change', aplicarFiltros);
});