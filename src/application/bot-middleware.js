let variants = [];

function tryShot(store) {
    if (store.state.battle.activeArea !== 'my') {
        return;
    }
    let index = variants[Math.random() * variants.length | 0];
    store.dispatch('shot', 'my', index % 10, index / 10 | 0);
}

function addHorizontalVariants(index, x, y, statusMap) {
    let isVertical = y > 0 && statusMap[index - 10] === 'killed' || y < 9 && statusMap[index + 10] === 'killed';
    if (isVertical) {
        return;
    }
    if (x > 0 && !(index - 1 in statusMap)) {
        variants.push(index - 1);
    }
    if (x < 9 && !(index + 1 in statusMap)) {
        variants.push(index + 1);
    }
}

function addVerticalVariants(index, x, y, statusMap) {
    let isHorizontal = x > 0 && statusMap[index - 1] === 'killed' || x < 9 && statusMap[index + 1] === 'killed';
    if (isHorizontal) {
        return;
    }
    if (y > 0 && !(index - 10 in statusMap)) {
        variants.push(index - 10);
    }
    if (y < 9 && !(index + 10 in statusMap)) {
        variants.push(index + 10);
    }
}

function addRandomVariants(statusMap) {
    for (let i = 0; i < 100; i++) {
        if (!(i in statusMap)) {
            variants.push(i);
        }
    }
}

export function updateBotState(firedItems) {
    variants = [];
    let statusMap = {};
    firedItems.forEach(item => {
        statusMap[item.index] = item.status;
    });
    firedItems.forEach(item => {
        if (item.status !== 'killed') {
            return;
        }
        let x = item.index % 10;
        let y = item.index / 10 | 0;
        addHorizontalVariants(item.index, x, y, statusMap);
        addVerticalVariants(item.index, x, y, statusMap);
    });
    if (variants.length === 0) {
        addRandomVariants(statusMap);
    }
}

export default function botMiddleware(store, actionName, actionData, next) {
    next(actionData);
    setTimeout(() => tryShot(store), 400);
}
