/**
 * Processo de renderização do documento "nota.html"
 * Ctrl + Shift + i
 */

console.log("teste")

const foco = document.getElementById('inputNote')

document.addEventListener('DOMContentLoaded', () => {
    foco.focus()// iniciar documento com foca na caixa de texto
})

// Captura de dados
let formNote = document.getElementById('formNote')
let note = document.getElementById('inputNote')
let color = document.getElementById('selectColor')

//= CRUD CREATE ===============================================//

formNote.addEventListener('submit', async (event) => {
    // evitar comportamento padrão de recarregar a página
    event.preventDefault()

    console.log(note.value, color.value)

    const stickynote = {
        textNote: note.value,
        colorNote: color.value
    }

    api.createNote(stickynote)

})