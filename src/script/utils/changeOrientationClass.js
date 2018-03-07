export default function changeOrientationClass() {
	var headerWrap = document.querySelector('.header__wrap-h1');
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	if ((width >= (height * 1.63)) && (height >= 320 && width >= 320) && headerWrap.classList.contains('header__wrap-h1--main')) {
		headerWrap.classList.remove('header__wrap-h1--main');
		headerWrap.classList.add('header__wrap-h1--main-side');
	} else {
		headerWrap.classList.remove('header__wrap-h1--main-side');
		headerWrap.classList.add('header__wrap-h1--main');
	}
}