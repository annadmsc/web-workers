const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
    const [item, tempo] = message.split('|');
    console.log(`Montando ${item}...`);

    setTimeout(() => {
        parentPort.postMessage(`Montagem do ${item} concluída`);
    }, tempo);
});
