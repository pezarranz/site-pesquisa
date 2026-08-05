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

// Função Principal (busca e renderiza os dados do Firebase)
async function carregarAtualizacoes() {
    const container = document.getElementById('lista-atualizacoes');
    if (!container) return;

    container.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, "atualizacoes"));
        
        // array de dados para ordenar do mais recente para o mais antigo
        let listaNoticias = [];
        querySnapshot.forEach((doc) => {
            listaNoticias.push(doc.data());
        });

        // ordem baseada em um campo numérico chamado 'ordem' (ex: 3, 2, 1)
        listaNoticias.sort((a, b) => b.ordem - a.ordem);

        // gera o HTML pra cada notícia
        listaNoticias.forEach((noticia) => {
            const cardHTML = `
            <article class="group py-6 border-b border-outline-variant flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 hover:bg-surface-container-low transition-colors duration-200 cursor-pointer px-4 -mx-4 md:px-0 md:mx-0">
                <div class="w-32 font-mono-label text-mono-label text-secondary shrink-0">
                    ${noticia.data}
                </div>
                <div class="flex-grow">
                    <h3 class="font-headline-md text-headline-md text-primary group-hover:text-on-tertiary-container transition-colors mb-2">
                        ${noticia.titulo}
                    </h3>
                    <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                        ${noticia.descricao}
                    </p>
                </div>
            </article>
            `;
            // concatenando novas informações ao conteúdo antigo
            container.innerHTML += cardHTML;
        });

    } catch (erro) {
        console.error("Erro ao carregar as atualizações:", erro);
    }
}

// Inicia o processo 
document.addEventListener('DOMContentLoaded', () => {
    carregarAtualizacoes();
});