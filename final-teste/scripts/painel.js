// 1. Imports do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 3. Proteção da Rota (O "Segurança")
onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
        document.getElementById('corpo-pagina').classList.remove('hidden');
    } else {
        window.location.href = "admin.html";
    }
});

document.getElementById('btn-sair').addEventListener('click', () => {
    signOut(auth).then(() => { window.location.href = "admin.html"; });
});

// ==========================================
// 4. LÓGICA DE SALVAMENTO DE PROJETOS
// ==========================================
const formProjeto = document.getElementById('form-projeto');
const btnSalvar = document.getElementById('btn-salvar');
const inputFoto = document.getElementById('proj-foto');
const previewContainer = document.getElementById('preview-container');
const imgPreview = document.getElementById('img-preview');
const btnRemoverFoto = document.getElementById('btn-remover-foto');

inputFoto.addEventListener('change', function(evento) {
    const arquivo = evento.target.files[0];
    if (arquivo) {
        imgPreview.src = URL.createObjectURL(arquivo);
        previewContainer.classList.remove('hidden');
    }
});

btnRemoverFoto.addEventListener('click', function() {
    inputFoto.value = ''; 
    imgPreview.src = '';  
    previewContainer.classList.add('hidden'); 
});

formProjeto.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 
    const textoOriginal = btnSalvar.innerText;
    btnSalvar.innerText = "Fazendo upload e salvando... Aguarde.";
    btnSalvar.disabled = true;
    btnSalvar.classList.add("opacity-70", "cursor-not-allowed");

    try {
        const arquivoImagem = inputFoto.files[0];
        const nomeArquivoUnico = Date.now() + "_" + arquivoImagem.name;
        const referenciaStorage = ref(storage, `projetos/${nomeArquivoUnico}`);
        
        await uploadBytes(referenciaStorage, arquivoImagem);
        const urlPublicaDaFoto = await getDownloadURL(referenciaStorage);

        const novoProjeto = {
            titulo: document.getElementById('proj-titulo').value.trim(),
            descricao: document.getElementById('proj-descricao').value.trim(),
            estado: document.getElementById('proj-estado').value,
            tags: document.getElementById('proj-tags').value.trim(),
            foto_url: urlPublicaDaFoto
        };

        await addDoc(collection(db, "projetos"), novoProjeto);
        alert("Projeto adicionado com sucesso ao site!");
        formProjeto.reset();
        btnRemoverFoto.click();
    } catch (erro) {
        console.error("Erro ao salvar projeto:", erro);
        alert("Ocorreu um erro ao salvar o projeto.");
    } finally {
        btnSalvar.innerText = textoOriginal;
        btnSalvar.disabled = false;
        btnSalvar.classList.remove("opacity-70", "cursor-not-allowed");
    }
});

// ==========================================
// 5. NAVEGAÇÃO ENTRE ABAS DO PAINEL
// ==========================================
const tabProjetos = document.getElementById('tab-projetos');
const tabEquipe = document.getElementById('tab-equipe');
const tabPublicacoes = document.getElementById('tab-publicacoes'); // NOVO

const secaoProjetos = document.getElementById('secao-projetos');
const secaoEquipe = document.getElementById('secao-equipe');
const secaoPublicacoes = document.getElementById('secao-publicacoes'); // NOVO

const classeAbaAtiva = ['text-primary', 'font-bold', 'border-b-2', 'border-primary'];
const classeAbaInativa = ['text-slate-500', 'font-medium', 'border-b-2', 'border-transparent'];

function resetarAbas() {
    // Esconde todas as seções
    secaoProjetos.classList.add('hidden');
    secaoEquipe.classList.add('hidden');
    secaoPublicacoes.classList.add('hidden');
    
    // Reseta visual de todos os botões
    [tabProjetos, tabEquipe, tabPublicacoes].forEach(tab => {
        tab.classList.remove(...classeAbaAtiva);
        tab.classList.add(...classeAbaInativa);
    });
}

tabProjetos.addEventListener('click', () => {
    resetarAbas();
    secaoProjetos.classList.remove('hidden');
    tabProjetos.classList.add(...classeAbaAtiva);
    tabProjetos.classList.remove(...classeAbaInativa);
});

tabEquipe.addEventListener('click', () => {
    resetarAbas();
    secaoEquipe.classList.remove('hidden');
    tabEquipe.classList.add(...classeAbaAtiva);
    tabEquipe.classList.remove(...classeAbaInativa);
});

tabPublicacoes.addEventListener('click', () => {
    resetarAbas();
    secaoPublicacoes.classList.remove('hidden');
    tabPublicacoes.classList.add(...classeAbaAtiva);
    tabPublicacoes.classList.remove(...classeAbaInativa);
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

formEquipe.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const textoOriginal = btnSalvarEquipe.innerText;
    btnSalvarEquipe.innerText = "Salvando Membro... Aguarde.";
    btnSalvarEquipe.disabled = true;
    btnSalvarEquipe.classList.add("opacity-70", "cursor-not-allowed");

    try {
        const arquivoImagem = inputFotoEq.files[0];
        const nomeArquivoUnico = Date.now() + "_" + arquivoImagem.name;
        const referenciaStorage = ref(storage, `equipe/${nomeArquivoUnico}`);
        
        await uploadBytes(referenciaStorage, arquivoImagem);
        const urlPublicaDaFoto = await getDownloadURL(referenciaStorage);

        const novoMembro = {
            nome: document.getElementById('eq-nome').value.trim(),
            email: document.getElementById('eq-email').value.trim(),
            categoria: document.getElementById('eq-categoria').value,
            cargo: document.getElementById('eq-cargo').value.trim(),
            descricao: document.getElementById('eq-descricao').value.trim(),
            link_academico: document.getElementById('eq-lattes').value.trim(),
            link_site: document.getElementById('eq-site').value.trim(),
            foto_url: urlPublicaDaFoto
        };

        await addDoc(collection(db, "equipe"), novoMembro);
        alert("Membro adicionado com sucesso!");
        formEquipe.reset();
        btnRemoverFotoEq.click(); 

    } catch (erro) {
        console.error("Erro ao salvar membro:", erro);
        alert("Erro ao salvar. Verifique o console.");
    } finally {
        btnSalvarEquipe.innerText = textoOriginal;
        btnSalvarEquipe.disabled = false;
        btnSalvarEquipe.classList.remove("opacity-70", "cursor-not-allowed");
    }
});

// ==========================================
// 7. LÓGICA DE SALVAMENTO: PUBLICAÇÕES
// ==========================================
const formPublicacao = document.getElementById('form-publicacao');
const btnSalvarPublicacao = document.getElementById('btn-salvar-publicacao');

formPublicacao.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 
    
    const textoOriginal = btnSalvarPublicacao.innerText;
    btnSalvarPublicacao.innerText = "Salvando Publicação...";
    btnSalvarPublicacao.disabled = true;
    btnSalvarPublicacao.classList.add("opacity-70", "cursor-not-allowed");

    try {
        const novaPublicacao = {
            titulo: document.getElementById('pub-titulo').value.trim(),
            autores: document.getElementById('pub-autores').value.trim(),
            ano: parseInt(document.getElementById('pub-ano').value),
            topico: document.getElementById('pub-topico').value.trim(),
            link: document.getElementById('pub-link').value.trim(),
            resumo: document.getElementById('pub-resumo').value.trim()
        };

        // Salva diretamente no banco (Coleção 'publicacoes')
        await addDoc(collection(db, "publicacoes"), novaPublicacao);
        
        alert("Publicação adicionada com sucesso!");
        formPublicacao.reset();

    } catch (erro) {
        console.error("Erro ao salvar publicação:", erro);
        alert("Ocorreu um erro ao salvar a publicação.");
    } finally {
        btnSalvarPublicacao.innerText = textoOriginal;
        btnSalvarPublicacao.disabled = false;
        btnSalvarPublicacao.classList.remove("opacity-70", "cursor-not-allowed");
    }
});