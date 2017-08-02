export default function restartReducer(state = {}, actionName, actionData) {
    if (actionName !== 'restart') {
        return state;
    }

    let addHorizontalVariant = (variants, item, x, y, cache) => {
        let checks = [
            x >= 0,
            x + item.decks - 1 <= 9,
            (x === 0 || !(y * 10 + x - 1 in cache)),
            (x + item.decks - 1 === 9 || !(y * 10 + x + item.decks in cache))
        ];
        if (checks.indexOf(false) !== -1) {
            return;
        }
        let variant = [];
        let valid = true;
        for (let i = x; i < x + item.decks; i++) {
            let checksValid = [
                y > 0 && i > 0 && (y - 1) * 10 + i - 1 in cache,
                y < 9 && i > 0 && (y + 1) * 10 + i - 1 in cache,
                y > 0 && i < 9 && (y - 1) * 10 + i + 1 in cache,
                y < 9 && i < 9 && (y + 1) * 10 + i + 1 in cache,
                y > 0 && (y - 1) * 10 + i in cache,
                y < 9 && (y + 1) * 10 + i in cache
            ];
            if (checksValid.indexOf(true) !== -1) {
                valid = false;
                break;
            }
            variant.push({
                x: i,
                y: y
            });
        }
        if (valid) {
            variants.push(variant);
        }
    };

    let addVerticalVariant = (variants, item, x, y, cache) => {
        let checks = [
            y >= 0,
            y + item.decks - 1 <= 9,
            (y === 0 || !((y - 1) * 10 + x in cache)),
            (y + item.decks - 1 === 9 || !((y + item.decks) * 10 + x in cache))
        ];
        if (checks.indexOf(false) !== -1) {
            return;
        }
        let variant = [];
        let valid = true;
        for (let i = y; i < y + item.decks; i++) {
            let checksValid = [
                i > 0 && x > 0 && (i - 1) * 10 + x - 1 in cache,
                i < 9 && x > 0 && (i + 1) * 10 + x - 1 in cache,
                i > 0 && x < 9 && (i - 1) * 10 + x + 1 in cache,
                i < 9 && x < 9 && (i + 1) * 10 + x + 1 in cache,
                x > 0 && i * 10 + x - 1 in cache,
                x < 9 && i * 10 + x + 1 in cache
            ];
            if (checksValid.indexOf(true) !== -1) {
                valid = false;
                break;
            }
            variant.push({
                x: x,
                y: i
            });
        }
        if (valid) {
            variants.push(variant);
        }
    };

    let makeVariants = (item, cache) => {
        let variants = [];
        for (let y = 0; y <= 9; y++) {
            for (let x = 0; x <= 9; x++) {
                if (y * 10 + x in cache) {
                    continue;
                }
                addHorizontalVariant(variants, item, x, y, cache);
                addVerticalVariant(variants, item, x, y, cache);
            }
        }
        return variants;
    };

    let makeItems = () => {
        let items = [];
        for (let i = 0; i < 100; i++) {
            items.push({
                x: i % 10,
                y: i / 10 | 0,
                status: 'empty'
            });
        }
        return items;
    };

    let makeData = () => {
        let cache = {};
        let result = {
            items: makeItems(),
            ships: []
        };
        actionData.src.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                let variants = makeVariants(item, cache);
                let ship = variants[Math.random() * variants.length | 0];
                let shipIndex = result.ships.push(ship) - 1;
                ship.forEach(deck => {
                    let index = deck.y * 10 + deck.x;
                    result.items[index].status = 'deck';
                    result.items[index].shipIndex = shipIndex;
                    cache[index] = true;
                });
            }
        });
        return result;
    };

    return {
        // activeArea: (['my', 'opponent'])[Math.random() * 2 | 0],
        activeArea: 'opponent',
        my: makeData(),
        opponent: makeData()
    };
}
