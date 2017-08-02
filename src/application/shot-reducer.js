export default function shotReducer(state = {}, actionName, actionData) {
    if (actionName !== 'shot' || state.activeArea !== actionData.area) {
        return state;
    }

    let index = actionData.y * 10 + actionData.x;
    let item = state[actionData.area].items[index];

    if (item.status === 'missed' || item.status === 'killed') {
        return state;
    }

    let getNewState = (state, status) => {
        return {
            ...state,
            [actionData.area]: {
                ...state[actionData.area],
                items: state[actionData.area].items.map(_item => {
                    if (_item === item) {
                        return {
                            ..._item,
                            status: status
                        }
                    }
                    return _item;
                })
            }
        }
    };

    let updateShip = (newState) => {
        newState[actionData.area].ships = newState[actionData.area].ships.map((ship, index) => {
            if (index === item.shipIndex) {
                return ship.map(deck => {
                    if (deck.x === actionData.x && deck.y === actionData.y) {
                        return {
                            ...deck,
                            status: 'killed'
                        };
                    }
                    return deck;
                });
            }
            return ship;
        });
    };

    let wrapKilledShip = (newState) => {
        let ship = newState[actionData.area].ships[item.shipIndex];
        ship.forEach(deck => {
            let {x, y} = deck;
            let items = {
                [(y - 1) * 10 + x - 1]: y > 0 && x > 0,
                [(y - 1) * 10 + x + 1]: y > 0 && x < 9,
                [(y + 1) * 10 + x - 1]: y < 9 && x > 0,
                [(y + 1) * 10 + x + 1]: y < 9 && x < 9,
                [y * 10 + x - 1]: x > 0,
                [(y - 1) * 10 + x]: y > 0,
                [(y + 1) * 10 + x]: y < 9,
                [y * 10 + x + 1]: x < 9
            };
            Object.keys(items).forEach(index => {
                if (!items[index]) {
                    return;
                }
                let item = newState[actionData.area].items[index];
                if (item.status !== 'empty') {
                    return;
                }
                newState[actionData.area].items[index] = {
                    ...item,
                    status: 'missed'
                };
            });
        });
    };

    if (item.status === 'empty') {
        let newState = getNewState(state, 'missed');
        newState.activeArea = state.activeArea === 'my' ? 'opponent' : 'my';
        return newState;
    }

    if (item.status === 'deck') {
        let newState = getNewState(state, 'killed');
        updateShip(newState);
        let ship = newState[actionData.area].ships[item.shipIndex];
        let isShipKilled = ship.reduce((total, deck) => {
            return total + (deck.status !== 'killed' ? 1 : 0);
        }, 0) === 0;
        if (isShipKilled) {
            wrapKilledShip(newState);
        }
        return newState;
    }

    return state;
}
