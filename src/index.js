import './styles/app.less';

import Fluxter from 'fluxter';
import AreaView from './application/area-view';
import HeaderView from './application/header-view';
import shotReducer from './application/shot-reducer';
import restartReducer from './application/restart-reducer';
import botMiddleware, {updateBotState} from './application/bot-middleware';

const src = [
    {decks: 4, count: 1},
    {decks: 3, count: 2},
    {decks: 2, count: 3},
    {decks: 1, count: 4}
];

let store = new Fluxter({
    battle: {
        winner: null,
        activeArea: null,
        my: {items: [], ships: []},
        opponent: {items: [], ships: []}
    }
});

let header = new HeaderView(document.getElementById('header'));
let myArea = new AreaView(document.getElementById('myArea'), true);
let opponentArea = new AreaView(document.getElementById('opponentArea'), false);

store.addMiddleware(botMiddleware);
store.addReducer('battle', shotReducer);
store.addReducer('battle', restartReducer);
store.addAction('shot', (area, x, y) => ({area, x, y}));
store.addAction('restart', (src) => ({src}));

store.subscribe(store => {
    header.change({
        activeArea: store.state.battle.activeArea,
        winner: store.state.battle.winner
    });
    myArea.change(store.state.battle.my);
    opponentArea.change(store.state.battle.opponent);
    let botFiredItems = store.state.battle.my.items
        .filter(item => item.status !== 'deck' && item.status !== 'empty')
        .map(item => ({index: item.y * 10 + item.x, status: item.status}));
    updateBotState(botFiredItems);
});

header.onRestart(() => store.dispatch('restart', src));
opponentArea.bindClientEventHandler();
opponentArea.onShot((x, y) => store.dispatch('shot', 'opponent', x, y));
