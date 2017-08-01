export default class AreaView {

    constructor(container) {
        this.container = container;
        this.onShotCb = [];
        this.items = [];
        this.state = {};
        this.makeArea();
    }

    makeArea() {
        for (let i = 0; i < 100; i++) {
            this.items[i] = document.createElement('div');
            this.container.appendChild(this.items[i]);
        }
    }

    change(state) {
        if (state === this.state) {
            return;
        }
        this.state = state;
        this.state.items.forEach((item, index) => {
            this.items[index].classList = [item.status];
        })
    }

    bindClientEventHandler() {
        this.items.forEach(item => item.addEventListener('click', (e) => {
            let index = this.items.indexOf(e.target);
            let x = index % 10;
            let y = index / 10 | 0;
            this.onShotCb.forEach(cb => cb(x, y));
        }));
    }

    onShot(cb) {
        this.onShotCb.push(cb);
    }

}
