(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const words = ['APPLE', 'MOON', 'BOOK', 'TREE', 'FISH', 'STAR'];
  let deck = [], open = [], matched = new Set(), moves = 0, locked = false;
  function shuffled() {
    const items = [...words, ...words];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
  function paint() {
    [...$('board').children].forEach((button, i) => {
      const visible = open.includes(i) || matched.has(i);
      button.textContent = visible ? deck[i] : '?';
      button.classList.toggle('revealed', visible);
      button.classList.toggle('matched', matched.has(i));
      button.setAttribute('aria-label', `Card ${i + 1}: ${visible ? deck[i] : 'face down'}${matched.has(i) ? ', matched' : ''}`);
      button.setAttribute('aria-disabled', String(locked || visible));
    });
    $('moves').textContent = moves;
    $('pairs').textContent = matched.size / 2;
  }
  function choose(i) {
    if (locked || open.includes(i) || matched.has(i)) return;
    open.push(i);
    if (open.length === 1) {
      $('status').textContent = `${deck[i]}. Choose another card.`;
    } else {
      moves++;
      if (deck[open[0]] === deck[open[1]]) {
        open.forEach(index => matched.add(index)); open = [];
        $('status').textContent = 'Match found. Choose another pair.';
        if (matched.size === deck.length) {
          $('status').textContent = 'You found all six pairs.';
          $('summary').textContent = `You finished in ${moves} moves. A move is two cards turned over.`;
          $('result').hidden = false;
        }
      } else {
        locked = true; $('continue').hidden = false;
        $('status').textContent = 'Not a match. Take a moment to remember these cards, then turn them back over.';
      }
    }
    paint();
  }
  function newGame() {
    const previous = deck.join('|'); deck = shuffled();
    if (deck.join('|') === previous) {
      const other = deck.findIndex(word => word !== deck[0]);
      [deck[0], deck[other]] = [deck[other], deck[0]];
    }
    open = []; matched = new Set(); moves = 0; locked = false;
    $('result').hidden = true; $('continue').hidden = true;
    $('status').textContent = 'Choose two cards.';
    $('board').replaceChildren();
    deck.forEach((_, i) => {
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'card'; button.addEventListener('click', () => choose(i));
      $('board').append(button);
    }); paint();
  }
  $('continue').addEventListener('click', () => {
    open = []; locked = false; $('continue').hidden = true;
    $('status').textContent = 'Choose two cards.'; paint();
    [...$('board').children].find((_, i) => !matched.has(i)).focus({preventScroll:true});
  });
  for (const id of ['new', 'replay']) $(id).addEventListener('click', () => {
    newGame(); $('board').firstElementChild.focus({preventScroll:true});
  });
  newGame();
})();
