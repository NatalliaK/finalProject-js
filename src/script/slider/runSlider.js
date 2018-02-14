import Swiper from 'swiper';

export default function runSlider() {
	const interleaveOffset = 0.5;
	var dir;

	const galleryMain = new Swiper('.gallery-main', {
		loop: true,
		speed: 1000,
		autoplay: {
			delay: 3000
		},
		loopAdditionalSlides: 10,
		grabCursor: true,
		watchSlidesProgress: true,
		effect: 'cube',
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
		on: {
			init: function() {
				this.autoplay.stop();
			},
			imagesReady: function() {
				this.el.classList.remove('loading');
				this.autoplay.start();
			},
			slideChangeTransitionEnd: function() {
				var swiper = this,
					captions = swiper.el.querySelectorAll('.content__p');
				for (let i = 0; i < captions.length; ++i) {
					captions[i].classList.remove('show');
				}
				swiper.slides[swiper.activeIndex].querySelector('.content__p').classList.add('show');
			},
			touchStart: function() {
				var swiper = this;
				for (var i = 0; i < swiper.slides.length; i++) {
					swiper.slides[i].style.transition = "";
				}
			},
			setTransition: function(speed) {
				var swiper = this;
				for (var i = 0; i < swiper.slides.length; i++) {
					swiper.slides[i].style.transition = speed + "ms";
				}
			}
		}
	});

	var galleryThumbs = new Swiper('.gallery-thumbs', {
		loop: true,
		loopAdditionalSlides: 10,
		speed: 1000,
		spaceBetween: 5,
		centeredSlides: true,
		slidesPerView: 5,
		touchRatio: 0.2,
		slideToClickedSlide: true,
		direction: 'vertical',
		on: {
			imagesReady: function(){
				this.el.classList.remove('loading');
			},
			click: function(){
				galleryMain.autoplay.stop();
			}
		}
	});
	galleryMain.controller.control = galleryThumbs;
	galleryThumbs.controller.control = galleryMain;
}
