setInterval(() => {
	for (const streamerBox of streamerBoxes) {
		if (streamerBox.childElementCount > 0) {
			let streamer =
				streamerBox.children[streamerBox.childElementCount - 1];
			streamer.style.height = streamer.clientHeight + 5 + "px";
		}
		if (streamerBox.childElementCount > 20) {
			for (let i = streamerBox.childElementCount; i > 20; i--) {
				streamerBox.removeChild(streamerBox.children[0]);
			}
		}
	}
}, 16);
