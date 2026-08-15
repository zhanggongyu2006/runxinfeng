/* 新疆润欣丰 · 官网交互脚本 */
(function () {
  "use strict";

  /* ---------- 导航：滚动阴影 + 移动端菜单 ---------- */
  const nav = document.querySelector(".nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
      })
    );
  }

  /* ---------- Hero 轮播 ---------- */
  const heroFrame = document.querySelector(".hero__frame");
  if (heroFrame) {
    const slides = heroFrame.querySelectorAll("img");
    const dotsWrap = heroFrame.querySelector(".hero__dots");
    let cur = 0;
    let timer;
    if (slides.length > 1) {
      slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.setAttribute("aria-label", "第" + (i + 1) + "张");
        if (i === 0) d.classList.add("active");
        d.addEventListener("click", () => go(i));
        dotsWrap.appendChild(d);
      });
      const dots = dotsWrap.querySelectorAll("button");
      function go(i) {
        slides[cur].classList.remove("active");
        dots[cur].classList.remove("active");
        cur = (i + slides.length) % slides.length;
        slides[cur].classList.add("active");
        dots[cur].classList.add("active");
      }
      function auto() { timer = setInterval(() => go(cur + 1), 4500); }
      auto();
      heroFrame.addEventListener("mouseenter", () => clearInterval(timer));
      heroFrame.addEventListener("mouseleave", auto);
    }
  }

  /* ---------- 数字滚动 ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const val = Math.round(target * easeOut(p));
      el.textContent = val.toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- 滚动进入动画 + 计数器触发 ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        if (e.target.hasAttribute("data-count")) runCounter(e.target);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal, [data-count]").forEach((el) => io.observe(el));

  /* ---------- 产品筛选 ---------- */
  const filterWrap = document.querySelector(".filter");
  if (filterWrap) {
    const items = Array.from(document.querySelectorAll(".products > .card"));
    filterWrap.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterWrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        items.forEach((card) => {
          const show = cat === "all" || card.dataset.cat === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- 回到顶部 ---------- */
  const toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener(
      "scroll",
      () => toTop.classList.toggle("show", window.scrollY > 600),
      { passive: true }
    );
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- 联系表单 ---------- */
  const toast = document.getElementById("toast");
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const data = new FormData(form);
      const name = (form.querySelector('[name="name"]') || {}).value || "访客";
      data.append("_subject", "官网留言：" + name + " · " + (data.get("type") || "咨询"));
      if (btn) { btn.disabled = true; btn.textContent = "提交中…"; }
      try {
        const res = await fetch("https://formspree.io/f/myegdeok", {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          showToast("提交成功！我们将在 1 个工作日内与您联系。");
          form.reset();
        } else {
          const err = await res.json().catch(() => ({}));
          const msg = err.errors && err.errors[0] ? err.errors[0].message : "提交失败，请稍后重试";
          showToast(msg);
        }
      } catch (err) {
        showToast("网络异常，提交失败，请直接拨打电话 13565221821");
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = "提交留言 →"; }
      }
    });
  }

  /* ---------- 页脚年份 ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
