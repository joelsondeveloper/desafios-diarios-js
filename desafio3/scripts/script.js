const form = document.querySelector("#form");
const input = document.querySelector("#cep");

form.addEventListener("submit", handleSubmit);

input.addEventListener("input", addHifen);

function handleSubmit(event) {
  event.preventDefault();

  const validCep = validateCep(input.value);

  if (validCep) {
    fetchCep(validCep);
  }
}

function addHifen(event) {
  const value = event.target.value;

  if (value.length > 5 && value.split("-").length < 2) {
    event.target.value = value.slice(0, 5) + "-" + value.slice(5);
  }
}

function validateCep(cep) {
  if (cep.length !== 9) {
    return;
  }

  return cep.split("-").join("");
}

async function fetchCep(cep) {
  try {

    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: "GET",
    });

    const data = await res.json();

    if (data.erro) {
      alert("CEP inválido");
      return;
    }

    const { logradouro, bairro, localidade, estado } = data;

    renderDom(logradouro, bairro, localidade, estado);

  } catch (error) {
    console.log("deu erro:", error);

  }
}

function renderDom(logradouro, bairro, localidade, estado) {
  const logradouroElement = document.querySelector("#logradouro");
  const bairroElement = document.querySelector("#bairro");
  const cidadeElement = document.querySelector("#cidade");
  const estadoElement = document.querySelector("#estado");

  logradouroElement.textContent = logradouro;
  bairroElement.textContent = bairro;
  cidadeElement.textContent = localidade;
  estadoElement.textContent = estado;
}