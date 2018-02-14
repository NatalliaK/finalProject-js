export default function drawBtnAuth() {
	let btnAuth = document.createElement('div');
	btnAuth.id = 'btnAuth';
	btnAuth.classList.add('btn-auth-page');
	document.querySelector('#container').appendChild(btnAuth);
	btnAuth.innerHTML = '<p class="btn-auth-page__p">Чтобы задать вопрос, пожалуйста, войдите под своей учетной записью или зарегистрируйтесь</p><div class="btn-auth-page__btn-wrap"><button id="btnlogIn" class="btn-auth-page__btn btn-auth-page__btn--logIn"><img src="img/logIn.png" alt="Войти" title="Войти"></button><button id="btnLogOut" class="btn-auth-page__btn btn-auth-page__btn--logOut"><img src="img/logOut.png" alt="Выход" title="Выход"></button></div>';
}