// ====== FRUTAS (10 PARES) ======
const emojis = [
    "🍎", "🍌", "🍇", "🍓", "🍍",
    "🥝", "🍒", "🍉", "🍊", "🥭"
];

// A quantidade de cartas é calculada automaticamente a partir das frutas.
const totalCartas = emojis.length * 2;

// ====== ESTADO DO JOGO ======
let cartas = [...emojis, ...emojis];
let cartasViradas = Array(totalCartas).fill(false);
let errosConsecutivos = 0;
let primeiraEscolha = -1;
let segundaEscolha = -1;
let jogoAtivo = true;
let todasReveladas = false;

// ====== INICIALIZA ======
function init() {
    cartas = [...emojis, ...emojis];
    cartas.sort(() => Math.random() - 0.5);
    cartasViradas = Array(totalCartas).fill(false);
    errosConsecutivos = 0;
    primeiraEscolha = -1;
    segundaEscolha = -1;
    jogoAtivo = true;
    todasReveladas = false;
    atualizarTabuleiro();
    atualizarErros();
}

// ====== ATUALIZA TABULEIRO ======
function atualizarTabuleiro() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    for (let i = 0; i < totalCartas; i++) {
        const cartaEl = document.createElement('div');
        cartaEl.className = 'carta';
        cartaEl.dataset.index = i;

        if (cartasViradas[i]) {
            cartaEl.classList.add('virada');
            cartaEl.textContent = cartas[i];

            if (todasReveladas) {
                cartaEl.classList.add('matched');
            }
        } else {
            cartaEl.textContent = String(i + 1).padStart(2, '0');
        }

        cartaEl.addEventListener('click', () => clicarCarta(i));
        grid.appendChild(cartaEl);
    }
}

// ====== CLIQUE NA CARTA ======
function clicarCarta(index) {
    if (!jogoAtivo || cartasViradas[index] || todasReveladas) return;

    if (primeiraEscolha === -1) {
        // Primeira carta
        primeiraEscolha = index;
        cartasViradas[index] = true;
        atualizarTabuleiro();
    } else if (segundaEscolha === -1 && index !== primeiraEscolha) {
        // Segunda carta
        segundaEscolha = index;
        cartasViradas[index] = true;
        atualizarTabuleiro();

        // Verifica par
        setTimeout(() => {
            if (cartas[primeiraEscolha] === cartas[segundaEscolha]) {
                document.getElementById('textoMensagem').innerHTML = '✅ PAR CORRETO!';
                errosConsecutivos = 0;
            } else {
                document.getElementById('textoMensagem').innerHTML = '❌ PAR ERRADO!';
                errosConsecutivos++;
                cartasViradas[primeiraEscolha] = false;
                cartasViradas[segundaEscolha] = false;
            }

            atualizarErros();
            resetEscolhas();
            checarFimJogo();
        }, 1000);
    }
}

// ====== RESET DAS ESCOLHAS ======
function resetEscolhas() {
    primeiraEscolha = -1;
    segundaEscolha = -1;
}

// ====== ATUALIZA CONTADOR DE ERROS ======
function atualizarErros() {
    document.getElementById('erros').textContent = `❌ Erros consecutivos: ${errosConsecutivos}/5`;
}

// ====== VERIFICA FIM DO JOGO ======
function checarFimJogo() {
    if (cartasViradas.every(v => v)) {
        jogoAtivo = false;
        document.getElementById('textoMensagem').innerHTML = '🏆 PARABÉNS! VOCÊ VENCEU O JOGO DA MEMÓRIA!';
        mostrarMensagem();
        return;
    }

    if (errosConsecutivos >= 5) {
        jogoAtivo = false;
        todasReveladas = true;
        atualizarTabuleiro();
        document.getElementById('textoMensagem').innerHTML = `💀 VOCÊ PERDEU! 5 ERROS CONSECUTIVOS!<br><br>Cartas eram:`;
        mostrarMensagem();
    }
}

// ====== MOSTRA MENSAGEM ======
function mostrarMensagem() {
    document.getElementById('mensagem').style.display = 'block';
}

// ====== PRÓXIMA RODADA ======
function proximaRodada() {
    document.getElementById('mensagem').style.display = 'none';

    if (jogoAtivo) {
        atualizarTabuleiro();
    } else {
        init();
    }
}

// ====== INICIA O JOGO QUANDO O DOM CARREGA ======
document.addEventListener('DOMContentLoaded', init);
