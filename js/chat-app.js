(function () {
  const EMOJIS = ["😀","😂","🥰","😍","🤔","😎","🙌","👏","🔥","💯","✅","❌","📚","📝","🧪","📐","💡","⭐","❤️","👍","🙏","🎉","💬","📎","📷","📊","🏫","🎓","💪","🚀"];

  function avatarUrl(name) {
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=4f46e5&color=fff&size=96&bold=true&format=svg";
  }
  function toast(msg, type) {
    var c = document.getElementById("hshs-toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "hshs-toast-container";
      c.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;z-index:10000;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none";
      document.body.appendChild(c);
    }
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "background:" + (type === "error" ? "#b91c1c" : type === "info" ? "#1d4ed8" : "#15803d") + ";color:#fff;padding:0.75rem 1.1rem;border-radius:12px;font-size:0.9rem;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,.25);opacity:0;transform:translateY(12px);transition:0.3s";
    c.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; t.style.transform = "none"; });
    setTimeout(function () { t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 300); }, 2600);
  }
  function escapeHtml(str) {
    var d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }
  function nowTime() {
    var n = new Date();
    return n.getHours().toString().padStart(2, "0") + ":" + n.getMinutes().toString().padStart(2, "0");
  }
  function uid() {
    return "m_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }
  function voterId() {
    try {
      var k = "hshs-voter-id";
      var v = localStorage.getItem(k);
      if (!v) {
        v = "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(k, v);
      }
      return v;
    } catch (e) {
      return "anon";
    }
  }

  var defaultConversations = [
    {
      id: 1, name: "Amina K.", pic: avatarUrl("Amina K"), preview: "Thanks for the Maths notes!", time: "2m", unread: 2, status: "Online", isGroup: false,
      messages: [
        { id: "d1", text: "Hey! Do you have the Form 4 Maths Paper 1?", sent: false, time: "10:12" },
        { id: "d2", text: "Yes, I just uploaded it yesterday.", sent: true, time: "10:14" },
        { id: "d3", text: "Thanks for the Maths notes!", sent: false, time: "10:15" }
      ]
    },
    {
      id: 2, name: "Brian O.", pic: avatarUrl("Brian O"), preview: "Physics group study at 4pm?", time: "25m", unread: 0, status: "Online", isGroup: false,
      messages: [
        { id: "d4", text: "Physics group study at 4pm?", sent: false, time: "09:50" },
        { id: "d5", text: "Count me in! Library or classroom?", sent: true, time: "09:52" }
      ]
    },
    {
      id: 4, name: "Study Group – Chem", pic: avatarUrl("Chem Group"), preview: "Someone share the organic chem summary", time: "3h", unread: 0, status: "3 members", isGroup: true,
      messages: [
        { id: "d6", text: "Someone share the organic chem summary", sent: false, time: "07:15" },
        { id: "d7", text: "I have it, sending now.", sent: true, time: "07:18" }
      ]
    }
  ];

  var conversations = defaultConversations.slice();
  var activeId = null;
  var nextId = 6;
  var CHAT_KEY = "hshs-chats";
  var callStream = null;
  var callType = null; // "video" | "voice"

  function normalizeMessage(m) {
    if (!m) return m;
    if (!m.id) m.id = uid();
    if (m.type === "poll") {
      if (!Array.isArray(m.options)) m.options = [];
      if (!Array.isArray(m.votes)) m.votes = m.options.map(function () { return 0; });
      while (m.votes.length < m.options.length) m.votes.push(0);
      if (!Array.isArray(m.voters)) m.voters = [];
    }
    return m;
  }

  function normalizeConv(c) {
    if (!c.messages) c.messages = [];
    c.messages = c.messages.map(normalizeMessage);
    return c;
  }

  function loadChats() {
    try {
      var raw = localStorage.getItem(CHAT_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length) {
        conversations = saved.map(normalizeConv);
        var maxId = 0;
        conversations.forEach(function (c) { if (c.id > maxId) maxId = c.id; });
        nextId = maxId + 1;
      }
    } catch (e) {}
  }

  function saveChats() {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(conversations));
    } catch (e) {
      toast("Could not save messages (storage full?)", "error");
    }
  }

  loadChats();

  function isLoggedIn() {
    return window.HSHSAuth && window.HSHSAuth.isLoggedIn && window.HSHSAuth.isLoggedIn();
  }

  function updateGate() {
    var gate = document.getElementById("chatGate");
    var page = document.getElementById("chatPage");
    if (isLoggedIn()) {
      if (gate) gate.hidden = true;
      if (page) page.hidden = false;
    } else {
      if (gate) gate.hidden = false;
      if (page) page.hidden = true;
    }
  }

  function renderConversations(filter) {
    var list = document.getElementById("conversationsList");
    if (!list) return;
    var f = (filter || "").toLowerCase();
    var filtered = conversations.filter(function (c) {
      return (c.name || "").toLowerCase().includes(f) || (c.preview || "").toLowerCase().includes(f);
    });
    list.innerHTML = filtered.map(function (c) {
      return '<div class="conversation-item ' + (c.id === activeId ? "active" : "") + '" data-id="' + c.id + '">' +
        '<img class="conv-avatar" src="' + c.pic + '" alt="" width="44" height="44" />' +
        '<div class="conv-info"><div class="conv-name">' + (c.isGroup ? "Group · " : "") + escapeHtml(c.name) + '</div>' +
        '<div class="conv-preview">' + escapeHtml(c.preview || "") + '</div></div>' +
        '<div class="conv-meta"><div class="conv-time">' + escapeHtml(c.time || "") + '</div>' +
        (c.unread ? '<span class="conv-unread">' + c.unread + '</span>' : '') + '</div></div>';
    }).join("");
    list.querySelectorAll(".conversation-item").forEach(function (el) {
      el.addEventListener("click", function () { openConversation(+el.dataset.id); });
    });
  }

  function totalVotes(m) {
    if (!m.votes) return 0;
    return m.votes.reduce(function (a, b) { return a + (b || 0); }, 0);
  }

  function renderPoll(m) {
    normalizeMessage(m);
    var total = totalVotes(m);
    var myVote = null;
    var vid = voterId();
    if (m.voters) {
      for (var i = 0; i < m.voters.length; i++) {
        if (m.voters[i].id === vid) { myVote = m.voters[i].opt; break; }
      }
    }
    var opts = m.options.map(function (o, i) {
      var count = (m.votes && m.votes[i]) || 0;
      var pct = total > 0 ? Math.round((count / total) * 100) : 0;
      var voted = myVote === i;
      return '<button type="button" class="poll-opt-btn' + (voted ? " is-voted" : "") + '" data-msg="' + escapeHtml(m.id) + '" data-opt="' + i + '">' +
        '<span class="poll-opt-label">' + escapeHtml(o) + '</span>' +
        '<span class="poll-opt-meta"><span class="poll-count">' + count + ' vote' + (count === 1 ? "" : "s") + '</span>' +
        '<span class="poll-pct">' + pct + '%</span></span>' +
        '<span class="poll-bar" style="width:' + pct + '%"></span>' +
        '</button>';
    }).join("");
    return '<div class="message message-poll ' + (m.sent ? "sent" : "received") + '" data-msg-id="' + escapeHtml(m.id) + '">' +
      '<div class="poll-q">📊 ' + escapeHtml(m.text) + '</div>' +
      '<div class="poll-opts">' + opts + '</div>' +
      '<div class="poll-total">' + total + ' total voter' + (total === 1 ? "" : "s") + '</div>' +
      '<div class="msg-time">' + escapeHtml(m.time) + '</div></div>';
  }

  function renderMessage(m) {
    normalizeMessage(m);
    if (m.type === "poll") return renderPoll(m);
    if (m.type === "file") {
      return '<div class="message ' + (m.sent ? "sent" : "received") + '"><div class="file-bubble">📎 ' + escapeHtml(m.text) + '</div><div class="msg-time">' + escapeHtml(m.time) + '</div></div>';
    }
    return '<div class="message ' + (m.sent ? "sent" : "received") + '">' + escapeHtml(m.text) + '<div class="msg-time">' + escapeHtml(m.time) + '</div></div>';
  }

  function findMessage(msgId) {
    for (var i = 0; i < conversations.length; i++) {
      var msgs = conversations[i].messages || [];
      for (var j = 0; j < msgs.length; j++) {
        if (msgs[j].id === msgId) return { conv: conversations[i], msg: msgs[j], index: j };
      }
    }
    return null;
  }

  function votePoll(msgId, optIndex) {
    var found = findMessage(msgId);
    if (!found) return;
    var m = found.msg;
    normalizeMessage(m);
    var vid = voterId();
    var prev = null;
    for (var i = 0; i < m.voters.length; i++) {
      if (m.voters[i].id === vid) { prev = m.voters[i]; break; }
    }
    if (prev) {
      if (prev.opt === optIndex) return; // already voted same
      if (m.votes[prev.opt] > 0) m.votes[prev.opt]--;
      prev.opt = optIndex;
    } else {
      m.voters.push({ id: vid, opt: optIndex });
    }
    m.votes[optIndex] = (m.votes[optIndex] || 0) + 1;
    saveChats();
    if (activeId) openConversation(activeId);
  }

  function openConversation(id) {
    activeId = id;
    var conv = conversations.find(function (c) { return c.id === id; });
    if (!conv) return;
    document.getElementById("chatEmpty").style.display = "none";
    document.getElementById("activeChat").style.display = "flex";
    var img = document.getElementById("activeAvatarImg");
    var fb = document.getElementById("activeAvatar");
    if (img) { img.src = conv.pic; img.alt = conv.name; img.style.display = "block"; }
    if (fb) fb.style.display = "none";
    document.getElementById("activeName").textContent = conv.name;
    document.getElementById("activeStatus").textContent = conv.status;
    var container = document.getElementById("messagesContainer");
    container.innerHTML = (conv.messages || []).map(renderMessage).join("");
    container.scrollTop = container.scrollHeight;

    // Wire poll votes
    container.querySelectorAll(".poll-opt-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        votePoll(btn.getAttribute("data-msg"), +btn.getAttribute("data-opt"));
      });
    });

    conv.unread = 0;
    saveChats();
    renderConversations(document.getElementById("chatSearch") && document.getElementById("chatSearch").value || "");
    if (window.innerWidth <= 900) {
      document.getElementById("chatSidebar").classList.add("hidden-mobile");
      document.getElementById("chatMain").classList.add("active-mobile");
    }
  }

  function sendMessage() {
    var input = document.getElementById("messageInput");
    var text = input && input.value.trim();
    if (!text || !activeId) return;
    var conv = conversations.find(function (c) { return c.id === activeId; });
    if (!conv) return;
    conv.messages.push({ id: uid(), text: text, sent: true, time: nowTime() });
    conv.preview = text;
    conv.time = "Just now";
    input.value = "";
    saveChats();
    openConversation(activeId);
  }

  function closeMenus() {
    var am = document.getElementById("attachMenu");
    var ep = document.getElementById("emojiPicker");
    var ab = document.getElementById("attachBtn");
    var eb = document.getElementById("emojiBtn");
    if (am) { am.hidden = true; am.setAttribute("hidden", ""); am.classList.remove("is-open"); }
    if (ep) { ep.hidden = true; ep.setAttribute("hidden", ""); ep.classList.remove("is-open"); }
    if (ab) ab.setAttribute("aria-expanded", "false");
    if (eb) eb.setAttribute("aria-expanded", "false");
  }

  function initEmojiGrid() {
    var grid = document.getElementById("emojiGrid");
    if (!grid) return;
    grid.innerHTML = EMOJIS.map(function (e) { return '<button type="button" data-emoji="' + e + '">' + e + '</button>'; }).join("");
    grid.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = document.getElementById("messageInput");
        if (input) { input.value += btn.dataset.emoji; input.focus(); }
        closeMenus();
      });
    });
  }

  /* ── Video / Voice call ── */
  function ensureCallOverlay() {
    var el = document.getElementById("callOverlay");
    if (el) return el;
    el = document.createElement("div");
    el.id = "callOverlay";
    el.className = "call-overlay";
    el.hidden = true;
    el.innerHTML =
      '<div class="call-stage">' +
      '  <video id="callRemoteVideo" class="call-remote" playsinline autoplay muted></video>' +
      '  <video id="callLocalVideo" class="call-local" playsinline autoplay muted></video>' +
      '  <div class="call-placeholder" id="callPlaceholder">' +
      '    <div class="call-avatar" id="callAvatar"></div>' +
      '    <p class="call-name" id="callPeerName">Student</p>' +
      '    <p class="call-status" id="callStatusText">Connecting…</p>' +
      '  </div>' +
      '  <div class="call-controls">' +
      '    <button type="button" class="call-ctrl" id="callMuteBtn" title="Mute">🎤</button>' +
      '    <button type="button" class="call-ctrl call-ctrl-end" id="callEndBtn" title="End call">📵</button>' +
      '    <button type="button" class="call-ctrl" id="callCamBtn" title="Camera">📷</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(el);

    document.getElementById("callEndBtn").addEventListener("click", endCall);
    document.getElementById("callMuteBtn").addEventListener("click", function () {
      if (!callStream) return;
      callStream.getAudioTracks().forEach(function (t) {
        t.enabled = !t.enabled;
      });
      var muted = callStream.getAudioTracks().some(function (t) { return !t.enabled; });
      document.getElementById("callMuteBtn").textContent = muted ? "🔇" : "🎤";
      document.getElementById("callMuteBtn").classList.toggle("is-off", muted);
    });
    document.getElementById("callCamBtn").addEventListener("click", function () {
      if (!callStream || callType !== "video") return;
      callStream.getVideoTracks().forEach(function (t) {
        t.enabled = !t.enabled;
      });
      var off = callStream.getVideoTracks().some(function (t) { return !t.enabled; });
      document.getElementById("callCamBtn").textContent = off ? "📷" : "📷";
      document.getElementById("callCamBtn").classList.toggle("is-off", off);
      document.getElementById("callPlaceholder").hidden = !off;
    });
    return el;
  }

  function startCall(type) {
    if (!activeId) {
      toast("Open a chat first", "error");
      return;
    }
    var conv = conversations.find(function (c) { return c.id === activeId; });
    if (!conv) return;

    callType = type;
    var overlay = ensureCallOverlay();
    overlay.hidden = false;
    document.getElementById("callPeerName").textContent = conv.name;
    document.getElementById("callStatusText").textContent = type === "video" ? "Starting video call…" : "Starting voice call…";
    document.getElementById("callAvatar").textContent = (conv.name || "?").charAt(0).toUpperCase();
    document.getElementById("callPlaceholder").hidden = false;
    document.getElementById("callCamBtn").style.display = type === "video" ? "grid" : "none";
    document.getElementById("callLocalVideo").style.display = type === "video" ? "block" : "none";

    var constraints = type === "video"
      ? { audio: true, video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } }
      : { audio: true, video: false };

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      document.getElementById("callStatusText").textContent = "Camera/mic not supported in this browser";
      toast("Media devices not available", "error");
      return;
    }

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      callStream = stream;
      var local = document.getElementById("callLocalVideo");
      var remote = document.getElementById("callRemoteVideo");
      if (type === "video") {
        local.srcObject = stream;
        // Demo: mirror local as "remote" so the section is visibly active
        remote.srcObject = stream;
        document.getElementById("callPlaceholder").hidden = true;
      } else {
        remote.srcObject = null;
      }
      document.getElementById("callStatusText").textContent =
        type === "video" ? "Video call connected (local preview)" : "Voice call connected — mic on";
      toast(type === "video" ? "Video call active" : "Voice call active", "success");
    }).catch(function (err) {
      document.getElementById("callStatusText").textContent = "Permission denied or device unavailable";
      toast("Could not access " + (type === "video" ? "camera/mic" : "microphone"), "error");
      console.warn(err);
    });
  }

  function endCall() {
    if (callStream) {
      callStream.getTracks().forEach(function (t) { t.stop(); });
      callStream = null;
    }
    var local = document.getElementById("callLocalVideo");
    var remote = document.getElementById("callRemoteVideo");
    if (local) local.srcObject = null;
    if (remote) remote.srcObject = null;
    var overlay = document.getElementById("callOverlay");
    if (overlay) overlay.hidden = true;
    callType = null;
    toast("Call ended", "info");
  }

  /* ── Events ── */
  document.getElementById("sendBtn") && document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("messageInput") && document.getElementById("messageInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function toggleAttachMenu(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var menu = document.getElementById("attachMenu");
    var btn = document.getElementById("attachBtn");
    if (!menu || !btn) return;
    var willOpen = menu.hidden || menu.hasAttribute("hidden");
    var ep = document.getElementById("emojiPicker");
    var eb = document.getElementById("emojiBtn");
    if (ep) { ep.hidden = true; ep.setAttribute("hidden", ""); ep.classList.remove("is-open"); }
    if (eb) eb.setAttribute("aria-expanded", "false");
    if (willOpen) {
      menu.hidden = false; menu.removeAttribute("hidden"); menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      menu.hidden = true; menu.setAttribute("hidden", ""); menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function toggleEmojiPicker(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var picker = document.getElementById("emojiPicker");
    var btn = document.getElementById("emojiBtn");
    if (!picker || !btn) return;
    var willOpen = picker.hidden || picker.hasAttribute("hidden");
    var am = document.getElementById("attachMenu");
    var ab = document.getElementById("attachBtn");
    if (am) { am.hidden = true; am.setAttribute("hidden", ""); am.classList.remove("is-open"); }
    if (ab) ab.setAttribute("aria-expanded", "false");
    if (willOpen) {
      picker.hidden = false; picker.removeAttribute("hidden"); picker.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      picker.hidden = true; picker.setAttribute("hidden", ""); picker.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  var attachBtnEl = document.getElementById("attachBtn");
  if (attachBtnEl) attachBtnEl.addEventListener("click", toggleAttachMenu);
  var emojiBtnEl = document.getElementById("emojiBtn");
  if (emojiBtnEl) emojiBtnEl.addEventListener("click", toggleEmojiPicker);

  document.addEventListener("click", function (e) {
    var wrap = document.querySelector(".chat-attach-wrap");
    var emojiBtn = document.getElementById("emojiBtn");
    var emojiPicker = document.getElementById("emojiPicker");
    var target = e.target;
    if (wrap && wrap.contains(target)) return;
    if (emojiBtn && (emojiBtn === target || emojiBtn.contains(target))) return;
    if (emojiPicker && emojiPicker.contains(target)) return;
    closeMenus();
  });

  document.getElementById("attachMenu") && document.getElementById("attachMenu").addEventListener("click", function (e) { e.stopPropagation(); });
  document.getElementById("emojiPicker") && document.getElementById("emojiPicker").addEventListener("click", function (e) { e.stopPropagation(); });

  document.querySelectorAll(".attach-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var action = item.dataset.action;
      closeMenus();
      if (action === "poll") {
        var pm = document.getElementById("pollModal");
        if (pm) pm.hidden = false;
        return;
      }
      if (action === "photo" || action === "video" || action === "document") {
        document.getElementById("fileInput") && document.getElementById("fileInput").click();
        return;
      }
      if (action === "location" && activeId) {
        var conv = conversations.find(function (c) { return c.id === activeId; });
        if (conv) {
          conv.messages.push({ id: uid(), type: "file", text: "Shared location", sent: true, time: nowTime() });
          conv.preview = "Shared location";
          conv.time = "Just now";
          saveChats();
          openConversation(activeId);
          toast("Location shared", "success");
        }
      }
    });
  });

  document.getElementById("fileInput") && document.getElementById("fileInput").addEventListener("change", function () {
    var files = document.getElementById("fileInput").files;
    if (!files || !files.length || !activeId) return;
    var conv = conversations.find(function (c) { return c.id === activeId; });
    if (!conv) return;
    Array.prototype.forEach.call(files, function (f) {
      conv.messages.push({ id: uid(), type: "file", text: f.name, sent: true, time: nowTime() });
    });
    conv.preview = "Sent a file";
    conv.time = "Just now";
    saveChats();
    openConversation(activeId);
    toast("File attached", "success");
    document.getElementById("fileInput").value = "";
  });

  document.getElementById("callBtn") && document.getElementById("callBtn").addEventListener("click", function () {
    startCall("voice");
  });
  document.getElementById("videoBtn") && document.getElementById("videoBtn").addEventListener("click", function () {
    startCall("video");
  });
  document.getElementById("infoBtn") && document.getElementById("infoBtn").addEventListener("click", function () {
    var conv = conversations.find(function (c) { return c.id === activeId; });
    toast(conv ? (conv.name + " · " + conv.status + " · " + (conv.messages || []).length + " messages") : "No chat selected", "info");
  });

  function openModal(id) { var el = document.getElementById(id); if (el) el.hidden = false; }
  function closeModal(id) { var el = document.getElementById(id); if (el) el.hidden = true; }

  document.getElementById("newChatBtn") && document.getElementById("newChatBtn").addEventListener("click", function () { openModal("newChatModal"); });
  document.getElementById("emptyNewChat") && document.getElementById("emptyNewChat").addEventListener("click", function () { openModal("newChatModal"); });
  document.getElementById("newGroupBtn") && document.getElementById("newGroupBtn").addEventListener("click", function () { openModal("newGroupModal"); });
  document.getElementById("emptyNewGroup") && document.getElementById("emptyNewGroup").addEventListener("click", function () { openModal("newGroupModal"); });

  document.querySelectorAll("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", function () { closeModal(btn.getAttribute("data-close")); });
  });

  document.getElementById("confirmNewChat") && document.getElementById("confirmNewChat").addEventListener("click", function () {
    var name = document.getElementById("newChatName") && document.getElementById("newChatName").value.trim();
    if (!name) return;
    var id = nextId++;
    conversations.unshift({ id: id, name: name, pic: avatarUrl(name), preview: "No messages yet", time: "Now", unread: 0, status: "Online", isGroup: false, messages: [] });
    closeModal("newChatModal");
    document.getElementById("newChatName").value = "";
    saveChats();
    renderConversations();
    openConversation(id);
    toast("Chat started with " + name, "success");
  });

  document.getElementById("confirmNewGroup") && document.getElementById("confirmNewGroup").addEventListener("click", function () {
    var name = document.getElementById("newGroupName") && document.getElementById("newGroupName").value.trim();
    if (!name) return;
    var id = nextId++;
    conversations.unshift({ id: id, name: name, pic: avatarUrl(name), preview: "Group created", time: "Now", unread: 0, status: "Group", isGroup: true, messages: [] });
    closeModal("newGroupModal");
    document.getElementById("newGroupName").value = "";
    if (document.getElementById("newGroupMembers")) document.getElementById("newGroupMembers").value = "";
    saveChats();
    renderConversations();
    openConversation(id);
    toast('Group "' + name + '" created', "success");
  });

  document.getElementById("addPollOption") && document.getElementById("addPollOption").addEventListener("click", function () {
    var wrap = document.getElementById("pollOptions");
    var n = wrap.querySelectorAll(".poll-option").length + 1;
    if (n > 6) return;
    var inp = document.createElement("input");
    inp.type = "text";
    inp.className = "poll-option";
    inp.placeholder = "Option " + n;
    inp.maxLength = 60;
    wrap.appendChild(inp);
  });

  document.getElementById("confirmPoll") && document.getElementById("confirmPoll").addEventListener("click", function () {
    var q = document.getElementById("pollQuestion") && document.getElementById("pollQuestion").value.trim();
    var opts = Array.prototype.map.call(document.querySelectorAll(".poll-option"), function (i) { return i.value.trim(); }).filter(Boolean);
    if (!q || opts.length < 2 || !activeId) {
      toast("Add a question and at least 2 options", "error");
      return;
    }
    var conv = conversations.find(function (c) { return c.id === activeId; });
    if (!conv) return;
    conv.messages.push({
      id: uid(),
      type: "poll",
      text: q,
      options: opts,
      votes: opts.map(function () { return 0; }),
      voters: [],
      sent: true,
      time: nowTime()
    });
    conv.preview = "Poll: " + q;
    conv.time = "Just now";
    closeModal("pollModal");
    document.getElementById("pollQuestion").value = "";
    saveChats();
    openConversation(activeId);
    toast("Poll sent", "success");
  });

  document.getElementById("chatSearch") && document.getElementById("chatSearch").addEventListener("input", function (e) {
    renderConversations(e.target.value);
  });

  document.getElementById("chatBackBtn") && document.getElementById("chatBackBtn").addEventListener("click", function () {
    document.getElementById("chatSidebar") && document.getElementById("chatSidebar").classList.remove("hidden-mobile");
    document.getElementById("chatMain") && document.getElementById("chatMain").classList.remove("active-mobile");
    activeId = null;
    document.getElementById("chatEmpty").style.display = "flex";
    document.getElementById("activeChat").style.display = "none";
    renderConversations();
  });

  document.getElementById("themeToggle") && document.getElementById("themeToggle").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") || "light";
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hshs-theme", next);
  });

  document.getElementById("mobileMenuBtn") && document.getElementById("mobileMenuBtn").addEventListener("click", function () {
    document.getElementById("mainNav") && document.getElementById("mainNav").classList.toggle("open");
  });

  document.getElementById("gateLogin") && document.getElementById("gateLogin").addEventListener("click", function () {
    window.HSHSAuth && window.HSHSAuth.open("login");
  });
  document.getElementById("gateSignup") && document.getElementById("gateSignup").addEventListener("click", function () {
    window.HSHSAuth && window.HSHSAuth.open("signup");
  });

  window.addEventListener("hshs:auth", function () {
    updateGate();
    if (isLoggedIn()) renderConversations();
  });

  // Save on page hide
  window.addEventListener("beforeunload", saveChats);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") saveChats();
  });

  initEmojiGrid();
  updateGate();
  if (isLoggedIn()) {
    renderConversations();
    if (window.innerWidth > 900 && conversations.length) openConversation(conversations[0].id);
  }
})();
