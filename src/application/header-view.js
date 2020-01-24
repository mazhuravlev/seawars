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
                this.infoContainer.innerHTML = this.state.winner === 'my' ? 'Вы победили!' : 'Противник победил';
                var overlay = document.querySelector('.overlay');
                if(this.state.winner !== 'my') {
                    document.querySelector('.overlayText').innerHTML = 'Каждое поражение – это только стимул идти вперед!';
                }
                overlay.className+=" shown";
                return;
            }
        }
        if (this.state.activeArea !== state.activeArea) {
            this.state.activeArea = state.activeArea;
            if (this.state.activeArea) {
                this.infoContainer.innerHTML = this.state.activeArea === 'my' ? 'ход противника' : 'ваш ход';
            }
        }
    }

    appendButtonRestart() {
        let button = document.createElement('button');
        this.container.appendChild(button);
        button.setAttribute('type', 'button');
        button.innerHTML = 'В Бой!';
        button.addEventListener('click', () => {
            button.innerHTML = 'ЗАНОВО';
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
