// we grab our header and our desktop header
// we insert the contents of our header into the desktop one
const header = document.querySelector('.header');
const desktopHeader = document.querySelector('.header-desktop');
desktopHeader.innerHTML = header.innerHTML;

function setCurrentDate() {
  // Create a new Date instance
  const currentDate = new Date();
  const elts = document.querySelectorAll('.today');

  // Define months array
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get the day, month, and year
  const day = currentDate.getDate();
  const monthName = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Format the date string
  const formattedDate = `${day} ${monthName}, ${year}`;

  elts.forEach(item => {
    item.textContent = formattedDate;
  });

  console.log(formattedDate); // Output: "22 September, 2021"
}

setCurrentDate();

// 1. when the .header enters the viewport, hide the desktop header (removing the visible class)
// 2. when the header leaves, show it (by adding the visible class)
inView('.header')
  .on('enter', el => desktopHeader.classList.remove('visible'))
  .on('exit', el => desktopHeader.classList.add('visible'));

// here we enable the tilt libary on all our images
VanillaTilt.init(document.querySelectorAll('.image'), {
  max: 25,
  speed: 400,
});

// here we grab all our images we want to fade in
// we add the visible class which toggles the opacity
inView('.fade')
  .on('enter', img => img.classList.add('visible'))
  .on('exit', img => img.classList.remove('visible'));

// 1. when we click the .register-button, run a function
// 2. grab the .front element and add a class of .slide-up
const registerButton = document.querySelector('.register-button');
registerButton.addEventListener('click', event => {
  // stops any default actions from happening
  event.preventDefault();
  const frontEl = document.querySelector('.front');
  frontEl.classList.add('slide-up');
});
