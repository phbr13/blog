// tabbar entradas e saidas para trocar de página
function entrou(rota) {
    document.querySelector(`body > footer > a:nth-child(${rota}) > svg > path`).style.fill = "#f56e00ff"
}
function saiu(rota) {
    document.querySelector(`body > footer > a:nth-child(${rota}) > svg > path`).style.fill = "#f5f4f5"
}

//verificação de senha para entrar na página de adm
function verificarSenha() {
    const senha = document.querySelector("#senha").value
    if(senha === "salamaleiko") {
        window.location.href = "admin_dashboard.html"
    } else {
        const senhaerrada = document.querySelector("#aviso")
        senhaerrada.style.animation = "senhaerrada normal 5s"
        setTimeout(() => {
            document.querySelector("#aviso").style.animation = ""
        }, 5050);
    }
}