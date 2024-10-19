import {app} from "electron";

const template = [
    {
        label: app.name,
        role: 'appMenu',
        submenu: [
            {
                label: 'About ' + app.name,
                role: 'about'
            },
            {type: 'separator'},
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'File',
        submenu: [
            {label: 'New window', accelerator: 'CmdOrCtrl+N', click: () => createWindow('')},
            {label: 'Open', click: () => console.log('Open clicked')},
            {label: 'Save', click: () => console.log('Save clicked')},
            {type: 'separator'},
            {label: 'Exit', role: 'quit'}
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {label: 'Undo', role: 'undo'},
            {label: 'Redo', role: 'redo'},
            {type: 'separator'},
            {label: 'Cut', role: 'cut'},
            {label: 'Copy', role: 'copy'},
            {label: 'Paste', role: 'paste'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Enable Dark Mode',
                type: 'checkbox',
                checked: theme === 'dark',
                click: () => {
                    theme = theme === 'dark' ? 'light' : 'dark';
                    windows.forEach(window => {
                        // window.webContents.send('set-theme', theme);
                        // get window url
                        const url = window.webContents.getURL();
                        // reload window with new theme
                        // get hash path
                        const hashIndex = url.indexOf('#');
                        let urlPath = '';
                        if (hashIndex > -1) {
                            urlPath = url.substring(hashIndex);
                        }
                        loadWindow(window, urlPath);
                    });
                },
            },
            {role: 'reload'},
            {role: 'toggledevtools'}
        ]
    }
];

