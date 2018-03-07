import Router from './utils/router';
import ChangeClass from './utils/ChangeClass';
import drawSlider from './slider/drawSlider';
import runSlider from './slider/runSlider';
import text from './mainPage/text';
import MyMap from './mainPage/map/map';
import drawChat from './chat/drawChat';
import drawBtnAuth from './asksPage/drawBtnAuth';
import Asks from './asksPage/asks';
import News from './newsPage/news';
import TypeText from './utils/typeText';
import changeOrientationClass from './utils/changeOrientationClass';

const doc = document,
	container = doc.querySelector('#container'),
	header = doc.querySelector('header'),
	mainNav = doc.querySelector('#main-nav'),
	hamburger = doc.querySelector('#hamburger'),
	footer = doc.querySelector('#footer');

	const map = new MyMap('footer', [55.168131, 30.204001]);

var router = new Router({
	routes: [{
		name: 'Главная',
		match: '',
		onEnter: () => {
			doc.querySelector('.header__h1').classList.add('header__h1--main');
			doc.querySelector('.wrap').classList.add('wrap--main');
			doc.querySelector('.header__wrap-h1').classList.add('header__wrap-h1--main');
			doc.querySelector('.footer').classList.add('footer--main');
			window.onload = changeOrientationClass();
			window.addEventListener('resize', changeOrientationClass);
			drawSlider();
			runSlider();
			text();
			let header = doc.querySelector('.header');
			let wrapH1 = doc.querySelector('.header__wrap-h1');
			let h1 = new TypeText(wrapH1);
			window.onhashchange = () => h1.createSpan();
		},
		leave: () => {
			let wrap = doc.querySelector('.header__wrap-h1');
			doc.querySelector('.header__h1').classList.remove('header__h1--main');
			wrap.classList.remove('header__wrap-h1--main');
			wrap.classList.remove('header__wrap-h1--main-side');
			doc.querySelector('#sw').innerHTML = '';
			doc.querySelector('#container').innerHTML = '';
			doc.querySelector('.footer').classList.remove('footer--main');
		}
	},
		{
			name: 'news',
			match: 'news',
			onEnter: () => {
				let header = doc.querySelector('.header');
				let wrapH1 = doc.querySelector('.header__wrap-h1');
				header.classList.add('header--news');
				header.querySelector('.header__h1').className = 'hide header__h1 header__h1--print-txt';
				let h1 = new TypeText(wrapH1);
				//window.onhashchange = () => h1.createSpan();
				window.onload = () => h1.createSpan();
				drawChat(document.querySelector('#container'), 'Наши новости');
				doc.querySelector('.chat__form-wrap').classList.remove('hide');
				var news = new News();
				news.initFirebase();
				doc.querySelector('.chat').classList.add('.chat__news');
			},
			leave: () => {
				let h1 = doc.querySelector('.header__h1');
				let wrap = doc.querySelector('.header__wrap-h1');
				let wave = document.querySelectorAll('.wave');
				wave.forEach((el) => {
					el.remove();
				});
				wrap.removeChild(wrap.lastChild);
				doc.querySelector('.header').classList.remove('header--news');
				h1.classList.remove('hide');
				h1.classList.remove('header__h1--print-txt');
				doc.querySelector('.chat__form-wrap').classList.add('hide');
				doc.querySelector('.chat').classList.remove('.chat__news');
				container.innerHTML = '';
			}
		},
		{
			name: 'asks',
			match: 'asks',
			onEnter: () => {
				let header = doc.querySelector('.header');
				let wrapH1 = doc.querySelector('.header__wrap-h1');
				header.classList.add('header--asks');
				header.querySelector('.header__h1').className = 'hide header__h1 header__h1--print-txt';
				let h1 = new TypeText(wrapH1);
				//window.onhashchange = () => h1.createSpan();
				window.onload = () => h1.createSpan();

				if (!doc.querySelector('#btnAuth')) {
					drawBtnAuth();
					doc.querySelector('#btnlogIn').addEventListener('click', e => {
						if (firebase.auth().currentUser) {
							doc.querySelector('#auth').classList.add('hide');
							alert('Вы уже вошли');
						} else {
							doc.querySelector('#auth').classList.remove('hide');
						}
					});

					doc.querySelector('#btnLogOut').addEventListener('click', e => {
						const promise = firebase.auth().signOut();
						promise
							.then( () => alert('Выход пользователя.'))
							.catch(error => alert('Ошибка выхода.'))
					});
				}

				doc.querySelector('#btnAuth').classList.remove('hide');

				drawChat(doc.querySelector('#container'), 'Задать вопрос');
					var asks = new Asks();
					asks.initFirebase();

			},
			leave: () => {
				let h1 = doc.querySelector('.header__h1');
				let wrap = doc.querySelector('.header__wrap-h1');
				let wave = document.querySelectorAll('.wave');
				wave.forEach((el) => {
					el.remove();
				});
				wrap.removeChild(wrap.lastChild);
				doc.querySelector('.header').classList.remove('header--asks');
				h1.classList.remove('hide');
				h1.classList.remove('header__h1--print-txt');
				doc.querySelector('#auth').classList.add('hide');
				container.innerHTML = '';
			}
		}]
});

function changeView() {
	const spans = doc.querySelectorAll('.hamburger__span');
	spans.forEach((elem, i) => {
		let el = spans[i];
		const element = new ChangeClass(el, 'hamburger__span--closed', 'hamburger__span--open');
		element.changeClass();
	});
}

header.onclick = (event) => {
	var target = event.target;
	if (target === hamburger) {
		changeView();
		mainNav.classList.toggle('main-nav--open');
	}
	if (target.classList.contains('main-nav__link')) {
		mainNav.classList.toggle('main-nav--open');
		changeView();
	}
};



