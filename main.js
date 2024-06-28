function Game() {
    this.whites = [
        new Pebble(0,7,true,this,0),
        new Pebble(1,7,true,this,1),
        new Pebble(2,7,true,this,2),
        new Pebble(3,7,true,this,3),
        new Pebble(4,7,true,this,4),
        new Pebble(5,7,true,this,5),
        new Pebble(6,7,true,this,6),
        new Pebble(7,7,true,this,7),
    ];
    this.blacks = [
        new Pebble(0,0,false,this,0),
        new Pebble(1,0,false,this,1),
        new Pebble(2,0,false,this,2),
        new Pebble(3,0,false,this,3),
        new Pebble(4,0,false,this,4),
        new Pebble(5,0,false,this,5),
        new Pebble(6,0,false,this,6),
        new Pebble(7,0,false,this,7)
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
    this.lastMove = null;
    this.turn = true;
    this.selected = null;
    this.Draw = () => {
        for (let i=0;i<this.whites.length;i++) {
            if (this.whites[i] == null) {
                continue;
            }
            if (this.whites[i].captured) {
                document.getElementById(`white${i}`).style.opacity = "0";
                setTimeout(() => {
                    document.getElementById(`white${i}`).style.display = "none";
                    this.whites[i] = null;
                },"500");
                this.grid[this.whites[i].y][this.whites[i].x] = null;
                continue;
            } else {
                document.getElementById(`white${i}`).style.opacity = "1";

            }
            var top = 1+10*this.whites[i].y;
            var left = 1+10*this.whites[i].x;
            document.getElementById(`white${i}`).style.top = `min(${top}vh,${top}vw)`;
            document.getElementById(`white${i}`).style.left = `min(${left}vh,${left}vw)`;
        }
        for (let i=0;i<this.blacks.length;i++) {
            if (this.blacks[i] == null) {
                continue;
            }
            if (this.blacks[i].captured) {
                document.getElementById(`black${i}`).style.opacity = "0";
                
                setTimeout(() => {
                    document.getElementById(`black${i}`).style.display = "none";
                    this.blacks[i] = null;
                },"500");
                this.grid[this.blacks[i].y][this.blacks[i].x] = null;
                continue;
            } else {
                document.getElementById(`black${i}`).style.opacity = "1";
            }
            var top = 1+10*this.blacks[i].y;
            var left = 1+10*this.blacks[i].x;
            document.getElementById(`black${i}`).style.top = `min(${top}vh,${top}vw)`;
            document.getElementById(`black${i}`).style.left = `min(${left}vh,${left}vw)`;
        }
        document.getElementById(`${(!this.turn) ? "white" : "black"}Tab`).style.width = "0";

        document.getElementById(`${(this.turn) ? "white" : "black"}Tab`).style.width = "min(45vw,45vh)";
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
        if (!this.selected) return;
        this.selected.selected = false;
        this.selected = null;
    }
    for (let i = 0; i < this.whites.length; i++) {
        let white = document.getElementById(`white${i}`);
        let whitePebble = this.whites[i];
        white.addEventListener("click",(e) => {
            if (this.turn && !whitePebble.captured) {
                if (!whitePebble.selected) {this.Unselect();this.SelectPebble(i,true);} 
                else {this.Unselect()};
            }
        });
        
    }
    

    for (let i = 0; i < this.blacks.length; i++) {
        let black = document.getElementById(`black${i}`);
        let blackPebble = this.blacks[i];
        black.addEventListener("click",(e) => {
        if (!this.turn && !blackPebble.captured) {
                if (!blackPebble.selected) {this.Unselect();this.SelectPebble(i,false);} 
                else {this.Unselect()};
            }
        });
        
    }
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            var square = document.getElementById(`square${x}${y}`);
            square.addEventListener("click",(e) => {
                if (!this.selected ) return;
                if (this.selected.CanMoveTo(x,y)) {
                    this.selected.MoveTo(x,y);
                    if (x > 0 && this.grid[y][x-1] != null && this.grid[y][x-1].colour == !this.selected.colour
                        && this.grid[y][x-1].CheckForCaptures()
                    ) {

                    }
                    if (x < 7 && this.grid[y][x+1] != null && this.grid[y][x+1].colour == !this.selected.colour
                        && this.grid[y][x+1].CheckForCaptures()
                    ) {

                    }
                    if (y > 0 && this.grid[y-1][x] != null && this.grid[y-1][x].colour == !this.selected.colour
                        && this.grid[y-1][x].CheckForCaptures()
                    ) {
                        
                    }
                    if (y < 7 && this.grid[y+1][x] != null && this.grid[y+1][x].colour == !this.selected.colour
                        && this.grid[y+1][x].CheckForCaptures()
                    ) {
                        
                    }
                    this.turn = !this.turn;
                    
                    this.Unselect();
                }
                
                this.Draw();
            })
        }
        
    }
    this.Draw();
}

function Pebble(x,y,colour,game,index) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.game = game;
    this.captured = false;
    this.selected = false;
    this.index = index;
    this.CheckForCaptures = () => { 
        // Check vertical
        var top = false;
        var bottom = false;
        var left = false;
        var right = false;
        let x = this.x;
        let y = this.y;
        if (this.x > 0) {
            if (this.game.grid[y][x-1] != null) {
                if (this.game.grid[y][x-1].colour == !(this.colour)) {
                    left = true;

                }
            }
        }
        if (this.y > 0) {
            if (this.game.grid[y-1][x] != null) {
                if (this.game.grid[y-1][x].colour == !(this.colour)) {
                    top = true;
                }
            }
        }
        if (this.x < 7) {
            if (this.game.grid[y][x+1] != null) {
                if (this.game.grid[y][x+1].colour == !(this.colour)) {
                    right = true;

                }
            }
        }
        if (this.y < 7) {
            if (this.game.grid[y+1][x] != null) {
                
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
    this.CanMoveTo = (x,y) => {
        var available = this.FindAvailableMoves();
        
        if (x != this.x && y != this.y) return false;
        if (x == this.x && y == this.y) return false;
        if (x == this.x && (available.up <= y && y <= available.down)) return true;
        if (y == this.y && (available.left <= x && x <= available.right)) return true;
        return false;
    }
    this.MoveTo = (x,y) => {
        this.game.grid[y][x] = this;
        this.game.grid[this.y][this.x] = null;
        this.x = x;
        this.y = y;
    }
    
}

function ShowHowTo() {
    document.getElementById("howTo").showModal();
    document.getElementById("howTo").style.opacity="1";
    document.getElementById("howTo").style.transform="none";
}

function HideHowTo() {
    
    document.getElementById("howTo").style.opacity="0";
    document.getElementById("howTo").style.transform="translate(0,min(10vh,10vw))";
    setTimeout(() => {document.getElementById("howTo").close();},"250");
}

window.onload = (e) => {
    g = new Game();
    if (!document.cookie.includes("no")) {
        document.getElementById("howTo").showModal();
        document.getElementById("howTo").style.opacity="1";
        document.getElementById("howTo").style.transform="none";
    }
    document.getElementById("closeHowTo").addEventListener("click",() => {
        if (document.getElementById("dontShow").checked) {
            document.cookie = "tutorial=no;";
        }
        HideHowTo();
    })
    
}