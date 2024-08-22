

const readline = require('readline');
const { Worker } = require('worker_threads');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Olá, Bem-Vindo ao Byte Burguer');

console.log(
    "Lanches:\n1. Callback Burger\n2. Null-Burguer (veg)\n3. Crispy Turing\n4. Mongo Melt\n5. Webwrap\n\nAcompanhamentos:\n6. NPM Nuggets\n\nBebidas:\n7. Float Juice\n8. Array Apple\n9. Async Berry\n\nDigite 'chega' para finalizar o pedido."
);

const pedidos = [];

const cardapio = {
    1: { nome: 'Callback Burger', etapas: [{ nome: 'Cortar', tempo: 3000 }, { nome: 'Fritar', tempo: 8000 }, { nome: 'Montar', tempo: 2000 }] },
    2: { nome: 'Null-Burguer (veg)', etapas: [{ nome: 'Cortar', tempo: 4000 }, { nome: 'Fritar', tempo: 7000 }, { nome: 'Montar', tempo: 2000 }] },
    3: { nome: 'Crispy Turing', etapas: [{ nome: 'Cortar', tempo: 2000 }, { nome: 'Fritar', tempo: 10000 }, { nome: 'Montar', tempo: 1000 }] },
    4: { nome: 'Mongo Melt', etapas: [{ nome: 'Cortar', tempo: 1000 }, { nome: 'Fritar', tempo: 3000 }] },
    5: { nome: 'Webwrap', etapas: [{ nome: 'Cortar', tempo: 4000 }, { nome: 'Montar', tempo: 2000 }] },
    6: { nome: 'NPM Nuggets', etapas: [{ nome: 'Fritar', tempo: 4000 }] },
    7: { nome: 'Float Juice', etapas: [{ nome: 'Cortar', tempo: 4000 }, { nome: 'Montar', tempo: 3000 }] },
    8: { nome: 'Array Apple', etapas: [{ nome: 'Cortar', tempo: 4000 }, { nome: 'Montar', tempo: 3000 }] },
    9: { nome: 'Async Berry', etapas: [{ nome: 'Cortar', tempo: 2000 }, { nome: 'Montar', tempo: 2000 }] }
};

function processarPedido(item) {
    const { nome, etapas } = item;
    let etapaAtual = 0;

    function iniciarProximaEtapa() {
        if (etapaAtual < etapas.length) {
            const { nome: nomeEtapa, tempo } = etapas[etapaAtual];
            const worker = new Worker(`./worker-${nomeEtapa.toLowerCase()}.js`);
            const tarefa = `${nome}|${tempo}`;

            console.log(`Status: Preparando ${nomeEtapa} para ${nome}`);

            worker.postMessage(tarefa);

            worker.on('message', (message) => {
                console.log('Main:', message);
                worker.terminate();
                etapaAtual++;
                iniciarProximaEtapa();
            });

            worker.on('error', (err) => {
                console.error('Erro no Worker:', err);
            });

            worker.on('exit', (code) => {
                if (code !== 0) console.error(`Worker parado com o código ${code}`);
            });
        } else {
            console.log(`Pedido ${nome} finalizado!`);
        }
    }

    iniciarProximaEtapa();
}

function prepararPedidos() {
    console.log('\nIniciando a preparação dos pedidos...');
    pedidos.forEach((item) => {
        console.log(`\nPreparando: ${item.nome}`);
        processarPedido(item);
    });
}

function fazerPedido() {
    rl.question('Digite o número do seu pedido: ', (pedido) => {
        if (pedido.toLowerCase() === 'chega') {
            console.log('\nSeu pedido final:');
            pedidos.forEach((item) => {
                console.log(`${item.nome}`);
            });
            rl.close();
            prepararPedidos();
        } else {
            const numPedido = parseInt(pedido);
            const itemPedido = cardapio[numPedido];

            if (itemPedido) {
                pedidos.push(itemPedido);
                console.log(`Você adicionou: ${itemPedido.nome}`);
            } else {
                console.log('Pedido inválido.');
            }

            fazerPedido();
        }
    });
}

fazerPedido();
