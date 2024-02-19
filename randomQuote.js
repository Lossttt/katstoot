const garfieldQuotes = [
  "I'm not overweight; I'm undertall.",
  "Love me, feed me, never leave me.",
  "I'm not messy; I'm organizationally challenged.",
  "Dieting is when you eat food that makes you sad.",
  "I don't do mornings, and I don't do cardio.",
  "I'm not lazy; I'm in energy-saving mode.",
  "I don't suffer from insanity; I enjoy every minute of it.",
  "I'm not crazy. I prefer the term 'mentally hilarious'.",
  "I'm allergic to morning.",
  "I'm not fat; I'm just so darn sexy it overflows.",
  "I put the 'grand' in 'grandfather'.",
  "I'm not arguing; I'm just explaining why I'm right.",
  "I'm not antisocial; I'm just not user-friendly.",
  "I'm not a vegetarian because I love animals; I'm a vegetarian because I hate plants.",
  "I'm not old; I'm retro.",
  "I'm on a 30-day diet. So far, I've lost 15 days.",
  "I'm not a snob; I'm just better than you.",
  "I'm not ignoring you; I'm just prioritizing my awesomeness.",
  "I'm not saying I'm Wonder Woman; I'm just saying no one has ever seen me and Wonder Woman in the same room together.",
  "I'm not a couch potato; I'm a bed enthusiast.",
  "I'm not a morning person or a night owl. I'm a permanently exhausted pigeon.",
  "I'm not fat; I'm horizontally gifted.",
  "I'm not short; I'm fun-sized.",
  "I'm not late; others are just early.",
  "I'm not weird; I'm a limited edition.",
  "I'm not a snack; I'm a feast.",
  "I'm not clumsy; the floor just hates me.",
  "I'm not a troublemaker; I just prefer the term 'creative problem solver'.",
  "I'm not addicted to chocolate; we're just in a committed relationship.",
  "I'm not fat; I'm cultivating mass.",
  "I'm not a procrastinator; I'm just extremely productive at unimportant things.",
  "I'm not a grump; I'm just surrounded by idiots.",
  "I'm not nosy; I'm just intensely interested in other people's business.",
  "I'm not a morning person; I'm a not-a-morning person.",
];

function getRandomQuote() {
  // Creates a random index by generating a number and multiplying it with the length of the array
  const randomIndex = Math.floor(Math.random() * garfieldQuotes.length);
  return garfieldQuotes[randomIndex];
}

module.exports = { getRandomQuote };
