class Controls {
    constructor() {
        this.left = false;
        this.right = false;
        this.forward = false;
        this.reserse = false;

        this._addKeybbordListeners();
    }

    _addKeybbordListeners() {


        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        });
    }
}