// --- ELEMENTOS ---
const mostrarBtn = document.getElementById('mostrar');
const pistaEl = document.getElementById('pista');
const conferirBtn = document.getElementById("conferirBtn");
const reiniciarBtn = document.getElementById("reiniciar");
const tabela = document.getElementById("tabelaResposta");

const pistas = {
  'Facil': "1. Paulo comprou a geladeira e virá buscá-la na quarta.\n 2.Betina pagou R$200 e virá buscar seu item na sexta. \n 3. O micro-ondas custa R$100 e será retirado no sábado, por uma mulher\n 4. O fogão custa R$300 e será retirado na quinta.\n 5.O sofá custa R$500 e será retirado no domingo, mas não sera por Marcela",
  'Medio': "1. O item de maior valor será retirado na quarta-feira, por um homem.\n 2. A TV custa R$200 e sua retirada ocorre na sexta, 01 dia antes do pedido da Marcela.\n 3. O fogão é retirado antes do micro-ondas. \n 4.O micro-ondas é o item de menor preço e será retirado no fim de semana.\n 5. O sofá é retirado no domingo e custa R$500 e não foi comprado por Betina\n 6. Carlos virá buscar na quinta e não comprou a geladeira.\n 7. Felipe não pagou nem R300 nem R700.",
  'Dificil': "1. A geladeira é o item de maior preço e será retirada antes da TV, nenhuma das duas foram compradas pelo Felipe. \n 2. A TV é retirada na sexta e custa R$200 e não foi comprarda pelo Carlos. \n 3. O fogão custa R$300 e sua retirada ocorre exatamente um dia antes da retirada do micro-ondas.\n 4. O micro-ondas custa R$100. \n 5. O sofá é o único item retirado no domingo e custa R$500.\n 6. Carlos não comprou a TV nem a geladeira e vem buscar antes do dia da TV.\n 7. Paulo pagou mais do que Betina.\n 8.Betina não comprou o micro-ondas. "
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

const solucao = [
  { dia: "Quarta-feira", comprador: "Paulo", item: "Geladeira", preco: "700" },
  { dia: "Quinta-feira", comprador: "Carlos", item: "Fogão", preco: "300" },
  { dia: "Sexta-feira", comprador: "Betina", item: "TV", preco: "200" },
  { dia: "Sábado", comprador: "Marcela", item: "Microondas", preco: "100" },
  { dia: "Domingo", comprador: "Felipe", item: "Sofá", preco: "500" }
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
        dia: selects[0].value,
        comprador: selects[1].value,
        item: selects[2].value,
        preco: selects[3].value
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
      sol.dia === resposta.dia &&
      sol.comprador === resposta.comprador &&
      sol.item === resposta.item &&
      sol.preco === resposta.preco
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
  const escolhidos = { dia: [], comprador: [], item: [], preco: [] };

  linhas.forEach((linha, i) => {
    if (i > 0) { //
      const selects = linha.querySelectorAll("select");
      if (selects[0].value) escolhidos.dia.push(selects[0].value);
      if (selects[1].value) escolhidos.comprador.push(selects[1].value);
      if (selects[2].value) escolhidos.item.push(selects[2].value);
      if (selects[3].value) escolhidos.preco.push(selects[3].value);
    }
  });

  linhas.forEach((linha, i) => {
    if (i > 0) {
      const selects = linha.querySelectorAll("select");
      atualizarSelect(selects[0], ["Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"], escolhidos.dia);
      atualizarSelect(selects[1], ["Betina", "Paulo", "Felipe", "Marcela", "Carlos"], escolhidos.comprador);
      atualizarSelect(selects[2], ["Geladeira", "Fogão", "Microondas", "Sofá", "TV"], escolhidos.item);
      atualizarSelect(selects[3], ["100", "200", "300", "500", "700"], escolhidos.preco);
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

// Atualiza selects ao carregar a página
atualizarOpcoes();


// --- BOTÕES DA TABELA PRINCIPAL ---
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





