import {create} from 'zustand';

// export const websocketServer = 'ws://pce-server.glitch.me/1234';
export const websocketServer = 'ws://localhost:1234';

export const useWebsocketStore = create((set) => ({
    provider: null,
    yDoc: null,
    setProvider: (provider) => set({provider}),
    setYDoc: (yDoc) => set({yDoc}),
}));
