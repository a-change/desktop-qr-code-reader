// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library

function showInfo() {
	document.getElementById("info").innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

function openDocs() {
	Neutralino.os.open("https://neutralino.js.org/docs");
}

function openTutorial() {
	Neutralino.os.open("https://www.youtube.com/watch?v=txDlNNsgSh8&list=PLvTbqpiPhQRb2xNQlwMs0uVV0IN8N-pKj");
}

function setTray() {
	if (NL_MODE != "window") {
		console.log("INFO: Tray menu is only available in the window mode.");
		return;
	}
	let tray = {
		icon: "/resources/icons/trayIcon.png",
		menuItems: [
			{ id: "VERSION", text: "Get version" },
			{ id: "SEP", text: "-" },
			{ id: "QUIT", text: "Quit" },
		],
	};
	Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
	switch (event.detail.id) {
		case "VERSION":
			Neutralino.os.showMessageBox("Version information", `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
			break;
		case "QUIT":
			Neutralino.app.exit();
			break;
	}
}

function onWindowClose() {
	Neutralino.app.exit();
}

async function getManagedEndpoint(email) {
	const response = await fetch("https://api-demoapp.exponea.com/webxp/s/b5b56d38-0a70-11eb-b64a-8eb5f3c8d64c/managed-endpoints/6406eca5157dd00537669e60", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Token ${NL_BR_AUTH_TOKEN}`,
		},
		body: JSON.stringify({
			customer_ids: {
				registered: email.toString().trim().toLowerCase(),
			},
		}),
	});
	const data = await response.json();

	console.log(data);
	document.getElementById("customer-email").innerHTML = data.email;
	document.getElementById("customer-name").innerHTML = data.first_name;
	document.getElementById("customer-cltv").innerHTML = data.CLTV;
    document.getElementById("customer-value").innerHTML = data.customer_value;
	document.getElementById("loyalty-status").innerHTML = data.loyalty_status;
	document.getElementById("style-affinity").innerHTML = data.style_affinity;
	document.getElementById("last-purchase-date").innerHTML = data.last_purchase_timestamp;

	document.getElementById("last-purchased-products").innerHTML = data.last_purchased_items;
	document.getElementById("recommended-items").innerHTML = data.recommended_items;
}

function listenToInput() {
	var str = "";
	document.addEventListener("keypress", function (e) {
		console.log("On enter", e);
		// we don't want to double process form submissions which can also happen on enter, so we discard all non-body inputs
		if (e.target.tagName !== "BODY") {
			console.log("Coming from input, discarding...");
			return true;
		}
		if (e.key == "Enter") {
			console.log(str);
			var temp = str;
			str = "";
			getManagedEndpoint(temp);
			// document.querySelector("#input-box").innerText = temp;
		} else {
			str += e.key;
		}
	});
}

listenToInput();

document.querySelector("form").addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = Object.fromEntries(new FormData(e.target));
	console.log(formData);
	getManagedEndpoint(formData.email);
});

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if (NL_OS != "Darwin") {
	// TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
	setTray();
}

showInfo();
