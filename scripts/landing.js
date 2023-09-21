'use strict';

// ELEMENTS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
//buttons
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const allButtons = document.getElementsByTagName('button');
const btnLogin = document.querySelector('.login');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
//sections
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
const operations = document.querySelector('.operations');
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
//other
const dotContainer = document.querySelector('.dots');
const lazyIMGS = document.querySelectorAll('.features img');
const message = document.querySelector('.cookie-message');
const navLinks = document.querySelector('.nav__links');
const nav = navLinks.closest('nav');

//-----------------------------------------------------------------------

// REDIRECT -> LOGIN PAGE
console.log(btnLogin);
btnLogin.addEventListener('click', () => {
  const pageURL = 'app.html';
  window.location.replace(pageURL);
});

//-----------------------------------------------------------------------

// CLOSING POPUP //

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//-----------------------------------------------------------------------

// COOKIES //
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());
//-----------------------------------------------------------------------

// PAGE NAVIGATION //
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('redirect')
  ) {
    const sectionID = e.target.getAttribute('href');
    const section = document.querySelector(sectionID);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});
//-----------------------------------------------------------------------

// MENU FADE ANIMATION

function handleHober(e) {
  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    const sibilings = hovered.closest('.nav').querySelectorAll('.nav__link');
    const logo = hovered.closest('.nav').querySelector('img');

    sibilings.forEach(el => {
      if (el !== hovered) {
        el.style.opacity = this;
      }
      if (hovered !== logo) {
        logo.style.opacity = this;
      }
    });
  }
}

nav.addEventListener('mouseover', handleHober.bind(0.5));
nav.addEventListener('mouseout', handleHober.bind(1));
//-----------------------------------------------------------------------

// STICKY NAV BAR

function obsCallback(entries) {
  entries.forEach(entry =>
    entry.isIntersecting
      ? nav.classList.remove('sticky')
      : nav.classList.add('sticky')
  );
}
const navHeight = nav.getBoundingClientRect().height;
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);
//-----------------------------------------------------------------------

// OPERATION SECTION

operations.addEventListener('click', function (e) {
  const clicked = e.target.closest('button');
  if (!clicked) {
    return;
  }
  const tabNumber = clicked.getAttribute('data-tab');
  const clickedContent = this.querySelector(
    `.operations__content--${tabNumber}`
  );
  const activeTab = this.querySelector('.operations__tab--active');
  const activeContent = this.querySelector('.operations__content--active');

  activeTab.classList.remove('operations__tab--active');
  activeContent.classList.remove('operations__content--active');
  clicked.classList.add('operations__tab--active');
  clickedContent.classList.add('operations__content--active');
});
//-----------------------------------------------------------------------

// SLIDES SECTION
function slider() {
  slides.forEach(
    (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
  );

  let currSlide = 0;
  const maxSlide = slides.length;
  createDots();
  activateDot(currSlide);

  function nextSlide() {
    currSlide++;
    if (currSlide > maxSlide - 1) {
      currSlide = 0;
    }
    gotoSlide(currSlide);
  }
  function prevSlide() {
    currSlide--;
    if (currSlide < 0) {
      currSlide = 2;
    }
    gotoSlide(currSlide);
  }
  function gotoSlide(slideIndex) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - slideIndex)}%)`)
    );
    activateDot(slideIndex);
  }

  function activateDot(slideIndex) {
    const dots = dotContainer.querySelectorAll('.dots__dot');
    dots.forEach(dot => {
      if (dot.dataset.slide === `${slideIndex}`) {
        dot.style['background-color'] = 'black';
      } else {
        dot.style['background-color'] = '#b9b9b9';
      }
    });
  }
  function createDots() {
    slides.forEach((_, index) =>
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      )
    );
  }
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = Number(e.target.dataset.slide);
      gotoSlide(slide);
      e.target.style['background-color'] = 'black';
    }
  });
  btnSliderRight.addEventListener('click', nextSlide);

  btnSliderLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
}
slider();
//-----------------------------------------------------------------------

// FADE-IN SECTION ANIMATION

function revealSection(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
}

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const fadeObserver = new IntersectionObserver(revealSection, revealOptions);
allSections.forEach(element => {
  fadeObserver.observe(element);
  element.classList.add('section--hidden');
});
//-----------------------------------------------------------------------

//LAZY LOADING IMGES

function loadIMG(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('lazy-img');
    entry.target.src = entry.target.getAttribute('data-src');
    observer.unobserve(entry.target);
  }
}

const loadOptions = {
  root: null,
  threshold: 0.05,
  rootMargin: '100px',
};

console.log(lazyIMGS);
const imgObserver = new IntersectionObserver(loadIMG, loadOptions);
lazyIMGS.forEach(img => imgObserver.observe(img));

//-----------------------------------------------------------------------

// EVENT BUBBLING
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
