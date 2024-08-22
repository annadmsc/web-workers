const { parentPort } = require('worker_threads');

parentPort.on('message', (task) => {

    setTimeout(() => {
        parentPort.postMessage(`Worker completou a tarefa: ${task}`);
    }, Math.random() * 2000 + 1000);
});
