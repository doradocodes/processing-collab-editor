import {create} from 'zustand';
import {WebsocketProvider} from "y-websocket";
import * as Y from "yjs";

// export const websocketServer = 'ws://pce-server.glitch.me/1234';
// export const websocketServer = 'ws://localhost:1234';
export const websocketServer = 'wss://pce-server.onrender.com/1234';

const userColors = [
    { color: '#30bced', light: '#30bced33' },
    { color: '#6eeb83', light: '#6eeb8333' },
    { color: '#ffbc42', light: '#ffbc4233' },
    { color: '#ecd444', light: '#ecd44433' },
    { color: '#ee6352', light: '#ee635233' },
    { color: '#9ac2c9', light: '#9ac2c933' },
    { color: '#8acb88', light: '#8acb8833' },
    { color: '#1be7ff', light: '#1be7ff33' }
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const useWebsocketStore = create((set, get) => ({
    provider: null,
    yDoc: null,
    setProvider: (provider) => set({provider}),
    setYDoc: (yDoc) => set({yDoc}),
    isDocLoading: false,
    isConnected: false,
    setIsConnected: (isConnected) => {
        const { provider } = get();
        if (!isConnected && provider) {
            provider.disconnect();
        }
        set({isConnected});
    },
    isDisconnectDialogOpen: false,
    setIsDisconnectDialogOpen: (isOpen) => set({isDisconnectDialogOpen: isOpen}),
    setupProvider: (roomID, isHost, currentSketch, userName) => {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(websocketServer, roomID.toLowerCase(), ydoc);
        if (isHost && currentSketch) {
            const ytext = ydoc.getText('codemirror');
            ytext.insert(0, currentSketch.content);
        }

        provider.on('status', event => {
            if (event.status === 'connected') {
                console.log('Connected to server')
                set({isConnected: true});
            }
            if (event.status === 'disconnected') {
                console.log('Disconnected from server')
                set({isConnected: false});
            }
        })

        ydoc.on('update', (update, origin) => {
            set({isDocLoading: false});
            console.log('Document updated by:', origin);
        });

        provider.awareness.on('change', () => {
            set({isDocLoading: false});
        })

        const userColor = userColors[getRandomInt(0, userColors.length - 1)];
        provider.awareness.setLocalStateField('user', {
            name: userName,
            color: userColor.color,
            colorLight: userColor.light
        });

        set({provider});
        set({yDoc: ydoc});

        if (!isHost) {
            set({isDocLoading: true});
        }

    },
}));
