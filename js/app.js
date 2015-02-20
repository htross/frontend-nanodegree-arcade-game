//Constants for each rectangle tile on the board
var RECTANGWIDTH = 101;
var RECTANGHEIGHT = 83;

//Player/enemy properties
var BUGLENGTH = 101;
var PLAYERWIDTH = 101;
var PLAYERHEIGHT = 83;

//Where the player starts and returns to when struck by a bug
var PLAYERSTARTINGX = 202;
var PLAYERSTARTINGY = 380;

var helperLibrary = {
    randomStartingY : function() {
         return Math.floor(Math.random() * 3) * RECTANGHEIGHT + 60;
    },

    randomStartingX : function() {
        return Math.floor(Math.random() * 5) * RECTANGWIDTH;
    }
};


// Class to create instances of enemies player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = helperLibrary.randomStartingX(); //5 possible starting x positions
    this.y = helperLibrary.randomStartingY(); //3 possible starting y positions
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    //Need to go back to left side of game board bug left the board
    if (this.x > RECTANGWIDTH * 5) {
        this.x = -RECTANGWIDTH; //Start off the board and move onto the board
        this.y = helperLibrary.randomStartingY();
    } else {
        this.x = this.x + (RECTANGWIDTH * dt);
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/* Class to create an instance of the player
 * While there is only 1 player in this game
 * Having a class would make it easier to generalize
 * the game to multiple players
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = PLAYERSTARTINGX
    this.y = PLAYERSTARTINGY;
    this.noNewUpdates = true; //used as a closure for the update function
    this.updateDirection = ''; //A string that holds the most recent update direction
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function() {
    //Need to update player's position on the board
    if(!this.noNewUpdates) {
        this.noNewUpdates = true;

        if(this.updateDirection == 'left' && this.x > 0) {
            this.x = this.x - RECTANGWIDTH;
        } else if (this.updateDirection == 'right' && this.x < (4 * RECTANGWIDTH)) {
            this.x = this.x + RECTANGWIDTH;
        } else if (this.updateDirection == 'up' && (this.y - RECTANGHEIGHT) > 0) {
            this.y = this.y - RECTANGHEIGHT;
        } else if (this.updateDirection == 'down' && this.y < (4 * RECTANGHEIGHT)) {
            this.y = this.y + RECTANGHEIGHT;
        }

    }
}

//Updates the instance variables so the player's position is updated
//Next time the update function is callede
Player.prototype.handleInput = function(direct) {
    this.noNewUpdates = false;
    this.updateDirection = direct;
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();

var allEnemies = [];

for (i = 0; i < 3; i++) {
    var newEnemy = new Enemy();
    allEnemies.push(newEnemy);
}


/*
 * There are 2 ways for the player to collide with the bug
 * 1) The players is to the right of the bug and the bug runs into him
 * 2) The player is to the left of the bug and the player runs into the bug
 * The first conditional checks for this
 *
 * The second conditional just ensures they are in the same row
 */

function checkCollisions(player, enemies) {
    for (e in enemies) {

        var enemy = enemies[e];
        //if player and bug intersect  horizontally

        if(((enemy.x + BUGLENGTH) >= player.x && player.x > enemy.x) ||  //LEFT COLLISION
            ((player.x + PLAYERWIDTH) > enemy.x && enemy.x > player.x)) { //RIGHT COLLISION
            //if player and enemy intersect vertically
            if(player.y < enemy.y && enemy.y < (player.y + PLAYERHEIGHT)) { //Check if they are in same row
                player.x = PLAYERSTARTINGX;
                player.y = PLAYERSTARTINGY;
                break;
            }
        }
    }
}



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
