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

Even.mobileNavbar = function() {
  const $mobileNav = $('#mobile-navbar');
  const $mobileNavIcon = $('.mobile-navbar-icon');
  const slideout = new Slideout({
    'panel': document.getElementById('mobile-panel'),
    'menu': document.getElementById('mobile-menu'),
    'padding': 180,
    'tolerance': 70,
  });
  slideout.disableTouch();

  $mobileNavIcon.click(function() {
    slideout.toggle();
  });

  slideout.on('beforeopen', function() {
    $mobileNav.addClass('fixed-open');
    $mobileNavIcon.addClass('icon-click').removeClass('icon-out');
  });

  slideout.on('beforeclose', function() {
    $mobileNav.removeClass('fixed-open');
    $mobileNavIcon.addClass('icon-out').removeClass('icon-click');
  });

  $('#mobile-panel').on('touchend', function() {
    slideout.isOpen() && $mobileNavIcon.click();
  });
};

Even._initToc = function() {
  const SPACING = 20;
  const $toc = $('.post-toc');
  const $footer = $('.post-footer');

  if ($toc.length) {
    const minScrollTop = $toc.offset().top - SPACING;
    const maxScrollTop = $footer.offset().top - $toc.height() - SPACING;

    const tocState = {
      start: {
        'position': 'absolute',
        'top': minScrollTop,
      },
      process: {
        'position': 'fixed',
        'top': SPACING,
      },
      end: {
        'position': 'absolute',
        'top': maxScrollTop,
      },
    };

    $(window).scroll(function() {
      const scrollTop = $(window).scrollTop();

      if (scrollTop < minScrollTop) {
        $toc.css(tocState.start);
      } else if (scrollTop > maxScrollTop) {
        $toc.css(tocState.end);
      } else {
        $toc.css(tocState.process);
      }
    });
  }

  const HEADERFIX = 30;
  const $toclink = $('.toc-link');
  const $headerlink = $('.headerlink');
  const $tocLinkLis = $('.post-toc-content li');

  const headerlinkTop = $.map($headerlink, function(link) {
    return $(link).offset().top;
  });

  const headerLinksOffsetForSearch = $.map(headerlinkTop, function(offset) {
    return offset - HEADERFIX;
  });

  const searchActiveTocIndex = function(array, target) {
    for (let i = 0; i < array.length - 1; i++) {
      if (target > array[i] && target <= array[i + 1]) return i;
    }
    if (target > array[array.length - 1]) return array.length - 1;
    return -1;
  };

  $(window).scroll(function() {
    const scrollTop = $(window).scrollTop();
    const activeTocIndex = searchActiveTocIndex(headerLinksOffsetForSearch, scrollTop);

    $($toclink).removeClass('active');
    $($tocLinkLis).removeClass('has-active');

    if (activeTocIndex !== -1) {
      $($toclink[activeTocIndex]).addClass('active');
      let ancestor = $toclink[activeTocIndex].parentNode;
      while (ancestor.tagName !== 'NAV') {
        $(ancestor).addClass('has-active');
        ancestor = ancestor.parentNode.parentNode;
      }
    }
  });
};

Even.fancybox = function() {
  if ($.fancybox) {
    $('.post-content').each(function() {
      $(this).find('img').each(function() {
        $(this).wrap(`<a class="fancybox" href="${this.src}" data-fancybox="gallery" data-caption="${this.title}"></a>`);
      });
    });

    $('.fancybox').fancybox({
      selector: '.fancybox',
      protect: true,
    });
  }
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

Even.toc = function() {
  const tocContainer = document.getElementById('post-toc');
  if (tocContainer !== null) {
    const toc = document.getElementById('TableOfContents');
    if (toc === null) {
      // toc = true, but there are no headings
      tocContainer.parentNode.removeChild(tocContainer);
    } else {
      this._refactorToc(toc);
      this._linkToc();
      this._initToc();
    }
  }
};

Even._refactorToc = function(toc) {
  // when headings do not start with `h1`
  const oldTocList = toc.children[0];
  let newTocList = oldTocList;
  let temp;
  while (newTocList.children.length === 1
      && (temp = newTocList.children[0].children[0]).tagName === 'UL') {
    newTocList = temp;
  }

  if (newTocList !== oldTocList) toc.replaceChild(newTocList, oldTocList);
};

Even._linkToc = function() {
  const links = document.querySelectorAll('#TableOfContents a:first-child');
  for (let i = 0; i < links.length; i++) links[i].className += ' toc-link';

  for (let num = 1; num <= 6; num++) {
    const headers = document.querySelectorAll('.post-content>h' + num);
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      header.innerHTML = `<a href="#${header.id}" class="headerlink anchor"><i class="iconfont icon-link"></i></a>${header.innerHTML}`;
    }
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

