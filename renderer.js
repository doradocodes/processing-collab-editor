document.getElementById('runButton').addEventListener('click', () => {
    const sketchPath = document.getElementById('sketchPath').value;
    window.electronAPI.runProcessing(sketchPath);
});

window.electronAPI.onProcessingOutput((data) => {
    const outputElement = document.getElementById('output');
    outputElement.textContent += data + '\n';
});
