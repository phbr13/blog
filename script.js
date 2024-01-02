//tabbar entradas e saidas para trocar de página
function entrou(rota) {
    document.querySelector(`body > footer > a:nth-child(${rota}) > svg > path`).style.fill = "#f56e00ff"
}
function saiu(rota) {
    document.querySelector(`body > footer > a:nth-child(${rota}) > svg > path`).style.fill = "#f5f4f5"
}

//modificação da home page para adms 
if (JSON.parse(localStorage.getItem("adm?")) == 'adm.') {
    if (window.location.pathname == "/index.html") {
        document.querySelector("#botao > span").innerHTML = 'Registrar &#10140;'
        document.querySelector("#botao > span").setAttribute( "onClick", "window.location.href = 'admin.html';" )
    }
}

//dispositivo que já entrou como adm
if (window.location.pathname == "/admin.html") {
    const adm = localStorage.getItem("adm?")
    if (adm === '"adm."') {
        verificarSenha(true)
    }
}

//verificação de senha para entrar na página de adm
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (window.location.pathname == "/admin.html") {
            verificarSenha()
        }
    }
});
function verificarSenha(AdmJaConectado) {
    let senha
    if(AdmJaConectado) {
        senha = localStorage.senha
    } else {
        senha = document.querySelector("#senha").value
    }
    fetch('http://localhost:1313/senha_adm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({senha})
        })
        .then(response => response.json())
        .then(data => {
        if(data.acerto) {
            localStorage.setItem("adm?", JSON.stringify("adm."))
            localStorage.setItem("senha", data.senha)
            document.documentElement.innerHTML = data.arquivo;
        } else {
            localStorage.setItem("senha", JSON.stringify(data.senha))
            const senhaerrada = document.querySelector("#aviso")
            senhaerrada.style.animation = "senhaerrada normal 5s"
            setTimeout(() => {
                senhaerrada.style.animation = ""
            }, 5050);
        }
        })
        .catch(error => {
        console.error('Erro ao enviar a solicitação:', error);
    });
}

//parte do dashboard (pesquisa do conteudo)
function pesquisarFilme() {
    console.log(document.querySelector("#searchbar").value)
}
function pesquisarLivro() {
    console.log(document.querySelector("#searchbar").value)
}