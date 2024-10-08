/*============ cursor follower ============*/

// Select the circle element
const circleElement = document.querySelector('.cursor-follower');

// Create objects to track mouse position and custom cursor position
const mouse = { x: 0, y: 0 }; // Track current mouse position
const previousMouse = { x: 0, y: 0 } // Store the previous mouse position
const circle = { x: 0, y: 0 }; // Track the circle position

// Initialize variables to track scaling and rotation
let currentScale = 0; // Track current scale value
let currentAngle = 0; // Track current angle value

// Update mouse position on the 'mousemove' event
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Smoothing factor for cursor movement speed (0 = smoother, 1 = instant)
const speed = 0.17;

// Start animation
const tick = () => {
  // MOVE
  // Calculate circle movement based on mouse position and smoothing
  circle.x += (mouse.x - circle.x) * speed;
  circle.y += (mouse.y - circle.y) * speed;
  // Create a transformation string for cursor translation
  const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

  // SQUEEZE
  // 1. Calculate the change in mouse position (deltaMouse)
  const deltaMouseX = mouse.x - previousMouse.x;
  const deltaMouseY = mouse.y - previousMouse.y;
  // Update previous mouse position for the next frame
  previousMouse.x = mouse.x;
  previousMouse.y = mouse.y;
  // 2. Calculate mouse velocity using Pythagorean theorem and adjust speed
  const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150); 
  // 3. Convert mouse velocity to a value in the range [0, 0.5]
  const scaleValue = (mouseVelocity / 150) * 0.5;
  // 4. Smoothly update the current scale
  currentScale += (scaleValue - currentScale) * speed;
  // 5. Create a transformation string for scaling
  const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

  // ROTATE
  // 1. Calculate the angle using the atan2 function
  const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
  // 2. Check for a threshold to reduce shakiness at low mouse velocity
  if (mouseVelocity > 20) {
    currentAngle = angle;
  }
  // 3. Create a transformation string for rotation
  const rotateTransform = `rotate(${currentAngle}deg)`;

  // Apply all transformations to the circle element in a specific order: translate -> rotate -> scale
  circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

  // Request the next frame to continue the animation
  window.requestAnimationFrame(tick);
}

// Start the animation loop
tick();

/*============ Dark/Light Mode Toggler ============*/
let darkModeIcon = document.querySelector("#darkMode-icon");

// Function to toggle between dark and light mode
function toggleDarkMode(isDark) {
    if (isDark) {
        darkModeIcon.classList.remove("bx-sun");
        document.body.classList.add("dark-mode");
    } else {
        darkModeIcon.classList.add("bx-sun");
        document.body.classList.remove("dark-mode");
    }
}

// Detect initial system preference
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
toggleDarkMode(systemPrefersDark);

// Listen for system preference changes and update theme accordingly
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const isDark = e.matches;
    toggleDarkMode(isDark);
});

// Handle user-initiated toggle
darkModeIcon.onclick = () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    darkModeIcon.classList.toggle("bx-sun", !isDarkMode);
};

/*============ Scroll Reveal ============*/
ScrollReveal({
	reset: true,
	distance: "80px",
	duration: 2000,
	delay: 200,
})

ScrollReveal().reveal('.home-content .heading', { origin: "top" });

let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

/*============ Menu Toggler ============*/
menuIcon.onclick = () => {
	menuIcon.classList.toggle("bx-x");
	navbar.classList.toggle("active");
};

/*============ scroll sections active link ============*/
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
	sections.forEach((sec) => {
		let top = window.scrollY;
		let offset = sec.offsetTop - 150;
		let height = sec.offsetHeight;
		let id = sec.getAttribute("id");

		if (top >= offset && top < offset + height) {
			navLinks.forEach((links) => {
				links.classList.remove("active");
				document
					.querySelector("header nav a[href*=" + id + "]")
					.classList.add("active");
			});
		}
	});

	/*============ sticky navbar ============*/
	let header = document.querySelector(".header");
	header.classList.toggle("sticky", window.scrollY > 100);

	/*============ remove menu icon navbar when click navbar link (scroll) ============*/
	menuIcon.classList.remove("bx-x");
	navbar.classList.remove("active");
};

// Skills Carousel script
// Slider(all Slides in a container)
const slider = document.querySelector(".slider");
// All trails
const trail = document.querySelector(".trail").querySelectorAll("div");

// Transform value
let value = 0;
// trail index number
let trailValue = 0;
// interval (Duration)
let interval = 5000;

// Function to slide forward
const slide = (condition) => {
	// CLear interval
	clearInterval(start);
	// update value and trailValue
	condition === "increase" ? initiateINC() : initiateDEC();
	// move slide
	move(value, trailValue);
	// Restart Animation
	animate();
	// start interal for slides back
	start = setInterval(() => slide("increase"), interval);
};

// function for increase(forward, next) configuration
const initiateINC = () => {
	// Remove active from all trails
	trail.forEach((cur) => cur.classList.remove("active"));
	// increase transform value
	value === 75 ? (value = 0) : (value += 25);
	// update trailValue based on value
	trailUpdate();
};

// function for decrease(backward, previous) configuration
const initiateDEC = () => {
	// Remove active from all trails
	trail.forEach((cur) => cur.classList.remove("active"));
	// decrease transform value
	value === 0 ? (value = 75) : (value -= 25);
	// update trailValue based on value
	trailUpdate();
};

// function to transform slide
const move = (S, T) => {
	// transform slider
	slider.style.transform = `translateX(-${S}%)`;
	//add active class to the current trail
	trail[T].classList.add("active");
};

const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.inOut" } });
tl.from(".bg", { x: "-100%", opacity: 0 })
	.from(".carousel-heading", { opacity: 0, y: "30px" }, "-=0.3")
	.from(".carousel-paragraph", { opacity: 0 }, "-=0.3");
// .from("button", { opacity: 0, y: "-40px" }, "-=0.8");

// function to restart animation
const animate = () => tl.restart();

// function to update trailValue based on slide value
const trailUpdate = () => {
	if (value === 0) {
		trailValue = 0;
	} else if (value === 25) {
		trailValue = 1;
	} else if (value === 50) {
		trailValue = 2;
	} else {
		trailValue = 3;
	}
	// if (value === 0) {
	// 	trailValue = 0;
	// } else if (value === 20) {
	// 	trailValue = 1;
	// } else if (value === 40) {
	// 	trailValue = 2;
	// } else if (value === 60) {
	// 	trailValue = 3;
	// } else {
	// 	trailValue = 4;
	// }
};

// Start interval for slides
let start = setInterval(() => slide("increase"), interval);

// Next  and  Previous button function (SVG icon with different classes)
document.querySelectorAll("svg").forEach((cur) => {
	// Assign function based on the class Name("next" and "prev")
	cur.addEventListener("click", () =>
		cur.classList.contains("next") ? slide("increase") : slide("decrease")
	);
});

// function to slide when trail is clicked
const clickCheck = (e) => {
	// CLear interval
	clearInterval(start);
	// remove active class from all trails
	trail.forEach((cur) => cur.classList.remove("active"));
	// Get selected trail
	const check = e.target;
	// add active class
	check.classList.add("active");

	// Update slide value based on the selected trail
	if (check.classList.contains("box1")) {
		value = 0;
	} else if (check.classList.contains("box2")) {
		value = 25;
	} else if (check.classList.contains("box3")) {
		value = 50;
	} else {
		value = 75;
	}
	// update trail based on value
	trailUpdate();
	// transfrom slide
	move(value, trailValue);
	// start animation
	animate();
	// start interval
	start = setInterval(() => slide("increase"), interval);
};

// Add function to all trails
trail.forEach((cur) => cur.addEventListener("click", (ev) => clickCheck(ev)));

// Mobile touch Slide Section
// const touchSlide = (() => {
// 	let start, move, change, sliderWidth;

// 	// Do this on initial touch on screen
// 	slider.addEventListener("touchstart", (e) => {
// 		// get the touche position of X on the screen
// 		start = e.touches[0].clientX;
// 		// (each slide with) the width of the slider container divided by the number of slides
// 		sliderWidth = slider.clientWidth / trail.length;
// 	});

// 	// Do this on touchDrag on screen
// 	slider.addEventListener("touchmove", (e) => {
// 		// prevent default function
// 		e.preventDefault();
// 		// get the touche position of X on the screen when dragging stops
// 		move = e.touches[0].clientX;
// 		// Subtract initial position from end position and save to change variabla
// 		change = start - move;
// 	});

// 	const mobile = (e) => {
// 		// if change is greater than a quarter of sliderWidth, next else Do NOTHING
// 		change > sliderWidth / 4 ? slide("increase") : null;
// 		// if change * -1 is greater than a quarter of sliderWidth, prev else Do NOTHING
// 		change * -1 > sliderWidth / 4 ? slide("decrease") : null;
// 		// reset all variable to 0
// 		[start, move, change, sliderWidth] = [0, 0, 0, 0];
// 	};
// 	// call mobile on touch end
// 	slider.addEventListener("touchend", mobile);
// })();

// Stop autoscroll when mouse is hovered over the carousel
// slider.addEventListener("mouseover", () => {
// 	clearInterval(start);
// });

// // Restart autoscroll when mouse is no longer hovering over the carousel
// slider.addEventListener("mouseout", () => {
// 	start = setInterval(() => slide("increase"), interval);
// });

// Projects script

document.querySelectorAll(".project").forEach((item) => {
	item.addEventListener("click", (event) => {
		item.classList.toggle("opened");
	});
});

// Contact form script

const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

function sendEmail() {
	const bodyMessage = `
		<h3>Name: ${fullName.value || "Not Available"}<br><br>
		Email: ${email.value || "Not Available"}<br><br>
		Phone: ${phone.value || "Not Available"}<br><br>
		Message: ${message.value || "Not Available"}</h3>
	`;

	Email.send({
		SecureToken: "ef89ab81-3da9-4ba9-9795-c369861d8b3d",
		To: "aaryan2chouksey@gmail.com",
		From: "aaryan2chouksey@gmail.com",
		Subject: subject.value || "No Subject",
		Body: bodyMessage,
	}).then((message) => {
		if (message == "OK") {
			Swal.fire({
				title: "Success!",
				text: "Message sent to Aaryan!",
				icon: "success",
			});
		} else {
			Swal.fire({
				title: "Error!",
				text: "Message not sent! Please try again.",
				icon: "error",
			});
		}
	});
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	sendEmail();
});

/*============ Scroll Reveal ============*/
ScrollReveal({ 
	reset: true,
	distance: "80px",
	duration: 1000,
	delay: 100
});

ScrollReveal().reveal('.home-content, .heading, .about-img, .project-subheading', { origin: "top" });
ScrollReveal().reveal('.home-img img, .contact form', { origin: "bottom" });