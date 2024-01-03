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
        alert('Algo de errado com o servidor.');
    });
}

//parte do dashboard (pesquisa do conteudo)
function pesquisarFilme() {
    const filme = document.querySelector("#searchbar").value
    const resultadoPesquisa = document.querySelector("#resultado-pesquisa")
    resultadoPesquisa.innerHTML=''
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjZlMTM5MjFiODIwYWFhZmE2YTY5MjYwNDlmMmUwNyIsInN1YiI6IjY1OTViMmJiMzI2ZWMxMDY3MTA2YzE4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7JFdsfoWvql9rEP_XyrKv2SB8HpXbvJHg4o9bDhYc14'
        }
    };
    fetch(`https://api.themoviedb.org/3/search/movie?query=${filme}&include_adult=false&language=pt-BR&page=1`, options)
    .then(response => response.json())
    .then(response => {
        console.log(response.results)
        response.results.forEach(element => {
            if (element.poster_path === null) {
                imgFilme = 'imgs/none.jpg'
            } else {
                imgFilme = `https://image.tmdb.org/t/p/w500${element.poster_path}`
            }
            resultadoPesquisa.innerHTML += `
            <div class="resultado">
                <img src="${imgFilme}" alt="">
                <h5>${element.title} <span style="font-size: 13px; color: #797979;font-style: italic;">(${element.release_date})</span></h5>
                <input class="btn" type="button" value="Detalhes">
            </div>
            `
        });
    })
    .catch(err => console.error(err));
}
function pesquisarLivro() {
    console.log(document.querySelector("#searchbar").value)
}

// backdrop_path/ genre_ids/ original_title/ title/ overview/ release_date/ vote_average vote_count