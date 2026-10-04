(function(){
  const EMOJIS = ["😀","😂","🥰","😍","🤔","😎","🙌","👏","🔥","💯","✅","❌","📚","📝","🧪","📐","💡","⭐","❤️","👍","🙏","🎉","💬","📎","📷","📊","🏫","🎓","💪","🚀"];
  function avatarUrl(name) {
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=4f46e5&color=fff&size=96&bold=true&format=svg";
  }
  function toast(msg, type) {
    let c = document.getElementById("hshs-toast-container");
    if (!c) { c = document.createElement("div"); c.id = "hshs-toast-container"; c.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;z-index:10000;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none"; document.body.appendChild(c); }
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "background:" + (type === "error" ? "#b91c1c" : type === "info" ? "#1d4ed8" : "#15803d") + ";color:#fff;padding:0.75rem 1.1rem;border-radius:12px;font-size:0.9rem;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,.25);opacity:0;transform:translateY(12px);transition:0.3s";
    c.appendChild(t);
    requestAnimationFrame(function(){ t.style.opacity = "1"; t.style.transform = "none"; });
    setTimeout(function(){ t.style.opacity = "0"; setTimeout(function(){ t.remove(); }, 300); }, 2600);
  }
  function escapeHtml(str) { const d = document.createElement("div"); d.textContent = str; return d.innerHTML; }
  function nowTime() { const n = new Date(); return n.getHours().toString().padStart(2,"0") + ":" + n.getMinutes().toString().padStart(2,"0"); }

  let conversations = [
    { id: 1, name: "Amina K.", pic: avatarUrl("Amina K"), preview: "Thanks for the Maths notes!", time: "2m", unread: 2, status: "Online", isGroup: false, messages: [
      { text: "Hey! Do you have the Form 4 Maths Paper 1?", sent: false, time: "10:12" },
      { text: "Yes, I just uploaded it yesterday.", sent: true, time: "10:14" },
      { text: "Thanks for the Maths notes!", sent: false, time: "10:15" }
    ]},
    { id: 2, name: "Brian O.", pic: avatarUrl("Brian O"), preview: "Physics group study at 4pm?", time: "25m", unread: 0, status: "Online", isGroup: false, messages: [
      { text: "Physics group study at 4pm?", sent: false, time: "09:50" },
      { text: "Count me in! Library or classroom?", sent: true, time: "09:52" }
    ]},
    { id: 4, name: "Study Group – Chem", pic: avatarUrl("Chem Group"), preview: "Someone share the organic chem summary", time: "3h", unread: 0, status: "3 members", isGroup: true, messages: [
      { text: "Someone share the organic chem summary", sent: false, time: "07:15" },
      { text: "I have it, sending now.", sent: true, time: "07:18" }
    ]}
  ];
  let activeId = null;
  let nextId = 6;

  function isLoggedIn() {
    return window.HSHSAuth && window.HSHSAuth.isLoggedIn && window.HSHSAuth.isLoggedIn();
  }
  function updateGate() {
    const gate = document.getElementById("chatGate");
    const page = document.getElementById("chatPage");
    if (isLoggedIn()) {
      if (gate) gate.hidden = true;
      if (page) page.hidden = false;
    } else {
      if (gate) gate.hidden = false;
      if (page) page.hidden = true;
    }
  }

  function renderConversations(filter) {
    const list = document.getElementById("conversationsList");
    if (!list) return;
    const f = (filter || "").toLowerCase();
    const filtered = conversations.filter(function(c){ return c.name.toLowerCase().includes(f) || c.preview.toLowerCase().includes(f); });
    list.innerHTML = filtered.map(function(c){
      return '<div class="conversation-item ' + (c.id === activeId ? "active" : "") + '" data-id="' + c.id + '">' +
        '<img class="conv-avatar" src="' + c.pic + '" alt="" width="44" height="44" />' +
        '<div class="conv-info"><div class="conv-name">' + (c.isGroup ? "Group · " : "") + escapeHtml(c.name) + '</div>' +
        '<div class="conv-preview">' + escapeHtml(c.preview) + '</div></div>' +
        '<div class="conv-meta"><div class="conv-time">' + c.time + '</div>' +
        (c.unread ? '<span class="conv-unread">' + c.unread + '</span>' : '') + '</div></div>';
    }).join("");
    list.querySelectorAll(".conversation-item").forEach(function(el){
      el.addEventListener("click", function(){ openConversation(+el.dataset.id); });
    });
  }

  function renderMessage(m) {
    if (m.type === "poll") {
      var opts = (m.options || []).map(function(o, i){
        return '<button type="button" class="poll-opt-btn" data-opt="' + i + '" style="display:block;width:100%;text-align:start;padding:0.4rem 0.6rem;margin:0.2rem 0;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer">' + escapeHtml(o) + '</button>';
      }).join("");
      return '<div class="message ' + (m.sent ? "sent" : "received") + '"><div>Poll: ' + escapeHtml(m.text) + '</div><div>' + opts + '</div><div class="msg-time">' + m.time + '</div></div>';
    }
    if (m.type === "file") {
      return '<div class="message ' + (m.sent ? "sent" : "received") + '"><div>📎 ' + escapeHtml(m.text) + '</div><div class="msg-time">' + m.time + '</div></div>';
    }
    return '<div class="message ' + (m.sent ? "sent" : "received") + '">' + escapeHtml(m.text) + '<div class="msg-time">' + m.time + '</div></div>';
  }

  function openConversation(id) {
    activeId = id;
    var conv = conversations.find(function(c){ return c.id === id; });
    if (!conv) return;
    document.getElementById("chatEmpty").style.display = "none";
    document.getElementById("activeChat").style.display = "flex";
    var img = document.getElementById("activeAvatarImg");
    var fb = document.getElementById("activeAvatar");
    img.src = conv.pic; img.alt = conv.name; img.style.display = "block"; fb.style.display = "none";
    document.getElementById("activeName").textContent = conv.name;
    document.getElementById("activeStatus").textContent = conv.status;
    var container = document.getElementById("messagesContainer");
    container.innerHTML = conv.messages.map(renderMessage).join("");
    container.scrollTop = container.scrollHeight;
    conv.unread = 0;
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
    var conv = conversations.find(function(c){ return c.id === activeId; });
    if (!conv) return;
    conv.messages.push({ text: text, sent: true, time: nowTime() });
    conv.preview = text;
    conv.time = "Just now";
    input.value = "";
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
    grid.innerHTML = EMOJIS.map(function(e){ return '<button type="button" data-emoji="' + e + '">' + e + '</button>'; }).join("");
    grid.querySelectorAll("button").forEach(function(btn){
      btn.addEventListener("click", function(){
        var input = document.getElementById("messageInput");
        if (input) { input.value += btn.dataset.emoji; input.focus(); }
        closeMenus();
      });
    });
  }

  document.getElementById("sendBtn") && document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("messageInput") && document.getElementById("messageInput").addEventListener("keypress", function(e){ if (e.key === "Enter") sendMessage(); });

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
      menu.hidden = false;
      menu.removeAttribute("hidden");
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      menu.hidden = true;
      menu.setAttribute("hidden", "");
      menu.classList.remove("is-open");
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
      picker.hidden = false;
      picker.removeAttribute("hidden");
      picker.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      picker.hidden = true;
      picker.setAttribute("hidden", "");
      picker.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  var attachBtnEl = document.getElementById("attachBtn");
  if (attachBtnEl) attachBtnEl.addEventListener("click", toggleAttachMenu);
  var emojiBtnEl = document.getElementById("emojiBtn");
  if (emojiBtnEl) emojiBtnEl.addEventListener("click", toggleEmojiPicker);

  document.addEventListener("click", function(e) {
    var wrap = document.querySelector(".chat-attach-wrap");
    var emojiBtn = document.getElementById("emojiBtn");
    var emojiPicker = document.getElementById("emojiPicker");
    var target = e.target;
    if (wrap && wrap.contains(target)) return;
    if (emojiBtn && (emojiBtn === target || emojiBtn.contains(target))) return;
    if (emojiPicker && emojiPicker.contains(target)) return;
    closeMenus();
  });

  document.getElementById("attachMenu") && document.getElementById("attachMenu").addEventListener("click", function(e){ e.stopPropagation(); });
  document.getElementById("emojiPicker") && document.getElementById("emojiPicker").addEventListener("click", function(e){ e.stopPropagation(); });

  document.querySelectorAll(".attach-item").forEach(function(item){
    item.addEventListener("click", function(){
      var action = item.dataset.action;
      closeMenus();
      if (action === "poll") { document.getElementById("pollModal").hidden = false; return; }
      if (action === "photo" || action === "video" || action === "document") {
        document.getElementById("fileInput") && document.getElementById("fileInput").click();
        return;
      }
      if (action === "location" && activeId) {
        var conv = conversations.find(function(c){ return c.id === activeId; });
        if (conv) {
          conv.messages.push({ type: "file", text: "Shared location", sent: true, time: nowTime() });
          conv.preview = "Shared location";
          openConversation(activeId);
          toast("Location shared", "success");
        }
      }
    });
  });

  document.getElementById("fileInput") && document.getElementById("fileInput").addEventListener("change", function(){
    var files = document.getElementById("fileInput").files;
    if (!files || !files.length || !activeId) return;
    var conv = conversations.find(function(c){ return c.id === activeId; });
    if (!conv) return;
    Array.prototype.forEach.call(files, function(f){
      conv.messages.push({ type: "file", text: f.name, sent: true, time: nowTime() });
    });
    conv.preview = "Sent a file";
    openConversation(activeId);
    toast("File attached", "success");
    document.getElementById("fileInput").value = "";
  });

  document.getElementById("callBtn") && document.getElementById("callBtn").addEventListener("click", function(){ toast("Voice call starting… (demo)", "info"); });
  document.getElementById("videoBtn") && document.getElementById("videoBtn").addEventListener("click", function(){ toast("Video call starting… (demo)", "info"); });
  document.getElementById("infoBtn") && document.getElementById("infoBtn").addEventListener("click", function(){
    var conv = conversations.find(function(c){ return c.id === activeId; });
    toast(conv ? (conv.name + " · " + conv.status) : "No chat selected", "info");
  });

  function openModal(id) { var el = document.getElementById(id); if (el) el.hidden = false; }
  function closeModal(id) { var el = document.getElementById(id); if (el) el.hidden = true; }

  document.getElementById("newChatBtn") && document.getElementById("newChatBtn").addEventListener("click", function(){ openModal("newChatModal"); });
  document.getElementById("emptyNewChat") && document.getElementById("emptyNewChat").addEventListener("click", function(){ openModal("newChatModal"); });
  document.getElementById("newGroupBtn") && document.getElementById("newGroupBtn").addEventListener("click", function(){ openModal("newGroupModal"); });
  document.getElementById("emptyNewGroup") && document.getElementById("emptyNewGroup").addEventListener("click", function(){ openModal("newGroupModal"); });

  document.querySelectorAll("[data-close]").forEach(function(btn){
    btn.addEventListener("click", function(){ closeModal(btn.getAttribute("data-close")); });
  });

  document.getElementById("confirmNewChat") && document.getElementById("confirmNewChat").addEventListener("click", function(){
    var name = document.getElementById("newChatName") && document.getElementById("newChatName").value.trim();
    if (!name) return;
    var id = nextId++;
    conversations.unshift({ id: id, name: name, pic: avatarUrl(name), preview: "No messages yet", time: "Now", unread: 0, status: "Online", isGroup: false, messages: [] });
    closeModal("newChatModal");
    document.getElementById("newChatName").value = "";
    renderConversations();
    openConversation(id);
    toast("Chat started with " + name, "success");
  });

  document.getElementById("confirmNewGroup") && document.getElementById("confirmNewGroup").addEventListener("click", function(){
    var name = document.getElementById("newGroupName") && document.getElementById("newGroupName").value.trim();
    if (!name) return;
    var id = nextId++;
    conversations.unshift({ id: id, name: name, pic: avatarUrl(name), preview: "Group created", time: "Now", unread: 0, status: "Group", isGroup: true, messages: [] });
    closeModal("newGroupModal");
    document.getElementById("newGroupName").value = "";
    if (document.getElementById("newGroupMembers")) document.getElementById("newGroupMembers").value = "";
    renderConversations();
    openConversation(id);
    toast('Group "' + name + '" created', "success");
  });

  document.getElementById("addPollOption") && document.getElementById("addPollOption").addEventListener("click", function(){
    var wrap = document.getElementById("pollOptions");
    var n = wrap.querySelectorAll(".poll-option").length + 1;
    if (n > 6) return;
    var inp = document.createElement("input");
    inp.type = "text"; inp.className = "poll-option"; inp.placeholder = "Option " + n; inp.maxLength = 60;
    inp.style.cssText = "width:100%;padding:0.65rem 0.85rem;border-radius:10px;border:1.5px solid var(--border);margin-block-end:0.75rem;background:var(--bg);outline:none;box-sizing:border-box";
    wrap.appendChild(inp);
  });

  document.getElementById("confirmPoll") && document.getElementById("confirmPoll").addEventListener("click", function(){
    var q = document.getElementById("pollQuestion") && document.getElementById("pollQuestion").value.trim();
    var opts = Array.prototype.map.call(document.querySelectorAll(".poll-option"), function(i){ return i.value.trim(); }).filter(Boolean);
    if (!q || opts.length < 2 || !activeId) { toast("Add a question and at least 2 options", "error"); return; }
    var conv = conversations.find(function(c){ return c.id === activeId; });
    if (!conv) return;
    conv.messages.push({ type: "poll", text: q, options: opts, sent: true, time: nowTime() });
    conv.preview = "Poll: " + q;
    closeModal("pollModal");
    document.getElementById("pollQuestion").value = "";
    openConversation(activeId);
    toast("Poll sent", "success");
  });

  document.getElementById("chatSearch") && document.getElementById("chatSearch").addEventListener("input", function(e){ renderConversations(e.target.value); });
  document.getElementById("chatBackBtn") && document.getElementById("chatBackBtn").addEventListener("click", function(){
    document.getElementById("chatSidebar") && document.getElementById("chatSidebar").classList.remove("hidden-mobile");
    document.getElementById("chatMain") && document.getElementById("chatMain").classList.remove("active-mobile");
    activeId = null;
    document.getElementById("chatEmpty").style.display = "flex";
    document.getElementById("activeChat").style.display = "none";
    renderConversations();
  });

  document.getElementById("themeToggle") && document.getElementById("themeToggle").addEventListener("click", function(){
    var cur = document.documentElement.getAttribute("data-theme") || "light";
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hshs-theme", next);
  });
  document.getElementById("mobileMenuBtn") && document.getElementById("mobileMenuBtn").addEventListener("click", function(){
    document.getElementById("mainNav") && document.getElementById("mainNav").classList.toggle("open");
  });

  document.getElementById("gateLogin") && document.getElementById("gateLogin").addEventListener("click", function(){ window.HSHSAuth && window.HSHSAuth.open("login"); });
  document.getElementById("gateSignup") && document.getElementById("gateSignup").addEventListener("click", function(){ window.HSHSAuth && window.HSHSAuth.open("signup"); });

  window.addEventListener("hshs:auth", function(){ updateGate(); if (isLoggedIn()) renderConversations(); });

  initEmojiGrid();
  updateGate();
  if (isLoggedIn()) {
    renderConversations();
    if (window.innerWidth > 900 && conversations.length) openConversation(conversations[0].id);
  }
})();
