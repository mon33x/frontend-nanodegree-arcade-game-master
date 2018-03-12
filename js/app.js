'use strict';

let gemsCarried = 0;
let gemsDeposited = 0;
let enemies = 3;
let gemsPickedUp = 0;
let listening = true;
let lives = startingLives;

const $lives = $('.lives').children().first();
const $gemsCarried = $('.gemsCarried').children().first();
const $gemsDeposited = $('.gemsDeposited').children().first();
const $enemies = $('.enemies').children().first();
const $modal = $('.modal');
const $overlay = $('.overlay');
const $overlayClose = $('#close');
const $help = $('.help');

// object that holds info about enemies

const Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// function that multiplies the speed by dt and moves the bug to the left if it leaves the screen
// it also calls checkCollision

Enemy.prototype.update = function(dt) {

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x + dt * this.speed;
    if (this.x > 520) {
          this.x = -120;
   }
   this.checkCollision();
};

// function that checks if the player crashed into an enemy, reduces the number of lives and displays it
// if you lose all your lives it calls end function, if the number of enemies is bigger than startingEnemies remove one and display it
// decrease the number of gems carried by lostGems and set them to 0 if you have less than lostGems also display it

Enemy.prototype.checkCollision = function() {
      if (player.y + 131 >= this.y + 90 && player.x + 25 <= this.x + 88 && player.y + 73 <= this.y + 135 && player.x + 76 >= this.x + 11) {
            player.x = 202;
            player.y = 400;
            lives--;
            $lives.text(lives);
            if (lives === 0) {
                  end();
            }
            if (enemies > startingEnemies) {
                  enemies--;
                  allEnemies.pop();
                  $enemies.text(enemies);
            };
            gemsCarried -= lostGems;
            if (gemsCarried < 0) {
                  gemsCarried = 0;
            }
            $gemsCarried.text(gemsCarried);
      }
};

// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// object that holds info about gems

const Gem = function(x, y, gemIndex) {
      this.sprite = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'][gemIndex];
      this.value = [1, 2, 3][gemIndex];
      this.x = x;
      this.y = y;
};

// function that gets a random index for our Gem object ()
// the index depends on the perchantage set by orangeGemChance and greenGem chance;

function getRandomGem() {
      let gemIndex = Math.floor(Math.random() * 100  + 1);
      if (gemIndex > orangeGemChance) {
            gemIndex = 2;
      } else if (gemIndex > greenGemChance) {
            gemIndex = 1;
      } else {
            gemIndex = 0;
      }
      return gemIndex;
}

// Draw the gem on the screen, required method for game

Gem.prototype.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// function that checks if the player picked up a gem, it increments gemsPickedUp, and adds the value of the picked up gem to the gemsCarried
// it updates the display with gemsCarried. A new gem is created to replace the last one and every enemyEveryNGems a new enemy is spawned
// enemies is incremented and the display is updated

Gem.prototype.checkPickup = function() {
      if (player.y <= this.y && player.x + 25 <= this.x + 88 && player.y + 60 >= this.y && player.x + 76 >= this.x + 11) {
            gemsPickedUp++;
            gemsCarried += gem.value;
            $gemsCarried.text(gemsCarried);
            gem = new Gem(101 * Math.floor(Math.random() * 5) + 25, 460 - 83 * (Math.floor(Math.random() * 3) + 2) , getRandomGem());
            if (gemsPickedUp % enemyEveryNGems === 0){
                  allEnemies.push(new Enemy(0, Math.random() * 184 + 50, Math.random() * 200 + 100));
                  enemies++;
                  $enemies.text(enemies);
            }
      }
};

// object that holds info about our player

const Player = function(x, y) {
      this.sprite = 'images/char-princess-girl.png';
      this.x = x;
      this.y = y;
};

// not necessary

Player.prototype.update = function() {
};

// Draw the player on the screen, required method for game

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// function that moves the player accoriding to the pressed key.
// it also sets the player image according to the pressed key.

Player.prototype.handleInput = function (keyPressed) {
      switch (keyPressed) {
            case 'left':
                  this.x -= 101;
                  break;
            case 'right':
                  this.x += 101;
                  break;
            case 'up':
                  this.y -= 83;
                  break;
            case 'down':
                  this.y += 83;
                  break;
            case 'char1':
                  this.sprite = 'images/char-boy.png';
                  break;
            case 'char2':
                  this.sprite = 'images/char-cat-girl.png';
                  break;
            case 'char3':
                  this.sprite = 'images/char-horn-girl.png';
                  break;
            case 'char4':
                  this.sprite = 'images/char-pink-girl.png';
                  break
            case 'char5':
                  this.sprite = 'images/char-princess-girl.png';
      }

      // limits the player from leaving the canvas and checks if the player got to the river
      // if the player got to the river increase gemsDeposited by gemsCarried if you had 5 or more get a life
      // set gems carried to 0 and display everything. Check if the player picked up a gem.

      if (this.x > 400) {
            this.x = 400;
      }
      if (this.x < 0) {
            this.x = 0;
      }
      if (this.y > 400) {
            this.y = 400;
      }
      if (this.y < -80) {
            this.y = -15;
      }
      if (this.y < 60) {
            this.x = 202;
            this.y = 400;
            gemsDeposited += gemsCarried;
            if (gemsCarried >= 5) {
                  lives++;
            }
            gemsCarried = 0;
            $gemsCarried.text(gemsCarried);
            $gemsDeposited.text(gemsDeposited);
            $lives.text(lives);
      }
      gem.checkPickup();
};

// restart function that sets listening to true so we can track key presses
// close the modal and clear the allEnemies array. Set lives and enemies gemsCarried, gemsDeposited and gemsPickedUp to initial values
// display it create a new player at the starting position and create a new gem.
// Create startingEnemies number of bugs.

function restart() {
      listening = true;
      $modal.css('display', 'none');
      allEnemies = [];
      lives = startingLives;
      enemies = startingEnemies;
      gemsCarried = 0;
      gemsDeposited = 0;
      gemsPickedUp = 0;
      $enemies.text(enemies);
      $gemsCarried.text(gemsCarried);
      $gemsDeposited.text(gemsDeposited);
      $lives.text(lives);
      player = new Player(202, 400);
      gem = new Gem(101 * Math.floor(Math.random() * 5) + 25 , 460 - 83 * (Math.floor(Math.random() * 3) + 2) , getRandomGem());
      for (let i = 0; i < startingEnemies; i++) {
            allEnemies.push(new Enemy(0, Math.random() * 184 + 50, Math.random() * 200 + 100));
      }
}

// function that calls populateModal, disables key press tracking, display the Modal
// add an event listener that closes the modal and calls restart

function end() {
      populateModal();
      listening = false;
      $modal.css('display', 'block');
      $('.close').click(function (){
            restart();
      });
}

// function that updates the modal with the number of gemsDeposited and the number of enemies present at the end.

function populateModal() {
      $('.modal-text').children().first().text(gemsDeposited);
      $('.modal-text').children().next().text(enemies);
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];
let player = new Player(202, 400);
let gem = new Gem(101 * Math.floor(Math.random() * 5) + 25 , 460 - 83 * (Math.floor(Math.random() * 3) + 2) , getRandomGem());

// create a startingEnemies number of enemies

for (let i = 0; i < startingEnemies; i++) {
      allEnemies.push(new Enemy(0, Math.random() * 184 + 50, Math.random() * 200 + 100));
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// On (1-5) sends data for character image

document.addEventListener('keyup', function(e) {
      const allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down',
          49: 'char1',
          50: 'char2',
          51: 'char3',
          52: 'char4',
          53: 'char5',
          97: 'char1',
          98: 'char2',
          99: 'char3',
          100: 'char4',
          101: 'char5'
      };
      if (listening) {
            player.handleInput(allowedKeys[e.keyCode]);
      }
});

$overlayClose.click(function(){
      $overlay.css('display', 'none');
      $help.css('display', 'block');
});
$help.click(function(){
      $overlay.css('display', 'block');
      $help.css('display', 'none');
});
