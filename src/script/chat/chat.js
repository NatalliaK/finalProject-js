import firebaseIn from './../utils/firebase';
import ProgressBar from '../utils/ProgressBar';
import changeChatForm from './changeChatForm';
import drawChat from "./drawChat";

export default class Chat {
	constructor() {
		firebaseIn();

		this.postButton = document.querySelector('#post');
		this.chatMessage = document.querySelector('#chat__message');
		this.chatFormWrap = document.querySelector('.chat__form-wrap');
		this.loadImage = document.querySelector('#chat__upload-img');
		this.chatMessageLabel = document.querySelector('.chat__message-label');
		this.messageButtonAnswer = document.querySelector('#message__button-answer');
		this.image;
		this.previosMessageWrap;
		this.files = [];

		this.postButton.addEventListener('click', this.saveMessage.bind(this));
		this.loadImage.addEventListener('change', this.uploadImg.bind(this));
	}

	initFirebase() {
		//add a realtime listener
		this.auth = firebase.auth();
		this.database = firebase.database();
		this.storage = firebase.storage();
		this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
	}

	loadMessages(path) {
		const setMessage = ((snapshot) => {
			const val = snapshot.val();
			this.displayMessage(val.uid, val.name, val.text, val.validate, val.url, snapshot.key);
		}).bind(this);

		this.messagesRef = this.database.ref(path);
		// this.messagesRef.off();
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
			message.innerHTML = `<div class="message__name-user">${name}</div><div class="message__date">${validate}</div><div class="message__text" data=${this.date}><pre>${text}</pre></div>`;
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
			btnRemove.setAttribute('data', this.date);
			btnRemove.innerHTML = 'Удалить';
			if (!(this.auth.currentUser && uid === this.auth.currentUser.uid)) {
				btnChange.classList.add('hide');
				btnRemove.classList.add('hide');
			}
			message.appendChild(btnChange);
			message.appendChild(btnRemove);

			if (url) {
				this.file = url;
				const imgWrap = document.createElement('div');
				imgWrap.classList.add('message__img-wrap');
				message.insertBefore(imgWrap, message.children[2]);

				if (typeof url === 'object') {

					if (this.file.length > 1) {

						imgWrap.innerHTML = `<div class="message__img-controls-wrap"><button class="message__img-controls  message__img-controls--prev" controls="prev" data=${this.date}>&lt;</button><button class="message__img-controls  message__img-controls--next" controls="next" data=${this.date}>&gt;</button></div>`;

						this.file.forEach((el) => {
							const slide = document.createElement('div');
							slide.classList.add('message__slide');
							slide.innerHTML = `<img class="message__slide-img" data=${this.date} src=${el}><button btn="delete" class="btn-close message__btn-change hide" data=${key}><img src="img/close.png" data=${key} image="close" class="message__img-close"></button>`;
							imgWrap.appendChild(slide);
						});

						message.querySelector('.message__slide').classList.add('show');
					} else {
						imgWrap.innerHTML = `<img class="message__img" data=${this.date} src=${this.file}><button btn="delete" class="btn-close message__btn-change hide" data=${key}><img src="img/close.png" data=${key} image="close" class="message__img-close"></button>`;
					}
				}
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

			//add a new message to the farebase db
			this.messagesRef.push({
				uid: currentUser.uid,
				name: val,
				text: this.chatMessage.value || '',
				validate: data.toLocaleString("ru", options),
				url: this.dbFiles || null
			})
		}
		this.chatMessage.value = '';
		this.image = undefined;
		this.chatMessageLabel.classList.remove('visibility');
		this.files = [];
	}

	checkSignedInWithMessage() {
	}

	uploadImg(e) {
		const progress = new ProgressBar();
		progress.move();

		this.file = e.target.files[0];

		this.metadata = {
			'contentType': this.file.type
		};

		this.chatMessageLabelAsks();

		if ((this.file.type === "image/png") || (this.file.type === "image/jpeg")) {

			const filePath = 'images/' + this.file.name;
			const storageRef = firebase.storage().ref().child(filePath);
			const task = storageRef.put(this.file, this.metadata)
				.then((snapshot) => {
					this.image = snapshot.downloadURL;
					this.files.push(this.image);
				})
			this.dbFiles = this.files;
		}
		else {
			alert('Это не картинка');
		}
		// if (file.type === ("audio/mp3" || "audio/mpeg")) {
		//
		// }
	}

	chatMessageLabelAsks() {
	}

	nextSlide(el) {
	}

	previousSlide(el) {
	}

	changeMessage(e) {
		this.messageBtn;
		e.preventDefault();
		const target = e.target;
		this.message = e.currentTarget;
		this.key = this.message.getAttribute('data');
		this.uid = this.auth.currentUser.uid;
		this.dbRef = this.getDbRef().child(this.key);
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

				this.message.querySelector('button[btn="remove"]').classList.add('hide');
				this.message.querySelector('button[btn="change"]').classList.add('hide');
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
				if (this.message.querySelector('.btn-close')) {
					this.message.querySelector('.btn-close').classList.add('hide');
				}

				this.message.querySelector('button[btn="remove"]').classList.remove('hide');
				this.message.querySelector('button[btn="change"]').classList.remove('hide');
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

			else if (target.getAttribute('btn') === 'reset') {
				if (document.querySelector('#message-wrap')) {
					document.querySelector('#message-wrap').remove();
				}

				if (this.message.querySelector('.btn-close')) {
					this.message.querySelector('.btn-close').classList.add('hide');
				}

				this.message.querySelector('button[btn="remove"]').classList.remove('hide');
				this.message.querySelector('button[btn="change"]').classList.remove('hide');
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

			if (target.getAttribute('controls') === 'prev') {
				this.previousSlide(this.message);
			}

			if (target.getAttribute('controls') === 'next') {
				this.nextSlide(this.message);
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
			this.message.querySelector('.message__img-wrap').remove();
		}
			this.previosMessage = this.message;
			this.previosMessageWrap = this.currentMessageWrap;
	}
}