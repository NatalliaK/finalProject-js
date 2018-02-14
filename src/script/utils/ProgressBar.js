export default class ProgressBar {
	constructor() {
		this.progress = document.querySelector('#progress');
		this.elem = document.querySelector('#myBar');
		this.width = 0;
	}

	move() {
		this.progress.classList.remove('hide');
		this.id = setInterval(this.frame.bind(this), 10);
	}

	frame() {
		if (this.width >= 100) {
			this.progress.classList.add('hide');
			clearInterval(this.id);
		} else {
			this.width ++;
			this.elem.style.width = this.width + '%';
			this.elem.innerHTML = this.width * 1 + '%';
		}
	}
}