(function () {
  var root = document.documentElement;
  root.classList.add("js-ready");
  var storageKey = "gowa-theme";

  var menu = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
  }
  if (menu && nav) {
    menu.addEventListener("click", function () {
      menu.setAttribute("aria-expanded", String(menu.getAttribute("aria-expanded") !== "true"));
    });
    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && (!nav.contains(event.target) || event.target.closest("a"))) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menu.focus();
      }
    });
    window.matchMedia("(max-width: 640px)").addEventListener("change", closeMenu);
  }

  /* 1. Theme toggle */
  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch (_) {}

  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  var toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    var getActiveTheme = function () {
      var explicit = root.getAttribute("data-theme");
      if (explicit === "light" || explicit === "dark") return explicit;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    toggleBtn.addEventListener("click", function () {
      var next = getActiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(storageKey, next);
      } catch (_) {}
    });
  }

  /* 2. Copy Docker command */
  var copyBtn = document.getElementById("copy-docker");
  var dockerCode = document.getElementById("docker-code");
  if (copyBtn && dockerCode && navigator.clipboard) {
    var label = copyBtn.querySelector(".copy-label");
    var resetTimer = null;

    copyBtn.addEventListener("click", function () {
      var text = dockerCode.textContent || "";
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.classList.add("copied");
        if (label) label.textContent = "Copied";
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          copyBtn.classList.remove("copied");
          if (label) label.textContent = "Copy";
        }, 2000);
      });
    });
  } else if (copyBtn && !navigator.clipboard) {
    copyBtn.hidden = true;
  }

  /* 3. Subtle scroll reveal */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (!prefersReduced && "IntersectionObserver" in window && revealEls.length) {
    root.classList.add("js-reveal");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* 4. Interactive 3D tilt & specular glare */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!prefersReduced && finePointer) {
    var bindTilt = function (el, maxDeg, restRx, restRy) {
      el.addEventListener("pointerenter", function () {
        el.classList.add("is-tilting");
      });

      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (0.5 - py) * maxDeg * 2;
        var ry = (px - 0.5) * maxDeg * 2;

        el.style.setProperty("--rx", rx.toFixed(2) + "deg");
        el.style.setProperty("--ry", ry.toFixed(2) + "deg");
        el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      });

      el.addEventListener("pointerleave", function () {
        el.classList.remove("is-tilting");
        el.style.setProperty("--rx", restRx + "deg");
        el.style.setProperty("--ry", restRy + "deg");
      });
    };

    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var maxDeg = parseFloat(el.getAttribute("data-tilt-max")) || 10;
      bindTilt(el, maxDeg, 4, -6);
    });

    document.querySelectorAll(".bento-card").forEach(function (el) {
      bindTilt(el, 4.5, 0, 0);
    });

    var terminalEl = document.querySelector(".terminal");
    if (terminalEl) {
      bindTilt(terminalEl, 2.5, 0, 0);
    }
  }

  /* 5. Interactive GOWA Hero Simulator */
  var stageEl = document.getElementById("stage-3d");
  var triggerBtn = document.getElementById("gowa-trigger");
  var packetEl = document.getElementById("flying-packet");
  var peerLabel = document.getElementById("mcp-peer-label");
  var simMethod = document.getElementById("sim-method");
  var simPath = document.getElementById("sim-path");
  var simStatus = document.getElementById("sim-status");
  var simFeed = document.getElementById("sim-feed");
  var simFrom = document.getElementById("sim-from");
  var simLine1 = document.getElementById("sim-line-1");
  var simTo = document.getElementById("sim-to");
  var simLine2 = document.getElementById("sim-line-2");
  var modeButtons = document.querySelectorAll(".mode-pill[data-mode]");

  if (stageEl && modeButtons.length) {
    var scenarios = {
      message: [
        {
          method: "POST",
          path: "/send/message",
          status: "200 OK",
          from: "GOWA",
          line1: 'To Nadia: "Release v6.4 is live on staging."',
          to: "Delivered",
          line2: "X-Device-Id: ops-01 · 38ms"
        },
        {
          method: "POST",
          path: "/send/image",
          status: "200 OK",
          from: "GOWA",
          line1: 'To Design Team: "Updated dashboard screenshot"',
          to: "Delivered",
          line2: "image/webp · 44ms"
        },
        {
          method: "POST",
          path: "/send/schedules",
          status: "201 OK",
          from: "GOWA",
          line1: 'Scheduled daily 09:00: "Standup check-in"',
          to: "Queued",
          line2: "repeat: daily · persisted"
        }
      ],
      call: [
        {
          method: "EVENT",
          path: "call.offer",
          status: "RINGING",
          from: "Voice",
          line1: "Calling Nadia (+62 812-4091-8832)...",
          to: "Live",
          line2: "00:01 · device: support-02"
        },
        {
          method: "EVENT",
          path: "call.offer",
          status: "RINGING",
          from: "Voice",
          line1: "Calling Rafi (+62 811-7720-1940)...",
          to: "Live",
          line2: "00:01 · device: ops-01"
        }
      ],
      claude: [
        {
          method: "POST",
          path: "/mcp",
          status: "MCP · 200",
          peer: "Claude",
          from: "Claude",
          line1: '"Summarize unread WhatsApp messages from Ops"',
          to: "GOWA",
          line2: "3 unread · Invoice #412 approved by Tariq"
        },
        {
          method: "POST",
          path: "/mcp",
          status: "MCP · 200",
          peer: "Claude",
          from: "Claude",
          line1: '"Reply to Tariq that deployment starts at 14:00"',
          to: "GOWA",
          line2: "tool: send_message · sent · 52ms"
        }
      ],
      codex: [
        {
          method: "POST",
          path: "/mcp",
          status: "MCP · 200",
          peer: "Codex",
          from: "Codex",
          line1: '"Notify #backend group: CI passed on main"',
          to: "GOWA",
          line2: "tool: send_message · 120363...g.us · 200"
        },
        {
          method: "POST",
          path: "/mcp",
          status: "MCP · 200",
          peer: "Codex",
          from: "Codex",
          line1: '"Fetch latest bug report media from QA chat"',
          to: "GOWA",
          line2: "tool: download_media · trace.log ready"
        }
      ],
      webhook: [
        {
          method: "POST",
          path: "/webhook",
          status: "SIGNED",
          from: "Event",
          line1: 'message.received from +62 813-9021-4410',
          to: "HMAC",
          line2: "X-Hub-Signature-256: sha256=9f4a...c21e"
        },
        {
          method: "POST",
          path: "/webhook",
          status: "SIGNED",
          from: "Event",
          line1: "Chatwoot inbox synced · 1 conversation updated",
          to: "HMAC",
          line2: "CHATWOOT_ENABLED=true · 19ms"
        }
      ]
    };

    var currentMode = "message";
    var indices = { message: 0, call: 0, claude: 0, codex: 0, webhook: 0 };
    var callTimer = null;
    var callSeconds = 1;

    var formatTime = function (sec) {
      var m = String(Math.floor(sec / 60)).padStart(2, "0");
      var s = String(sec % 60).padStart(2, "0");
      return m + ":" + s;
    };

    var stopCallTimer = function () {
      if (callTimer) {
        clearInterval(callTimer);
        callTimer = null;
      }
    };

    var triggerVisualPulse = function (mode) {
      if (triggerBtn) {
        triggerBtn.classList.remove("is-pulsing");
        void triggerBtn.offsetWidth;
        triggerBtn.classList.add("is-pulsing");
      }

      if (simFeed) {
        simFeed.classList.remove("is-updating");
        void simFeed.offsetWidth;
        simFeed.classList.add("is-updating");
      }

      if (packetEl && (mode === "message" || mode === "webhook")) {
        packetEl.classList.remove("is-flying");
        void packetEl.offsetWidth;
        packetEl.classList.add("is-flying");
      }
    };

    var applyMode = function (mode, advance) {
      var list = scenarios[mode];
      if (!list) return;

      if (advance) {
        indices[mode] = (indices[mode] + 1) % list.length;
      }

      currentMode = mode;
      var item = list[indices[mode]];

      stageEl.setAttribute("data-mode", mode);
      modeButtons.forEach(function (btn) {
        var active = btn.getAttribute("data-mode") === mode;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });

      if (peerLabel && item.peer) {
        peerLabel.textContent = item.peer;
      }
      if (simMethod) simMethod.textContent = item.method;
      if (simPath) simPath.textContent = item.path;
      if (simStatus) simStatus.textContent = item.status;
      if (simFrom) simFrom.textContent = item.from;
      if (simLine1) simLine1.textContent = item.line1;
      if (simTo) simTo.textContent = item.to;
      if (simLine2) simLine2.textContent = item.line2;

      stopCallTimer();
      if (mode === "call") {
        callSeconds = 1;
        var baseDevice = item.line2.split("·")[1] || " device: ops-01";
        callTimer = setInterval(function () {
          callSeconds += 1;
          if (simLine2) {
            simLine2.textContent = formatTime(callSeconds) + " ·" + baseDevice;
          }
        }, 1000);
      }

      triggerVisualPulse(mode);
    };

    modeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var nextMode = btn.getAttribute("data-mode");
        applyMode(nextMode, nextMode === currentMode);
      });
    });

    if (triggerBtn) {
      triggerBtn.addEventListener("click", function () {
        applyMode(currentMode, true);
      });
    }
  }
})();
