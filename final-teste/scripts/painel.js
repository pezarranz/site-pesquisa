// 1. Imports do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

// 3. Proteção da Rota
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
// 4. LÓGICA DE SALVAMENTO: PROJETOS
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
    btnSalvar.innerText = "Fazendo upload... Aguarde.";
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
        alert("Projeto adicionado com sucesso!");
        formProjeto.reset();
        btnRemoverFoto.click();
    } catch (erro) {
        console.error("Erro:", erro);
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
const tabPublicacoes = document.getElementById('tab-publicacoes');
const tabAtualizacoes = document.getElementById('tab-atualizacoes');
const tabParcerias = document.getElementById('tab-parcerias');
const tabGerenciar = document.getElementById('tab-gerenciar');

const secaoProjetos = document.getElementById('secao-projetos');
const secaoEquipe = document.getElementById('secao-equipe');
const secaoPublicacoes = document.getElementById('secao-publicacoes');
const secaoAtualizacoes = document.getElementById('secao-atualizacoes');
const secaoParcerias = document.getElementById('secao-parcerias');
const secaoGerenciar = document.getElementById('secao-gerenciar');

const classeAbaAtiva = ['text-primary', 'font-bold', 'border-b-2', 'border-primary'];
const classeAbaInativa = ['text-slate-500', 'font-medium', 'border-b-2', 'border-transparent'];
const classeAbaAtivaPerigo = ['text-red-600', 'font-bold', 'border-b-2', 'border-red-600']; 

function resetarAbas() {
    secaoProjetos.classList.add('hidden');
    secaoEquipe.classList.add('hidden');
    secaoPublicacoes.classList.add('hidden');
    secaoAtualizacoes.classList.add('hidden');
    secaoParcerias.classList.add('hidden');
    secaoGerenciar.classList.add('hidden');
    
    [tabProjetos, tabEquipe, tabPublicacoes, tabAtualizacoes, tabParcerias].forEach(tab => {
        tab.classList.remove(...classeAbaAtiva);
        tab.classList.add(...classeAbaInativa);
    });
    tabGerenciar.classList.remove(...classeAbaAtivaPerigo);
    tabGerenciar.classList.add(...classeAbaInativa);
}

tabProjetos.addEventListener('click', () => { resetarAbas(); secaoProjetos.classList.remove('hidden'); tabProjetos.classList.add(...classeAbaAtiva); tabProjetos.classList.remove(...classeAbaInativa); });
tabEquipe.addEventListener('click', () => { resetarAbas(); secaoEquipe.classList.remove('hidden'); tabEquipe.classList.add(...classeAbaAtiva); tabEquipe.classList.remove(...classeAbaInativa); });
tabPublicacoes.addEventListener('click', () => { resetarAbas(); secaoPublicacoes.classList.remove('hidden'); tabPublicacoes.classList.add(...classeAbaAtiva); tabPublicacoes.classList.remove(...classeAbaInativa); });
tabAtualizacoes.addEventListener('click', () => { resetarAbas(); secaoAtualizacoes.classList.remove('hidden'); tabAtualizacoes.classList.add(...classeAbaAtiva); tabAtualizacoes.classList.remove(...classeAbaInativa); });
tabParcerias.addEventListener('click', () => { resetarAbas(); secaoParcerias.classList.remove('hidden'); tabParcerias.classList.add(...classeAbaAtiva); tabParcerias.classList.remove(...classeAbaInativa); });

tabGerenciar.addEventListener('click', () => {
    resetarAbas();
    secaoGerenciar.classList.remove('hidden');
    tabGerenciar.classList.add(...classeAbaAtivaPerigo);
    tabGerenciar.classList.remove(...classeAbaInativa);
    carregarListasDeGerenciamento(); 
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
    if (arquivo) { imgPreviewEq.src = URL.createObjectURL(arquivo); previewContainerEq.classList.remove('hidden'); }
});

btnRemoverFotoEq.addEventListener('click', function() {
    inputFotoEq.value = ''; imgPreviewEq.src = ''; previewContainerEq.classList.add('hidden'); 
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
        console.error("Erro:", erro);
        alert("Erro ao salvar.");
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

        await addDoc(collection(db, "publicacoes"), novaPublicacao);
        alert("Publicação adicionada!");
        formPublicacao.reset();
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao salvar.");
    } finally {
        btnSalvarPublicacao.innerText = textoOriginal;
        btnSalvarPublicacao.disabled = false;
        btnSalvarPublicacao.classList.remove("opacity-70", "cursor-not-allowed");
    }
});

// ==========================================
// 8. LÓGICA DE SALVAMENTO: ATUALIZAÇÕES
// ==========================================
const formAtualizacao = document.getElementById('form-atualizacao');
const btnSalvarAtualizacao = document.getElementById('btn-salvar-atualizacao');

formAtualizacao.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 
    const textoOriginal = btnSalvarAtualizacao.innerText;
    btnSalvarAtualizacao.innerText = "Publicando...";
    btnSalvarAtualizacao.disabled = true;
    btnSalvarAtualizacao.classList.add("opacity-70", "cursor-not-allowed");

    try {
        const novaAtualizacao = {
            titulo: document.getElementById('atu-titulo').value.trim(),
            data: document.getElementById('atu-data').value.trim(),
            descricao: document.getElementById('atu-mensagem').value.trim()
        };
        await addDoc(collection(db, "atualizacoes"), novaAtualizacao);
        alert("Atualização publicada!");
        formAtualizacao.reset();
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao publicar.");
    } finally {
        btnSalvarAtualizacao.innerText = textoOriginal;
        btnSalvarAtualizacao.disabled = false;
        btnSalvarAtualizacao.classList.remove("opacity-70", "cursor-not-allowed");
    }
});

// ==========================================
// 9. LÓGICA VISUAL E SALVAMENTO: PARCERIAS
// ==========================================
const selectParcTipo = document.getElementById('parc-tipo');
const blocoIndustria = document.getElementById('bloco-industria');
const blocoAcademico = document.getElementById('bloco-academico');

selectParcTipo.addEventListener('change', (evento) => {
    const tipo = evento.target.value;
    if (tipo === 'industria') {
        blocoIndustria.classList.remove('hidden'); blocoIndustria.classList.add('flex');
        blocoAcademico.classList.add('hidden'); blocoAcademico.classList.remove('flex');
    } else {
        blocoAcademico.classList.remove('hidden'); blocoAcademico.classList.add('flex');
        blocoIndustria.classList.add('hidden'); blocoIndustria.classList.remove('flex');
    }
});

const formParceria = document.getElementById('form-parceria');
const btnSalvarParceria = document.getElementById('btn-salvar-parceria');
const inputFotoParc = document.getElementById('parc-foto');
const previewContainerParc = document.getElementById('preview-container-parc');
const imgPreviewParc = document.getElementById('img-preview-parc');
const btnRemoverFotoParc = document.getElementById('btn-remover-foto-parc');

inputFotoParc.addEventListener('change', function(evento) {
    const arquivo = evento.target.files[0];
    if (arquivo) { imgPreviewParc.src = URL.createObjectURL(arquivo); previewContainerParc.classList.remove('hidden'); }
});

btnRemoverFotoParc.addEventListener('click', function() {
    inputFotoParc.value = ''; imgPreviewParc.src = ''; previewContainerParc.classList.add('hidden'); 
});

formParceria.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const textoOriginal = btnSalvarParceria.innerText;
    btnSalvarParceria.innerText = "Salvando Parceiro...";
    btnSalvarParceria.disabled = true;
    btnSalvarParceria.classList.add("opacity-70", "cursor-not-allowed");

    try {
        const tipoParceria = selectParcTipo.value;
        let urlPublicaDaFoto = null;

        if (tipoParceria === 'academico' && inputFotoParc.files.length > 0) {
            const arquivoImagem = inputFotoParc.files[0];
            const nomeArquivoUnico = Date.now() + "_" + arquivoImagem.name;
            const referenciaStorage = ref(storage, `parcerias/${nomeArquivoUnico}`);
            await uploadBytes(referenciaStorage, arquivoImagem);
            urlPublicaDaFoto = await getDownloadURL(referenciaStorage);
        }

        const novaParceria = {
            categoria: tipoParceria === 'academico' ? 'academica' : 'industria', 
            nome: document.getElementById('parc-nome').value.trim()
        };

        if (tipoParceria === 'industria') {
            novaParceria.link = document.getElementById('parc-link').value.trim();
        } else {
            const valorOrigem = document.getElementById('parc-origem').value;
            novaParceria.abrangencia = valorOrigem === 'nacional' ? 'Nacional' : 'Internacional';
            novaParceria.descricao = document.getElementById('parc-descricao').value.trim();
            
            const textoTags = document.getElementById('parc-tags').value;
            novaParceria.tags = textoTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            novaParceria.logo_url = urlPublicaDaFoto; 
        }

        await addDoc(collection(db, "parcerias"), novaParceria);
        alert("Parceiro adicionado!");
        formParceria.reset();
        btnRemoverFotoParc.click();
        selectParcTipo.dispatchEvent(new Event('change'));
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao salvar parceiro.");
    } finally {
        btnSalvarParceria.innerText = textoOriginal;
        btnSalvarParceria.disabled = false;
        btnSalvarParceria.classList.remove("opacity-70", "cursor-not-allowed");
    }
});

// ==========================================
// 10. LÓGICA DE GERENCIAMENTO (LER E APAGAR)
// ==========================================
async function carregarListasDeGerenciamento() {
    const listaProjetos = document.getElementById('lista-gerenciar-projetos');
    const listaEquipe = document.getElementById('lista-gerenciar-equipe');
    const listaPublicacoes = document.getElementById('lista-gerenciar-publicacoes');
    const listaAtualizacoes = document.getElementById('lista-gerenciar-atualizacoes');
    const listaParcerias = document.getElementById('lista-gerenciar-parcerias');

    listaProjetos.innerHTML = '<li class="text-sm text-slate-500">Carregando...</li>';
    listaEquipe.innerHTML = '<li class="text-sm text-slate-500">Carregando...</li>';
    listaPublicacoes.innerHTML = '<li class="text-sm text-slate-500">Carregando...</li>';
    listaAtualizacoes.innerHTML = '<li class="text-sm text-slate-500">Carregando...</li>';
    listaParcerias.innerHTML = '<li class="text-sm text-slate-500">Carregando...</li>';

    try {
        const snapProjetos = await getDocs(collection(db, "projetos"));
        listaProjetos.innerHTML = '';
        snapProjetos.forEach(doc => {
            const proj = doc.data();
            listaProjetos.innerHTML += `
                <li class="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                    <span class="font-medium text-slate-700">${proj.titulo}</span>
                    <button onclick="apagarItem('projetos', '${doc.id}', '${proj.foto_url}')" class="text-red-500 hover:text-red-700 p-2">🗑️</button>
                </li>
            `;
        });

        const snapEquipe = await getDocs(collection(db, "equipe"));
        listaEquipe.innerHTML = '';
        snapEquipe.forEach(doc => {
            const membro = doc.data();
            listaEquipe.innerHTML += `
                <li class="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                    <span class="font-medium text-slate-700">${membro.nome}</span>
                    <button onclick="apagarItem('equipe', '${doc.id}', '${membro.foto_url}')" class="text-red-500 hover:text-red-700 p-2">🗑️</button>
                </li>
            `;
        });

        const snapPubs = await getDocs(collection(db, "publicacoes"));
        listaPublicacoes.innerHTML = '';
        snapPubs.forEach(doc => {
            const pub = doc.data();
            listaPublicacoes.innerHTML += `
                <li class="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                    <span class="font-medium text-slate-700">${pub.titulo}</span>
                    <button onclick="apagarItem('publicacoes', '${doc.id}', null)" class="text-red-500 hover:text-red-700 p-2">🗑️</button>
                </li>
            `;
        });

        const snapAtualizacoes = await getDocs(collection(db, "atualizacoes"));
        listaAtualizacoes.innerHTML = '';
        snapAtualizacoes.forEach(doc => {
            const atu = doc.data();
            listaAtualizacoes.innerHTML += `
                <li class="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                    <span class="font-medium text-slate-700">${atu.data} - ${atu.titulo}</span>
                    <button onclick="apagarItem('atualizacoes', '${doc.id}', null)" class="text-red-500 hover:text-red-700 p-2">🗑️</button>
                </li>
            `;
        });

        // E. Carregar Parcerias
        const snapParcerias = await getDocs(collection(db, "parcerias"));
        listaParcerias.innerHTML = '';
        snapParcerias.forEach(doc => {
            const parc = doc.data();
            
            // Lê usando a nova estrutura
            let tipoLabel = parc.categoria === 'industria' ? 'Indústria' : 'Acadêmica';
            
            if (parc.categoria === 'academica' && parc.abrangencia) {
                const origemStr = (parc.abrangencia === 'Nacional' || parc.abrangencia === 'nacional') ? 'Nac.' : 'Int.';
                tipoLabel += ` - ${origemStr}`;
            }

            // Usa logo_url para o botão de apagar funcionar corretamente
            const urlImg = parc.logo_url ? parc.logo_url : null;
            
            listaParcerias.innerHTML += `
                <li class="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                    <span class="font-medium text-slate-700">${parc.nome} <span class="text-xs text-slate-400">(${tipoLabel})</span></span>
                    <button onclick="apagarItem('parcerias', '${doc.id}', '${urlImg}')" class="text-red-500 hover:text-red-700 p-2">🗑️</button>
                </li>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar listas:", erro);
        alert("Erro ao buscar os dados.");
    }
}

window.apagarItem = async function(colecao, idDocumento, urlFoto) {
    if (!confirm("Tem certeza que deseja apagar este item permanentemente?")) return; 
    try {
        await deleteDoc(doc(db, colecao, idDocumento));
        if (urlFoto && urlFoto !== 'null' && urlFoto !== 'undefined' && urlFoto.trim() !== '') {
            try { await deleteObject(ref(storage, urlFoto)); } 
            catch (e) { console.warn("Foto não encontrada no Storage."); }
        }
        alert("Item apagado com sucesso!");
        carregarListasDeGerenciamento(); 
    } catch (erro) {
        console.error("Erro ao apagar:", erro);
        alert("Erro ao tentar apagar o item.");
    }
};