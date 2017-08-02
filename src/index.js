import './styles/app.less';

import Fluxter from 'fluxter';
import AreaView from './application/area-view';
import shotReducer from './application/shot-reducer';
import restartReducer from './application/restart-reducer';
import botMiddleware, {updateFired} from './application/bot-middleware';

const src = [
    { decks: 4, count: 1 },
    { decks: 3, count: 2 },
    { decks: 2, count: 3 },
    { decks: 1, count: 4 }
];

let store = new Fluxter({
    battle: {
        activeArea: null,
        my: { items: [], ships: [] },
        opponent: { items: [], ships: [] }
    }
});

let myAreaView = new AreaView(document.getElementById('myArea'), true);
let opponentAreaView = new AreaView(document.getElementById('opponentArea'), false);

store.addMiddleware(botMiddleware);
store.addReducer('battle', shotReducer);
store.addReducer('battle', restartReducer);
store.addAction('shot', (area, x, y) => ({ area, x, y }));
store.addAction('restart', (src) => ({ src }));

store.subscribe(store => {
    myAreaView.change(store.state.battle.my);
    opponentAreaView.change(store.state.battle.opponent);
    let botFiredItems = store.state.battle.my.items
        .filter(item => item.status !== 'deck' && item.status !== 'empty')
        .map(item => item.y * 10 + item.x);
    updateFired(botFiredItems);
});

opponentAreaView.bindClientEventHandler();
opponentAreaView.onShot((x, y) => store.dispatch('shot', 'opponent', x, y));

document.getElementById('restartButton').addEventListener('click', (e) => {
    e.target.innerHTML = 'RESTART';
    store.dispatch('restart', src);
});
