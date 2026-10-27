const RATE = 0.50;
const INITIAL_VIDEOS = 3;

const videoList = document.getElementById('videoList');
const totalMoney = document.getElementById('totalMoney');
const totalViews = document.getElementById('totalViews');
const videoCount = document.getElementById('videoCount');
const status = document.getElementById('status');

let nextId = 1;

const moneyFormat = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const numberFormat = new Intl.NumberFormat('pt-BR');

function addVideo(value = '') {
  const id = nextId++;

  const row = document.createElement('div');
  row.className = 'video-row';
  row.dataset.id = id;

  const number = document.createElement('div');
  number.className = 'video-number';

  const wrap = document.createElement('div');
  wrap.className = 'input-wrap';

  const label = document.createElement('label');
  label.htmlFor = `views-${id}`;
  label.textContent = 'Milhares de visualizações';

  const input = document.createElement('input');
  input.className = 'views-input';
  input.id = `views-${id}`;
  input.type = 'number';
  input.min = '0';
  input.step = '1';
  input.inputMode = 'numeric';
  input.placeholder = 'Ex.: 10 = 10 mil views';
  input.value = value;

  input.addEventListener('input', calculate);
  
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
  
      const inputs = [
        ...videoList.querySelectorAll('.views-input')
      ];
  
      const currentIndex = inputs.indexOf(input);
      const nextInput = inputs[currentIndex + 1];
  
      if (nextInput) {
        nextInput.focus();
      } else {
        addVideo();
        const newInputs = videoList.querySelectorAll('.views-input');
        newInputs[newInputs.length - 1].focus();
      }
    }
  });


  const remove = document.createElement('button');
  remove.className = 'remove-btn';
  remove.type = 'button';
  remove.textContent = '×';
  remove.title = 'Remover vídeo';
  remove.setAttribute('aria-label', 'Remover este vídeo');

  remove.addEventListener('click', () => {
    row.remove();
    renumberVideos();
    calculate();
  });

  wrap.append(label, input);
  row.append(number, wrap, remove);
  videoList.appendChild(row);

  renumberVideos();
}

function renumberVideos() {
  [...videoList.children].forEach((row, index) => {
    row.querySelector('.video-number').textContent =
      String(index + 1).padStart(2, '0');

    row.querySelector('label').textContent =
      `Milhares de visualizações · Vídeo ${index + 1}`;

    row.querySelector('input').setAttribute(
      'aria-label',
      `Milhares de visualizações do vídeo ${index + 1}`
    );
  });
}

function calculate() {
  const inputs = [...videoList.querySelectorAll('.views-input')];

  let thousands = 0;

  inputs.forEach(input => {
    const value = Number(input.value);

    if (
      input.value.trim() !== '' &&
      Number.isFinite(value) &&
      value > 0
    ) {
      thousands += Math.floor(value);
    }
  });

  // Cria um campo quando o último campo é preenchido.
  const lastInput = inputs[inputs.length - 1];

  if (lastInput && lastInput.value.trim() !== '') {
    addVideo();
  }

  const views = thousands * 1000;
  const earnings = thousands * RATE;

  totalMoney.textContent = moneyFormat.format(earnings);
  totalViews.textContent = numberFormat.format(views);

  // Conta somente os campos preenchidos.
  const filledCount = inputs.filter(
    input => input.value.trim() !== ''
  ).length;

  videoCount.textContent = numberFormat.format(filledCount);

  status.textContent = filledCount === 0
    ? 'Preencha as views para começar.'
    : 'Cada unidade digitada equivale a 1.000 views.';
}

document.getElementById('clearBtn').addEventListener('click', () => {
  videoList.replaceChildren();
  nextId = 1;

  for (let i = 0; i < INITIAL_VIDEOS; i++) {
    addVideo();
  }

  calculate();
});

// Inicia com três campos vazios.
for (let i = 0; i < INITIAL_VIDEOS; i++) {
  addVideo();
}

calculate();
