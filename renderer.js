document.getElementById('runButton').addEventListener('click', () => {
    const sketchPath = document.getElementById('sketchPath').value;
    window.electronAPI.runProcessing(sketchPath).then(output => {
        document.getElementById('output').textContent = output;
    }).catch(err => {
        document.getElementById('output').textContent = err;
    });
});
