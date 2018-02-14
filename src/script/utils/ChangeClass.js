export default class ChangeClass {
	constructor(elem, className1, className2) {
		this.elem = elem;
		this.className = className1;
		this.newClassName = className2;
	}

	addClass() {
		this.elem.classList.add(this.newClassName);
	}

	removeClass() {
		this.elem.classList.remove(this.className);
	}

	addLastClass() {
		this.elem.classList.add(this.className);
	}

	removeNewClass() {
		this.elem.classList.remove(this.newClassName);
	}

	changeClass() {
		if (this.elem.classList.contains(this.className)) {
			this.removeClass();
			this.addClass();
		} else {
			this.removeNewClass();
			this.addLastClass();
		}
	}
}
