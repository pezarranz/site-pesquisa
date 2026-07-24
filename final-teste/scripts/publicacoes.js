// 1. Apenas os imports via URL (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. Suas credenciais
const firebaseConfig = {
  apiKey: "AIzaSyCVAt9i9LbtQ6uRZjAdagWbxR05LcnB4v8",
  authDomain: "site-pesquisa-engcomp.firebaseapp.com",
  projectId: "site-pesquisa-engcomp",
  storageBucket: "site-pesquisa-engcomp.firebasestorage.app",
  messagingSenderId: "661838953834",
  appId: "1:661838953834:web:484769ea2fde9077ca3913"
};

// 3. LIGANDO O MOTOR (O que estava faltando)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// A partir daqui, você pode continuar com a lógica da página...

// Função principal para buscar e renderizar os dados
// Função principal para buscar e renderizar os dados do Firebase
// Função principal para buscar e renderizar os dados do Firebase
async function carregarPublicacoes() {
    const conteiner = document.getElementById('lista-publicacoes');
    
    if (!conteiner) return; 
    conteiner.innerHTML = ''; 

    try {
        const querySnapshot = await getDocs(collection(db, "publicacoes"));
        
        querySnapshot.forEach((doc) => {
            const artigo = doc.data();
            
            // AQUI ESTÁ O SEU HTML! 
            // Ele agora funciona como um molde dinâmico:
            const cardHTML = `
            <article data-ano="${artigo.ano}" data-topico="${artigo.topico}" class="artigo-publicacao bg-surface-container-lowest border border-surface-variant p-6 rounded-lg hover:shadow-[0px_4px_20px_rgba(15,23,42,0.08)] transition-shadow duration-300 flex flex-col md:flex-row gap-6">
                <div class="flex-grow">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="bg-surface-container px-2 py-1 rounded font-mono-label text-mono-label text-on-surface uppercase">${artigo.conferencia} ${artigo.ano}</span>
                        <span class="bg-surface-container px-2 py-1 rounded font-mono-label text-mono-label text-on-surface uppercase">${artigo.topico}</span>
                    </div>
                    <h3 class="font-headline-md text-headline-md text-primary mb-2">${artigo.titulo}</h3>
                    <p class="font-body-md text-body-md text-on-surface-variant mb-4">
                        ${artigo.autores}
                    </p>
                    <p class="font-body-md text-body-md text-on-surface max-w-4xl line-clamp-2 mb-4">
                        ${artigo.resumo}
                    </p>
                </div>
                <div class="md:w-48 flex flex-col justify-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-surface-variant pt-4 md:pt-0 md:pl-6">
                    <a href="${artigo.link_pdf}" target="_blank" class="w-full bg-primary text-on-primary py-2 rounded-DEFAULT font-label-sm text-label-sm hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors">
                        <span class="material-symbols-outlined text-[18px]" data-icon="picture_as_pdf">picture_as_pdf</span>
                        PDF
                    </a>
                    <a href="${artigo.doi}" target="_blank" rel="noopener noreferrer" class="w-full bg-transparent border border-outline text-on-surface py-2 rounded-DEFAULT font-label-sm text-label-sm hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[18px]" data-icon="link">link</span>
                        <span class="texto-botao">DOI</span>
                    </a>
                </div>
            </article>
            `;
            
            // Injeta o molde finalizado dentro da <div> vazia do seu HTML
            conteiner.innerHTML += cardHTML;
        });

    } catch (erro) {
        console.error("Erro ao comunicar com o banco de dados:", erro);
    }
}

// Manda rodar a função assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarPublicacoes();
});

// 6. Manda executar a função assim que a página terminar de carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarPublicacoes();
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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