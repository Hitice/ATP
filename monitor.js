const supabaseUrl = 'https://your-project-url.supabase.co'; // Substitua pelo seu URL do Supabase
const supabaseKey = 'your-anon-key'; // Substitua pela sua chave de anon
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Função para adicionar uma chave privada ao banco de dados
async function addWallet(privateKey) {
  const { data, error } = await supabase
    .from('wallets')
    .insert([{ private_key: privateKey }]);

  if (error) {
    console.error("Erro ao adicionar chave:", error);
  } else {
    console.log("Chave privada adicionada:", data);
    fetchWallets();
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
    walletsList.innerHTML = '';

    data.forEach(wallet => {
      const listItem = document.createElement('li');
      listItem.textContent = `Chave: ${wallet.private_key} | Saldo: ${wallet.balance}`;
      walletsList.appendChild(listItem);
    }
  }
}

// Chamada inicial para exibir as carteiras já cadastradas
fetchWallets();

// Adicionar chave privada via botão
document.getElementById('add-wallet-btn').addEventListener('click', () => {
  const privateKey = prompt("Digite a chave privada:");
  if (privateKey) {
    addWallet(privateKey);
  }
});
