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

  /* ---------- 水波背景：鼠标涟漪 + 滚动波纹 + 光晕视差 ---------- */
  (function waterRipple() {
    const aurora = document.querySelector(".aurora");
    if (!aurora) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.createElement("canvas");
    canvas.className = "ripple-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
    aurora.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let W = 0, H = 0;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth = window.innerWidth;
      H = canvas.clientHeight = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const ripples = [];
    let mx = W / 2, my = H / 2;
    let cx = 0, cy = 0;
    let t = 0;

    function addRipple(x, y, s) {
      if (reduced || ripples.length > 70) return;
      ripples.push({
        x, y, r: 3, a: 0.30,
        maxR: 50 + s * 55,
        sp: 1.3 + Math.random() * 1.5,
        gold: Math.random() > 0.45,
        ph: Math.random() * Math.PI * 2,
        wob: 5 + Math.random() * 4
      });
    }

    // 鼠标移动 → 涟漪 + 视差目标
    let lastM = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      const now = performance.now();
      if (!reduced && now - lastM > 80) { lastM = now; addRipple(mx, my, 0.7); }
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (e.touches[0]) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }
      if (!reduced) addRipple(mx, my, 0.5);
    }, { passive: true });

    // 滚动 → 随机波纹
    let lastS = 0;
    window.addEventListener("scroll", () => {
      const now = performance.now();
      if (!reduced && now - lastS > 100) {
        lastS = now;
        addRipple(W * (0.15 + Math.random() * 0.7), H * (0.12 + Math.random() * 0.75), 0.9);
      }
    }, { passive: true });

    // 空闲时偶尔自动泛起微澜（水面的"活"感）
    setInterval(() => {
      if (!reduced) addRipple(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.8), 0.4);
    }, 2600);

    function frame(now) {
      t = now;
      // 光晕视差（平滑跟随鼠标）
      const tx = (mx / W - 0.5) * 22;
      const ty = (my / H - 0.5) * 14;
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (!reduced) aurora.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";

      // 绘制水波
      ctx.clearRect(0, 0, W, H);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.sp;
        rp.a *= 0.975;
        if (rp.a < 0.015 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }
        for (let k = 0; k < 3; k++) {
          const rr = rp.r - k * 8;
          if (rr < 2) continue;
          const alpha = rp.a * (1 - k * 0.32);
          const col = rp.gold ? "201,151,63" : "46,107,79";
          ctx.beginPath();
          // 波浪形的圆（水波抖动）
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.22) {
            const rad = rr + Math.sin(a * rp.wob + rp.ph + now * 0.003) * 1.6;
            const px = rp.x + Math.cos(a) * rad;
            const py = rp.y + Math.sin(a) * rad;
            if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = "rgba(" + col + "," + alpha + ")";
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();
