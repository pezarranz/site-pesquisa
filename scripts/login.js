import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Elementos da tela HTML
const formLogin = document.getElementById('form-login');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const mensagemErro = document.getElementById('mensagem-erro');
const btnEntrar = document.getElementById('btn-entrar');

// O Evento de "Submit" (Quando o usuáiro clica em Entrar)
formLogin.addEventListener('submit', async (evento) => {
    // Evita que a página recarregue ao enviar o formulário
    evento.preventDefault();

    // Muda o texto do botão para dar um feedback visual enquanto o servidor pensa
    const textoOriginalBotao = btnEntrar.innerText;
    btnEntrar.innerText = "Verificando...";
    btnEntrar.disabled = true;
    
    // Esconde qualquer mensagem de erro anterior
    mensagemErro.classList.add('hidden');

    try {
        // Tenta fazer o login com o Firebase
        await signInWithEmailAndPassword(auth, inputEmail.value, inputSenha.value);
        
        // Se a linha de cima funcionar (senha correta), o código continua aqui:
        // Redireciona a cliente para a página do painel (que vamos criar a seguir)
        window.location.href = "painel.html";

    } catch (erro) {
        // Se a senha estiver errada, o Firebase joga um erro e o código cai aqui no 'catch'
        console.error("Erro no login:", erro.code);
        
        // Exibe o texto de erro para a cliente
        mensagemErro.classList.remove('hidden');
        
        // Traduzindo os erros técnicos do Firebase para português amigável
        if (erro.code === 'auth/invalid-credential' || erro.code === 'auth/wrong-password' || erro.code === 'auth/user-not-found') {
            mensagemErro.innerText = "E-mail ou senha incorretos. Tente novamente.";
        } else if (erro.code === 'auth/too-many-requests') {
            mensagemErro.innerText = "Muitas tentativas falhas. Tente novamente mais tarde.";
        } else {
            mensagemErro.innerText = "Ocorreu um erro ao tentar entrar. Contate o suporte.";
        }

        // Restaura o botão
        btnEntrar.innerText = textoOriginalBotao;
        btnEntrar.disabled = false;
    }
});