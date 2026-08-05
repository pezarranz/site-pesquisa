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
async function carregarEquipe() {
    const containerDocentes = document.getElementById('lista-docentes');
    const containerEstudantes = document.getElementById('lista-estudantes');

    if (!containerDocentes || !containerEstudantes) return;

    containerDocentes.innerHTML = '';
    containerEstudantes.innerHTML = '';

    try {
        // Busca na nova coleção "equipe" que você vai criar no Firebase
        const querySnapshot = await getDocs(collection(db, "equipe"));
        
        querySnapshot.forEach((doc) => {
            const membro = doc.data();
            
            // Lógica para injetar os links acadêmicos apenas se existirem no banco
            let linksHTML = '';
            if (membro.link_academico) {
                linksHTML += `<a aria-label="Acadêmico" class="text-on-surface-variant hover:text-primary transition-colors" href="${membro.link_academico}" target="_blank"><span class="material-symbols-outlined">school</span></a>`;
            }
            if (membro.link_site) {
                linksHTML += `<a aria-label="Site/LinkedIn" class="text-on-surface-variant hover:text-primary transition-colors" href="${membro.link_site}" target="_blank"><span class="material-symbols-outlined">link</span></a>`;
            }

            // SEPARAÇÃO: Verifica a categoria do membro
            if (membro.categoria === 'docente') {
                const cardDocente = `
                <article class="group flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300">
                    <div class="aspect-[4/3] bg-surface-container-low overflow-hidden relative">
                        <img class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-in-out" alt="Foto de ${membro.nome}" src="${membro.foto_url}">
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="font-headline-md text-on-surface">${membro.nome}</h3>
                        <p class="font-label-sm text-on-surface-variant uppercase mt-1 mb-4">${membro.cargo}</p>
                        <p class="font-body-md text-on-surface-variant mb-6 flex-grow">${membro.descricao || ''}</p>
                        <div class="flex gap-4 pt-4 border-t border-outline-variant/50">
                            <button aria-label="Email" data-email="${membro.email}" title="Copiar Email" class="btn-copiar-email text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center"><span class="material-symbols-outlined">mail</span></button>
                            ${linksHTML}
                        </div>
                    </div>
                </article>
                `;
                containerDocentes.innerHTML += cardDocente;

            } else if (membro.categoria === 'estudante') {
                const cardEstudante = `
                <article class="group flex flex-col bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:shadow-[0px_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300">
                    <div class="aspect-square bg-surface-container-low overflow-hidden relative border-b border-outline-variant/50">
                        <img class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="Foto de ${membro.nome}" src="${membro.foto_url}">
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="font-headline-md text-[20px] text-on-surface">${membro.nome}</h3>
                        <p class="font-label-sm text-on-surface-variant uppercase mt-1 mb-2">${membro.cargo}</p>
                        <div class="mt-auto pt-4 flex gap-3">
                            <button data-email="${membro.email}" title="Copiar Email" class="btn-copiar-email hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">mail</span></button>
                            ${linksHTML}
                        </div>
                    </div>
                </article>
                `;
                containerEstudantes.innerHTML += cardEstudante;
            }
        });

        // Ativa os botões de e-mail DEPOIS que os cards estão na tela
        configurarBotoesEmail();

    } catch (erro) {
        console.error("Erro ao carregar equipe:", erro);
    }
}

// Código original encapsulado em uma função
function configurarBotoesEmail() {
    const botoesEmail = document.querySelectorAll('.btn-copiar-email');
    botoesEmail.forEach(botao => {
        botao.addEventListener('click', function() {
            const enderecoEmail = botao.getAttribute('data-email');
            
            if (!enderecoEmail) return;

            navigator.clipboard.writeText(enderecoEmail)
                .then(() => {
                    const icone = botao.querySelector('.material-symbols-outlined');
                    const iconeOriginal = icone.textContent;
                    
                    icone.textContent = "check";
                    botao.classList.remove("text-on-surface-variant");
                    botao.classList.add("text-green-600");

                    setTimeout(() => {
                        icone.textContent = iconeOriginal;
                        botao.classList.remove("text-green-600");
                        botao.classList.add("text-on-surface-variant");
                    }, 2000);
                })
                .catch(erro => {
                    console.error("Falha ao copiar o e-mail: ", erro);
                    alert("Não foi possível copiar o e-mail.");
                });
        });
    });
}

// Inicia o processo
document.addEventListener('DOMContentLoaded', () => {
    carregarEquipe();
});