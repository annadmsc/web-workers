const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
    const [item, tempo] = message.split('|');
    console.log(`Cortando ${item}...`);

    setTimeout(() => {
        parentPort.postMessage(`Corte do ${item} concluído`);
    }, tempo);
});
