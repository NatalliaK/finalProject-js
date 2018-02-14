import Router from './utils/router';
import ChangeClass from './utils/ChangeClass';
import drawSlider from './slider/drawSlider';
import runSlider from './slider/runSlider';
import text from './mainPage/text';
import MyMap from './mainPage/map/map';
import drawChat from './asksPage/drawChat';
import drawBtnAuth from './asksPage/drawBtnAuth';
import Chat from './chat/chat';

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
				let container = doc.querySelector('#container');
				container.innerHTML = '<h1>News</h1>';
			},
			leave: () => {
				doc.querySelector('.header').classList.remove('header--news');
			}
		},
		{
			name: 'asks',
			match: 'asks',
			onEnter: () => {
				doc.querySelector('.header').classList.add('header--asks');
				drawBtnAuth();
				doc.querySelector('#btnlogIn').addEventListener('click', e => {
					doc.querySelector('#auth').classList.remove('hide');
				});

				doc.querySelector('#btnLogOut').addEventListener('click', e => {
					const promise = firebase.auth().signOut();
					promise
						.then( () => alert('Выход пользователя.'))
						.catch(error => alert('Ошибка выхода.'))
				});

				drawChat(document.querySelector('#container'));
					var n = new Chat();
					n.initFirebase();

			},
			leave: () => {
				doc.querySelector('.header').classList.remove('header--asks');
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



