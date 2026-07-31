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

// 3. LIGANDO O MOTOR
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Função principal para buscar e renderizar os dados do Firebase
async function carregarPublicacoes() {
    const conteiner = document.getElementById('lista-publicacoes');
    
    if (!conteiner) return; 
    conteiner.innerHTML = ''; 

    // NOVAS ESTRUTURAS: 'Sets' guardam valores únicos. Se vierem 10 artigos de 2024, ele salva '2024' só uma vez.
    const anosUnicos = new Set();
    const topicosUnicos = new Set();

    try {
        const querySnapshot = await getDocs(collection(db, "publicacoes"));
        
        querySnapshot.forEach((doc) => {
            const artigo = doc.data();
            
            // Extrai o ano e o tópico do banco e adiciona aos nossos conjuntos
            if (artigo.ano) anosUnicos.add(artigo.ano);
            if (artigo.topico) topicosUnicos.add(artigo.topico);
            
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
            
            conteiner.innerHTML += cardHTML;
        });

        // CHAMA A NOVA FUNÇÃO PARA INJETAR AS OPÇÕES NO HTML
        atualizarFiltrosDinamicos(anosUnicos, topicosUnicos);

        // 5. ATIVA OS FILTROS SOMENTE DEPOIS QUE OS CARDS ESTÃO NA TELA
        configurarFiltros();

    } catch (erro) {
        console.error("Erro ao comunicar com o banco de dados:", erro);
    }
}

// NOVA FUNÇÃO: Transforma os dados extraídos em <option> no HTML
function atualizarFiltrosDinamicos(anos, topicos) {
    const selectAno = document.getElementById('filtro-ano');
    const selectTopico = document.getElementById('filtro-topico');

    if (selectAno) {
        // Converte o Set para Array e ordena de forma decrescente (mais novo pro mais antigo)
        const anosOrdenados = Array.from(anos).sort((a, b) => b - a);
        
        // Reseta o menu mantendo apenas a opção "Todos os Anos"
        selectAno.innerHTML = '<option value="todos">Todos os Anos</option>';
        
        // Injeta os anos reais encontrados no banco
        anosOrdenados.forEach(ano => {
            selectAno.innerHTML += `<option value="${ano}">${ano}</option>`;
        });
    }

    if (selectTopico) {
        // Converte o Set para Array e ordena em ordem alfabética
        const topicosOrdenados = Array.from(topicos).sort();
        
        // Reseta o menu mantendo apenas a opção "Todos os Tópicos"
        selectTopico.innerHTML = '<option value="todos">Todos os Tópicos</option>';
        
        // Injeta os tópicos reais encontrados no banco
        topicosOrdenados.forEach(topico => {
            // Formata para garantir que a primeira letra fique maiúscula visualmente
            const topicoFormatado = topico.charAt(0).toUpperCase() + topico.slice(1);
            selectTopico.innerHTML += `<option value="${topico}">${topicoFormatado}</option>`;
        });
    }
}

// 6. Lógica de filtragem separada em uma função
function configurarFiltros() {
    const inputBusca = document.getElementById('input-busca');
    const filtroAno = document.getElementById('filtro-ano');
    const filtroTopico = document.getElementById('filtro-topico');
    
    // Captura os cards recém-criados
    const artigos = document.querySelectorAll('.artigo-publicacao');

    function aplicarFiltros() {
        const termoBuscado = inputBusca ? inputBusca.value.toLowerCase() : "";
        const anoSelecionado = filtroAno ? filtroAno.value.toLowerCase() : "";
        const topicoSelecionado = filtroTopico ? filtroTopico.value.toLowerCase() : "";

        artigos.forEach(artigo => {
            const elementoTitulo = artigo.querySelector('h3');
            const titulo = elementoTitulo ? elementoTitulo.textContent.toLowerCase() : ""; 
            
            const anoDoArtigo = (artigo.getAttribute('data-ano') || "").toLowerCase();
            const topicoDoArtigo = (artigo.getAttribute('data-topico') || "").toLowerCase();

            const bateNome = titulo.includes(termoBuscado);
            const bateAno = (anoSelecionado === 'todos') || (anoDoArtigo === anoSelecionado);
            const bateTopico = (topicoSelecionado === 'todos') || (topicoDoArtigo === topicoSelecionado);

            if (bateNome && bateAno && bateTopico) {
                artigo.style.display = ''; 
            } else {
                artigo.style.display = 'none'; 
            }
        });

    // Adiciona os ouvintes de eventos para os filtros
    if(inputBusca) inputBusca.addEventListener('input', aplicarFiltros);
    if(filtroAno) filtroAno.addEventListener('change', aplicarFiltros);
    if(filtroTopico) filtroTopico.addEventListener('change', aplicarFiltros);
}

// 7. Ponto de partida: Manda executar a função assim que a página terminar de carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarPublicacoes();
});
}