let keyDom = document.getElementsByClassName("key");
let streamerBoxes = document.getElementsByClassName("streamer-box");
let keyUpdater = document.getElementById("key-updater");
let keySlots = document.getElementsByClassName("key-slot");
let speedDom = document.getElementById("speed");
let bpmDom = document.getElementById("bpm");
let settings = document.getElementById("settings");
let bg = document.getElementById("bg");
let chartDom = document.getElementById("chart");

let keysUp = [true, true];
let hitsound = "key.wav";
let updatingKeys = false;
let clickTimes = [];
let firstClick = 0;
let mode = "freeclick";

window.addEventListener("keyup", keyUp);
window.addEventListener("keydown", keyDown);

let keys = JSON.parse(localStorage.getItem("keys")) || ["Z", "X"];
updateKeys(keys);

function keyUp(key) {
	let keyPressed = key.key.toUpperCase();

	if (keys.includes(keyPressed)) {
		let keyIndex = keys.indexOf(keyPressed);

		let streamer = document.createElement("div");
		streamer.classList.add("streamer");
		streamer.style.backgroundColor = "#00000000";
		streamerBoxes[keyIndex].appendChild(streamer);

		keyDom[keyIndex].classList.remove("pressed");
		keysUp[keyIndex] = true;
	}
}

function keyDown(key) {
	let keyPressed = key.key.toUpperCase();
	if (updatingKeys) {
		if (keys.includes(keyPressed)) return;

		keys.push(keyPressed);
		keySlots[keys.length - 1].innerHTML = keyPressed;
		if (keys.length >= 2) {
			updateKeys(keys);
			updatingKeys = false;
			setTimeout(closeKeyUpdater, 300);
		}
		return;
	}
	if (!keys.includes(keyPressed)) return;

	let keyIndex = keys.indexOf(keyPressed);
	if (!keysUp[keyIndex]) return;

	if (
		!firstClick ||
		clickTimes[clickTimes.length - 1] + firstClick + 1000 <= Date.now()
	) {
		firstClick = Date.now();
		clickTimes = [];
		clickTimes.push(0);
		chart.data.labels = [];
		chart.data.datasets[0].data = [];
		chartInterval = setInterval(chartUpdateInterval, 1000);
		chartUpdateInterval();
	} else {
		clickTimes.push(Date.now() - firstClick);
	}

	keyDom[keyIndex].classList.add("pressed");
	let hit = new Audio(`../audio/hitsounds/${hitsound}`);
	hit.volume = 0.2;
	hit.play();

	let streamer = document.createElement("div");
	streamer.classList.add("streamer");
	streamer.style.backgroundColor = "#FFFFFF";
	streamerBoxes[keyIndex].appendChild(streamer);

	keysUp[keyIndex] = false;
}

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
	closeSettings();
	keyUpdater.style.visibility = "visible";
	keyUpdater.style.opacity = 1;
	keyUpdater.style.pointerEvents = "all";
}

function closeKeyUpdater() {
	updatingKeys = false;
	keyUpdater.style.opacity = 0;
	keyUpdater.style.pointerEvents = "none";
	setTimeout(() => {
		keyUpdater.style.visibility = "hidden";
		for (let i = 0; i < keySlots.length; i++) {
			keySlots[i].innerHTML = "";
		}
	}, 500);
}

function openSettings() {
	settings.style.visibility = "visible";
	settings.style.opacity = 1;
	settings.style.pointerEvents = "all";
}

function closeSettings() {
	settings.style.opacity = 0;
	settings.style.pointerEvents = "none";
	setTimeout(() => {
		settings.style.visibility = "hidden";
	}, 500);
}

setInterval(() => {
	let secondsSinceFirstClick = (Date.now() - firstClick) / 1000;
	let speed = clickTimes.length / secondsSinceFirstClick;
	// Convert clicks per second to BPM
	let bpm = (speed / 4) * 60;

	let speedContent = `${speed.toFixed(2)} click/s`;
	if (speedContent != speedDom.innerHTML) speedDom.innerHTML = speedContent;

	let bpmContent = `${bpm.toFixed(0)} BPM`;
	if (bpmContent != bpmDom.innerHTML) bpmDom.innerHTML = bpmContent;
}, 50);

function setMode(newMode) {
	mode = newMode;
	bg.textContent = newMode;

	if (mode == "freeclick") {
		bg.style.filter = "hue-rotate(-126deg)";
	}
	if (mode == "timed") {
		bg.style.filter = "hue-rotate(45deg)";
	}
	if (mode == "clicks") {
		bg.style.filter = "hue-rotate(115deg)";
	}
}
