// INITIALISE GLOBAL VARIABLES. \\ JS BY damianCrow

const time = 750;
let section3Idx = 0;
let section4Idx = 0;

$(document).ready(() => {

// WAIT FOR gfyCatEmbed VIDEO TO START PLAYING ON MOBILE, THEN HIDE THE LOADING ANIMATION. \\

	if(window.innerWidth < 800) {
		$(window).on("message", (event) => {
		  if(event.originalEvent.source === $("#gfyCatEmbedIframe").get(0).contentWindow) {
		    if(event.originalEvent.data === 'playing') {
		    	$('#loading').addClass('hidden');
		    }
		  }
		});
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
			$(`#section${index}`).find(`.backgroundWrapper`).addClass('scaleBackground');
			$(`#section${index}`).find('.tint').addClass('removeTint');

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

// INITIATE initializeSection ON SECTIONS 3 AND 4. \\

	initializeSection(3, 0);
	initializeSection(4, 0);

// SECTIONS 2 (ABOUT US SECTION) BACKGROUND IMAGE TRANSITION HANDLER. \\

	let section2ImageIdx = 0;

	const section2ImageControler = () => {

		$(`#section2`).find('.tint').removeClass('removeTint');
		$(`#section2Background${section2ImageIdx}`).removeClass('scaleBackground');
		initializeSection(2, section2ImageIdx);
		
		setTimeout(() => {
			$(`#section2`).find(`.backgroundWrapper`).addClass('scaleBackground');
			$(`#section2`).find('.tint').addClass('removeTint');
		}, 500);

		if(section2ImageIdx === 2) {
			section2ImageIdx = 0;
		} else {
			section2ImageIdx++;
		}
	};

	section2ImageControler();

	setInterval(() => {
		section2ImageControler();
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
		handlePaninationButtonClick(e);
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
	  	$('#scrollerWrapper').moveTo(1);
		} else {
			$('#scrollerWrapper').moveDown();
		}
	});

// HIDE THE LOADING ANIMATIOPN WHEN VIDEO IS READY TO PLAY ON DEXKTOP. \\

	const hideLoadingAnimation = () => {
		if(window.innerWidth > 800 && !$('#loading').hasClass('hidden')) {

			if($('#video').get(0).readyState === 4) {
				$('#loading').addClass('hidden');
			}
		}
	}

// IF NOT IN CMS ADMIN PREVIEW, PERPETUALLY CHECK IF WE ARE AT THE TOP OF THE PAGE AND IF SO, DONT SHOW THE FOOTER OR GREEN SHAPE. \\

	if(!$(location).attr('href').includes('index.php')) {
		setInterval(() => {
			if($('#scrollerWrapper').offset().top >= 0) {
				$('#headerShape, #footer').addClass('moveOffScreen');
				$('#video').get(0).play();
				$('.arrow').addClass('pulsate');
			} else {
				var timeout = setTimeout(() => {
					$('#headerShape, #footer').removeClass('moveOffScreen');
					$('#video').get(0).pause();
					$('.arrow').removeClass('pulsate');
					clearTimeout(timeout);
				}, time);
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
		}, 250);
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

// WHEN THE NAVE IS OPEN PREVENT USER FROM BEING ABLE TO CLICK ANYTHING ELSE \\

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
				
				$('.section4PaginatorButton')[section4PaginationLength - (section4Idx + 1)].click();
			}
			if(d === 'r') {

				if(section4Idx > 0) {
					section4Idx--;
				} else {
					section4Idx = section4PaginationLength - 1;
				}

				$('.section4PaginatorButton')[section4PaginationLength - (section4Idx + 1)].click();
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
				
				$('.section3PaginatorButton')[section3PaginationLength - (section3Idx + 1)].click();
			}
			if(d === 'r') {

				if(section3Idx > 0) {
					section3Idx--;
				} else {
					section3Idx = section3PaginationLength - 1;
				}
				
				$('.section3PaginatorButton')[section3PaginationLength - (section3Idx + 1)].click();
			}
		}
	}

// INITIATE FOR SWIPE DETECTION ON SECTIONS 3 AND 4 EXCEPT IN ADMIN PREVIEW. \\

	if(!$(location).attr('href').includes('index.php')) {
		detectswipe('section4', swipeController);
		detectswipe('section3', swipeController);
	}
});