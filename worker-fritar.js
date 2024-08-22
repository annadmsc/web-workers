const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
    const [item, tempo] = message.split('|');
    console.log(`Fritando/Grelhando ${item}...`);

    setTimeout(() => {
        parentPort.postMessage(`Fritura/Grelhado do ${item} concluído`);
    }, tempo);
});
