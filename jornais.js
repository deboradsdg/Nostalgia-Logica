const mostrarBtn = document.getElementById('mostrar');
const pistaEl = document.getElementById('pista');
const conferirBtn = document.getElementById("conferirBtn");
const reiniciarBtn = document.getElementById("reiniciar");
const tabela = document.getElementById("tabelaResposta");

const pistas = {

'Facil' : "1. Boa Nova tem valor unitário R$1,10. \n 2. O jornal com 50 páginas tem a assinatura mais alta e não é O Apelo.\n 3. O Popular é o de menor tiragem (só 10 páginas) e tem a assinatura mais baixa, mas não tem o valor unitário mais barato. \n 4. Gravuras não custa R$1,00 por exemplar tem a assinatura mais cara que O Alvorada \n 5. O jornal que custa R$0,90 por exemplar tem 20 páginas e a assinatura mensal custa menos de R$100,00 \n 6. O Alvorada 40 páginas cobra R$1,00 por exemplar.\n 7. A assinatura de Boa Nova é R$100.",
'Medio': "1. O jornal que cobra R$1,20 por exemplar não é nem o de 10 páginas nem o de 50 páginas. \n 2. A assinatura de R$120 pertence ao jornal de 50 páginas. \n 3. O Apelo tem menos páginas que o jornal que cobra R$1,10 por exemplar. \n 4. O jornal com assinatura R$80 tem exatamente 30 páginas a menos que o jornal com assinatura R$120. \n 5. O jornal que custa R$0,90 por exemplar tem assinatura R$90.\n 6. Boa Nova cobra R$1,10 por exemplar. \n 7. O jornal que tem 40 páginas tem assinatura R$110.",
'Dificil': "1. Somando o número de páginas do jornal de assinatura R$80 com o do jornal que cobra R$1,10 por exemplar dá 40. \n 2. O jornal com 50 páginas cobra a assinatura mais alta (R$120).\n3. O jornal de 40 páginas não cobra R$0,80 nem R$1,20 por exemplar.\n 4. O jornal que cobra R$0,80 por exemplar tem mais páginas do que O Apelo, mas menos do que o jornal que cobra R$1,20.\n 5. Boa Nova cobra R$1,10 por exemplar. \n 6. A assinatura R$100 é paga por um jornal com mais páginas que o que tem assinatura R$90.\n 7. O jornal que custa R$0,90 por exemplar tem assinatura R$90.\n"

};

if (mostrarBtn && pistaEl) {
  mostrarBtn.addEventListener('click', () => {
    const nivelSelecionado = document.querySelector('input[name="nivel"]:checked');
    if (!nivelSelecionado) {
      pistaEl.textContent = 'Selecione um nível primeiro';
      return;
    }
    pistaEl.textContent = pistas[nivelSelecionado.value] || 'Sem pistas para este nível';
  });
}

const solucao= [
  {jornal: "Boa Nova", valor_unitario: "1,10", n_paginas: "30", assinatura_mensal: "100"},
  {jornal: "Gravuras", valor_unitario: "0,80",n_paginas: "50", assinatura_mensal: "120"},
  {jornal: "O Apelo",valor_unitario: "0,90", n_paginas: "20", assinatura_mensal: "90" },
  {jornal: "O Alvorada",valor_unitario: "1,00", n_paginas: "40", assinatura_mensal: "110" },
  {jornal: "O Popular", valor_unitario: "1,20",  n_paginas: "10",assinatura_mensal: "80" }
];

conferirBtn.addEventListener("click", () => {
  const linhas = document.querySelectorAll("#QuadroRespostaContainer #Tabelafinal tr");
  let acertos = 0;
  // Cria uma cópia da solução para modificação
  const solucaoTemporaria = [...solucao];

  // Coleta as respostas do usuário
  const respostasUsuario = [];
  linhas.forEach((linha, i) => {
    if (i > 0) { // Pula o cabeçalho
      const selects = linha.querySelectorAll("select");
      const resposta = {
        jornal: selects[0].value,
        valor_unitario: selects[1].value,
        n_paginas: selects[2].value,
        assinatura_mensal: selects[3].value
      };
      // Adiciona apenas respostas completas para evitar problemas de comparação
      if (Object.values(resposta).every(val => val)) {
        respostasUsuario.push(resposta);
      }
    }
  });

  // Compara as respostas do usuário com a solução
  respostasUsuario.forEach(resposta => {
    const indexSolucao = solucaoTemporaria.findIndex(sol =>
      sol.jornal === resposta.jornal &&
      sol.valor_unitario === resposta.valor_unitario &&
      sol.n_paginas === resposta.n_paginas &&
      sol.assinatura_mensal === resposta.assinatura_mensal
    );

    if (indexSolucao !== -1) {
      acertos++;
      solucaoTemporaria.splice(indexSolucao, 1); // Remove a correspondência para evitar duplicidade
    }
  });

  document.getElementById("resultado").textContent =
    acertos === solucao.length
      ? "🎉 Todas corretas! Você venceu!"
      : `Você acertou ${acertos} de ${solucao.length}`;
});
reiniciarBtn.addEventListener("click", () => {
  document.querySelectorAll("#QuadroRespostaContainer #Tabelafinal select").forEach(sel => sel.value = "");
  document.querySelectorAll(".resposta").forEach(btn => {
    btn.textContent = "?";
    btn.style.color = "black";
    btn.style.backgroundColor = "white";
  });

  document.getElementById("resultado").textContent = "";

  atualizarOpcoes();
});

function atualizarOpcoes() {
  const linhas = document.querySelectorAll("#QuadroRespostaContainer #Tabelafinal tr");
  const escolhidos = { jornal: [], valor_unitario: [], n_paginas: [], assinatura_mensal: [] };

  linhas.forEach((linha, i) => {
    if (i > 0) { // Pula o cabeçalho
      const selects = linha.querySelectorAll("select");
      if (selects[0].value) escolhidos.jornal.push(selects[0].value);
      if (selects[1].value) escolhidos.valor_unitario.push(selects[1].value);
      if (selects[2].value) escolhidos.n_paginas.push(selects[2].value);
      if (selects[3].value) escolhidos.assinatura_mensal.push(selects[3].value);
    }
  });

  linhas.forEach((linha, i) => {
    if (i > 0) {
      const selects = linha.querySelectorAll("select");
      atualizarSelect(selects[0], ["Boa Nova", "Gravuras", "O Apelo", "O Alvorada", "O Popular"], escolhidos.jornal);
      atualizarSelect(selects[1], ["1,10", "0,80", "0,90", "1,00", "1,20"], escolhidos.valor_unitario);
      atualizarSelect(selects[2], ["30", "50", "20", "40", "10"], escolhidos.n_paginas);
      atualizarSelect(selects[3], ["100", "120", "90", "110", "80"], escolhidos.assinatura_mensal);
    }
  });
}

function atualizarSelect(select, todas, escolhidas) {
  const valorAtual = select.value;
  select.innerHTML = `<option value="">— escolha —</option>`;
  todas.forEach(op => {
    if (!escolhidas.includes(op) || op === valorAtual) {
      const option = document.createElement("option");
      option.value = op;
      option.textContent = op;
      if (op === valorAtual) option.selected = true;
      select.appendChild(option);
    }
  });
}

document.querySelectorAll("#QuadroRespostaContainer #Tabelafinal select").forEach(sel => {
  sel.addEventListener("change", atualizarOpcoes);
});


atualizarOpcoes();

tabela.addEventListener('click', (event) => {
  if (event.target.classList.contains('resposta')) {
    const botao = event.target;
    const txt = botao.textContent.trim();

    if (txt === '?') {
      botao.textContent = '✓';
      botao.style.color = '#006400';
      botao.style.backgroundColor = '#90EE90';
    } else if (txt === '✓') {
      botao.textContent = 'X';
      botao.style.color = '#8B0000';
      botao.style.backgroundColor = '#FA8072';
    } else {
      botao.textContent = '?';
      botao.style.color = 'black';
      botao.style.backgroundColor = 'white';
    }
  }
});







