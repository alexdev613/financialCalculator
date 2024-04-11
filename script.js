  // Declaração de constantes e variáveis, seleção de elementos do DOM para interação e atualização dinâmica da página

const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

  /*---------------------------------------------------------------------*/

// ADICIONANDO EVENTO AO BOTÃO "INCLUIR"

btnNew.onclick = () => {
  // Verifica se os campos estão preenchidos
  if (descItem.value === "" || amount.value === "" || type.value === "") {
    return alert("Preencha todos os campos!");
  }

  // Adiciona um novo item ao array "items" com base nos valores preenchidos
  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
  });

  // Atualiza os dados no armazenamento local
  setItemsDB();
  
  // Recarrega os itens na tabela
  loadItems();

  // limpa os campos de entrada após a inclusão
  descItem.value = ""; // Descrição do item
  amount.value = ""; // valor
};

  /*---------------------------------------------------------------------*/

// Inserção de linha com células com valores vindos dos inputs:

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}
/* 
  Esta função cria e insere uma nova linha (<tr>) na tabela (<tbody>).
  Utiliza document.createElement("tr") para criar um novo elemento <tr>.
  Define o conteúdo HTML da linha (<tr>) com base nos dados do objeto item.
  Finalmente, adiciona a linha (<tr>) à tabela (<tbody>) usando tbody.appendChild(tr).
*/

  /*---------------------------------------------------------------------*/

// FUNÇÃO DE DELETAR ITEM DA TABELA
function deleteItem(index) {
  items.splice(index, 1);
  setItemsDB();
  loadItems();
}
/*
  Esta função remove um item do array items com base no índice fornecido (index).
  Utiliza items.splice(index, 1) para remover o item do array.
  Em seguida, chama setItemsDB() para atualizar o armazenamento local e loadItems()
  para recarregar os itens na tabela após a exclusão.
*/

  /*---------------------------------------------------------------------*/

// Função para recarregar os itens na tabela:
function loadItems() {
  items = getItemsDB();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

/*
    Esta função carrega os itens do armazenamento local para o array items.
  Limpa o conteúdo da tabela (<tbody>) para evitar duplicatas.
  Para cada item no array items, chama a função insertItem(item, index) para inserir uma nova linha na tabela.
  Por fim, chama getTotals() para calcular e exibir os totais de entradas, saídas e o saldo total.
*/

  /*---------------------------------------------------------------------*/

// Função getTotals() para Atualização e Cálculo dos Totias
function getTotals() {
  // Filtra os itens por tipo (Entrada ou Saída) e mapeia para valores numéricos
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  // Calcula os totais de entradas, saídas e saldo total
  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  // Atualiza os valores exibidos na página
  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

/*
  Esta função calcula os totais de entradas, saídas e o saldo total com base nos itens do array items.
  Utiliza filter() para separar os itens por tipo (Entrada ou Saída) e map() para obter os valores numéricos.
  Em seguida, utiliza reduce() para somar os valores e calcular os totais de entradas, saídas e o saldo total.
  Por fim, atualiza os valores exibidos nas respectivas <span> na página.
 */

  /*---------------------------------------------------------------------*/

  // Armazenamento Local: para salvar e recuperar os dados do array "items" entre as sessões do navegador
  // getItemsDB() recupera os itens salvos no localStorage:
const getItemsDB = () => JSON.parse(localStorage.getItem("db_items")) ?? [];

  // setItemsDB() salva os itens atualizados no localStorage após adições ou remoções.
const setItemsDB = () => localStorage.setItem("db_items", JSON.stringify(items));

 // Por fim, a função loadItems() é chamada para carregar os itens iniciais ao carregar a página:
loadItems();