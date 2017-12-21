const time = 750;
let section3Idx = 0;
let section4Idx = 0;

const masterObj = {
	section2CurrentIdx: 0, 
	section1CurrentIdx: 0,
	section3: {
		automate: '',
		isAutomated: false
	},
	section4: {
		automate: '',
		isAutomated: false
	},
	basketball: {loopAmount: 1},
	football: {loopAmount: 1},
	tennis: {loopAmount: 1},
	baseball: {loopAmount: 1},
	fan: {loopAmount: 1}
};

const homepageMobImages = [
	'assets/images/homepageMob/basketball.jpg',
	'assets/images/homepageMob/football.jpg',
	'assets/images/homepageMob/tennis.jpg', 
	'assets/images/homepageMob/baseball.jpg', 
	'assets/images/homepageMob/fan.jpg' 
]

$(document).ready(() => {
	if(window.innerWidth < 800) {
// IF THE WINDOW IS SMALLER THAT 800PX FETCH THE JSON FOR THE ICON ANIMATION AND ATACH THE ANIMATIONS SEPERATELY TO masterObj \\
		fetch('assets/js/Fantastec_Sprite_Sheet.json').then(function(response) { 
			return response.json();
		}).then(function(spriteObj) {
			const IdleFrame = filterByValue(spriteObj.frames, 'idle');
			masterObj.football.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'football')];
			masterObj.tennis.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'tennis')];
			masterObj.baseball.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'baseball')];
			masterObj.basketball.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'basket')];
			masterObj.fan.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'fan')];
// CALL ANIMATOR SETUP FUNCTION AND START THE IMAGE SLIDESHOW FOR SECTION 1 (HOMEPAGE) \\			
			animatorSetup();
			imageControler(masterObj, 1);
// CALL THE imageControler FUNCTION EVERY 5 SECONDS TO CHANGE THE IMAGE FOR SECTION 1 (HOMEPAGE) \\
			setInterval(() => {
				imageControler(masterObj, 1);
			}, 5000);
		});
	}
// FUNCTION TO SEPERATE THE ANIMATION FRAMES BY NAME \\
	const filterByValue = (array, string) => {
    return array.filter(o => typeof o['filename'] === 'string' && o['filename'].toLowerCase().includes(string.toLowerCase()));
	}
// GENERIC SETUP FUNCTION FOR ADDING VENDOR PREFIXES TO requestAnimationFrame \\
	const animatorSetup = () => {
			
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
 
    if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
	}


	const animator = (animationObj) => {
						
		var dancingIcon,
			spriteImage,
			canvas;					
// FUNCTION TO PASS TO requestAnimationFrame \\
		function gameLoop () {
		  $('#loading').addClass('hidden');
		  animationObj.loopId = window.requestAnimationFrame(gameLoop);
		  dancingIcon.update();
		  dancingIcon.render();
		}
		
		function sprite (options) {
		
			var that = {},
				frameIndex = 0,
				tickCount = 0,
				loopCount = 0,
				ticksPerFrame = options.ticksPerFrame || 0,
				numberOfFrames = options.numberOfFrames || 1;
			
			that.context = options.context;
			that.width = options.width;
			that.height = options.height;
			that.image = options.image;
			that.loops = options.loops;
			
			that.update = function () {

        tickCount += 1;

        if (tickCount > ticksPerFrame) {

					tickCount = 0;
          // If the current frame index is in range
          if (frameIndex < numberOfFrames - 1) {	
          // Go to the next frame
            frameIndex += 1;
          } else {
        		loopCount++
            frameIndex = 0;

            if(loopCount === that.loops) {
            	window.cancelAnimationFrame(animationObj.loopId);
            }
          }
	      }
	    }
			
			that.render = function () {
			
			  // Clear the canvas
			  that.context.clearRect(0, 0, that.width, that.height);
			  
			  that.context.drawImage(
			    that.image,
			    animationObj.animationArray[frameIndex].frame.x,
			    animationObj.animationArray[frameIndex].frame.y,
			    200,
			    175,
			    0,
			    0,
			    window.innerWidth / 3.846,
			    window.innerWidth / 4.1)
			};
			
			return that;
		}
		
		// Get canvas
		canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth / 3.846;
		canvas.height = window.innerWidth / 2.2;
		
		// Create sprite sheet
		spriteImage = new Image();	
		
		// Create sprite
		dancingIcon = sprite({
			context: canvas.getContext("2d"),
			width: 4040,
			height: 1770,
			image: spriteImage,
			numberOfFrames: animationObj.animationArray.length,
			ticksPerFrame: 4,
			loops: animationObj.loopAmount
		});
		
		// Load sprite sheet
		spriteImage.addEventListener("load", gameLoop);
		spriteImage.src = 'assets/images/Fantastec_Sprite_Sheet.png';
	} 

// INITIALISE AND SETUP CURRENT PAGE. EXECUTE TRANSITIONS AND REMOVE TINT IF RELEVANT \\

	const	pageLoader = (index) => {
		if(index === 5) {
			$('.tint').removeClass('removeTint');
			$('.backgroundWrapper').removeClass('scaleBackground');
			$('#section5').find('.heading').addClass('show fadeIn');
			$('.subSection').addClass('scaleBackground');
			$('.subSection').find('.tint').addClass('removeTint');
			$('#section5').find('.textWrapper').addClass('show');
			setTimeout(() => {
				$('.subSection > .textWrapper').find('.heading').addClass('fadeIn');
			}, 1000);
		} 
		else {
			$('.tint').removeClass('removeTint');
			$('.subSection').removeClass('scaleBackground');
			$(`.backgroundWrapper:not(#section${index}Background)`).removeClass('scaleBackground');
			$(`.section.active`).find(`.backgroundWrapper`).addClass('scaleBackground');
			$(`section.active`).find('.tint').addClass('removeTint');

			if($(`.section${index}PaginatorButton`).length && $(`.section${index}PaginatorButton.active`).length < 1) {
				$(`.section${index}PaginatorButton`).get(0).click();
			}
		}
	};

// HIDE ALL BECKGROUNDS IN THE SECTION EXCEPT THE SPECIFIED INDEX, WHICH IS SCALED AND SHOWN. \\

	const initializeSection = (sectionNumber, idx) => {
		$(`#section${sectionNumber}Background${idx}`).siblings('.backgroundWrapper').map((ix, ele) => {
			$(ele).css({opacity: 0});
		});

		$(`#section${sectionNumber}Background${idx}`).css({
			'transform': 'scale(1.1)',
			'opacity': 1
		});
	};

// CALL initializeSection ON SECTIONS 1, 3 AND 4. \\
	initializeSection(1, 0);
	initializeSection(3, 0);
	initializeSection(4, 0);

// BACKGROUND IMAGE TRANSITION HANDLER. \\

	const imageControler = (idxObj, sectionNumber) => {
		let relevantAnimation;

		if(sectionNumber === 1) {
			switch(idxObj.section1CurrentIdx) {
				case 0:
					relevantAnimation = masterObj.basketball;
				break;
				case 1:
					relevantAnimation = masterObj.football;
				break;
				case 2:
					relevantAnimation = masterObj.tennis;
				break;
				case 3:
					relevantAnimation = masterObj.baseball;
				break;
				case 4:
					relevantAnimation = masterObj.fan;
				break;
			}
		}

		$(`#section${sectionNumber}`).find('.tint').removeClass('removeTint');
		$(`#section${sectionNumber}Background${idxObj[`section${sectionNumber}CurrentIdx`]}`).removeClass('scaleBackground');
		initializeSection(sectionNumber, idxObj[`section${sectionNumber}CurrentIdx`]);
		
		setTimeout(() => {
			if(sectionNumber === 1) {
				animator(relevantAnimation);
			}

			$(`#section${sectionNumber}`).find(`.backgroundWrapper`).addClass('scaleBackground');
			$(`#section${sectionNumber}`).find('.tint').addClass('removeTint');
		}, 500);

		if(idxObj[`section${sectionNumber}CurrentIdx`] === $(`#section${sectionNumber}`).find(`.backgroundWrapper`).length - 1) {
			idxObj[`section${sectionNumber}CurrentIdx`] = 0;
		} else {
			idxObj[`section${sectionNumber}CurrentIdx`] += 1;
		}
	}
// START SLIDESHOW ON SECTION 2 \\
	imageControler(masterObj, 2);

// CHANGE SECTION 2 BACKGROUND IMAGE EVERY 15 SECONDS \\
	setInterval(() => {
		imageControler(masterObj, 2);
	}, 15000);

// PAGINATION BUTTONS CLICK HANDLER FOR SECTIONS 3 AND 4. \\

	const handlePaninationButtonClick = (e) => {

		const idx = parseInt($(e.target).attr('data-index'));
		const sectionId = $(e.target).closest('section').attr('id');
		let relevantDataArray;

		if(sectionId === 'section3') {
			section3Idx = idx;
		}

		if(sectionId === 'section4') {
			section4Idx = idx;
		}

		$(`#${sectionId}`).find('.tint').removeClass('removeTint');
		$(`#${sectionId}`).find('.textWrapper').removeClass('show');
		$(`#${sectionId}`).find(`#textWrapper${idx}`).addClass('show');
		$(`#${sectionId}Background${idx}`).removeClass('scaleBackground');
		$(`.${sectionId}PaginatorButton`).removeClass('active');
		$(e.target).addClass('active');

		initializeSection(parseInt($(`#${sectionId}`).attr('data-index')), idx);

		setTimeout(() => {
			pageLoader(parseInt($(`#${sectionId}`).attr('data-index')));
		}, 500);

		if(sectionId !== 'section2'){
			$(`#${sectionId}`).find('.heading, p').addClass('fadeIn');
			$(`#${sectionId}`).on('transitionend webkitTransitionEnd oTransitionEnd', (es) => {
	    	$(`#${sectionId}`).find('.heading, p').removeClass('fadeIn');
			});
		}
	};

// CLICK LISTENER FOR PAGINATION BUTTONS ON SECTIONS 3 AND 4. \\

	$('.section3PaginatorButton, .section4PaginatorButton').click((e) => {
		
		if(masterObj[$(e.currentTarget).closest('section').attr('id')].isAutomated) {
// IF THERE IS A RINNING INTERVAL ON THE RELEVANT SECTION CLEAR IT \\
			intervalManager(false, $(e.currentTarget).closest('section').attr('id'));
// SET A NEW INTERVAL OF 7 SECONDS ON THE SECTION \\
			intervalManager(true, $(e.currentTarget).closest('section').attr('id'), 7000);
		}
// CALL THE CLICK HANDLER FUNCTION AND PASS IT THE EVENT IF TARGET IS NOT ALREADY ACTIVE \\
		if(!$(e.currentTarget).hasClass('active')) {
			handlePaninationButtonClick(e);
		}
	});

// INITIALIZE ONEPAGESCROLL IF NOT IN CMS PREVIEW. \\

	if(!$(location).attr('href').includes('index.php')) {
		$('#scrollerWrapper').onepage_scroll({
			sectionContainer: "section",    
			easing: "ease-out",                 
			animationTime: time,            
			pagination: true,               
			updateURL: true,               
			beforeMove: (index) => {}, 
			afterMove: (index) => {
// INITIALIZE THE CURRENT PAGE. \\

				pageLoader(index);
			},  
			loop: false,                    
			keyboard: true,                 
			responsiveFallback: false,                                    
			direction: "vertical"          
		});

		$('#scrollerWrapper').moveTo(1);
	}

// CONTROL CLICKS ON WORK WITH US SECTION (SECTION5). \\

	$('.clickable').click((e) => {
		let currentSection = $(e.target).closest($('.subSection'));

		if(currentSection.hasClass('open')) {
			currentSection.removeClass('open');
			currentSection.find('.button, p').removeClass('fadeIn');
			currentSection.siblings('.subSection').map((idx, section) => {
				$(section).removeClass('closed');
				$(section).find('.tint').removeClass('addTint').addClass('removeTint');
			});
		} else {
			currentSection.removeClass('closed').addClass('open');
			currentSection.on('transitionend webkitTransitionEnd oTransitionEnd', (es) => {
	    	$('.subSection.open').find('.button, p').addClass('fadeIn');
			});
			currentSection.siblings('.subSection').map((idx, section) => {
				$(section).removeClass('open').addClass('closed');
				$(section).find('.tint').removeClass('removeTint').addClass('addTint');
				$(section).find('.button, p').removeClass('fadeIn');
			});
		}
		currentSection.find('.tint').removeClass('addTint').addClass('removeTint');
	});

// CONTROL FOOTER ARROW CLICKS. \\

	$('#downArrow').click(() => {
		if($(window).height() * ($('.page').length - 1) === - $('#scrollerWrapper').offset().top) {
// MOVE TO TOP OF PAGE IF CURRENTLY AT BOTTOM \\
	  	$('#scrollerWrapper').moveTo(1);
		} else {
			$('#scrollerWrapper').moveDown();
		}
	});

// HIDE THE LOADING ANIMATIOPN WHEN VIDEO IS READY TO PLAY ON DESXKTOP. \\

	const hideLoadingAnimation = () => {
		if(window.innerWidth > 800 && !$('#loading').hasClass('hidden')) {

			if($('#video').get(0).readyState === 4) {
				$('#loading').addClass('hidden');
			}
		}
	}

// MANAGEMENT FUNCTION FOR SETTING AND CLEARING THE SLIDE AUTOMATION INTERVALS. \\

	const intervalManager = (flag, sectionId, time) => {
   	if(flag) {
 			masterObj[sectionId].automate = setInterval(() => {
     		swipeController(sectionId, 'l');	
     	}, time); 
   	} else {		
    	clearInterval(masterObj[sectionId].automate);
   	}
	};

// IF NOT IN CMS ADMIN PREVIEW, PERPETUALLY CHECK IF WE ARE AT THE TOP OF THE PAGE AND IF SO, DONT SHOW THE FOOTER OR GREEN SHAPE. \\

	if(!$(location).attr('href').includes('index.php')) {
		setInterval(() => {
			if($('#scrollerWrapper').offset().top >= - (window.innerHeight / 1.9)) {
				$('#headerShape, #footer').addClass('moveOffScreen');
				$('#video').get(0).play();
				$('.arrow').addClass('pulsate');
			} else {
				$('#headerShape, #footer').removeClass('moveOffScreen');
				$('#video').get(0).pause();
				$('.arrow').removeClass('pulsate');
			}

// ROTATE THE ARROW IN THE FOOTER WHEN AT THE BOTTOM OF THE PAGE \\

			if($('#scrollerWrapper').offset().top < - (window.innerHeight * 4)) {
				$('#downArrow').css({'transform': 'rotate(180deg) translateX(-50%)'});
			} else {
				$('#downArrow').css({'transform': 'translateX(-50%) rotate(0deg)'});
			}

			hideLoadingAnimation();

// ADD LANDSCAPE STYLES TO RELEVANT ELEMENTS \\

			if(window.matchMedia("(orientation: landscape)").matches && window.innerWidth < 800) {
			  $('.nav_link, #headerShape, #footer, .custom, .marker, #section5, .textWrapper').addClass('landscape');
			} else {
				 $('.nav_link, #headerShape, #footer, .custom, .marker, #section5, .textWrapper').removeClass('landscape');
			}

			if($('#section3.active').length) { // AUTOMATE THE SLIDES ON SECTIOPN 3 EVERY 7 SECONDS IF THE SECTION IS ACTIVE. \\
				if(masterObj.section3.isAutomated !== true) {
					masterObj.section3.isAutomated = true;
					intervalManager(true, 'section3', 7000);
				}
			} else { // STOP AUTOMATED SLIDES ON SECTIOPN 3 IF THE SECTION IS NOT ACTIVE. \\
				if(masterObj.section3.isAutomated === true) {
					intervalManager(false, 'section3');
					masterObj.section3.isAutomated = false;
				}
			}

			if($('#section4.active').length) { // AUTOMATE THE SLIDES ON SECTIOPN 4 EVERY 7 SECONDS IF THE SECTION IS ACTIVE. \\
				if(masterObj.section4.isAutomated !== true) {
					masterObj.section4.isAutomated = true;
					intervalManager(true, 'section4', 7000);
				}
			} else { // STOP AUTOMATED SLIDES ON SECTIOPN 4 IF THE SECTION IS NOT ACTIVE. \\
				if(masterObj.section4.isAutomated === true) {
					intervalManager(false, 'section4');
					masterObj.section4.isAutomated = false;
				}
			}
		}, 500);
	}

// CONTROL WHAT HAPPENS WHEN LINKS IN THE NAV/MENU ARE CLICKED \\

	$('.nav_link').click((e) => {
		const pageIdx = parseInt($(e.target).attr('data-index'));
		$('#scrollerWrapper').moveTo(pageIdx);
		$('#menuBlockOut').addClass('hidden');

		if(burger.classList.contains('burger--active')) {
      nav.classList.remove('nav_open');
      burger.classList.remove('burger--active');
      document.body.style.position = 'relative';
    } 
	});

// WHEN THE NAV IS OPEN PREVENT USER FROM BEING ABLE TO CLICK ANYTHING ELSE \\

	$('#menuBlockOut').click((e) => {
	   e.stopPropagation();
	});

	var burger = document.getElementById('main-burger'), 
  nav = document.getElementById('mainNav');

// CONTROL FOR OPEN AND CLOSING THE MENU/NAV  \\

  function navControl() {

    if(burger.classList.contains('burger--active')) {
      nav.classList.remove('nav_open');
      burger.classList.remove('burger--active');
      $('#menuBlockOut').addClass('hidden');
    } 
    else {
      burger.classList.add('burger--active');
      nav.classList.add('nav_open');
      $('#menuBlockOut').removeClass('hidden');
    }
  }
  
// ONLY LISTEN FOR MENU CLICKS WHEN NOT IN CMS PREVIEW MODE \\

  if(!$(location).attr('href').includes('index.php')) {
  	burger.addEventListener('click', navControl);
  }

// CLOSE THE NAV IF THE WINDOW IS OVER 1000PX WIDE \\

  window.addEventListener('resize', function() {
    if(window.innerWidth > 1000 && nav.classList.contains('nav_open')) {
      navControl();
      nav.classList.remove('nav_open');
       $('#menuBlockOut').addClass('hidden');
    }
  });

// THIS SET OF IF STATEMENTS INITIALISES THE SPESIFIC PAGES FOR PREVIEWING IN CMS ADMIN. \\

  if($(location).attr('href').includes('index.php')) {
		if($(location).attr('href').includes('imagine-if')) {
			pageLoader(4);
		}
		if($(location).attr('href').includes('how-we-innovate')) {
			pageLoader(3);
		}
		if($(location).attr('href').includes('work-with-us')) {
			pageLoader(5);
		}
		if($(location).attr('href').includes('contact-us')) {
			pageLoader(6);
		}
		if($(location).attr('href').includes('home-video')) {
			setInterval(() => {
				hideLoadingAnimation();
			}, 500)
		}
	}

// SWIPE EVENTS DETECTOR FUNCTION \\

  function detectswipe(el, func) {
	  let swipe_det = {};
	  swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
	  var min_x = 30;  //min x swipe for horizontal swipe
	  var max_x = 30;  //max x difference for vertical swipe
	  var min_y = 50;  //min y swipe for vertical swipe
	  var max_y = 60;  //max y difference for horizontal swipe
	  var direc = "";
	  let ele = document.getElementById(el);
	  ele.addEventListener('touchstart',function(e){
	    var t = e.touches[0];
	    swipe_det.sX = t.screenX; 
	    swipe_det.sY = t.screenY;
	  },false);
	  ele.addEventListener('touchmove',function(e){
	    e.preventDefault();
	    var t = e.touches[0];
	    swipe_det.eX = t.screenX; 
	    swipe_det.eY = t.screenY;    
	  },false);
	  ele.addEventListener('touchend',function(e){
	    //horizontal detection
	    if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
	      if(swipe_det.eX > swipe_det.sX) direc = "r";
	      else direc = "l";
	    }
	    //vertical detection
	    else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
	      if(swipe_det.eY > swipe_det.sY) direc = "d";
	      else direc = "u";
	    }

	    if (direc != "") {
	      if(typeof func == 'function') func(el,direc);
	    }
	    let direc = "";
	    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
	  },false);  
	}

// CHOSE THE NEXT SLIDE TO SHOW AND CLICK THE PAGINATION BUTTON THAT RELATES TO IT. \\

	const swipeController = (el, d) => {

		if(el === 'section4') {

			const section4PaginationLength = $('.section4PaginatorButton').length;

			if(d === 'l') {

				if(section4Idx < section4PaginationLength - 1) {
					section4Idx++;
				} else {
					section4Idx = 0;
				}
				
				$('.section4PaginatorButton')[section4Idx].click();
			}
			if(d === 'r') {

				if(section4Idx > 0) {
					section4Idx--;
				} else {
					section4Idx = section4PaginationLength - 1;
				}

				$('.section4PaginatorButton')[section4Idx].click();
			}
		}
		if(el === 'section3') {

			const section3PaginationLength = $('.section3PaginatorButton').length;

			if(d === 'l') {

				if(section3Idx < section3PaginationLength - 1) {
					section3Idx++;
				} else {
					section3Idx = 0;
				}
				
				$('.section3PaginatorButton')[section3Idx].click();
			}
			if(d === 'r') {

				if(section3Idx > 0) {
					section3Idx--;
				} else {
					section3Idx = section3PaginationLength - 1;
				}
				
				$('.section3PaginatorButton')[section3Idx].click();
			}
		}
	}

// INITIATE FOR SWIPE DETECTION ON SECTIONS 3 AND 4 EXCEPT IN ADMIN PREVIEW. \\

	if(!$(location).attr('href').includes('index.php')) {
		detectswipe('section4', swipeController);
		detectswipe('section3', swipeController);
	}
});