// Theme switcher function
function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  const theme = storedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(theme);
}

function applyTheme(theme) {
  // Set the data attribute on HTML element
  document.documentElement.setAttribute('data-theme', theme);
  
  // Toggle dark-mode class on body
  document.body.classList.toggle('dark-mode', theme === 'dark');

  // Update icon
  const themeIcon = document.querySelector('.theme-toggle i');
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Store theme preference
  localStorage.setItem('theme', theme);
  
  // Add transition class for smooth animation
  document.body.classList.add('theme-transition');
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 1000);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}

function typeText(element, speed = 'medium') {
    // Store original text
    const originalText = element.textContent;
    // Just display text normally without typing animation for Hindi content
    element.innerHTML = originalText;
    element.classList.add('visible');
    element.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Remove the typing animation for Hindi text
    // paragraphs.forEach((p, index) => {
    //     setTimeout(() => {
    //         typeText(p, 'medium');
    //     }, delay);
    //     delay += 4000; // Wait for previous paragraph to finish
    // });

    // Setup writing animation observer
    setupAnimationObserver();
    
    // Track active pencil for scroll updates
    window.activePencil = null;
    window.activeElement = null;
    window.charCount = 0;
    
    // Update pencil position on scroll
    window.addEventListener('scroll', function() {
        if (window.activePencil && window.activeElement && window.charCount > 0) {
            updatePencilPosition(window.activeElement, window.activePencil, window.charCount);
        }
    });
    
    // Update pencil position on window resize
    window.addEventListener('resize', function() {
        if (window.activePencil && window.activeElement && window.charCount > 0) {
            updatePencilPosition(window.activeElement, window.activePencil, window.charCount);
        }
    });

  // Smooth scroll to committee section
  const committeeLink = document.querySelector('a[href="#committee"]');
    if (committeeLink) {
  committeeLink.addEventListener('click', (e) => {
    e.preventDefault();
    const committeeSection = document.querySelector('.committee-section');
    committeeSection.scrollIntoView({ behavior: 'smooth' });
  });
    }

  // Mobile menu functionality
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');

  mobileNavToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
  });

  // Slider functionality
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const dotsContainer = document.querySelector('.slider-dots');

  let currentSlide = 0;
  let startX;
  let moveX;
  let autoSlideInterval;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
  }

  // Touch events
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(autoSlideInterval);
  });

  slider.addEventListener('touchmove', (e) => {
    moveX = e.touches[0].clientX;
    const diff = moveX - startX;
    slider.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
  });

  slider.addEventListener('touchend', (e) => {
    const diff = moveX - startX;
    if (Math.abs(diff) > 100) {
      if (diff > 0) prevSlide();
      else nextSlide();
    }
    goToSlide(currentSlide);
    startAutoSlide();
  });

  // Button controls
  prevBtn.addEventListener('click', () => {
    prevSlide();
    clearInterval(autoSlideInterval);
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    clearInterval(autoSlideInterval);
    startAutoSlide();
  });

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  startAutoSlide();
});

// Function to setup Intersection Observer for animations
function setupAnimationObserver() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const animationElements = document.querySelectorAll('.animation-container');
        
        // Stagger the animation start times to create a sequence effect
        let animationDelay = 0;
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If element is in view
                if (entry.isIntersecting) {
                    // Get the elements
                    const writingEl = entry.target.querySelector('.writing-animation');
                    const writingEl2 = entry.target.querySelector('.writing-animation-part2');
                    
                    if (writingEl) {
                        // Set a staggered delay for each animation container
                        setTimeout(() => {
                            // Handle case with second part
                            if (writingEl2) {
                                animateTextElement(writingEl, () => {
                                    // When first part is done, animate second part if exists
                                    setTimeout(() => {
                                        writingEl.style.borderRight = 'none';
                                        writingEl2.style.display = 'inline-block'; // First make it visible
                                        setTimeout(() => {
                                            writingEl2.style.opacity = '1'; // Then fade it in
                                            animateTextElement(writingEl2);
                                        }, 50);
                                    }, 200);
                                });
                            } else {
                                // Just animate the single element
                                animateTextElement(writingEl);
                            }
                        }, animationDelay);
                        
                        // Increase delay for next animation container
                        animationDelay += 800; // Stagger animations by 800ms
                    }
                    
                    // Unobserve after animation triggered
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when at least 10% of the element is visible
        });
        
        // Observe each animation container
        animationElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
}

// Function to animate a text element word by word
function animateTextElement(element, callback) {
    // Get the text and split into words
    const text = element.getAttribute('data-text') || element.textContent;
    const words = text.split(' ');
    
    // Detect if mobile
    const isMobile = window.innerWidth <= 768;
    
    // Clear the element content
    element.textContent = '';
    element.style.animation = 'none';
    element.style.borderRight = 'none';
    
    // Create pencil cursor - use an image for better visibility
    const pencil = document.createElement('div');
    pencil.className = 'pencil-cursor';
    pencil.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    document.body.appendChild(pencil);
    
    // Adjust animation speed for mobile
    const charSpeed = isMobile ? 40 : 30; // Slightly slower on mobile
    const wordSpeed = isMobile ? 100 : 80; // Slightly slower on mobile
    
    // Text alignment - center on mobile, default on desktop
    if (isMobile) {
        element.style.textAlign = 'left';
    } else {
        element.style.textAlign = ''; // Default alignment for desktop
    }
    
    // Get element position
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight) || 24;
    
    // Position the pencil at the start immediately (before animation begins)
    // Store references to be used by event listeners
    window.activePencil = pencil;
    window.activeElement = element;
    window.charCount = 0;
    
    // Initialize pencil position before animation starts
    if (isMobile) {
        // Mobile - position below the text at the left edge
        pencil.style.position = 'absolute';
        pencil.style.left = `${rect.left + scrollX}px`;
        pencil.style.top = `${rect.top + scrollY + lineHeight}px`; // Position below the first line
        pencil.style.transform = 'rotate(45deg)'; // Rotation for mobile
        pencil.style.fontSize = '20px';
    } else {
        // Desktop - position at the beginning of the text (to the left)
        pencil.style.position = 'absolute';
        pencil.style.left = `${rect.left + scrollX - 5}px`;
        pencil.style.top = `${rect.top + scrollY - 5}px`;
        pencil.style.transform = 'rotate(120deg)'; // Original desktop rotation
        pencil.style.fontSize = '22px';
    }
    
    // Common pencil styles
    pencil.style.color = '#1a237e';
    pencil.style.display = 'block';
    pencil.style.zIndex = '99999';
    pencil.style.filter = 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))';
    
    // Prepare for word animation
    let wordIndex = 0;
    let totalCharCount = 0;
    
    // Word by word animation function - in normal order for all devices
    const animateNextWord = () => {
        if (wordIndex < words.length) {
            const currentWord = words[wordIndex];
            
            // Create span for the current word
            const wordSpan = document.createElement('span');
            wordSpan.textContent = currentWord + (wordIndex < words.length - 1 ? ' ' : '');
            wordSpan.style.opacity = '0';
            
            // Append word to element
            element.appendChild(wordSpan);
            
            // Animate the word appearance
            let charIndex = 0;
            const chars = wordSpan.textContent.split('');
            wordSpan.textContent = '';
            
            // Letter by letter animation
            const typeChar = () => {
                if (charIndex < chars.length) {
                    // Normal LTR, append each character
                    wordSpan.textContent += chars[charIndex];
                    
                    wordSpan.style.opacity = '1';
                    
                    // Update pencil position and store references for scroll updates
                    window.activePencil = pencil;
                    window.activeElement = element;
                    window.charCount = totalCharCount + charIndex;
                    updatePencilPosition(element, pencil, totalCharCount + charIndex, false);
                    
                    charIndex++;
                    totalCharCount++;
                    setTimeout(typeChar, charSpeed); // Speed for typing each character
                } else {
                    // Move to next word
                    wordIndex++;
                    setTimeout(animateNextWord, wordSpeed); // Speed for word transition
                }
            };
            
            typeChar();
        } else {
            // Animation completed
            pencil.remove(); // Remove the pencil element completely
            // Clear global references
            window.activePencil = null;
            window.activeElement = null;
            window.charCount = 0;
            
            if (typeof callback === 'function') {
                callback();
            }
        }
    };
    
    // Start the animation
    setTimeout(animateNextWord, 200);
}

// Function to update pencil position
function updatePencilPosition(element, pencil, charCount, isRTL = false) {
    // Get the element's position and scroll offsets
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Detect if mobile device based on screen width
    const isMobile = window.innerWidth <= 768;
    
    // For mobile devices, position pencil below the text
    if (isMobile) {
        // Create a temporary span to measure text width
        const tempSpan = document.createElement('span');
        tempSpan.style.position = 'absolute';
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.style.font = window.getComputedStyle(element).font;
        tempSpan.textContent = element.textContent.substring(0, charCount);
        document.body.appendChild(tempSpan);
        
        // Calculate position
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        // Calculate lineHeight for mobile
        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight) || 24;
        const elementWidth = rect.width;
        
        // Calculate which line we're on based on text width
        const lineCount = Math.floor(textWidth / elementWidth);
        let leftOffset, topOffset;
        
        // Calculate positions for mobile
        if (lineCount > 0) {
            // We've wrapped to a new line
            const remainingWidth = textWidth % elementWidth;
            leftOffset = rect.left + scrollX + remainingWidth;
            // Place pencil below the text
            topOffset = rect.top + scrollY + (lineCount * lineHeight) + lineHeight;
        } else {
            // Still on first line
            leftOffset = rect.left + scrollX + textWidth;
            // Place pencil below the text
            topOffset = rect.top + scrollY + lineHeight;
        }
        
        // Set the pencil position for mobile
        pencil.style.position = 'absolute';
        pencil.style.left = `${leftOffset}px`;
        pencil.style.top = `${topOffset}px`;
        pencil.style.right = 'auto';
        pencil.style.bottom = 'auto';
        // Adjust rotation for a pencil that appears below text (point upward)
        pencil.style.transform = 'rotate(45deg)';
        pencil.style.color = '#1a237e';
        pencil.style.fontSize = '20px';
        pencil.style.display = 'block';
        pencil.style.zIndex = '99999';
        pencil.style.pointerEvents = 'none';
        pencil.style.transition = 'left 0.05s ease-out, top 0.1s ease-out';
        pencil.style.filter = 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))';
        return;
    }
    
    // Desktop version - original behavior
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.position = 'absolute';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.style.font = window.getComputedStyle(element).font;
    tempSpan.textContent = element.textContent.substring(0, charCount);
    document.body.appendChild(tempSpan);
    
    // Calculate position
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);
    
    // Desktop positioning - to the right of the text
    let leftOffset = rect.left + textWidth + scrollX + 5;
    const verticalVariation = Math.sin(charCount * 0.5) * 3;
    let topOffset = rect.top + scrollY - 5 + verticalVariation;
    
    // Apply styles to the pencil for desktop
    pencil.style.position = 'absolute';
    pencil.style.left = `${leftOffset}px`;
    pencil.style.right = 'auto';
    pencil.style.top = `${topOffset}px`;
    pencil.style.color = '#1a237e';
    pencil.style.fontSize = '22px';
    pencil.style.display = 'block';
    pencil.style.zIndex = '99999';
    pencil.style.pointerEvents = 'none';
    pencil.style.transition = 'left 0.05s ease-out, top 0.1s ease-out';
    pencil.style.filter = 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))';
    pencil.style.transform = 'rotate(120deg)'; // Original desktop rotation
}

// Contact form popup functions
function openContactPopup() {
    const popup = document.getElementById('contactPopup');
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeContactPopup() {
    const popup = document.getElementById('contactPopup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const message = document.getElementById('message').value;

    // Basic form validation
    if (!name || !mobile || !message) {
        alert('कृपया सभी आवश्यक फ़ील्ड भरें');
        return;
    }
    
    // Mobile number validation (10 digits)
    if (!/^[0-9]{10}$/.test(mobile)) {
        alert('कृपया सही मोबाइल नंबर दर्ज करें');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', { name, mobile, message });
    
    // Show success message
    alert('आपका संदेश सफलतापूर्वक भेज दिया गया है');

    // Clear form and close popup
    document.getElementById('contactForm').reset();
    closeContactPopup();
}

// Close popup when clicking outside
window.addEventListener('click', (event) => {
    const popup = document.getElementById('contactPopup');
    if (event.target === popup) {
        closeContactPopup();
    }
});