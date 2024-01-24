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

//funcao para mudar o valor das estrelas de rating
function mudarStar(valor) {
    const estrelas = document.querySelector("#estrelas")
    estrelas.innerHTML=""
    let num = Number(valor.toString()[0])
    for (let index = 0; index < num; index++) {
        estrelas.innerHTML += `
            <span class="fa fa-star checked"></span>
        `
    }
    if (valor.toString()[2] === '5') {
        estrelas.innerHTML += `
            <span class="fa fa-star halfchecked"></span>
        `
    }
}

//funcoes para aparecer e desaparecer os detalhes dos filmes/series
function aparecerDetals(id) {
    const detals = document.getElementById(`${id}`)
    const cardDetal = document.querySelector(`.obra${id}`)
    detals.style.display = 'flex'
    gsap.to(detals, {
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
    const detals = document.getElementById(`${id}`)
    const cardDetal = document.querySelector(`.obra${id}`)
    gsap.to(detals, {
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
        detals.style.display = 'none'
    }, 350);
}

//identificador de generos de filmes e series
let generosFilmes
fetch('data/generosFilmes.json')
.then(response => response.json())
.then(data => {
    generosFilmes = data})
.catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
let generosSeries
fetch('data/generosSeries.json')
.then(response => response.json())
.then(data => {
    generosSeries = data})
.catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
function identificarGen(genres, especificar) {
    let generos = ''
    let armazemGeneros
    if (especificar === 'movie') {
        armazemGeneros = generosFilmes
    } else {
        armazemGeneros = generosSeries
    }
    for (let index1 = 0; index1 < genres.length; index1++) {
        const element = genres[index1];
        for (let index = 0; index < armazemGeneros.length; index++) {
            if (element == armazemGeneros[index].id) {
                generos += `${armazemGeneros[index].name}, `
            }
        }
    }
    return generos.slice(0, -2)
}

function sumirInfosAdicao() {
    desaparecerDetals('-qualquer');
    document.querySelector('#-qualquer > div.card-detals.obra-qualquer > input[type=number]:nth-child(6)').value = 0;
    document.querySelector('#input-comentario').value = '';
    mudarStar(0)
}

//adicionar o conteudo/obras ao seu repertório pessoal(banco de dados, refúgio da inspiração, oq vc preferir chamar:D)
function adicionarCard(id, tipoObra, nome, img) {
    document.querySelector("#-qualquer > div.card-detals.obra-qualquer > h5:nth-child(2)").innerHTML = `Adicionar "${nome}"`
    const seila = document.querySelector('#botoes > input:nth-child(1)')
    seila.setAttribute('data-id', `${id}`)
    seila.setAttribute('data-tipoObra', `${tipoObra}`)
    seila.setAttribute('data-nomeObra', nome)
    document.querySelector("#-qualquer > div.card-detals.obra-qualquer > img").src = img
    aparecerDetals('-qualquer')
}
function adicionarTrue(id, tipoObra, nome) {
    document.querySelector("#botoes > input:nth-child(1)").disabled = true
    const aval = document.querySelector("#-qualquer > div.card-detals.obra-qualquer > input[type=number]:nth-child(6)")
    const coment = document.querySelector("#input-comentario")
    const obra = {
        nome: nome,
        id: id,
        tipoObra: tipoObra,
        avaliacao: aval.value,
        comentario: coment.value,
        senha: localStorage.senha
    }
    fetch('http://localhost:1313/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({obra})
        })
        .then(response => response.json())
        .then(data => {
            console.log(`%c${data.resposta}`, 'background-color: #37505F; padding: 5px; font-family: sans-serif; font-size: 10px')
            sumirInfosAdicao()
            setTimeout(() => {
                document.querySelector("#botoes > input:nth-child(1)").disabled = false
                if(data.deuruim) {
                    alert('A adição falhou! Provavelmente ocorreu um erro no servidor.')
                } else {
                    alert('A adição ocorreu com sucesso!')
                }
            }, 500);
        })
        .catch(error => {
        console.error('Erro ao enviar a solicitação:', error);
        alert('Algo de errado com o servidor.');
    });
}

//display do resultado da pesquisa generico para filmes e series
function displayContent(especificar) {
    const search = document.querySelector("#searchbar").value
    const resultadoPesquisa = document.querySelector("#resultado-pesquisa")
    resultadoPesquisa.innerHTML=''
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjZlMTM5MjFiODIwYWFhZmE2YTY5MjYwNDlmMmUwNyIsInN1YiI6IjY1OTViMmJiMzI2ZWMxMDY3MTA2YzE4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7JFdsfoWvql9rEP_XyrKv2SB8HpXbvJHg4o9bDhYc14'
        }
    };
    fetch(`https://api.themoviedb.org/3/search/${especificar}?query=${search}&include_adult=false&language=pt-BR&page=1`, options)
    .then(response => response.json())
    .then(response => {
        response.results.forEach(element => {
            let data = 'sem data'
            let nome = {
                original: '',
                brasileiro: ''
            }
            if (especificar === "tv") {
                if (element.first_air_date !== "") {
                    data = `${element.first_air_date}`
                }
                nome.original = element.original_name
                nome.brasileiro = element.name
            } else {
                if (element.release_date !== "") {
                    data = `${element.release_date}`
                }
                nome.original = element.original_title
                nome.brasileiro = element.title
            }
            let generos = "sem gêneros"
            if (element.genre_ids.length !== 0) {
                generos = identificarGen(element.genre_ids, especificar)
            }
            let img = 'imgs/none.jpg'
            if (element.poster_path !== null) {
                img = `https://image.tmdb.org/t/p/w500${element.poster_path}`
            }
            let poster = 'imgs/none2.png'
            if (element.backdrop_path !== null) {
                poster = `https://image.tmdb.org/t/p/w500${element.backdrop_path}`
            }
            let overview = 'Sem sinopse'
            if (element.overview !== "") {
                overview = `${element.overview}`
            }
            resultadoPesquisa.innerHTML += `
            <div class="resultado">
                <img src="${img}" alt="">
                <h5>${nome.brasileiro} <span style="font-size: 13px; color: #797979;font-style: italic;">(${data})</span></h5>
                <input class="btn" type="button" value="Detalhes" onclick="aparecerDetals(${element.id})">
                <input class="btn" type="button" value="Adicionar" onclick="adicionarCard(${element.id}, '${especificar}', '${nome.original}', '${poster}')">
            </div>
            <div class="card-obra-detals" id="${element.id}">
            <div class="fundo-detals" onclick="desaparecerDetals(${element.id})"></div>
            <div class="card-detals obra${element.id}">
                <img style="border: 0;" src="${poster}" alt="">
                <div style="padding-right: 13px;">
                    <h5>${nome.brasileiro}</h5>
                    <h5 style="margin-top: -5px;"><span style="font-size: 13px; color: #797979;font-style: italic;">${nome.original} (${data})</span></h5>
                    <h5 style="margin-top: -5px;"><span style="font-size: 13px; color: #797979;font-style: italic;">Gênero(s): ${generos}</span></h5>
                    <h5 style="font-size: 18px;">Sinopse</h5> 
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

//parte do dashboard (pesquisa do conteudo)
function pesquisarFilme() {
    displayContent('movie')
}
function pesquisarSerie() {
    displayContent('tv')
}
function pesquisarLivro() {
    console.log(document.querySelector("#searchbar").value)
}