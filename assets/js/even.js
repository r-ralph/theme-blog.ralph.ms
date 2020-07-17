'use strict';

const Even = {};

Even.backToTop = function () {
    const backToTop = document.getElementById('back-to-top');
    backToTop.style.opacity = "0"
    let isAnimating = false;
    let visibleBackToTopNow = false;

    function fade(isFadeIn) {
        visibleBackToTopNow = isFadeIn;
        if (isAnimating) {
            return;
        }
        const targetOpacity = isFadeIn ? '1' : '0';
        const originalOpacity = isFadeIn ? '0' : '1';
        if (backToTop.style.opacity !== targetOpacity) {
            isAnimating = true;
            backToTop.style.opacity = originalOpacity;
            backToTop.style.transition = 'opacity 1000ms';
            backToTop.style.display = 'block';
            setTimeout(function () {
                backToTop.style.opacity = targetOpacity;
            }, 1);
            setTimeout(function () {
                backToTop.style.display = isFadeIn ? 'block' : 'none';
                backToTop.style.transition = '';
                isAnimating = false;
                if (visibleBackToTopNow !== isFadeIn) {
                    fade(visibleBackToTopNow);
                }
            }, 1010);
        }
    }

    window.addEventListener('scroll', function () {
        if (document.scrollingElement.scrollTop > 100) {
            fade(true);
        } else {
            fade(false);
        }
    });

    backToTop.addEventListener('click', function () {
        document.body.scrollIntoView({behavior: 'smooth'});
    })
};

Even.mobileNavbar = function () {
    const mobileNav = document.getElementById('mobile-navbar');
    const mobileNavIcon = document.getElementsByClassName('mobile-navbar-icon')[0];
    const slideout = new Slideout({
        'panel': document.getElementById('mobile-panel'),
        'menu': document.getElementById('mobile-menu'),
        'padding': 180,
        'tolerance': 70,
    });
    slideout.disableTouch();

    mobileNavIcon.addEventListener('click', function () {
        slideout.toggle();
    });

    slideout.on('beforeopen', function () {
        mobileNav.classList.add('fixed-open');
        mobileNavIcon.classList.add('icon-click');
        mobileNavIcon.classList.remove('icon-out');
    });

    slideout.on('beforeclose', function () {
        mobileNav.classList.remove('fixed-open');
        mobileNavIcon.classList.remove('icon-click');
        mobileNavIcon.classList.add('icon-out');
    });

    document.getElementById('mobile-panel').addEventListener('touchend', function () {
        if (slideout.isOpen()) {
            slideout.toggle();
        }
    });
};

Even.chroma = function() {
  const blocks = document.querySelectorAll('.highlight > .chroma');
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const afterHighLight = block.querySelector('pre.chroma > code[data-lang]');
    const lang = afterHighLight ? afterHighLight.className : '';
    block.className += ' ' + lang;
  }
};

Even.responsiveTable = function() {
  const tables = document.querySelectorAll('.post-content table:not(.lntable)');
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    table.parentElement.replaceChild(wrapper, table);
    wrapper.appendChild(table);
  }
};

