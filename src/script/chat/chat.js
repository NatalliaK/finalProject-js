import drawForm from './drawForm';
import firebaseIn from './../utils/firebase';
import ProgressBar from '../utils/ProgressBar';
import changeChatForm from './changeChatForm';
import drawChat from "../asksPage/drawChat";

export default class Chat {
	constructor() {
		drawForm();
		firebaseIn();
		this.auth = document.querySelector('#auth');
		this.emailField = document.querySelector('#email');
		this.passwordField = document.querySelector('#password');
		this.nameField = document.querySelector('#name');
		this.content = document.querySelector('#content');
		this.close = document.querySelector('#close');
		this.logInButton = document.querySelector('#logIn');
		this.signInGoogleButton = document.querySelector('#signInGoogle');
		this.signUpButton = document.querySelector('#signUp');
		this.postButton = document.querySelector('#post');
		this.chatMessage = document.querySelector('#chat__message');
		this.chatFormWrap = document.querySelector('.chat__form-wrap');
		this.loadImage = document.querySelector('#chat__upload-img');
		this.chatMessageLabel = document.querySelector('.chat__message-label');
		this.messageButtonAnswer = document.querySelector('#message__button-answer');
		this.image;
		this.previosMessageWrap;
		this.previosMessageBtn;

		this.logInButton.addEventListener('click', this.logIn.bind(this));
		this.signInGoogleButton.addEventListener('click', this.signWithGoogle.bind(this));
		this.signUpButton.addEventListener('click', this.signUp.bind(this));
		this.postButton.addEventListener('click', this.saveMessage.bind(this));
		this.loadImage.addEventListener('change', this.uploadImg.bind(this));
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

	initFirebase() {
		//add a realtime listener
		this.auth = firebase.auth();
		this.database = firebase.database();
		this.storage = firebase.storage();
		this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
	}

	onAuthStateChanged(firebaseUser) {
		this.chatFormWrap.classList.remove('hide');
		let p = document.querySelector('.btn-auth-page__p');

		this.loadMessages();

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

			this.loadMessages();

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

		 //this.loadMessages();
		}
	}

	loadMessages() {
		const setMessage = ((snapshot) => {
			const val = snapshot.val();
			this.displayMessage(val.uid, val.name, val.text, val.validate, val.url, snapshot.key);
		}).bind(this);

		this.messagesRef = this.database.ref('messages/questions/');
		this.messagesRef.limitToLast(30).on('child_added', setMessage);
		this.messagesRef.limitToLast(30).on('child_changed', setMessage);
	}

	displayMessage(uid, name, text, validate, url, key) {
		this.date = key;
		this.user = uid;
		if (!(document.querySelector(`.message[data=${this.date}]`))) {
			const parentEl = document.querySelector('#chat__results');
			const firstChild = parentEl.firstChild;
			var message = document.createElement('div');
			message.setAttribute('data', this.date);
			message.setAttribute('data-user', this.user);
			message.classList.add('message');
			message.innerHTML = `<div class="message__name-user">${name}</div><div class="message__date">${validate}</div><div class="message__text" data=${this.date}><pre>${text}</pre></div><button data=${this.date} btn="answer" class="message__button btn">Ответить</button>`;
			parentEl.insertBefore(message, firstChild);
			const btnChange = document.createElement('button');
			btnChange.classList.add('message__button');
			btnChange.classList.add('btn');
			btnChange.setAttribute('btn', 'change');
			btnChange.innerHTML = 'Изменить';

			const btnRemove = document.createElement('button');
			btnRemove.classList.add('message__button');
			btnRemove.classList.add('btn');
			btnRemove.setAttribute('btn', 'remove');
			btnRemove.innerHTML = 'Удалить';
			if (!(this.auth.currentUser && uid === this.auth.currentUser.uid)) {
				console.log('message-hide');
				btnChange.classList.add('hide');
				btnRemove.classList.add('hide');
			}
			message.appendChild(btnChange);
			message.appendChild(btnRemove);

			if (url) {
				const imgWrap = document.createElement('div');
				imgWrap.classList.add('message__img-wrap');
				imgWrap.innerHTML = `<img class="message__img" data=${this.date} src=${url}><button btn="delete" class="btn-close message__btn-change hide" data=${key}><img src="img/close-icon1.png" data=${key} image="close" class="message__img"></button>`;
				const img = document.createElement('img');
				img.classList.add(`message__img`);
				img.setAttribute('data', this.date);
				img.src = url;
				message.insertBefore(imgWrap, message.children[2]);
			}

			if (this.auth.currentUser && uid === this.auth.currentUser.uid) {
				message.onclick = this.changeMessage.bind(this);
			}
		}
	}

	//save new message on farebase db
	saveMessage(e) {
		e.preventDefault();

		if ((this.image && this.chatMessage.value && this.checkSignedInWithMessage()) ||
			(this.image && this.checkSignedInWithMessage()) ||
			(this.chatMessage.value && this.checkSignedInWithMessage())) {
			const currentUser = this.auth.currentUser;
			const data = new Date();
			const options = {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric'
			};

			var val;
				this.fbRef.on('value', (snapshot => {
					return val = snapshot.val().userName;}));

			console.log(val);

			//add a new message to the farebase db
			this.messagesRef.push({
				uid: currentUser.uid,
				name: val,
				text: this.chatMessage.value || '',
				validate: data.toLocaleString("ru", options),
				url: this.image || null
			})
		}
		this.chatMessage.value = '';
		this.image = undefined;
		this.chatMessageLabel.classList.remove('visibility');
	}

	checkSignedInWithMessage() {
		return (this.auth.currentUser);
	}

	uploadImg(e) {
		const progress = new ProgressBar();
		progress.move();

		this.file = e.target.files[0];

		this.metadata = {
			'contentType': this.file.type
		};

		this.chatMessageLabel.classList.add('visibility');

		if ((this.file.type === "image/png") || (this.file.type === "image/jpeg")) {

			const filePath = 'images/' + this.file.name;
			const storageRef = firebase.storage().ref().child(filePath);
			const task = storageRef.put(this.file, this.metadata)
				.then((snapshot) => {
					this.image = snapshot.downloadURL;
				})
		}
		else {
			alert('Это не картинка');
		}
		// if (file.type === ("audio/mp3" || "audio/mpeg")) {
		//
		// }
	}

	changeMessage(e) {
		this.messageBtn;
		e.preventDefault();
		const target = e.target;
		this.key = target.getAttribute('data');
		this.uid = this.auth.currentUser.uid;
		this.dbRef = firebase.database().ref('messages/questions/' + this.key);
		this.message = e.currentTarget;
		this.text = this.message.querySelector('pre');
		this.previosMessage;

		if ((this.previosMessage !== this.message) && this.previosMessageWrap) {
				this.previosMessageWrap.remove();
		}

		if (target.tagName === 'BUTTON') {
			this.file = this.message.querySelector('img');

			if (target.getAttribute('btn') === 'change') {
				this.image = this.message.querySelector('.message__img');

				changeChatForm(e.currentTarget, this.text, this.key);
				this.currentMessageWrap = this.message.querySelector('#message-wrap');
				this.messageBtn = this.message.querySelectorAll('.message__button');
				//this.message.querySelector('label[label="load"]').classList.remove('hide');

				if (this.image) {
					//this.message.querySelector('label[label="load"]').classList.add('hide');
					this.message.querySelector('.btn-close').classList.remove('hide');
				}
			}

			else if (target.getAttribute('btn') === 'remove') {
				this.uid = this.auth.currentUser.uid;
				this.dbRef.remove();
				if (this.file) {
					firebase.storage().refFromURL(this.file.src).delete();
				}
				this.dbRef.on('child_removed', () => {
					this.message.remove();
				});
			}
			else if (target.getAttribute('btn') === 'send') {
				this.textarea = this.message.querySelector('textarea').value;
				let newData = {
					"text": this.textarea
				};
				this.dbRef.update(newData);
				this.dbRef.on('child_changed', snap => {
					const val = snap.val();
					this.text.innerText = val;
				});
				this.currentMessageWrap.remove();
			}

			else if (target.getAttribute('btn') === 'reset') {
				if (document.querySelector('#message-wrap')) {
					document.querySelector('#message-wrap').remove();
				}
			}

			else if (target.getAttribute('btn') === 'delete') {
				this.image = this.message.querySelector('.message__img');
				firebase.storage().refFromURL(this.file.src).delete();

				const img = this.dbRef.child('url');
				img.remove();
				this.dbRef.on('child_removed', () => {
					this.image.remove();
				});
			}
			else if (target.getAttribute('btn') === 'answer') {
				drawChat(this.message, this.key);
				this.message.querySelector('.chat__form-wrap').classList.remove('hide');
				this.message.querySelector('.chat__form-wrap').classList.add('chat__form-wrap--inner');
			}

			if (target.getAttribute('btn') === 'sendAnswer') {
				//this.messagesRef = this.database.ref('messages/answers/');
				this.saveMessage.bind(this);
			}
		}

		// else if (target.getAttribute('label') === 'load') {
		// 	this.loadImage.addEventListener('change', this.uploadImg.bind(this));
		// }

		else if (target.getAttribute('image') === 'close') {
			this.image = this.message.querySelector('.message__img');
			firebase.storage().refFromURL(this.file.src).delete();

			const img = this.dbRef.child('url');
			img.remove();
			this.dbRef.on('child_removed', () => {
				this.image.remove();
			});
		}
			this.previosMessage = this.message;
			this.previosMessageWrap = this.currentMessageWrap;
	}
}