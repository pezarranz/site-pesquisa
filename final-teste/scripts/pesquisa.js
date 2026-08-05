// Imports do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Credenciais
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

// Função Principal
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
            // caso tag "em andamento"
            if (projeto.estado.toLowerCase() === "em andamento") {
                classeEstado = "bg-tertiary-fixed text-on-tertiary-fixed font-bold";
            } 
            // caso tag "concluído"
            else if (projeto.estado.toLowerCase() === "concluído" || projeto.estado.toLowerCase() === "concluido") {
                classeEstado = "bg-surface-variant text-on-surface-variant border border-outline-variant";
            }

            // LÓGICA DE TAGS: Preparada para lidar tanto com Strings quanto com Arrays
            let tagsHTML = "";
            if (projeto.tags) {
                let listaTags = [];
                
                // 1. Se veio do Firebase como Texto (String): "Arquitetura, IA"
                // lidamos esse caso removendo as virgulas e transformando em dois(ou mais) itens
                if (typeof projeto.tags === 'string') {
                    listaTags = projeto.tags.split(',').map(tag => tag.trim());
                } 
                // 2. Se veio do Firebase já como uma Lista (Array): ["Arquitetura", "IA"]
                else if (Array.isArray(projeto.tags)) {
                    listaTags = projeto.tags;
                }

                // construindo visuais das tags no HTML
                listaTags.forEach(tag => {
                    tagsHTML += `<span class="bg-surface-container text-on-surface font-mono-label text-mono-label px-2 py-1 rounded-sm uppercase">${tag}</span>`;
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

// Inicia o processo
document.addEventListener('DOMContentLoaded', () => {
    carregarProjetos();
});