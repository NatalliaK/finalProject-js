export default class MyMap {
	constructor(id, center) {
		this.id = id;
		this.center = center;
		ymaps.ready(() => this.init());
	}

	init() {
		const myMap = new ymaps.Map(this.id, {
			center: this.center,
			zoom: 13
		});

		const myPlaceMark = new ymaps.Placemark(myMap.getCenter(), {
				baloonContent: 'ул. Воинов-Интернационалистов, 10а'
			}, {
				iconLayout: 'default#image',
				iconImageHref: './img/baloon2.png',
				iconImageSize: [30, 48],
				iconImageOffset: [-20, -47],
				iconShadow: true
			});

		myMap.geoObjects.add(myPlaceMark);
	}
}
