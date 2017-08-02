let botState = {
    activeArea: null,
    fired: [],
    variants: [],
    ship: null
};


function tryShot(store) {
    if (store.state.battle.activeArea !== 'my') {
        return;
    }
    store.dispatch('shot', 'my', Math.random() * 10 | 0, Math.random() * 10 | 0);
}

export function updateFired(fired) {
    botState.fired = fired;
}

export default function botMiddleware(store, actionName, actionData, next) {
    next(actionData);
    setTimeout(() => tryShot(store), 400);
}
