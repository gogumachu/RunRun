// 아래 변수들도 전역 선언을 피할 수 있으면 피하자
const canvas = document.getElementsByClassName("canv")[0];
const ctx = canvas.getContext("2d");


class Pyshics {
    constructor() {
        this._gravity = 0.1
    }

    get gravity() {
        return this._gravity;
    }
}

class Player {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 60;

        this._ySpeed = 3;
        this._xSpeed = 0;

        this._canJump = false;
    }

    get xSpeed() {
        return this._xSpeed;
    }

    set xSpeed(speed) {
       this._xSpeed = speed; 
    }

    get ySpeed() {
        return this._ySpeed;
    }

    set ySpeed(speed) {
       this._ySpeed = speed; 
    }

    canJump() {
        return this._canJump;
    }

    show() {
        // 전역변수 접근....더 좋은 방법을 찾아보자
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    update() {
        this.show();

        // this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.ySpeed += pyshics.gravity;
        if(this.y >= 440) {
            this._canJump = true;
            this.ySpeed = 0;
        } else {
            this._canJump = false;
        }
    }
}

// 장애물(obstacles)
class Rock {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 40;
    }
    show() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    update() {
        // rock 이랑 player 랑 상호의존하게 되지는 않으려나...흠
    }

}

class KeyController {
    constructor(player) {
        this.player = player;
        document.onkeydown = this.keyDown.bind(this);
        document.onkeyup = this.keyUp.bind(this);
    }

    keyDown(event) {
        // right
        if(event.keyCode === 39) {
            // 이것도 접근제한자로 다듬을 필요가..
            this.player.xSpeed = 5;
        }
        // left
        if(event.keyCode === 37) {
            this.player.xSpeed = -5;
        }
        // space
        if(event.keyCode === 32 && this.player.canJump()) {
            this.player.ySpeed = -3;
        }
    }

    // 키를 놓으면 speed 를 0으로 초기화한다.
    keyUp(event) {
        if(event.keyCode === 39) {
            // 이것도 접근제한자로 다듬을 필요가..
            this.player.xSpeed = 0;
        }
        if(event.keyCode === 37) {
            this.player.xSpeed = 0;
        }

    }
}

class Main {
    constructor() {
        this.player = new Player(400,200);
        this.keyController = new KeyController(this.player);
        this.rocks = [];
        let rockX = 500;
        for(let i=0; i<10; i++) {
            const r = new Rock(rockX, 460);
            this.rocks.push(r);
            rockX += 200;
        }
    }

    gameStart() {
        setInterval(this.update.bind(this), 10);
    }

    update() {
        // ??
        canvas.width = canvas.width;
        this.drawGround();
        this.player.update();
        this.rocks.forEach((rock) => { 
            rock.show();
            // player 가 움직이려는 반대 방향으로 배경을 이동 시켜서 player 가 움직이는 것 처럼 한다.
            rock.x -= this.player.xSpeed;
        });
    }

    drawGround() {
        ctx.fillStyle = 'green';
        ctx.fillRect(0,500,960,40);
    }
}

const gameMain = new Main();
const pyshics = new Pyshics();

window.onload = () => {
    gameMain.gameStart();
}