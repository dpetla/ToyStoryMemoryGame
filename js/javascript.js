/*	This is a javascript file to control all functions of the memory game
*
*/

// init
window.onload = function() {
	
	// allocate cards randomly
	allocateCards();
	
	// allow user to quit game pressing ESC
	document.addEventListener( 'keydown', quit );
	
}

/** This method runs if user hits the esc key and ends the game
*
*/
function quit( ev ) {
	// check what key is pressed
	var code = ev.keyCode;
	if(code === 27) {
		gameOver(quit);
	}
}

var countPlay = 0;	// variable to control if user got right match to all cards
var tries = 0;		// variable keeps track of # of tries during the game
var myscore = 0;	// receive and it's displayed as the total score

// array containing cards source address
var cardsSrc = ['image/bullseye.jpg', 'image/buzz.jpg', 'image/dinosaur.jpg', 
				'image/jessie.jpg', 'image/mr-potato-head.jpg', 'image/woody.jpg'];

// generate random number to choose the card
var cardIndex = Math.round(Math.random() * cardsSrc.length - 1);

/** This method allocates all the cards randomly from position 0 to poasition 11
*
*/
function allocateCards() {
	var positionLength = document.querySelectorAll('.card_position').length;
	var imgFreq = [0, 0, 0, 0, 0, 0];	// variable to control image frequency 
	var cardIndex;	// gets the random number and it's used to call the right image
	
	// loops from positoin 0 to postion 11 inserting a image
	for(var i = 1; i <= positionLength; i++) {
		// generate random number that only repeats 2 times
		do {
			cardIndex = Math.round(Math.random() * (cardsSrc.length - 1));
		} while (imgFreq[cardIndex] > 1);
		imgFreq[cardIndex]++;

		// allocate image based on index generated randomly
		var pic = document.querySelector('#card' + i + ' img');
		pic.src = cardsSrc[cardIndex];
	}
}

/** This method gets the selected element and display image to user.
*	When there are more than two images being displayed it checks the result
*/
function select(el) {
	// declaring variables to the card clicked
	card = document.getElementById(el.id);
	img = card.querySelector('img');

	// flips up selected card
	img.style.display = 'block';
	// if 2 cards are up check result
	if (isOpen() === 2) {
		tries++;
		result(); //checks if guess is right or wrong
	}
}

/** This method checks the number of cards facing up
*
*/
function isOpen() {
	allImg = document.querySelectorAll('img');
	var count = 0;
	for(var i = 0; i < allImg.length; i++){
		if(allImg[i].style.display === 'block'){
			count++;
		}
	}
	// return number of cards facing up
	return count;
}

/** This method checks the result of each try.
*	
*/
function result() {
	var c0;
	var c1;
	var counter = 0;
	
	// find which images are facing up
	for(var i = 0; i < allImg.length; i++) {
		if(allImg[i].style.display === 'block'){
			counter++;
			if (counter === 1) {
				c0 = allImg[i];	// assign first element selected to this variable
			} else {
				c1 = allImg[i]; //	assign second element selected to this variable
				break;
			}
		}
	}
	
	// check if images sources match each other, for 2 cards facing up
	//some delay added to result so that user can see the cards selected
	var match = c0.src == c1.src;
	if(match) {
		//display right answer sound effect
		soundEffect(match);
		countPlay++;
		// delete cards player got right
		setTimeout(deleteCards, 1500, c0, c1);	
	} else {
		// display wrong answer sound effect
		soundEffect(match);
		// hide cards player got wrong
		setTimeout(function() {
			c0.style.display = 'none';
			c1.style.display = 'none';
				   }, 1300);
	}
	
	// updates the score
	calcScore();
	
	// If there are no plays left/user matchs all cards, end game (win)
	if(countPlay === 6) {
		gameOver(true);
	}
	
	//Game ends after 25th try (loose)
	if(tries > 25) {
		gameOver(false);
	}
}

/** This function gets and displays # of tries and correct guesses
*	Calculate final score after each try
*/
function calcScore() {
	document.getElementById('tries').textContent = tries;
	document.getElementById('correct').textContent = countPlay;
	myscore = 20 * countPlay - 5 * tries;
	document.getElementById('myscore').textContent = myscore;
}

/** This function deletes/remove cards if guess is correct. Change some styling 
*
*/
function deleteCards(c0, c1) {
	
	// get parent element (card position) of each img
	var c0ParId = c0.parentElement.id;
	var c1ParId = c1.parentElement.id;
	
	// remove onclick attribute
	document.getElementById(c0ParId).removeAttribute('onclick');
	document.getElementById(c1ParId).removeAttribute('onclick');
	
	// change .card_position backgroundColor
	document.getElementById(c0ParId).style.backgroundColor = 'RGBA(210, 0, 12, 0.1)';
	document.getElementById(c1ParId).style.backgroundColor = 'RGBA(210, 0, 12, 0.1)';
	
	//remove box shadow
	document.getElementById(c0ParId).style.boxShadow = 'none';
	document.getElementById(c1ParId).style.boxShadow = 'none';
	
	// remove images
	c0.remove();
	c1.remove();
	
}

/** This method reproduces sound based on on the result of each try
*
*/
function soundEffect(match) {
	if(match){
		// correct answer sound effect
		var audio = new Audio('media/right-answer.mp3');		
	} else {
		// wrong answer sound effect
		var audio = new Audio('media/wrong-answer.mp3');
	}
	audio.play();
}

/** This method displays custom message of Game Over
*
*/
function gameOver(win) {
	switch(win) {
		case true:
			// win game message
			alert('Congratulations! You win!!\n Your score is ' + myscore + '.');
			break;
		case false:
			// loose game message
			alert('Game Over! Please try Again.\n Your score is ' + myscore + '.');
			break;
		case quit:
			// quit game message
			alert('Quit! Please try Again.\n Your score is ' + myscore + '.');
			break;
	}
	
	//reload webpage to restart game
	location.reload();
}
