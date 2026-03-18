/*
 * Portfolio interaction script
 *
 * Handles mobile navigation toggling, sticky header behaviour, active navigation
 * highlighting, section reveal animations via IntersectionObserver, rotating
 * typing effect for roles and a simple mailto contact form fallback.
 */

// Cache DOM elements
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');
const typingElement = document.getElementById('typing-text');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Toggle mobile navigation on click
if (menuIcon && navbar) {
  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
  });
}

// Handle scroll events for sticky header and active nav links
window.addEventListener('scroll', () => {
  // Sticky header
  if (header) {
    header.classList.toggle('sticky', window.scrollY > 60);
  }
  // Determine current section
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  // Highlight the active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (current && link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
  // Close mobile menu on scroll
  if (menuIcon && navbar) {
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
  }
});

// IntersectionObserver for reveal animations (only for users that don't prefer reduced motion)
const revealElements = document.querySelectorAll('.section-reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.12
});
revealElements.forEach(el => revealObserver.observe(el));

// Typing effect rotating through roles
const roles = [
  'Software Engineer',
  'Java Full‑Stack Developer',
  'Cloud & Microservices Engineer',
  'React / Spring Boot Developer'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingElement) return;
  const currentRole = roles[roleIndex];
  if (!isDeleting) {
    typingElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1200);
      return;
    }
  } else {
    typingElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 90);
}

window.addEventListener('load', typeEffect);

// Contact form handler: opens default mail client for users of static hosting
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';
    const mailSubject = encodeURIComponent(`Portfolio Contact | ${subject}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    // Compose a mailto link
    window.location.href = `mailto:pscr.lm0428@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    if (formStatus) {
      formStatus.textContent = 'Your email client has been opened. Please send the message from there.';
    }
    contactForm.reset();
  });
}