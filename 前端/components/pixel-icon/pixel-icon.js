const PALETTE = {
  ".": "transparent",
  K: "#2d2d2d",
  W: "#ffffff",
  w: "#ffffff",
  R: "#ff4757",
  r: "#ff6b81",
  G: "#2ed573",
  g: "#7bed9f",
  Y: "#ffa502",
  y: "#ffc048",
  O: "#ff7f50",
  o: "#ff6348",
  P: "#ffb8d0",
  p: "#ff85a2",
  B: "#70a1ff",
  b: "#5352ed",
  C: "#ffeaa7",
  c: "#fdcb6e",
  M: "#ff4757",
  m: "#ee5a6f",
  F: "#ffd32a",
  f: "#ffb142",
  H: "#8B5A2B",
  h: "#a0522d",
  L: "#f5f6fa",
  l: "#dfe4ea"
};

const ICONS = {
  fruit: [
    ".....KKKKK.....",
    "...KKGGGGGKK...",
    "..KGGrrrrrGGK..",
    ".KGrrKrKrKrrGK.",
    ".KGrrrrrrrrrGK.",
    ".KGrrrrrrrrrGK.",
    "..KGGrrrrrGGK..",
    "...KKGGGGGKK...",
    ".....KKKKK....."
  ],
  staple: [
    ".....KKKKK.....",
    "...KKyyyyyKK...",
    "..KyyyyyyyyyK..",
    ".KyywwwwwwwyyK.",
    ".KyywwwwwwwyyK.",
    ".KyywwwwwwwyyK.",
    "..KyyyyyyyyyK..",
    "...Khh....hhK..",
    "....KhhhhhhK..."
  ],
  steam: [
    ".....KKKKK.....",
    "....KyyyyK.....",
    "...KyyyyyyyK...",
    "..KyyKyyKyyK...",
    ".KyyyyyyyyyyyK.",
    "..KyyyyyyyyyK..",
    "...KyyyyyyyK...",
    "....KKKKKKK...."
  ],
  drink: [
    ".....KKKKK.....",
    "....Kg..KyyK...",
    "...Kgg..KyyyK..",
    "..Kgg...KyyyK..",
    ".Kgg....KyyyK..",
    ".Kgg....KyyyK..",
    "..Kgg...KyyK...",
    "...Kgg..KyK....",
    "....KgggKK....."
  ],
  grill: [
    ".....KKKKK.....",
    "....KooooK.....",
    "...KooooooK....",
    "..KooooooooK...",
    "..KooK.ooooK...",
    "...KooooooK....",
    "....KooooK.....",
    ".....KooK......",
    "......oK......."
  ],
  fry: [
    ".....KKKKK.....",
    "....KmmmmK.....",
    "...KmFFFFFmK...",
    "..KmFFFFFFmK...",
    "..KmFFFFFFmK...",
    "..KmFKwKwFmK...",
    "..KmFFFFFFmK...",
    "...KmmmmmmmK...",
    "....KKKKKKK...."
  ],
  other: [
    ".....KKKKK.....",
    "....KcccccK....",
    "...KcccccccK...",
    "..KcccccccccK..",
    "..KcccccccccK..",
    "..KcccccccccK..",
    "...KcccccccK...",
    "....KcccccK....",
    ".....KKKKK....."
  ]
};

function parseIcon(type) {
  const grid = ICONS[type] || ICONS.other;
  const unit = 6;
  const pixels = [];
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      const color = PALETTE[key];
      if (color && color !== "transparent") {
        pixels.push({ x, y, color });
      }
    }
  });
  return {
    pixels,
    unit,
    size: grid[0].length * unit,
    height: grid.length * unit
  };
}

Component({
  properties: {
    type: {
      type: String,
      value: "fruit"
    }
  },
  data: {
    pixels: [],
    unit: 6,
    size: 60,
    height: 54
  },
  observers: {
    type(type) {
      const icon = parseIcon(type);
      this.setData(icon);
    }
  },
  lifetimes: {
    attached() {
      const icon = parseIcon(this.properties.type);
      this.setData(icon);
    }
  }
});
