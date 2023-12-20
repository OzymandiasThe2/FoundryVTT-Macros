const getActor = () => {
  return canvas.tokens.controlled.length
    ? canvas.tokens.controlled.map((token) => token.actor)[0]
    : game.user.character;
};

const actor = getActor();

if (!actor) {
  // @ts-ignore
  return ui.notifications.warn("No character selected!");
}

// This gets token/actor level and size
const level = actor.level;
console.log(level);

const size = actor.size;
console.log(size);

const monsterName = actor.name;
console.log(monsterName);

const monsterRarity = actor.rarity;
console.log(monsterRarity);

// Function to calculate bulk based on monster size
const calculateBulk = (size) => {
  switch (size) {
    case 'sm':
      return 'Light';
    case 'med':
      return 1;
    case 'lg':
      return 2;
    case 'huge':
      return 4;
    case 'grg':
      return 8;
    default:
      return 'Not harvestable';
  }
};

const calculateValues = (level) => {
  const monsterPartsTable = [
    2, 3, 4, 5, 7, 12, 18, 30, 45, 64, 90, 125, 175, 250, 375, 560, 810, 1250, 1875, 3000, 5000, 8750, 10000, 17500, 20000, 35000, 40000
  ];

  const index = level + 1;
  const monsterParts = monsterPartsTable[index];

  return { monsterParts };
};

if (level < 1) {
  ui.notifications.warn("This monster is not harvestable");
} else {
  const values = calculateValues(level);
  const bulk = calculateBulk(size);

  const data = [
    {
      "name": `Monster Part: ${monsterName}`,
      type: "treasure",
      img: "systems/pf2e/icons/default-icons/treasure.svg",
      system: 
{
bulk: {value: bulk},
traits: {"rarity": monsterRarity},
price: {"value": {"gp": values.monsterParts}},

},


    }
  ];

  const created = await Item.createDocuments(data);
  console.log("Item created:", created);

}
