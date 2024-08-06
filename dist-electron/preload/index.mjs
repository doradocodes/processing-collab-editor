"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  // ...
  writeTempFile: (content) => electron.ipcRenderer.invoke("write-temp-file", content),
  runProcessing: (content) => electron.ipcRenderer.invoke("run-processing", content),
  onProcessingOutput: (callback) => electron.ipcRenderer.on("processing-output", (event, data) => callback(data))
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlwY1JlbmRlcmVyLCBjb250ZXh0QnJpZGdlIH0gZnJvbSAnZWxlY3Ryb24nXG5cbi8vIC0tLS0tLS0tLSBFeHBvc2Ugc29tZSBBUEkgdG8gdGhlIFJlbmRlcmVyIHByb2Nlc3MgLS0tLS0tLS0tXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdpcGNSZW5kZXJlcicsIHtcbiAgb24oLi4uYXJncykge1xuICAgIGNvbnN0IFtjaGFubmVsLCBsaXN0ZW5lcl0gPSBhcmdzXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLm9uKGNoYW5uZWwsIChldmVudCwgLi4uYXJncykgPT4gbGlzdGVuZXIoZXZlbnQsIC4uLmFyZ3MpKVxuICB9LFxuICBvZmYoLi4uYXJncykge1xuICAgIGNvbnN0IFtjaGFubmVsLCAuLi5vbWl0XSA9IGFyZ3NcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIub2ZmKGNoYW5uZWwsIC4uLm9taXQpXG4gIH0sXG4gIHNlbmQoLi4uYXJncykge1xuICAgIGNvbnN0IFtjaGFubmVsLCAuLi5vbWl0XSA9IGFyZ3NcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCAuLi5vbWl0KVxuICB9LFxuICBpbnZva2UoLi4uYXJncykge1xuICAgIGNvbnN0IFtjaGFubmVsLCAuLi5vbWl0XSA9IGFyZ3NcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKGNoYW5uZWwsIC4uLm9taXQpXG4gIH0sXG5cbiAgLy8gWW91IGNhbiBleHBvc2Ugb3RoZXIgQVBUcyB5b3UgbmVlZCBoZXJlLlxuICAvLyAuLi5cbiAgd3JpdGVUZW1wRmlsZTogKGNvbnRlbnQpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnd3JpdGUtdGVtcC1maWxlJywgY29udGVudCksXG4gIHJ1blByb2Nlc3Npbmc6IChjb250ZW50KSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ3J1bi1wcm9jZXNzaW5nJywgY29udGVudCksXG4gIG9uUHJvY2Vzc2luZ091dHB1dDogKGNhbGxiYWNrKSA9PiBpcGNSZW5kZXJlci5vbigncHJvY2Vzc2luZy1vdXRwdXQnLCAoZXZlbnQsIGRhdGEpID0+IGNhbGxiYWNrKGRhdGEpKVxufSlcbiJdLCJuYW1lcyI6WyJjb250ZXh0QnJpZGdlIiwiaXBjUmVuZGVyZXIiLCJhcmdzIl0sIm1hcHBpbmdzIjoiOztBQUdBQSxTQUFBQSxjQUFjLGtCQUFrQixlQUFlO0FBQUEsRUFDN0MsTUFBTSxNQUFNO0FBQ1YsVUFBTSxDQUFDLFNBQVMsUUFBUSxJQUFJO0FBQzVCLFdBQU9DLHFCQUFZLEdBQUcsU0FBUyxDQUFDLFVBQVVDLFVBQVMsU0FBUyxPQUFPLEdBQUdBLEtBQUksQ0FBQztBQUFBLEVBQzVFO0FBQUEsRUFDRCxPQUFPLE1BQU07QUFDWCxVQUFNLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSTtBQUMzQixXQUFPRCxxQkFBWSxJQUFJLFNBQVMsR0FBRyxJQUFJO0FBQUEsRUFDeEM7QUFBQSxFQUNELFFBQVEsTUFBTTtBQUNaLFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQzNCLFdBQU9BLHFCQUFZLEtBQUssU0FBUyxHQUFHLElBQUk7QUFBQSxFQUN6QztBQUFBLEVBQ0QsVUFBVSxNQUFNO0FBQ2QsVUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUk7QUFDM0IsV0FBT0EscUJBQVksT0FBTyxTQUFTLEdBQUcsSUFBSTtBQUFBLEVBQzNDO0FBQUE7QUFBQTtBQUFBLEVBSUQsZUFBZSxDQUFDLFlBQVlBLFNBQUFBLFlBQVksT0FBTyxtQkFBbUIsT0FBTztBQUFBLEVBQ3pFLGVBQWUsQ0FBQyxZQUFZQSxTQUFBQSxZQUFZLE9BQU8sa0JBQWtCLE9BQU87QUFBQSxFQUN4RSxvQkFBb0IsQ0FBQyxhQUFhQSxTQUFXLFlBQUMsR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLFNBQVMsU0FBUyxJQUFJLENBQUM7QUFDdkcsQ0FBQzsifQ==
