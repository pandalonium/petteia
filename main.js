function Game() {
    this.whites = [
        new Pebble(0,7,true,this),
        new Pebble(1,7,true,this),
        new Pebble(2,7,true,this),
        new Pebble(3,7,true,this),
        new Pebble(4,7,true,this),
        new Pebble(5,7,true,this),
        new Pebble(6,7,true,this),
        new Pebble(7,7,true,this),
    ];
    this.blacks = [
        new Pebble(0,0,false,this),
        new Pebble(1,0,false,this),
        new Pebble(2,0,false,this),
        new Pebble(3,0,false,this),
        new Pebble(4,0,false,this),
        new Pebble(5,0,false,this),
        new Pebble(6,0,false,this),
        new Pebble(7,0,false,this)
    ];
    this.grid = [
        [this.blacks[0], this.blacks[1], this.blacks[2], this.blacks[3], this.blacks[4], this.blacks[5], this.blacks[6], this.blacks[7]],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [this.whites[0], this.whites[1], this.whites[2], this.whites[3], this.whites[4], this.whites[5], this.whites[6], this.whites[7]]
    ];
    this.turn = true;
    this.selected = null;
    this.Draw = () => {

        for (let i=0;i<8;i++) {
            var top = 2+10*this.whites[i].y;
            var left = 2+10*this.whites[i].x;
            document.getElementById(`white${i}`).style.top = `min(${top}vh,${top}vw)`;
            document.getElementById(`white${i}`).style.left = `min(${left}vh,${left}vw)`;
        }
        for (let i=0;i<8;i++) {
            var top = 2+10*this.blacks[i].y;
            var left = 2+10*this.blacks[i].x;
            document.getElementById(`black${i}`).style.top = `min(${top}vh,${top}vw)`;
            document.getElementById(`black${i}`).style.left = `min(${left}vh,${left}vw)`;
        }
    }
    this.SelectPebble = (index,colour) => {
        var selected = ((colour) ? this.whites : this.blacks)[index];
        this.selected = selected;
        selected.selected = true;
        var moves = selected.FindAvailableMoves();

        var top = 4+10*moves.up;
        var bottom = 6+10*moves.down;
        var selectLeft = 4+10*selected.x;
        var vertical = document.getElementById("verticalBar")

        vertical.style.top = `min(${top}vh,${top}vw)`;
        vertical.style.left = `min(${selectLeft}vh,${selectLeft}vw)`;
        vertical.style.height = `min(${bottom-top}vh,${bottom-top}vw)`;
        vertical.style.display = "block";

        var left = 4+10*moves.left;
        var right = 6+10*moves.right;
        var selectTop = 4+10*selected.y;
        var horizontal = document.getElementById("horizontalBar")

        horizontal.style.left = `min(${left}vh,${left}vw)`;
        horizontal.style.top = `min(${selectTop}vh,${selectTop}vw)`;
        horizontal.style.width = `min(${right-left}vh,${right-left}vw)`;
        horizontal.style.display = "block";
    }
    this.Unselect = () => {
        document.getElementById("horizontalBar").style.display = "none";
        document.getElementById("verticalBar").style.display = "none";
        this.selected.selected = false;
    }
    for (let i = 0; i < 8; i++) {
        let white = document.getElementById(`white${i}`);
        let whitePebble = this.whites[i];
        white.addEventListener("click",(e) => {
            if (this.turn) {
                if (!whitePebble.selected) {this.SelectPebble(i,true);} 
                else {this.Unselect()};
            }
        });
        
    }

    for (let i = 0; i < 8; i++) {
        let black = document.getElementById(`black${i}`);
        let blackPebble = this.blacks[i];
        black.addEventListener("click",(e) => {
            if (!this.turn) {
                this.SelectPebble(i,false);
            }
        });
        
    }
}

function Pebble(x,y,colour,game) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.game = game;
    this.captured = false;
    this.selected = false;
    this.CheckForCaptures = () => {
        // Check vertical
        var top = false;
        var bottom = false;
        var left = false;
        var right = false;
        if (this.x > 0) {
            if (this.game.grid[y][x-1]) {
                if (this.game.grid[y][x-1].colour == !(this.colour)) {
                    left = true;

                }
            }
        }
        if (this.y > 0) {
            if (this.game.grid[y-1][x]) {
                if (this.game.grid[y-1][x].colour == !(this.colour)) {
                    top = true;
                }
            }
        }
        if (this.x < 7) {
            if (this.game.grid[y][x+1]) {
                if (this.game.grid[y][x+1].colour == !(this.colour)) {
                    right = true;

                }
            }
        }
        if (this.y < 7) {
            if (this.game.grid[y+1][x]) {
                if (this.game.grid[y+1][x].colour == !(this.colour)) {
                    bottom = true;
                }
            }
        }
        if ((top && bottom) || (left && right)) {
            this.captured = true;
            return true;
        }
        return false;
    }
    this.FindAvailableMoves = () => {
        var checking = this.y-1;
        // Up
        while (checking >= 0 && this.game.grid[checking][this.x] == null) {
            checking--;
        }
        var upTo = checking+1;
        // Down
        checking = this.y+1;
        
        while (checking < 8 && this.game.grid[checking][this.x] == null) checking++;
        var downTo = checking-1;
        // Left
        checking = this.x-1;
        while (checking >= 0 && this.game.grid[this.y][checking] == null) checking--;
        var leftTo = checking+1;
        // Right
        checking = this.x+1;
        while (checking < 8 && this.game.grid[this.y][checking] == null) checking++;
        var rightTo = checking-1;
        return {
            up: upTo,
            down: downTo,
            left: leftTo,
            right: rightTo
        }
    }
    this.MoveTo = (x,y) => {
        this.game.grid[y][x] = this;
        this.game.grid[this.y][this.x] = null;
        this.x = x;
        this.y = y;
    }
    
}