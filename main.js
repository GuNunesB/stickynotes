console.log("Hello Word")

// Processo Principal do Electron - importação de recursos
const { app, BrowserWindow } = require('electron/main')

// Janela principal
let win
const createWindow = () => {
  win = new BrowserWindow({
    width: 1010,
    height: 720
    /**
     * "frame: false" faz a maioria desses abaixo
     * "minimizable: false" não permite minimizar a tela;
     * "resizable: false" não deixa redimencionar a tela;
     * "closeble:  false " não permite que fechar a tela;
     * "autoHideMenuBar: true" permite a amostra do menu;
    **/
  })

  win.loadFile('./src/views/index.html') // Carrega o documento HTML na janela
}

// Inicialização da Aplicação (assíncronismo)
app.whenReady().then(() => {
  createWindow()

  //Só ativar a janela principal caso nenhuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Se o sistema não for MAC fecha a janela quando encerrar a aplicação
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})