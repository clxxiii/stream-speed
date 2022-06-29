let labels = [];
let chartInterval;

let data = {
	labels: labels,
	datasets: [
		{
			backgroundColor: "rgb(255, 255, 255)",
			borderColor: "rgb(255,255,255)",
			data: [],
		},
	],
};

let config = {
	type: "line",
	data: data,
	options: {
		plugins: {
			legend: {
				display: false,
			},
		},
		elements: {
			line: {
				tension: 0.25,
				borderColor: "#FFFFFF",
			},
		},
		scales: {
			y: {
				min: 0,
			},
		},
	},
};

const chart = new Chart(document.getElementById("chart"), config);

function chartUpdateInterval() {
	let lastClick = clickTimes[clickTimes.length - 1] + firstClick;
	console.log(lastClick + 1000 - Date.now());
	if (lastClick + 1000 < Date.now()) {
		clearInterval(chartInterval);
	}

	let secondsSinceFirstClick = Math.round((Date.now() - firstClick) / 1000);
	chart.data.labels.push(secondsSinceFirstClick);
	let speed = clickTimes.length / secondsSinceFirstClick;
	// Convert clicks per second to BPM
	let bpm = (speed / 4) * 60;
	// console.log(chart.data.datasets);
	chart.data.datasets[0].data.push(bpm);
	chart.update();
}
