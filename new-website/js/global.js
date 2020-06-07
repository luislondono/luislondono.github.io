window.onload = function () {
	try {
		pageSpecificOnload();
	} catch (error) {
		console.warn("No pageSpecificOnLoad() defined!");
	}
};

window.onresize = function () {
	try {
		pageSpecificOnResize();
	} catch (error) {
		console.warn("No pageSpecificOnResize() defined!");
	}
};

function generateNode(
	type,
	parentNode,
	classString = "",
	innerText = "",
	src = "",
	href = ""
) {
	var node = document.createElement(type);
	if (classString != "") {
		node.classList.add(...classString.split(" "));
	}
	node.innerText = innerText;
	if (type == "img") {
		node.src = src;
	}
	if (type == "a") {
		node.href = href;
	}
	parentNode.appendChild(node);
	return node;
}
