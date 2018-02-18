export default function drawForm() {
	let wrapAuth = document.createElement('div');
	wrapAuth.classList.add('auth__wrap-out');
	document.querySelector('#container').appendChild(wrapAuth);

	wrapAuth.innerHTML = '<div id="auth" class="auth hide"><p class="auth__p">Чтобы задать вопрос, пожалуйста, войдите под своей учетной записью или зарегистрируйтесь</p><input id="name" class="auth__input" placeholder="При регистрации введите Ваше имя"><input id="email" class="auth__input" type="email" placeholder="Email" /><input id="password" class="auth__input" type="password" placeholder="Пароль" /><div class="auth__btn-wrap"><button id="logIn" class="auth__btn">Войти</button><button id="signInGoogle" class="auth__btn">Войти Google</button><button id="signUp" class="auth__btn">Регистрация</button></div><button id="close" class="btn__close"><img class="btn__close-img" src="img/close-icon1.png"></button></div>';
}