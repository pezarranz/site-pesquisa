// 1. Imports do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. Credenciais
const firebaseConfig = {
    apiKey: "AIzaSyCVAt9i9LbtQ6uRZjAdagWbxR05LcnB4v8",
    authDomain: "site-pesquisa-engcomp.firebaseapp.com",
    projectId: "site-pesquisa-engcomp",
    storageBucket: "site-pesquisa-engcomp.firebasestorage.app",
    messagingSenderId: "661838953834",
    appId: "1:661838953834:web:484769ea2fde9077ca3913"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Função Principal
async function carregarProjetos() {
    const container = document.getElementById('lista-projetos');
    if (!container) return;

    container.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, "projetos"));
        
        querySnapshot.forEach((doc) => {
            const projeto = doc.data();
            
            // LÓGICA DE ESTADO: Define as cores da etiqueta com base no status
            let classeEstado = "";
            if (projeto.estado.toLowerCase() === "em andamento") {
                classeEstado = "bg-tertiary-fixed text-on-tertiary-fixed font-bold";
            } else if (projeto.estado.toLowerCase() === "concluído" || projeto.estado.toLowerCase() === "concluido") {
                classeEstado = "bg-surface-variant text-on-surface-variant border border-outline-variant";
            }

            // LÓGICA DE TAGS
            let tagsHTML = "";
            if (projeto.tags) {
                let listaTags = [];
                
                // Se veio como texto (String), converte
                if (typeof projeto.tags === 'string') {
                    listaTags = projeto.tags.split(',').map(tag => tag.trim());
                } 
                // Se por acaso veio como Array
                else if (Array.isArray(projeto.tags)) {
                    listaTags = projeto.tags;
                }

                // Monta os bloquinhos visuais apenas se houver itens válidos
                listaTags.forEach(tag => {
                    if (tag) {
                        tagsHTML += `<span class="bg-surface-container text-on-surface font-mono-label text-mono-label px-2 py-1 rounded-sm uppercase">${tag}</span>`;
                    }
                });
            }

            // MOLDE DO CARD
            const cardHTML = `
            <article class="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden group hover:shadow-[0px_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col">
                <div class="h-48 relative overflow-hidden bg-surface-container-low">
                    <img alt="Imagem representativa do projeto ${projeto.titulo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${projeto.foto_url}">
                    <div class="absolute top-4 right-4 font-mono-label text-mono-label px-2 py-1 rounded-sm uppercase tracking-wider ${classeEstado}">
                        ${projeto.estado}
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow gap-4">
                    <div class="flex flex-wrap gap-2">
                        ${tagsHTML}
                    </div>
                    <h2 class="font-headline-md text-headline-md text-on-surface">${projeto.titulo}</h2>
                    <p class="font-body-md text-body-md text-on-surface-variant flex-grow">
                        ${projeto.descricao}
                    </p>
                </div>
            </article>
            `;
            
            container.innerHTML += cardHTML;
        });

    } catch (erro) {
        console.error("Erro ao carregar os projetos de pesquisa:", erro);
    }
}

// 4. Inicia o processo
document.addEventListener('DOMContentLoaded', () => {
    carregarProjetos();
});

// ==========================================
// 6. LÓGICA DE SALVAMENTO: EQUIPE
// ==========================================
const formEquipe = document.getElementById('form-equipe');
const btnSalvarEquipe = document.getElementById('btn-salvar-equipe');
const inputFotoEq = document.getElementById('eq-foto');
const previewContainerEq = document.getElementById('preview-container-eq');
const imgPreviewEq = document.getElementById('img-preview-eq');
const btnRemoverFotoEq = document.getElementById('btn-remover-foto-eq');

// A. Lógica do Preview da Foto do Membro
inputFotoEq.addEventListener('change', function(evento) {
    const arquivo = evento.target.files[0];
    if (arquivo) {
        imgPreviewEq.src = URL.createObjectURL(arquivo);
        previewContainerEq.classList.remove('hidden');
    }
});

btnRemoverFotoEq.addEventListener('click', function() {
    inputFotoEq.value = ''; 
    imgPreviewEq.src = '';  
    previewContainerEq.classList.add('hidden'); 
});

// B. Lógica de Envio para o Firebase
formEquipe.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const textoOriginal = btnSalvarEquipe.innerText;
    btnSalvarEquipe.innerText = "Salvando Membro... Aguarde.";
    btnSalvarEquipe.disabled = true;
    btnSalvarEquipe.classList.add("opacity-70", "cursor-not-allowed");

    try {
        // 1. Upload da Foto (Salvando na pasta 'equipe' no Storage)
        const arquivoImagem = inputFotoEq.files[0];
        const nomeArquivoUnico = Date.now() + "_" + arquivoImagem.name;
        const referenciaStorage = ref(storage, `equipe/${nomeArquivoUnico}`);
        
        await uploadBytes(referenciaStorage, arquivoImagem);
        const urlPublicaDaFoto = await getDownloadURL(referenciaStorage);

        // 2. Empacotando os dados
        const novoMembro = {
            nome: document.getElementById('eq-nome').value.trim(),
            email: document.getElementById('eq-email').value.trim(),
            categoria: document.getElementById('eq-categoria').value,
            cargo: document.getElementById('eq-cargo').value.trim(),
            descricao: document.getElementById('eq-descricao').value.trim(),
            lattes: document.getElementById('eq-lattes').value.trim(),
            site: document.getElementById('eq-site').value.trim(),
            foto_url: urlPublicaDaFoto
        };

        // 3. Enviando para o banco de dados (Coleção 'equipe')
        await addDoc(collection(db, "equipe"), novoMembro);

        alert("Membro adicionado com sucesso!");
        formEquipe.reset();
        btnRemoverFotoEq.click(); // Força o clique no "X" para esconder o preview da foto antiga

    } catch (erro) {
        console.error("Erro ao salvar membro:", erro);
        alert("Erro ao salvar. Verifique o console para detalhes.");
    } finally {
        btnSalvarEquipe.innerText = textoOriginal;
        btnSalvarEquipe.disabled = false;
        btnSalvarEquipe.classList.remove("opacity-70", "cursor-not-allowed");
    }
});