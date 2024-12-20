const supabaseUrl = 'https://your-project-url.supabase.co'; // Substitua pelo seu URL do Supabase
const supabaseKey = 'your-anon-key'; // Substitua pela sua chave anon
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Função para adicionar uma chave privada ao banco de dados
async function addWallet(privateKey) {
  const { data, error } = await supabase
    .from('wallets')
    .insert([{ private_key: privateKey, balance: 0 }]);

  if (error) {
    console.error("Erro ao adicionar chave:", error);
  } else {
    console.log("Chave privada adicionada:", data);
    fetchWallets();  // Recarregar a lista de carteiras
  }
}

// Função para buscar todas as carteiras e exibir seus saldos
async function fetchWallets() {
  const { data, error } = await supabase
    .from('wallets')
    .select('*');

  if (error) {
    console.error("Erro ao buscar carteiras:", error);
  } else {
    const walletsList = document.getElementById('wallets-list');
    walletsList.innerHTML = '';  // Limpar a lista antes de atualizar

    const labels = [];
    const balances = [];

    data.forEach(wallet => {
      const listItem = document.createElement('div');
      listItem.classList.add('wallet-card');
      
      listItem.innerHTML = `
        <h2>Chave: ${wallet.private_key}</h2>
        <p>Saldo: <span class="balance">Calculando...</span></p>
      `;

      walletsList.appendChild(listItem);

      // Adicionar ao gráfico de saldo
      labels.push(wallet.private_key); // Aqui pode-se colocar o endereço
      balances.push(wallet.balance);  // Defina um valor de saldo inicial ou calcule dinâmicamente

      // Atualizar o saldo depois (simulação)
      setTimeout(() => {
        listItem.querySelector('.balance').textContent = `${wallet.balance} BTC`;
      }, 1000);
    });

    // Atualizar gráfico
    updateBalanceGraph(labels, balances);
  }
}

// Função para atualizar o gráfico com os saldos
function updateBalanceGraph(labels, balances) {
  const ctx = document.getElementById('balance-chart-container').getContext('2d');

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Saldo das Carteiras',
      data: balances,
      backgroundColor: '#1db954',
      borderColor: '#1db954',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
}

// Chamada inicial para exibir as carteiras já cadastradas
fetchWallets();

// Adicionar chave privada via campo de texto
document.getElementById('add-wallet-btn').addEventListener('click', () => {
  const privateKey = document.getElementById('private-key-input').value;
  if (privateKey) {
    addWallet(privateKey);
    document.getElementById('private-key-input').value = '';  // Limpar o campo após adicionar
  } else {
    alert('Por favor, insira uma chave privada!');
  }
});
