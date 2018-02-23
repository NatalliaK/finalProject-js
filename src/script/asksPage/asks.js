import Chat from './../chat/chat';
import drawForm from './../chat/drawForm';

export default class Asks extends Chat {
	constructor() {
		super();
		drawForm();
		this.db = firebase.database();
		this.auth = document.querySelector('#auth');
		this.emailField = document.querySelector('#email');
		this.passwordField = document.querySelector('#password');
		this.nameField = document.querySelector('#name');
		this.content = document.querySelector('#content');
		this.close = document.querySelector('#close');
		this.logInButton = document.querySelector('#logIn');
		this.signInGoogleButton = document.querySelector('#signInGoogle');
		this.signUpButton = document.querySelector('#signUp');

		this.logInButton.addEventListener('click', this.logIn.bind(this));
		this.signInGoogleButton.addEventListener('click', this.signWithGoogle.bind(this));
		this.signUpButton.addEventListener('click', this.signUp.bind(this));
		this.close.addEventListener('click', (e) => {
			document.querySelector('#auth').classList.add('hide');
		});
	}

	signUp() {
		this.signUpButton.addEventListener('click', e => {
			var email = this.emailField.value;
			var password = this.passwordField.value;
			var name = this.nameField.value;
			const auth = firebase.auth();
			const promise = auth.createUserWithEmailAndPassword(email, password);
			promise
				.then(user => alert('Вы вошли как ' + name))
				.catch( error => {
					if (name.length < 1) {
						alert('Введите имя');
					}	else if (email.length < 1) {
						alert('Введите email.');
					} else if (error.code === 'auth/invalid-email') {
						alert('Введите email правильно.');
					} else if(error.code === 'auth/email-already-in-use') {
						alert('Пользователь с таким email уже зарегистрирован');
						var credential = firebase.auth.EmailAuthProvider.credential(email, password);
					} else if (password.length < 6) {
						alert('Введите пароль.');
					} else if (error.code === 'auth/wrong-password') {
						alert('Введите пароль правильно.');
					} else alert('Ошибка входа. Попробуйте еще раз.')
				});
		});
	}

	signWithGoogle() {
		this.signInGoogleButton.addEventListener('click', () => {
			const name = this.nameField.value;
			const auth = firebase.auth();

			var provider = new firebase.auth.GoogleAuthProvider();
			const promise = auth.signInWithPopup(provider);
			promise
				.then(() => {
					user => console.log(user)
				})
				.catch(error => {
					alert('Ошибка регистрации. Возможно Вы уже вошли.');
				})
		});
	}

	logIn() {
		this.logInButton.addEventListener('click', e => {
			var email = this.emailField.value;
			var password = this.passwordField.value;
			const auth = firebase.auth();
			const promise = auth.signInWithEmailAndPassword(email, password);
			promise
				.then(user => console.log(user))
				.catch( error => {
					console.log(error.code);
					if (email.length < 1) {
						alert('Введите email.');
					} else if (error.code === 'auth/invalid-email') {
						alert('Введите email правильно.');
					} else if (password.length < 1) {
						alert('Введите пароль.');
					} else if (error.code === 'auth/weak-password') {
						alert('Введите пароль правильно.');
					} else alert('Ошибка регистрации. Попробуйте еще раз.')
				});
		});
	}

	logOut() {
		this.logOutButton.addEventListener('click', e => {
			const promise = firebase.auth().signOut();
			promise
				.then( () => alert('Выход пользователя.'))
				.catch(error => alert('Ошибка выхода.'))
		});
	}

	onAuthStateChanged(firebaseUser) {
		this.chatFormWrap.classList.remove('hide');
		let p = document.querySelector('.btn-auth-page__p');

		this.loadMessages('messages/questions/');

		if (document.querySelector('.message')) {
			var btnChange = document.querySelectorAll('button[btn="change"]');
			var btnRemove = document.querySelectorAll('button[btn="remove"]');
			btnChange.forEach((el) => {
				if (!el.classList.contains('hide')) {
					el.classList.add('hide');
				}
			});
			btnRemove.forEach((el) => {
				if (!el.classList.contains('hide')) {
					el.classList.add('hide');
				}
			});
		}
		if (firebaseUser) {
			this.name = this.nameField.value;
			this.email = this.emailField.value;
			this.uid = firebaseUser.uid;
			this.filePath = 'users/' + this.uid;
			this.fbRef = this.database.ref(this.filePath);
			if (this.name !== '' && this.email !== '') {
				this.fbRef.set({
					userName: this.name,
					userEmail: this.email
				});
			} else if (firebaseUser.displayName) {
				this.fbRef.set({
					userName: firebaseUser.displayName
				})
			}

			this.fbRef.on('value', (snapshot => {
				var val = snapshot.val().userName;
				p.innerHTML = `Вы вошли как ${val}`;
			}));

			this.emailField.value = '';
			this.nameField.value = '';
			this.passwordField.value = '';

			this.loadMessages('messages/questions/');

			if (document.querySelector('.message')) {
				const messages = document.querySelectorAll('.message');
				messages.forEach((el) => {
					if (el.getAttribute('data-user') === this.uid) {
						let btnChange = el.querySelector('button[btn="change"]');
						let btnRemove = el.querySelector('button[btn="remove"]');
						btnChange.classList.remove('hide');
						btnRemove.classList.remove('hide');
					}
				})
			}

			if (this.auth.currentUser && this.uid === this.auth.currentUser.uid) {
				document.querySelector('#auth').classList.add('hide');
			}
		} else {
			this.chatFormWrap.classList.add('hide');
			p.innerHTML = 'Чтобы задать вопрос, пожалуйста, войдите под своей учетной записью или зарегистрируйтесь';
		}
	}

	checkSignedInWithMessage() {
		return (this.auth.currentUser);
	}

	getDbRef() {
		return this.db.ref('messages/questions/');
	}

	chatMessageLabelAsks() {
		this.chatMessageLabel.classList.add('visibility');
	}

	messageAnswer() {
		if (document.querySelector('.message')) {
			const messages = document.querySelectorAll('.message');
			messages.forEach((el) => {
				console.log(el);
				//el.innerHTML += '<button btn="answer" class="message__button btn">Ответить</button>';
			})
		}
	}
}