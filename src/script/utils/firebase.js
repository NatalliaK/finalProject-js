export default function firebaseIn() {
	var config = {
	apiKey: "AIzaSyCrlyddfMD6nIjALjhqXJ-sscR34DrY7sE",
	authDomain: "athletic-24d64.firebaseapp.com",
	databaseURL: "https://athletic-24d64.firebaseio.com",
	projectId: "athletic-24d64",
	storageBucket: "athletic-24d64.appspot.com",
	messagingSenderId: "850535666027"
};
	if (!firebase.apps.length) {
		firebase.initializeApp(config);
	}
}