export default function drawSlider() {
	let sliderWrapper = document.createElement('div');
	sliderWrapper.className = 'swiper-outWrapper';
	document.querySelector('#sw').appendChild(sliderWrapper);
	sliderWrapper.innerHTML = '<div class="swiper-container gallery-main loading">' +
															'<div class="swiper-wrapper">' +
																'<div class="swiper-slide swiper-slide--main" style="background-image:url(img/andrewMansh.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title">Андрей</h2>' +
																		'<p class="content__p">Мастер спорта, двукратный чемпион РБ &#8203; по бодибилдингу</p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide swiper-slide--main" style="background-image:url(img/roma.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title">Роман</h2>' +
																		'<p class="content__p">Наш добряк-здоровяк</p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide swiper-slide--main" style="background-image:url(img/nikolay.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title">Николай</h2>' +
																		'<p class="content__p">Всегда с отличным настроением</p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide swiper-slide--main" style="background-image:url(img/ira.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title">Ирина</h2>' +
																		'<p class="content__p">Поделится секретами идеальной фигуры</p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide swiper-slide--main" style="background-image:url(img/andrewG.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title">Андрей</h2>' +
																		'<p class="content__p">Спокойствие и невозмутимость</p>' +
																	'</div>' +
																'</div>' +
															'</div>' +
															'<div class="swiper-button-prev swiper-button-white"></div>' +
															'<div class="swiper-button-next swiper-button-white"></div>' +
														'</div>' +
														'<div class="swiper-container gallery-thumbs">' +
															'<div class="swiper-wrapper">' +
																'<div class="swiper-slide" style="background-image:url(img/andrewMansh.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title"></h2>' +
																		'<p class="content__p"></p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide" style="background-image:url(img/roma.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title"></h2>' +
																		'<p class="content__p"></p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide" style="background-image:url(img/nikolay.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title"></h2>' +
																		'<p class="content__p"></p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide" style="background-image:url(img/ira.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title"></h2>' +
																		'<p class="content__p"></p>' +
																	'</div>' +
																'</div>' +
																'<div class="swiper-slide" style="background-image:url(img/andrewG.jpg)">' +
																	'<div class="content">' +
																		'<h2 class="content__title"></h2>' +
																		'<p class="content__p"></p>' +
																	'</div>' +
																'</div>' +
															'</div>';
}


