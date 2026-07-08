/**
 * Smile Solutions Multi Speciality Dental Clinic Dr RAMYA - Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================
  // 1. STICKY NAVBAR & BACK-TO-TOP BUTTON
  // ==========================================
  const navbar = document.getElementById('navbar');
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    // Navbar styling on scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to Top visibility
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  // Smooth scroll to top
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // ==========================================
  // 2. MOBILE MENU TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Tap outside mobile menu to close it
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      toggleMobileMenu();
    }
  });


  // ==========================================
  // 3. ACTIVE MENU LINK HIGHLIGHTING (Intersection Observer)
  // ==========================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserverOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Triggers when section is centered in viewport
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));


  // ==========================================
  // 4. SCROLL ANIMATIONS (Fade-in on scroll)
  // ==========================================
  const animatedElements = document.querySelectorAll('.animate-scroll');
  
  const scrollObserverOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Start animation slightly before element enters viewport
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        scrollObserver.unobserve(entry.target); // Animate only once
      }
    });
  }, scrollObserverOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));


  // ==========================================
  // 5. APPOINTMENT FORM SIMULATION
  // ==========================================
  const appointmentForm = document.getElementById('appointment-form');
  const formSuccess = document.getElementById('form-success');

  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animate submit button
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i data-lucide="loader-2" class="animate-spin"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Simulate network delay
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      
      // Show success message and clear form
      formSuccess.classList.add('active');
      appointmentForm.reset();
      
      // Scroll success message into view
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Hide success message after 8 seconds
      setTimeout(() => {
        formSuccess.classList.remove('active');
      }, 8000);
    }, 1500);
  });


  // ==========================================
  // 6. CUSTOM BEFORE & AFTER COMPARISON SLIDER
  // ==========================================
  const sliders = document.querySelectorAll('.comparison-slider');
  const dragHint = document.querySelector('.drag-hint');

  // Fade out the drag hint overlay upon first interaction
  const fadeHint = () => {
    if (dragHint && !dragHint.classList.contains('fade-out')) {
      dragHint.classList.add('fade-out');
      setTimeout(() => dragHint.remove(), 500);
    }
  };

  // Auto-fade hint after 5 seconds if no interaction occurs
  setTimeout(fadeHint, 5000);

  // Main slider updater function
  const updateSliderPosition = (slider, percentage) => {
    const afterImg = slider.querySelector('.after-image');
    const divider = slider.querySelector('.slider-divider');
    const beforeBadge = slider.querySelector('.badge-before');
    const afterBadge = slider.querySelector('.badge-after');

    // Update clipping path (vertical crop)
    // clip-path: inset(top right bottom left) -> inset(y% 0 0 0)
    afterImg.style.clipPath = `inset(${percentage}% 0 0 0)`;
    
    // Update divider top position
    divider.style.top = `${percentage}%`;
    divider.setAttribute('aria-valuenow', Math.round(percentage));

    // Dynamic Badge Fading based on handle proximity
    // Fade out top badge as handle goes near top (percentage < 15)
    if (beforeBadge) {
      if (percentage < 15) {
        beforeBadge.style.opacity = (percentage / 15).toFixed(2);
      } else {
        beforeBadge.style.opacity = '1';
      }
    }

    // Fade out bottom badge as handle goes near bottom (percentage > 85)
    if (afterBadge) {
      if (percentage > 85) {
        afterBadge.style.opacity = ((100 - percentage) / 15).toFixed(2);
      } else {
        afterBadge.style.opacity = '1';
      }
    }
  };

  // Initialize and bind events to each slider
  sliders.forEach(slider => {
    const divider = slider.querySelector('.slider-divider');
    const handle = slider.querySelector('.slider-handle');
    
    // Set initial middle state (50%)
    updateSliderPosition(slider, 50);

    // Mouse & Touch interaction via PointerEvents API
    let isDragging = false;

    const startDrag = (e) => {
      // Only start drag if originating on handle or inside it
      if (e.target !== handle && !handle.contains(e.target)) return;
      
      isDragging = true;
      slider.classList.add('dragging');
      fadeHint();
      
      // Capture pointer events to ensure smooth dragging even if finger leaves handle area
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (err) {
        console.warn("Failed to set pointer capture:", err);
      }
      
      // Listen to capture events on the handle element
      handle.addEventListener('pointermove', performDrag);
      handle.addEventListener('pointerup', endDrag);
      handle.addEventListener('pointercancel', endDrag);
      
      // Update position on initial click
      performDrag(e);
    };

    const performDrag = (e) => {
      if (!isDragging) return;
      
      // Prevent browser's native touch gestures (scrolling) during active dragging
      if (e.cancelable) {
        e.preventDefault();
      }
      
      const rect = slider.getBoundingClientRect();
      const clientY = e.clientY;
      
      // Calculate vertical offset percentage relative to slider box
      let percentage = ((clientY - rect.top) / rect.height) * 100;
      
      // Constrain within bounds (0% to 100%)
      percentage = Math.max(0, Math.min(100, percentage));
      
      updateSliderPosition(slider, percentage);
    };

    const endDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        slider.classList.remove('dragging');
        
        try {
          handle.releasePointerCapture(e.pointerId);
        } catch (err) {}
        
        handle.removeEventListener('pointermove', performDrag);
        handle.removeEventListener('pointerup', endDrag);
        handle.removeEventListener('pointercancel', endDrag);
      }
    };

    // Listen on handle for drag interactions
    handle.addEventListener('pointerdown', startDrag);

    // Keyboard Arrow Accessibility support
    divider.addEventListener('keydown', (e) => {
      fadeHint();
      let currentVal = parseFloat(divider.getAttribute('aria-valuenow')) || 50;
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        let newVal = Math.max(0, currentVal - 5);
        updateSliderPosition(slider, newVal);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        let newVal = Math.min(100, currentVal + 5);
        updateSliderPosition(slider, newVal);
      }
    });
  });

});
