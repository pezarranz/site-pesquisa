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
    // === LÓGICA DE CÓPIA DO ENDEREÇO/DOI ===

    // 1. Captura todos os botões da página que possuem a classe 'btn-copiar-doi'
    const botoesDoi = document.querySelectorAll('.btn-copiar-doi');

    // 2. Faz um loop para adicionar o "espião" de clique em CADA botão individualmente
    botoesDoi.forEach(botao => {
        botao.addEventListener('click', function() {
            
            // 3. Lê o endereço exato que você cadastrou no 'data-doi' deste botão específico
            const codigoDoi = botao.getAttribute('data-doi');

            // Proteção: se o botão não tiver nada cadastrado, a função para por aqui
            if (!codigoDoi) return; 

            // 4. Aciona a Clipboard API para copiar o endereço para o Ctrl+C
            navigator.clipboard.writeText(codigoDoi)
                .then(() => {
                    // === SUCESSO: FEEDBACK VISUAL ===
                    // Busca aquele <span> isolado que criamos dentro deste botão clicado
                    const spanTexto = botao.querySelector('.texto-botao');
                    const textoOriginal = spanTexto.textContent;
                    
                    // Altera o texto e troca as cores do Tailwind para verde
                    spanTexto.textContent = "Copiado!";
                    botao.classList.remove("border-outline", "text-on-surface");
                    botao.classList.add("border-green-600", "text-green-600");

                    // 5. Cronômetro: reverte para o estado normal após 2 segundos (2000 ms)
                    setTimeout(() => {
                        spanTexto.textContent = textoOriginal;
                        botao.classList.remove("border-green-600", "text-green-600");
                        botao.classList.add("border-outline", "text-on-surface");
                    }, 2000);
                })
                .catch(erro => {
                    // === FALHA: TRATAMENTO DE ERRO ===
                    console.error("Falha ao copiar o endereço: ", erro);
                    alert("Não foi possível copiar o link para a área de transferência.");
                });
        });
    });
});
