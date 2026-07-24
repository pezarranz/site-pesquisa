// === LÓGICA DE CÓPIA DO E-MAIL ===
    const botoesEmail = document.querySelectorAll('.btn-copiar-email');

    botoesEmail.forEach(botao => {
        botao.addEventListener('click', function() {
            const enderecoEmail = botao.getAttribute('data-email');
            
            if (!enderecoEmail) return;

            navigator.clipboard.writeText(enderecoEmail)
                .then(() => {
                    // Feedback visual: troca o ícone de carta por um ícone de "check"
                    const icone = botao.querySelector('.material-symbols-outlined');
                    const iconeOriginal = icone.textContent;
                    
                    icone.textContent = "check";
                    botao.classList.remove("text-on-surface-variant");
                    botao.classList.add("text-green-600");

                    // Reverte após 2 segundos
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