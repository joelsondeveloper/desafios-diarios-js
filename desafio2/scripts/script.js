const input = document.querySelector("#sequence");
const validDigits = document.querySelector("#valid-digits");
const maxDigit = document.querySelector("#max-digit");
const minDigit = document.querySelector("#min-digit");
const mostDigit = document.querySelector("#most-digit");

input.addEventListener("input", handleSubmit);

function handleSubmit(event) {
  const { length, max, min, most } = parseSequence(input.value);

  actualizeOutput(validDigits, length);
  actualizeOutput(maxDigit, max);
  actualizeOutput(minDigit, min);
  actualizeOutput(mostDigit, most);
}

function parseSequence(sequence) {
  const sequenceArray = sequence.trim().split(",");
  let objectMostDigit = {};

  const elements = sequenceArray.map((element) => {
    if (element.trim() !== "") {
        return Number(element);
    }
  }).filter((element) => {
    return !isNaN(element);
  });

  elements.forEach(element => {
    if (objectMostDigit[element]) {
      objectMostDigit[element]++;
    } else {
      objectMostDigit[element] = 1;
    }
  });

  const maxValue = Math.max(...Object.values(objectMostDigit));

  return {
    length: elements.length,
    max: Math.max(...elements),
    min: Math.min(...elements),
    most: Object.keys(objectMostDigit).find(key => objectMostDigit[key] === maxValue),
  }
}

function actualizeOutput(ref, value) {
  ref.textContent = value;
}
