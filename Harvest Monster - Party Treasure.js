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
const size = actor.size;

const calculateValues = (level) => {

    const table = [
        [175, [2, 1], [2, 3], 40, 10],
        [300, [3, 2], [3, 2, 1], 70, 18],
        [500, [4, 3], [4, 3, 2], 120, 30],
        [860, [5, 4], [5, 4, 3], 200, 50],
        [1350, [6, 5], [6, 5, 4], 320, 80],
        [2000, [7, 6], [7, 6, 5], 500, 125],
        [2900, [8, 7], [8, 7, 6], 720, 180],
        [4000, [9, 8], [9, 8, 7], 1000, 250],
        [5700, [10, 9], [10, 9, 8], 1400, 350],
        [8000, [11, 10], [11, 10, 9], 2000, 500],
        [11500, [12, 11], [12, 11, 10], 2800, 700],
        [16500, [13, 12], [13, 12, 11], 4000, 1000],
        [25000, [14, 13], [14, 13, 12], 6000, 1500],
        [36500, [15, 14], [15, 14, 13], 9000, 2250],
        [54500, [16, 15], [16, 15, 14], 13000, 3250],
        [82500, [17, 16], [17, 16, 15], 20000, 5000],
        [128000, [18, 17], [18, 17, 16], 30000, 7500],
        [208000, [19, 18], [19, 18, 17], 48000, 12000],
        [355000, [20, 19], [20, 19, 18], 80000, 20000],
        [490000, [20], [20, 19], 140000, 35000],
    ];

        const index = level - 1;
        const [totalValue, permanentItems, consumables, monsterParts, monsterPartsPer] = table[index];

        return { totalValue, permanentItems, consumables, monsterParts, monsterPartsPer };
};

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

if (level < 1) {
    ui.notifications.warn("This monster is not harvestable");
} else {
    const values = calculateValues(level);
    const bulk = calculateBulk(size);

    let d = new Dialog({
        title: "Monster Harvest",
        content: `
        <p>Total Value: ${values.totalValue}</p>
        <p>Permanent Items: ${values.permanentItems}</p>
        <p>Consumables: ${values.consumables}</p>
        <p>Monster Parts: ${values.monsterParts}</p>
        <p>Monster Parts per: ${values.monsterPartsPer}</p>
        <p>Monster Size: ${actor.size} (Bulk: ${bulk})</p>
`,
        buttons: {
            close: {
                icon: '<i class="fas fa-times"></i>',
                label: "Close",
            },
        },
        default: "close",
        render: (html) => console.log("Register interactivity in the rendered dialog"),
        close: (html) => console.log("This always is logged no matter which option is chosen"),
    });

    d.render(true);
}
