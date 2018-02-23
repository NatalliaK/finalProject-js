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
			doc.querySelector('.footer').classList.add('footer--main');
			drawSlider();
			runSlider();
			text();
		},
		leave: () => {
			doc.querySelector('.header__h1').classList.remove('header__h1--main');
			doc.querySelector('#sw').innerHTML = '';
			doc.querySelector('#container').innerHTML = '';
			doc.querySelector('.footer').classList.remove('footer--main');
		}
	},
		{
			name: 'news',
			match: 'news',
			onEnter: () => {
				doc.querySelector('.header').classList.add('header--news');
				drawChat(document.querySelector('#container'));
				doc.querySelector('.chat__form-wrap').classList.remove('hide');
				var news = new News();
				news.initFirebase();
				doc.querySelector('.chat').classList.add('.chat__news');
			},
			leave: () => {
				doc.querySelector('.header').classList.remove('header--news');
				doc.querySelector('.chat__form-wrap').classList.add('hide');
				doc.querySelector('.chat').classList.remove('.chat__news');
				container.innerHTML = '';
			}
		},
		{
			name: 'asks',
			match: 'asks',
			onEnter: () => {
				doc.querySelector('.header').classList.add('header--asks');
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

				drawChat(doc.querySelector('#container'));
					var asks = new Asks();
					asks.initFirebase();

			},
			leave: () => {
				doc.querySelector('.header').classList.remove('header--asks');
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



