/*
  Harvest Monster - Per Monster (Light Variant) Macro:
  This Foundry VTT macro facilitates the harvesting of a monster in a Pathfinder 2nd Edition (PF2E) game.
  It calculates the bulk and values of harvested monster parts based on the monster's level and size,
  then prompts the Game Master to confirm the creation of a corresponding treasure item. The item includes
  details such as the monster's name, traits, rarity, and a description of its traits. The macro ensures
  that a single player token and a single target monster are selected for the harvesting process.
*/

// Target for Harvest i.e. the monster being harvested
const targets = game.user.targets
const [target] = targets
const monster = target.actor.system

// Select player token
const getPlayer = () => {
    return canvas.tokens.controlled.length ?
        canvas.tokens.controlled.map((token) => token.actor)[0] :
        game.user.character;
}

const player = getPlayer();

// Monster Stats
const monsterLevel = monster.details.level.value;
const monsterSize = monster.traits.size.value;
const monsterName = target.actor.name;
const monsterRarity = monster.traits.rarity;
const monsterTraits = monster.traits.value;


// Construct the final description
const finalDescription = `<h1>Monster Traits:</h1>
<section class="traits">
  ${monsterTraits} 
</section>`;

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

// Uses the light variant table from battlezoo. Took some liberties to round nearest whole gold peice. 
const calculateValues = (level) => {
    const monsterPartsTable = [
        2, 3, 4, 5, 7, 12, 18, 30, 45, 64, 90, 125, 175, 250, 375, 560, 810, 1250, 1875, 3000, 5000, 8750, 10000, 17500, 20000, 35000, 40000
    ];

    const index = level + 1;
    const monsterParts = monsterPartsTable[index];

    return {
        monsterParts
    };
};


if (canvas.tokens.controlled.length !== 1) {
    ui.notifications.warn('You need to select exactly one token to Harvest Monster.');
} else if (game.user.targets.size !== 1) {
    ui.notifications.warn(`Please have only 1 target for harvesting`);
} else {
    if (monsterLevel < 1) {
        ui.notifications.warn("This monster is not harvestable");
    } else {
        const values = calculateValues(monsterLevel);
        const bulk = calculateBulk(monsterSize);

        // Display a confirmation dialog
        Dialog.confirm({
            title: "Confirmation",
            content: `Create item: Monster Part - ${monsterName}?`,
            yes: async () => {
                const data = [{
                    "name": `Monster Part: ${monsterName}`,
                    type: "treasure",
                    img: "systems/pf2e/icons/default-icons/treasure.svg",
                    system: {
                        bulk: {
                            value: bulk
                        },
                        description: {
                            "gm": "",
                            "value": finalDescription
                        },
                        traits: {
                            "rarity": monsterRarity
                        },
                        price: {
                            "value": {
                                "gp": values.monsterParts
                            }
                        },
                    },
                }, ];

                const created = await Item.createDocuments(data);
                console.log("Item created:", created);
            },
            no: () => console.log("Item creation cancelled"),
        });
    }
}
