/* ================================================================
   리틀스텝 – 유치원·어린이집 전문 미디어 서비스 홈페이지
   main.js  |  Vanilla JS only
   ================================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. 히어로 이미지 슬라이더
     ────────────────────────────────────────────── */
  function initHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var indicators = document.querySelector('.hero-indicators');
    if (!slides.length || !indicators) return;

    var current = 0;
    var total = slides.length;
    var interval = null;
    var DELAY = 5000;

    // 인디케이터 동적 생성
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', '슬라이드 ' + (i + 1));
      dot.dataset.index = i;
      indicators.appendChild(dot);
    }

    var dots = indicators.querySelectorAll('.hero-dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + total) % total;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoplay() {
      if (interval) return;
      interval = setInterval(next, DELAY);
    }

    function stopAutoplay() {
      clearInterval(interval);
      interval = null;
    }

    // 인디케이터 클릭
    indicators.addEventListener('click', function (e) {
      var btn = e.target.closest('.hero-dot');
      if (!btn) return;
      goTo(Number(btn.dataset.index));
      stopAutoplay();
      startAutoplay();
    });

    // 마우스 hover 시 자동재생 일시정지
    var slider = document.querySelector('.hero-slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  /* ──────────────────────────────────────────────
     2. WORKS 카테고리 필터  &  3. WORKS 더보기
     ────────────────────────────────────────────── */
  var ITEMS_PER_PAGE = 12;
  var visibleCount = ITEMS_PER_PAGE;
  var currentFilter = 'all';

  function applyFilter() {
    var items = document.querySelectorAll('.work-item');
    var moreBtn = document.querySelector('.works-more-btn');
    var matched = [];
    var shown = 0;

    // 매칭 아이템 수집
    items.forEach(function (item) {
      if (currentFilter === 'all' || item.dataset.category === currentFilter) {
        matched.push(item);
      }
    });

    // 표시/숨김 처리
    items.forEach(function (item) {
      var isMatch = currentFilter === 'all' || item.dataset.category === currentFilter;

      if (isMatch && shown < visibleCount) {
        item.style.display = '';
        setTimeout(function () {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, shown * 30);
        shown++;
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.display = 'none';
      }
    });

    // 더보기 버튼 표시/숨김
    if (moreBtn) {
      moreBtn.style.display = visibleCount >= matched.length ? 'none' : '';
    }
  }

  function initWorksFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.dataset.filter;
        if (filter === currentFilter) return;
        currentFilter = filter;

        // 활성 탭 토글
        buttons.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // 더보기 상태 리셋
        visibleCount = ITEMS_PER_PAGE;
        applyFilter();
      });
    });
  }

  function initWorksMore() {
    var moreBtn = document.querySelector('.works-more-btn');
    if (!moreBtn) return;

    moreBtn.addEventListener('click', function () {
      visibleCount += ITEMS_PER_PAGE;
      applyFilter();
    });

    // 초기 적용
    applyFilter();
  }

  /* ──────────────────────────────────────────────
     4. 카운터 애니메이션
     ────────────────────────────────────────────── */
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    var duration = 2000;
    var start = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var current = Math.round(easeOutCubic(progress) * target);
      el.textContent = current.toLocaleString('ko-KR');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('ko-KR');
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ──────────────────────────────────────────────
     5. 모바일 메뉴 토글
     ────────────────────────────────────────────── */
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // 메뉴 안 링크 클릭 시 자동 닫힘
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ──────────────────────────────────────────────
     6. 부드러운 앵커 스크롤
     ────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (history.replaceState) {
        history.replaceState(null, '', hash);
      }
    });
  }

  /* ──────────────────────────────────────────────
     INIT
     ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initWorksFilter();
    initWorksMore();
    initCounters();
    initMobileMenu();
    initSmoothScroll();
  });
})();
