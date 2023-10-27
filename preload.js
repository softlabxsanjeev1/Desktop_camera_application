window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})


const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposseInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
})