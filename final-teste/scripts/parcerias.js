import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function carregarParcerias() {
    const containerAcademicas = document.getElementById('container-academicas');
    const containerIndustria = document.getElementById('container-industria');
    const sectionIndustria = document.getElementById('section-industria');

    if (!containerAcademicas || !containerIndustria) return;

    // Mantém apenas a grade de fundo intacta
    const backgroundGrid = `<div class="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>`;
    containerAcademicas.innerHTML = backgroundGrid;
    containerIndustria.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, "parcerias"));
        
        // Se não houver nenhum parceiro, a função encerra e a aba fica vazia
        if (querySnapshot.empty) return;

        let academicas = [];
        let industria = [];

        // Separa os dados pelas categorias
        querySnapshot.forEach((doc) => {
            const parceiro = doc.data();
            if (parceiro.categoria === 'academica') {
                academicas.push(parceiro);
            } else if (parceiro.categoria === 'industria') {
                industria.push(parceiro);
            }
        });

        // 1. Renderiza Parcerias Acadêmicas com Lógica Cíclica
        academicas.forEach((parceiro, index) => {
            const ciclo = index % 4; // Retorna 0, 1, 2 ou 3
            
            // Renderiza as tags (se existirem no banco)
            let tagsHTML = '';
            if (parceiro.tags && Array.isArray(parceiro.tags)) {
                tagsHTML = parceiro.tags.map(tag => 
                    `<span class="font-label-sm text-label-sm ${ciclo >= 2 ? 'text-tertiary-fixed flex items-center gap-1' : 'bg-surface-container-high text-secondary px-3 py-1 rounded'}">
                        ${ciclo >= 2 ? '<span class="material-symbols-outlined text-[16px]">terminal</span>' : ''}
                        ${tag}
                    </span>`
                ).join('');
            }

            let cardHTML = '';

            // Card 1: Largo Claro (USP)
            if (ciclo === 0) {
                cardHTML = `
                <div class="md:col-span-8 bg-surface-container border border-outline-variant/30 rounded-lg p-8 relative overflow-hidden group hover:shadow-[0px_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-tertiary-fixed-dim/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div class="flex flex-col h-full relative z-10">
                        <div class="flex items-center justify-between mb-8">
                            <div class="h-16 w-32 bg-white rounded flex items-center justify-center p-2 shadow-sm border border-outline-variant/20">
                                <img class="object-contain h-full w-full opacity-80 mix-blend-multiply" src="${parceiro.logo_url}" alt="Logo ${parceiro.nome}">
                            </div>
                            <span class="font-mono-label text-mono-label bg-surface-variant text-on-surface-variant px-3 py-1 rounded-sm uppercase tracking-wider">${parceiro.abrangencia || 'Nacional'}</span>
                        </div>
                        <h3 class="font-headline-lg text-headline-lg text-primary mb-4">${parceiro.nome}</h3>
                        <p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">${parceiro.descricao}</p>
                        <div class="flex gap-2 flex-wrap">${tagsHTML}</div>
                    </div>
                </div>`;
            } 
            // Card 2: Estreito Claro (UNICAMP)
            else if (ciclo === 1) {
                cardHTML = `
                <div class="md:col-span-4 bg-surface-container border border-outline-variant/30 rounded-lg p-8 relative overflow-hidden group hover:shadow-[0px_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300">
                    <div class="flex flex-col h-full relative z-10">
                        <div class="mb-8">
                            <div class="h-12 w-24 bg-white rounded flex items-center justify-center p-2 shadow-sm border border-outline-variant/20">
                                <img class="object-contain h-full w-full opacity-80 mix-blend-multiply" src="${parceiro.logo_url}" alt="Logo ${parceiro.nome}">
                            </div>
                        </div>
                        <h3 class="font-headline-md text-headline-md text-primary mb-3">${parceiro.nome}</h3>
                        <p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">${parceiro.descricao}</p>
                        <div class="mt-auto flex gap-2 flex-wrap">${tagsHTML}</div>
                    </div>
                </div>`;
            } 
            // Cards 3 e 4: Escuros (MIT / Stanford)
            else if (ciclo === 2 || ciclo === 3) {
                cardHTML = `
                <div class="md:col-span-6 bg-[#0a1122] border border-outline-variant/20 rounded-lg p-8 relative overflow-hidden group hover:shadow-[0px_4px_20px_rgba(15,23,42,0.15)] transition-all duration-300">
                    ${ciclo === 2 ? '<div class="absolute inset-0 bg-gradient-to-br from-tertiary-fixed-dim/5 to-transparent pointer-events-none"></div>' : ''}
                    <div class="flex flex-col h-full relative z-10">
                        <div class="flex items-center justify-between mb-8">
                            <div class="h-16 w-32 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center p-2 border border-white/10">
                                <img class="object-contain h-full w-full opacity-90 invert" src="${parceiro.logo_url}" alt="Logo ${parceiro.nome}">
                            </div>
                            <span class="font-mono-label text-mono-label bg-white/10 text-tertiary-fixed px-3 py-1 rounded-sm uppercase tracking-wider border border-white/10">${parceiro.abrangencia || 'Internacional'}</span>
                        </div>
                        <h3 class="font-headline-lg text-headline-lg text-white mb-4">${parceiro.nome}</h3>
                        <p class="font-body-md text-body-md text-slate-300 mb-6 flex-grow">${parceiro.descricao}</p>
                        <div class="flex gap-4 flex-wrap mt-auto border-t border-white/10 pt-4">${tagsHTML}</div>
                    </div>
                </div>`;
            }

            containerAcademicas.innerHTML += cardHTML;
        });

        // 2. Renderiza Parcerias da Indústria
        if (industria.length > 0) {
            sectionIndustria.classList.remove('hidden'); // Exibe a seção
            
            industria.forEach(parceiro => {
                const cardIndustria = `
                <a href="${parceiro.link_site || '#'}" target="_blank" class="bg-surface border border-outline-variant/30 px-6 py-4 rounded flex items-center gap-3 hover:border-tertiary-fixed-dim transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-secondary">${parceiro.icone || 'business'}</span>
                    <span class="font-label-sm text-label-sm text-primary">${parceiro.nome}</span>
                </a>`;
                containerIndustria.innerHTML += cardIndustria;
            });
        }

    } catch (erro) {
        console.error("Erro ao carregar parcerias:", erro);
    }
}

document.addEventListener('DOMContentLoaded', carregarParcerias);