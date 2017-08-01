import './styles/app.less';

import Fluxter from 'fluxter';
import AreaView from './application/area-view';
import shotReducer from './application/shot-reducer';
import restartReducer from './application/restart-reducer';

const src = [
    { decks: 4, count: 1 },
    { decks: 3, count: 2 },
    { decks: 2, count: 3 },
    { decks: 1, count: 4 }
];

let store = new Fluxter({
    battle: {
        active: null,
        my: { items: [], ships: [] },
        opponent: { items: [], ships: [] }
    }
});

let myAreaView = new AreaView(document.getElementById('myArea'));
let opponentAreaView = new AreaView(document.getElementById('opponentArea'));

store.addReducer('battle', shotReducer);
store.addReducer('battle', restartReducer);
store.addAction('shot', (area, x, y) => ({ area, x, y }));
store.addAction('restart', (src) => ({ src }));

store.subscribe(store => {
    myAreaView.change(store.state.battle.my);
    opponentAreaView.change(store.state.battle.opponent);
});

opponentAreaView.bindClientEventHandler();
opponentAreaView.onShot((x, y) => store.dispatch('shot', 'opponent', x, y));

document.getElementById('restartButton').addEventListener('click', (e) => {
    e.target.innerHTML = 'RESTART';
    store.dispatch('restart', src);
});
