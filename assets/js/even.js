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
            backToTop.style.display = 'grid';
            setTimeout(function () {
                backToTop.style.opacity = targetOpacity;
            }, 1);
            setTimeout(function () {
                backToTop.style.display = isFadeIn ? 'grid' : 'none';
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

