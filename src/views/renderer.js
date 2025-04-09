/**
 * Processo de renderização do documento index.html
 */

console.log("Processo de renderização")

let arrayNotes = []

const list = document.getElementById('listNotes')

// inserção da data no rodapé
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

document.getElementById('dataAtual').innerHTML = obterData()

// Troca do icone de status de conexão do banco de dados
// uso do api preload.js
api.dbStatus((event, message) => {
    // teste de recebimento da mendagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('icondb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('icondb').src = "../public/img/dboff.png"
    }
})

//--------------------------

api.listNotes()

api.renderNotes((event, notes) => {
    const renderNotes = JSON.parse(notes) // Conversão de String para JSON
    console.log(renderNotes)

    arrayNotes = renderNotes

    arrayNotes.forEach((n) => {
        list.innerHTML += `
            <br>
            <li>
                <p>${n._id}</p>
                <p>${n.texto}</p>
                <p>${n.cor}</p>
            </li>
        `
    });
})