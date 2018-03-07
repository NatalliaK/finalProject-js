import Chat from './../chat/chat';

export default class News extends Chat {
	constructor() {
		super();
		this.db = firebase.database();
		// this.auth = firebase.auth();
		this.currentSlide = 0;
	}

	onAuthStateChanged(firebaseUser) {
		this.chatFormWrap.classList.remove('hide');

		this.loadMessages('news/');

		if (document.querySelector('.message') && (!(document.querySelector('.message').getAttribute('data-user') === 'VcXtJKZHFXN0n0yQhKQxOmRlRkc2'))) {
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
			this.uid = firebaseUser.uid;
			this.filePath = 'users/' + this.uid;
			this.fbRef = this.database.ref(this.filePath);

			this.fbRef.on('value', (snapshot => {
				var val = snapshot.val().userName;
			}));

			this.loadMessages('news/');

			if (document.querySelector('.message')) {
				const messages = document.querySelectorAll('.message');
				messages.forEach((el) => {
					if (el.getAttribute('data-user') === 'VcXtJKZHFXN0n0yQhKQxOmRlRkc2') {
						let btnChange = el.querySelector('button[btn="change"]');
						let btnRemove = el.querySelector('button[btn="remove"]');
						btnChange.classList.remove('hide');
						btnRemove.classList.remove('hide');
					}
				})
			}

		}

		if (!(firebaseUser && this.uid === 'VcXtJKZHFXN0n0yQhKQxOmRlRkc2')){
			this.chatFormWrap.classList.add('hide');
		}

		document.querySelector('#chat__results').onclick = this.slideshow.bind(this);
	}

	checkSignedInWithMessage() {
		return (this.auth.currentUser && this.uid === 'VcXtJKZHFXN0n0yQhKQxOmRlRkc2');
	}

	getDbRef() {
		return this.db.ref('news/');
	}

	slideshow(e) {
		e.preventDefault();
		const target = e.target;
		if (target.tagName === 'BUTTON' && (target.getAttribute('controls') === 'prev' || target.getAttribute('controls') === 'next')) {
			this.date = target.getAttribute('data');
			this.el = document.querySelector(`.message[data=${this.date}]`);
			if (this.el.querySelector('.message__slide')) {
				this.slides = this.el.querySelectorAll('.message__slide');
				this.data = this.el.getAttribute('data');
				this.prev = this.el.querySelector(`button[controls="prev"]`);
				this.next = this.el.querySelector(`button[controls="next"]`);

				if (target === this.prev) {
					this.slides[this.currentSlide].classList.remove('show');
					this.currentSlide = (this.slides.length + this.currentSlide) % this.slides.length;

					if (this.currentSlide === 0) {
						this.currentSlide = this.slides.length - 1;
					} else {
						this.currentSlide--;
					}
					this.slides[this.currentSlide].classList.add('show');
				}

				if (target === this.next) {
					this.slides[this.currentSlide].classList.remove('show');
					this.currentSlide = (this.slides.length + this.currentSlide) % this.slides.length;

					if (this.currentSlide === this.slides.length - 1) {
						this.currentSlide = 0;
					} else {
						this.currentSlide++;
					}
					this.slides[this.currentSlide].classList.add('show');
				}
			}
		}
		return;
	}
}