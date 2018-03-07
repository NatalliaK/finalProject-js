export default class TypeText {
	constructor(elem) {
		this.elem = elem;
		this.h1 = this.elem.querySelector('h1');
		this.text = this.h1.textContent.replace(/^\s*(.*)\s*$/, '$1');
	}

	createSpan() {
		if (this.h1.classList.contains('header__h1--print-txt')) {
			for (var i = 0; i < this.text.length; i++) {
				this.txt = document.createTextNode(this.text[i]);

				setTimeout(this.getSpan, 150 * i, this.txt, i);
			}
		}
	}

	getSpan(txt, i) {
		var span = document.createElement('span');
		span.appendChild(txt);
		span.classList.add('wave');
		document.querySelector('.header__wrap-h1').appendChild(span);
		if (i < 15) {
			span.classList.add('header__h1');
		}
		if (i === 15) {
			let br = document.createElement('br');
			document.querySelector('.header__wrap-h1').appendChild(br);
		}

		if (i > 16) {
			span.classList.add('header__span');
		}
	}
}