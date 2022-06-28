let keyDom = document.getElementsByClassName("key");
let keyUp = [true, true];
let streamerBoxes = document.getElementsByClassName("streamer-box");
let keyUpdater = document.getElementById("key-updater");
let keySlots = document.getElementsByClassName("key-slot");
let hitsound = "key.wav";
let updatingKeys = false;
let clickTimes = [];
let firstClick;

let keys = JSON.parse(localStorage.getItem("keys")) || ["Z", "X"];
updateKeys(keys);

window.addEventListener("keydown", (key) => {
	let keyPressed = key.key.toUpperCase();
	if (updatingKeys) {
		if (keys.includes(keyPressed)) return;

		keys.push(keyPressed);
		keySlots[keys.length - 1].innerHTML = keyPressed;
		if (keys.length >= 2) {
			updateKeys(keys);
			updatingKeys = false;
			setTimeout(closeKeyUpdater, 1000);
		}
		return;
	}
	if (!keys.includes(keyPressed)) return;

	let keyIndex = keys.indexOf(keyPressed);
	if (!keyUp[keyIndex]) return;

	keyDom[keyIndex].classList.add("pressed");
	let hit = new Audio(`../audio/hitsounds/${hitsound}`);
	hit.volume = 0.2;
	hit.play();

	let streamer = document.createElement("div");
	streamer.classList.add("streamer");
	streamer.style.backgroundColor = "#FFFFFF";
	streamerBoxes[keyIndex].appendChild(streamer);

	keyUp[keyIndex] = false;
});

window.addEventListener("keyup", (key) => {
	let keyPressed = key.key.toUpperCase();

	if (keys.includes(keyPressed)) {
		let keyIndex = keys.indexOf(keyPressed);

		let streamer = document.createElement("div");
		streamer.classList.add("streamer");
		streamer.style.backgroundColor = "#111111";
		streamerBoxes[keyIndex].appendChild(streamer);

		keyDom[keyIndex].classList.remove("pressed");
		keyUp[keyIndex] = true;
	}
});

function updateKeys(keyInput) {
	keys = keyInput;
	localStorage.setItem("keys", JSON.stringify(keys));

	for (let i = 0; i < keyDom.length; i++) {
		keyDom[i].innerHTML = keys[i];
	}
}

function openKeyUpdater() {
	updatingKeys = true;
	keys = [];
	keyUpdater.style.opacity = 1;
	keyUpdater.style.height = "100%";
	keyUpdater.style.width = "100%";
}

function closeKeyUpdater() {
	updatingKeys = false;
	keyUpdater.style.opacity = 0;
	setTimeout(() => {
		keyUpdater.style.height = "0%";
		keyUpdater.style.width = "0%";
		for (let i = 0; i < keySlots.length; i++) {
			keySlots[i].innerHTML = "";
		}
	}, 1000);
}
