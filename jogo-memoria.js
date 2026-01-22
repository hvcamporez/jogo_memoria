import readline from "readline-sync";

// ====== EMOJIS (8 PARES) ======
const emojis = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍒", "🍉"];

// ====== CRIA CARTAS (16) ======
let cartas = [...emojis, ...emojis];

// ====== EMBARALHA ======
cartas.sort(() => Math.random() - 0.5);

// ====== ESTADO DO JOGO ======
let cartasViradas = Array(16).fill(false);
let errosConsecutivos = 0;

// ====== FUNÇÕES ======

function limparTela() {
  console.clear();
}

function mostrarTabuleiro() {
  console.log("🎴 JOGO DA MEMÓRIA 🎴\n");

  for (let i = 0; i < 16; i++) {
    if (cartasViradas[i]) {
      process.stdout.write(` ${cartas[i]} `);
    } else {
      process.stdout.write(` ${String(i + 1).padStart(2, "0")} `);
    }

    if ((i + 1) % 4 === 0) console.log("\n");
  }
}

function pedirCarta(mensagem, cartaJaEscolhida = null) {
  let escolha;

  do {
    escolha = readline.questionInt(mensagem) - 1;

    if (escolha < 0 || escolha > 15) {
      console.log("❌ Escolha um número entre 1 e 16.");
      escolha = null;
    } else if (cartasViradas[escolha]) {
      console.log("❌ Essa carta já está virada.");
      escolha = null;
    } else if (escolha === cartaJaEscolhida) {
      console.log("❌ Você não pode escolher a mesma carta.");
      escolha = null;
    }

  } while (escolha === null);

  return escolha;
}

function todasViradas() {
  return cartasViradas.every(v => v === true);
}

// ====== LOOP PRINCIPAL ======
while (true) {
  limparTela();
  mostrarTabuleiro();

  console.log(`❌ Erros consecutivos: ${errosConsecutivos}/5\n`);

  // Primeira carta
  const primeira = pedirCarta("Escolha a PRIMEIRA carta (1-16): ");
  cartasViradas[primeira] = true;

  limparTela();
  mostrarTabuleiro();

  // Segunda carta
  const segunda = pedirCarta("Escolha a SEGUNDA carta (1-16): ", primeira);
  cartasViradas[segunda] = true;

  limparTela();
  mostrarTabuleiro();

  // ====== VERIFICA ======
  if (cartas[primeira] === cartas[segunda]) {
    console.log("✅ PAR CORRETO!");
    errosConsecutivos = 0;
  } else {
    console.log("❌ PAR ERRADO!");
    errosConsecutivos++;

    // Mostra por 2 segundos antes de virar
    readline.question("\nPressione ENTER para continuar...");

    cartasViradas[primeira] = false;
    cartasViradas[segunda] = false;
  }

  // ====== VITÓRIA ======
  if (todasViradas()) {
    limparTela();
    mostrarTabuleiro();
    console.log("🏆 PARABÉNS! VOCÊ VENCEU O JOGO DA MEMÓRIA!");
    break;
  }

  // ====== DERROTA ======
  if (errosConsecutivos >= 5) {
    limparTela();
    mostrarTabuleiro();
    console.log("💀 VOCÊ PERDEU! 5 ERROS CONSECUTIVOS!");
    console.log("\nCartas eram:");
    for (let i = 0; i < 16; i++) {
      process.stdout.write(` ${cartas[i]} `);
      if ((i + 1) % 4 === 0) console.log("\n");
    }
    break;
  }

  readline.question("\nPressione ENTER para próxima rodada...");
}
