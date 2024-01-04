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
        response.results.forEach(element => {
            let generos 
            if (element.genre_ids.length === 0) {
                generos = "sem gêneros"
            } else {
                generos = identificarGen(element.genre_ids)
            }
            let imgFilme
            if (element.poster_path === null) {
                imgFilme = 'imgs/none.jpg'
            } else {
                imgFilme = `https://image.tmdb.org/t/p/w500${element.poster_path}`
            }
            let posterFilme
            if (element.backdrop_path === null) {
                posterFilme = 'imgs/none2.png'
            } else {
                posterFilme = `https://image.tmdb.org/t/p/w500${element.backdrop_path}`
            }
            let data
            if (element.release_date === "") {
                data = 'sem data'
            } else {
                data = `${element.release_date}`
            }
            let overview
            if (element.overview === "") {
                overview = 'Sem resumo'
            } else {
                overview = `${element.overview}`
            }
            resultadoPesquisa.innerHTML += `
            <div class="resultado">
                <img src="${imgFilme}" alt="">
                <h5>${element.title} <span style="font-size: 13px; color: #797979;font-style: italic;">(${data})</span></h5>
                <input class="btn" type="button" value="Detalhes" onclick="aparecerDetals(${element.id})">
            </div>
            <div class="card-movie-detals" id="${element.id}">
            <div class="fundo-detals" onclick="desaparecerDetals(${element.id})"></div>
            <div class="card-detals movie${element.id}">
                <img style="border: 0;" src="${posterFilme}" alt="">
                <div style="padding-right: 13px;">
                    <h5>${element.title}</h5>
                    <h5 style="margin-top: -5px;"><span style="font-size: 13px; color: #797979;font-style: italic;">${element.original_title} (${data})</span></h5>
                    <h5 style="margin-top: -5px;"><span style="font-size: 13px; color: #797979;font-style: italic;">Gênero(s): ${generos}</span></h5>
                    <h5 style="font-size: 18px;">Overview</h5> 
                    <p style="margin-bottom: 0; font-size: 16px;">${overview}</p>
                    <h5 style="font-size: 18px">Avaliação</h5>
                    <h5 style="margin-top: -5px;margin-bottom: 13px;"><span style="font-size: 13px; color: #797979;font-style: italic;">${element.vote_average.toFixed(1)}/10 de acordo com ${element.vote_count} usuário(s) do <a href="https://www.themoviedb.org/" target="_blank" style="color: #797979;">TMDB</a></span></h5>
                </div>
            </div>
            </div>
            `
        });
    })
    .catch(err => console.error(err));
}
function pesquisarLivro() {
    console.log(document.querySelector("#searchbar").value)
}

//funcoes para aparecer os detalhes dos filmes
function aparecerDetals(id) {
    const detalsFilme = document.getElementById(`${id}`)
    const cardDetal = document.querySelector(`.movie${id}`)
    detalsFilme.style.display = 'flex'
    gsap.to(detalsFilme, {
        opacity: 1,
        delay: 0.3,
        duration: 0.1,
    })
    gsap.to(cardDetal, {
        y: 0,
        opacity: 1,
        delay: 0.3,
        duration: 0.1,
    })
}

function desaparecerDetals(id) {
    const detalsFilme = document.getElementById(`${id}`)
    const cardDetal = document.querySelector(`.movie${id}`)
    gsap.to(detalsFilme, {
        opacity: 0,
        delay: 0.3,
        duration: 0.1,
    })
    gsap.to(cardDetal, {
        y: 13,
        opacity: 0,
        delay: 0.3,
        duration: 0.1,
    })
    setTimeout(() => {
        detalsFilme.style.display = 'none'
    }, 350);
}

//identificador de generos de cinema
const generos = [
    {
      id: 28,
      name: "Ação"
    },
    {
      id: 12,
      name: "Aventura"
    },
    {
      id: 16,
      name: "Animação"
    },
    {
      id: 35,
      name: "Comédia"
    },
    {
      id: 80,
      name: "Crime"
    },
    {
      id: 99,
      name: "Documentário"
    },
    {
      id: 18,
      name: "Drama"
    },
    {
      id: 10751,
      name: "Família"
    },
    {
      id: 14,
      name: "Fantasia"
    },
    {
      id: 36,
      name: "História"
    },
    {
      id: 27,
      name: "Terror"
    },
    {
      id: 10402,
      name: "Música"
    },
    {
      id: 9648,
      name: "Mistério"
    },
    {
      id: 10749,
      name: "Romance"
    },
    {
      id: 878,
      name: "Ficção científica"
    },
    {
      id: 10770,
      name: "Cinema TV"
    },
    {
      id: 53,
      name: "Thriller"
    },
    {
      id: 10752,
      name: "Guerra"
    },
    {
      id: 37,
      name: "Faroeste"
    }
]
function identificarGen(geners) {
    let generosFIlmes = ''
    for (let index1 = 0; index1 < geners.length; index1++) {
        const element = geners[index1];
        for (let index = 0; index < generos.length; index++) {
            if (element == generos[index].id) {
                generosFIlmes += `${generos[index].name}, `
            }
        }
    }
    return generosFIlmes.slice(0, -2)
}