var googleMapsBackground;
var workCarousel;
var cellularMaxWidth;
var tabletMaxWidth;
var resume;
const baysideAnchor = 550 / 776;
var carouselScrollTimer;
var carouselScrollDirection;
var carouselScrollStrength = 1;

const myWork = [
	{
		icon: "uber_icon.png",
		name: "Uber Customer Obsesion",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "hyperloop_webdev_logo.png",
		name: "Cornell Hyperloop",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "snakes_and_ladders.png",
		name: "Snakes & Ladders",
		link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders",
	},
	{
		icon: "rush_hour_logo.jpg",
		name: "Gridlock!",
		link: "https://luislondono.com/gridLockGame",
	},
	{
		icon: "snakes_and_ladders2.png",
		name: "Snakes & Ladders",
		link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders",
	},
	{
		icon: "egos_icon.png",
		name: "OS Practicum",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "ocaml_icon.svg",
		name: "OCaml Repl",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "c_icon.png",
		name: "Malloc Library",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "uber_icon.png",
		name: "Uber Customer Obsesion",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "hyperloop_webdev_logo.png",
		name: "Cornell Hyperloop",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "snakes_and_ladders.png",
		name: "Snakes & Ladders",
		link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders",
	},
	{
		icon: "rush_hour_logo.jpg",
		name: "Gridlock!",
		link: "https://luislondono.com/gridLockGame",
	},
	{
		icon: "snakes_and_ladders2.png",
		name: "Snakes & Ladders",
		link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders",
	},
	{
		icon: "egos_icon.png",
		name: "OS Practicum",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "ocaml_icon.svg",
		name: "OCaml Repl",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "c_icon.png",
		name: "Malloc Library",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "uber_icon.png",
		name: "Uber Customer Obsesion",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "hyperloop_webdev_logo.png",
		name: "Cornell Hyperloop",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "snakes_and_ladders.png",
		name: "Snakes & Ladders",
		link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders",
	},
	{
		icon: "rush_hour_logo.jpg",
		name: "Gridlock!",
		link: "https://luislondono.com/gridLockGame",
	},
	{
		icon: "snakes_and_ladders2.png",
		name: "Snakes & Ladders",
		link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders",
	},
	{
		icon: "egos_icon.png",
		name: "OS Practicum",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "ocaml_icon.svg",
		name: "OCaml Repl",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
	{
		icon: "c_icon.png",
		name: "Malloc Library",
		link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io",
	},
];

const myskills = [
	{ name: "Python", icon: "./assets/skills_icons/python_icon.png", link: "" },
	{ name: "Java", icon: "./assets/skills_icons/java_icon.png", link: "" },
	{ name: "C", icon: "./assets/c_icon.png", link: "" },
	{ name: "Go", icon: "./assets/skills_icons/go_icon.jpg", link: "" },
	{ name: "HTML5", icon: "./assets/skills_icons/html5_icon.png", link: "" },
	{ name: "CSS", icon: "./assets/skills_icons/css_icon.png", link: "" },
	{
		name: "Javascript",
		icon: "./assets/skills_icons/javascript_icon.png",
		link: "",
	},
	{ name: "R", icon: "./assets/skills_icons/R_icon.png", link: "" },
	{ name: "Swift", icon: "./assets/skills_icons/swift_icon.png", link: "" },
	{
		name: "Excel Modeling",
		icon: "./assets/skills_icons/excel_icon.png",
		link: "",
	},
	{
		name: "SQL/SQLite",
		icon: "./assets/skills_icons/sqllite_icon.jpg",
		link: "",
	},

	{ name: "Redis", icon: "./assets/skills_icons/redis_icon.webp", link: "" },
	{
		name: "Google Firebase",
		icon: "./assets/skills_icons/googlefirebase_icon.png",
		link: "",
	},
	{ name: "bash", icon: "./assets/skills_icons/bash_icon.png", link: "" },

	{ name: "Node.js", icon: "./assets/skills_icons/node_icon.svg", link: "" },
	{ name: "React", icon: "./assets/skills_icons/react_icon.webp", link: "" },
	{ name: "AMPL", icon: "./assets/skills_icons/ampl_icon.png", link: "" },
	{
		name: "Unix-like systems",
		icon: "./assets/skills_icons/linux_icon.png",
		link: "",
	},
];
function pageSpecificOnResize() {
	resizeCarousel();
	anchorGoogleMapsBackground();
}

function pageSpecificOnload(first = true) {
	initializeDocumentValues();
	generateCarousel();
	generateSkills();
	anchorGoogleMapsBackground();
}

function initializeDocumentValues() {
	googleMapsBackground = document.getElementById("google-maps-background");
	workCarousel = document.getElementById("work-carousel");
	resume = document.getElementById("resume");
	cellularMaxWidth = parseInt(
		getComputedStyle(document.documentElement).getPropertyValue(
			"--cellularMaxWidth"
		)
	);
	tabletMaxWidth = parseInt(
		getComputedStyle(document.documentElement).getPropertyValue(
			"--tabletMaxWidth"
		)
	);
}

function generateSkills() {
	skillsContainer = document.getElementById("skills-container");
	myskills.forEach((s) => {
		skillContainer = generateNode("div", skillsContainer, "skill");
		skillicon = generateNode("img", skillContainer, "skill-icon", null, s.icon);
		skillLabel = generateNode("div", skillContainer, "skill-label", s.name);
	});
}

function anchorGoogleMapsBackground() {
	googleMapsBackground.style.position = "absolute";
	const imageWidth = googleMapsBackground.getBoundingClientRect().width;
	const horizontalAnchor = window.innerWidth * 0.65;
	var shift = baysideAnchor * imageWidth - horizontalAnchor;

	shift = Math.min(shift, imageWidth - window.innerWidth);
	if (window.innerWidth >= imageWidth) {
		googleMapsBackground.style.left = "";
		return;
	}
	googleMapsBackground.style.left = "-" + String(shift) + "px";
}

function generateCarousel() {
	workCarousel.addEventListener("mouseover", (e) => {
		carouselMouseOver(e);
	});
	workCarousel.addEventListener("mouseleave", (e) => {
		carouselScrollDirection = "";
	});

	resizeCarousel();

	if (workCarousel.childElementCount < myWork.length) {
		myWork.forEach((elm) => generateCarouselItem(workCarousel, elm));
	}
}

function resizeCarousel() {
	const iconHeight = getComputedStyle(
		document.documentElement
	).getPropertyValue("--carousel-icon-height");
	const mult = getComputedStyle(document.documentElement).getPropertyValue(
		"--carousel-item-width-mult"
	);
	const itemWidth = parseInt(iconHeight) * parseFloat(mult);

	const numItems = Math.floor(
		document.documentElement.getBoundingClientRect().width / itemWidth
	);

	if (["cellular", "tablet"].includes(getViewportType())) {
		workCarousel.style.width = String(numItems * itemWidth) + "px";

		// resume.style.width = String(numItems * itemWidth) + "px";
	} else {
		workCarousel.style.width = "";
		resume.style.width = "";
	}
}

function generateCarouselItem(root, work) {
	workCarouselItem = document.createElement("div");
	workCarouselItem.classList.add("work-carousel-item");

	workCarouselItemImage = document.createElement("div");
	workCarouselItemImage.classList.add(
		"work-carousel-item-image",
		"horizontal-centered"
	);

	anchor = document.createElement("a");
	anchor.href = work.link;

	icon = document.createElement("img");
	icon.src = "./assets/" + work.icon;
	anchor.appendChild(icon);
	workCarouselItemImage.appendChild(anchor);

	workCarouselItem.appendChild(workCarouselItemImage);

	label = document.createElement("span");
	label.classList.add("work-carousel-item-label", "text-centered");
	label.innerText = work.name;

	workCarouselItem.appendChild(label);

	root.appendChild(workCarouselItem);
}

function carouselMouseOver(event) {
	// if (getViewportType() != "desktop") {
	// return
	// }
	const activeRegionRatio = 0.37;
	const workCarouselBoundingClientRect = workCarousel.getBoundingClientRect();
	// console.log(event)
	// console.log(event.pageX)
	var x = event.clientX - workCarouselBoundingClientRect.x;

	// console.log("( " + x + ", " + y + " )")
	if (x <= workCarouselBoundingClientRect.width * activeRegionRatio) {
		carouselScrollDirection = "left";
		strength =
			(workCarouselBoundingClientRect.width * activeRegionRatio - x) /
			(workCarouselBoundingClientRect.width * activeRegionRatio);
		carouselScrollStrength = strength;
		handleCarouselScroll();
	} else if (
		x >=
		workCarouselBoundingClientRect.width * (1 - activeRegionRatio)
	) {
		strength =
			(x - workCarouselBoundingClientRect.width * (1 - activeRegionRatio)) /
			(workCarouselBoundingClientRect.width * activeRegionRatio);
		carouselScrollStrength = strength;
		carouselScrollDirection = "right";
		handleCarouselScroll();
	} else {
		carouselScrollDirection = "";
		carouselScrollTimer = clearInterval(carouselScrollTimer);
	}
}

function handleCarouselScroll() {
	// console.log("handling Carousel Scroll()");
	if (carouselScrollTimer == undefined) {
		carouselScrollTimer = setInterval(() => {
			scrollCarousel();
		}, 8);
		// console.log("Set timer: " + String(carouselScrollTimer));
	}
}

function scrollCarousel() {
	const c = 5;
	const cap = 10;
	switch (carouselScrollDirection) {
		case "left":
			workCarousel.scrollBy(
				-1 * Math.min(Math.max(c * convertStrength(strength), 1), cap),
				0
			);
			console.log("Scrolling left " + String(convertStrength(strength)));
			break;
		case "right":
			workCarousel.scrollBy(
				1 * Math.min(Math.max(c * convertStrength(strength), 1), cap),
				0
			);
			console.log("Scrolling right " + String(convertStrength(strength)));
			break;

		default:
			carouselScrollTimer = clearInterval(carouselScrollTimer);
	}
}

function getViewportType() {
	if (window.innerWidth <= cellularMaxWidth) {
		return "cellular";
	} else if (window.innerWidth <= tabletMaxWidth) {
		return "tablet";
	} else {
		return "desktop";
	}
}

function convertStrength(x) {
	//  console.log(x)
	return x * Math.sqrt(x);
}
