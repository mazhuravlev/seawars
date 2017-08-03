export default class HeaderView {

    constructor(container) {
        this.state = {};
        this.container = container;
        this.onRestartCb = [];
        this.appendButtonRestart();
        this.appendInfoContainer();
    }

    change(state) {
        if (this.state.winner !== state.winner) {
            this.state.winner = state.winner;
            if (this.state.winner) {
                this.infoContainer.innerHTML = this.state.winner === 'my' ? 'You win!!!' : 'Opponent win :-(';
                return;
            }
        }
        if (this.state.activeArea !== state.activeArea) {
            this.state.activeArea = state.activeArea;
            if (this.state.activeArea) {
                this.infoContainer.innerHTML = this.state.activeArea === 'my' ? 'opponent\'s move' : 'your move';
            }
        }
    }

    appendButtonRestart() {
        let button = document.createElement('button');
        this.container.appendChild(button);
        button.setAttribute('type', 'button');
        button.innerHTML = 'START';
        button.addEventListener('click', () => {
            button.innerHTML = 'RESTART';
            this.onRestartCb.forEach(cb => cb());
        });
    }

    appendInfoContainer() {
        this.infoContainer = document.createElement('div');
        this.container.appendChild(this.infoContainer);
        this.infoContainer.className = 'header-info';
    }

    onRestart(cb) {
        this.onRestartCb.push(cb);
    }

}
