document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS ---
  const mostrarBtn = document.getElementById('mostrar');
  const pistaEl = document.getElementById('pista');
  const conferirBtn = document.getElementById("conferirBtn");
  const reiniciarBtn = document.getElementById("reiniciar");
  const tabela = document.getElementById("tabelaResposta");

  // --- PISTAS ---
  const pistas = {
    'Facil': "1. O bolo de morango é da Clara e foi entregue na quarta-feira.\n2. O bolo de paçoca foi feito para a Lúcia.\n3. O bolo de chocolate foi entregue na sexta-feira.\n4. O bolo do Roberto foi feito no sábado.\n5. O bolo de abacaxi é do Roberto.",
    'Medio': "1. O bolo de chocolate foi entregue na sexta-feira.\n2. Clara pediu bolo de morango.\n3. Quem pediu o bolo de paçoca marcou para a quinta-feira.\n4. O bolo do Marco não é de morango nem de paçoca.\n5. Roberto pediu o bolo de abacaxi.\n6. Clara não marcou para sábado.",
    'Dificil': "1. O bolo de paçoca foi feito para a cliente cujo nome começa com L.\n2. O bolo entregue na sexta-feira foi pedido por um cliente homem.\n3. O bolo de morango foi entregue dois dias antes do bolo de chocolate.\n4. O bolo de abacaxi foi entregue no dia seguinte ao bolo de chocolate.\n5. O bolo da Clara não foi entregue na quinta-feira. Roberto não foi o primeiro a receber seu bolo."
  };

  // --- SOLUÇÃO ---
  const solucao = [
    { dia: "Quarta-feira", cliente: "Clara", bolo: "Morango" },
    { dia: "Quinta-feira", cliente: "Lúcia", bolo: "Paçoca" },
    { dia: "Sexta-feira", cliente: "Marco", bolo: "Chocolate" },
    { dia: "Sábado", cliente: "Roberto", bolo: "Abacaxi" }
  ];

  // --- MOSTRAR PISTAS ---
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


  // --- CONFERIR RESPOSTAS (LÓGICA AJUSTADA) ---
  conferirBtn.addEventListener("click", () => {
    const linhas = document.querySelectorAll("#QuadroRespostaContainer #Tabelafinal tr");
    let acertos = 0;
    // Cria uma cópia da solução para ir removendo os itens encontrados
    const solucaoTemporaria = [...solucao];

    // Coleta as respostas preenchidas pelo usuário
    const respostasUsuario = [];
    linhas.forEach((linha, i) => {
      if (i > 0) { // Pula o cabeçalho
        const selects = linha.querySelectorAll("select");
        const resposta = {
          dia: selects[0].value,
          cliente: selects[1].value,
          bolo: selects[2].value
        };
        // Adiciona a resposta apenas se todos os campos estiverem preenchidos
        if (Object.values(resposta).every(val => val)) {
          respostasUsuario.push(resposta);
        }
      }
    });

    // Compara as respostas do usuário com a solução
    respostasUsuario.forEach(resposta => {
      const indexSolucao = solucaoTemporaria.findIndex(sol =>
        sol.dia === resposta.dia &&
        sol.cliente === resposta.cliente &&
        sol.bolo === resposta.bolo
      );

      if (indexSolucao !== -1) {
        acertos++;
        solucaoTemporaria.splice(indexSolucao, 1); // Remove o item encontrado para não ser contado duas vezes
      }
    });

    document.getElementById("resultado").textContent =
      acertos === solucao.length
        ? "🎉 Todas corretas! Você venceu!"
        : `Você acertou ${acertos} de ${solucao.length}`;
  });

  // --- REINICIAR ---
  reiniciarBtn.addEventListener("click", () => {
    // Limpa os selects
    document.querySelectorAll("#QuadroRespostaContainer #Tabelafinal select").forEach(sel => sel.value = "");

    // Reseta os botões da tabela principal
    document.querySelectorAll(".resposta").forEach(btn => {
      btn.textContent = "?";
      btn.style.color = "black";
      btn.style.backgroundColor = "white";
    });

    // Limpa resultado
    document.getElementById("resultado").textContent = "";

    atualizarOpcoes();
  });

  // --- FUNÇÃO DE ATUALIZAÇÃO DOS SELECTS ---
  function atualizarOpcoes() {
    const linhas = document.querySelectorAll("#QuadroRespostaContainer #Tabelafinal tr");
    const escolhidos = { dia: [], cliente: [], bolo: [] };

    linhas.forEach((linha, i) => {
      if (i > 0) { // pular header
        const selects = linha.querySelectorAll("select");
        if (selects[0].value) escolhidos.dia.push(selects[0].value);
        if (selects[1].value) escolhidos.cliente.push(selects[1].value);
        if (selects[2].value) escolhidos.bolo.push(selects[2].value);
      }
    });

    linhas.forEach((linha, i) => {
      if (i > 0) {
        const selects = linha.querySelectorAll("select");
        atualizarSelect(selects[0], ["Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"], escolhidos.dia);
        atualizarSelect(selects[1], ["Clara", "Lúcia", "Marco", "Roberto"], escolhidos.cliente);
        atualizarSelect(selects[2], ["Abacaxi", "Chocolate", "Morango", "Paçoca"], escolhidos.bolo);
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

  // --- EVENTO DE CHANGE PARA ATUALIZAR SELECTS ---
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
});


