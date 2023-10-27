const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposseInMainWorld('electronAPI', {
    setImage: (data) => ipcRenderer.send('set-image', data),
}) 