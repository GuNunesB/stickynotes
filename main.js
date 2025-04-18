console.log("Electron - Processo principal")

// importação dos recursos do framework
// app (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (definir um menu personalizado)
// shell (acessar links externos no navegador padrão)
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

// preload.js
const path = require('node:path')

// Módulo de conexão importação 
const { conectar, desconectar } = require('./database.js')

// Importação do modelo de dados do "notes.js"
const noteModel = require('./src/models/Notes.js')

// Janela principal
let win
const createWindow = () => {
  // definindo o tema da janela claro ou ecuro
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 1010,
    height: 720,
    //frame: false,
    //resizable: false,
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })

  // Carregar o menu personalizado
  // Atenção! Antes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // carregar o documento html na janela
  win.loadFile('./src/views/index.html')
}

// janela sobre
let about
function aboutWindow() {
  nativeTheme.themeSource = 'light'
  // obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // validação (se existir a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 320,
      height: 210,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, './preload.js')// link para receber a msg
      }
    })
  }


  about.loadFile('./src/views/sobre.html')

  ipcMain.on('about-exit', () => {
    if (about && !about.isDestroyed()) {
      about.close()
    }
   
  })
}

let note
function noteWindow() {
  nativeTheme.themeSource = 'light'
  // obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // validação (se existir a janela principal)
  if (mainWindow) {
    note = new BrowserWindow({
      width: 400,
      height: 270,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')// link para receber a msg
      }
    })
  }


  note.loadFile('./src/views/nota.html')
}

// inicialização da aplicação (assíncronismo)
app.whenReady().then(() => {
  createWindow()

  //local para estabelecer conexão com o bd
  // o ipcMain.on receberá a mensagem
  // db-connect = rótulo da mensagem
  ipcMain.on('db-connect', async (event) => {
    const conectado = await conectar()
    if (conectado) {
      // enviar img para trocar icone de status de conexão do banco de dados
      setTimeout(() => {
        event.reply('db-status', "conectado")
      }, 500) // (delay de 0.5s para sincronizar com a nuvem)
    }
  })

  // só ativar a janela principal se nenhuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// se o sistem não for MAC encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Encerrar a conexão do bd quando a aplicação for finalizada
app.on('before-quit', async () => {
  await desconectar()
})

// Reduzir a verbosidade de logs não críticos (devtools)
app.commandLine.appendSwitch('log-level', '3')

// template do menu
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar nota',
        accelerator: 'Ctrl+N',
        click: () => noteWindow()
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExternal('https://github.com/GuNunesB/stickynotes')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]

//= CRUD CREATE ===============================================//

//Recebe o objeto com os dados
ipcMain.on('create-note', async (event, stickynote) => {
  console.log(stickynote)
  try {
    const newNote = noteModel({
      texto: stickynote.textNote,
      cor: stickynote.colorNote
    })
  
    // Salvar no MongoDB
    newNote.save()
  
    // Enviar ao Renderizador um pedido para limpar os campos assim que salvar uma nota
    event.reply('reset-form')

  } catch(error) {
    console.log(error)

  }  
})

//= FIM CRUD CREATE ===========================================//

//= CRUD READ ===========================================//

ipcMain.on('list-notes', async (event) => {
  try {
    const notes = await noteModel.find()
    event.reply('render-notes', JSON.stringify(notes))

  } catch (error) {
    console.log(error)
  }
})

//= FIM CRUD READ ===========================================//