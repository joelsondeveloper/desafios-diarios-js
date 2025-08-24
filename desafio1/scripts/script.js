const bill = document.querySelector("#bill");
const tip = document.querySelector("#tip");
const people = document.querySelector("#people");
const calculate = document.querySelector("#calculate");
const resultTip = document.querySelector("#result-tip");
const resultTotal = document.querySelector("#result-total");
const form = document.querySelector(".form");
const inputs = document.querySelectorAll("input, select");

inputs.forEach((input) => {
    input.addEventListener("input", handleSubmit);
});

function handleSubmit(event) {
  event.preventDefault();

  let peopleValue = Number(people.value);

  if (peopleValue < 1) {
    peopleValue = 1;
  }

  const { total, tipTotal } = calculateTotal();

  const tipTotalPerPerson = dividePeople(tipTotal, peopleValue);
  const totalPerPerson = dividePeople(total, peopleValue);

  resultTip.textContent = `Gorjeta por pessoa: R$ ${tipTotalPerPerson.toFixed(2)}`;
  resultTotal.textContent = `Total por pessoa: R$ ${totalPerPerson.toFixed(2)}`;
}

function calculateTotal() {
  const billValue = Number(bill.value);
  const tipValue = Number(tip.value);

  const tipTotal = calculateTip(billValue, tipValue);
  const total = tipTotal + billValue;

  return { total, tipTotal };
}

function calculateTip(bill, tip) {
  const tipTotal = bill * tip;
  return tipTotal;
}

function dividePeople(num, people) {
  return num / people;
}
