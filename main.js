const { app, BrowserWindow, Menu, ipcMain } = require('electron')
// const { mainMenu } = require('./menulist')
const path = require('node:path')


const isMac = process.platform === 'darwin'
// Menu.setApplicationMenu(mainMenu)
const template = [
    // { role: 'appMenu' }
    ...(isMac
        ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }]
        : []),
    // { role: 'fileMenu' }
    {
        label: 'Electrone',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'Camera',
        click: async () => {
            const cameraWindow = await new BrowserWindow({
                title: "Camera Window",
                width: 600,
                height: 600,
                webPreferences: {
                    // contextIsolation: true,
                    nodeIntegration: true,
                    preload: path.join(__dirname, 'cameraPreload.js')
                }
            });
            // cameraWindow.webContents.openDevTools();
            Menu.setApplicationMenu(null)
            // cameraWindow.webContents.openDevTools();
            cameraWindow.loadFile('./renderer/camera.html');
            cameraWindow.once('ready-to-show', () => cameraWindow.show());
        }
    },
    {
        label: 'File',
        submenu: [
            // { role: 'editMenu' }
            {
                label: 'New Window',
                click: async () => {
                    const aboutWindow = await new BrowserWindow({
                        width: 300,
                        height: 300,
                    });
                    aboutWindow.loadFile('./renderer/about.html');
                }
            },
            // open url page in Browser window
            {
                label: 'Git Profile',
                click: async () => {
                    const aboutWindow = await new BrowserWindow({
                        title: "Your git Profile",
                        width: 500,
                        height: 400,
                        backgroundColor: "wait"
                    });
                    aboutWindow.loadURL('https://github.com/softlabxsanjeev1');
                }
            },
            // open this page on browser crome
            {
                label: 'About me',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://www.linkedin.com/in/sanjeev-kumar-1729351b3/')
                }
            },
            {
                label: 'Exit',
                click: () => {
                    app.exit()
                }
            },
            ...(isMac
                ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ]
                : [])
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac
                ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ]
                : [
                    { role: 'close' }
                ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }

]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const createWindow = () => {
    const win = new BrowserWindow({
        title: "Camera view",
        width: 800,
        height: 600,
        // alwaysOnTop: true,
        webPreferences: {
            // contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // this function use to send or get data from preloads of renderers process
    ipcMain.on('set-image', (event, data) => {
        win.webContents.send("get-image", data)
    });

    win.loadFile('./renderer/index.html')
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
// Create about window
