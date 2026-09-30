const API = location.port === "3000" ? "" : "http://localhost:3000";
const menu = document.getElementById("menu");
const content = document.getElementById("content");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
}[c]));

const get = (url) => fetch(API + url).then(r => {
  if (!r.ok) throw new Error("Request failed");
  return r.json();
});

let lessons = [];

async function init(){
  try{
    lessons = await get("/api/lessons");
    menu.innerHTML = lessons.map(l =>
      `<button data-id="${esc(l.id)}">${esc(l.icon)} ${esc(l.title)}</button>`
    ).join("") + `<button data-id="software">💿 Software</button><button data-id="practical">🛠️ Practical Skills</button><button data-id="quiz">📝 Quiz</button>`;

    menu.onclick = (e) => {
      const id = e.target.dataset.id;
      if(id) openSection(id);
    };

    document.getElementById("lessonCount").textContent = lessons.length + 2;
    const hardware = lessons.find(x => x.id === "hardware");
    document.getElementById("hardwareCount").textContent = hardware ? 20 : 0;

    const quiz = await get("/api/quiz");
    document.getElementById("quizCount").textContent = quiz.length;

    openSection("hardware");
  }catch(err){
    content.innerHTML = `<p class="msg">⚠️ Cannot reach the backend. Please start the server with <b>node server.js</b>.</p>`;
  }
}

function openSection(id){
  menu.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.id === id));
  window.scrollTo({top:0,behavior:"smooth"});
  if(id === "quiz") return showQuiz();
  if(id === "software") return showSoftware();
  if(id === "practical") return showPractical();
  showLesson(id);
}

async function showLesson(id){
  try{
    const l = await get("/api/lessons/" + encodeURIComponent(id));
    let body = "";

    if(l.type === "cards"){
      body = `<div class="grid">${l.items.map(x => `
        <article class="card">
          <div class="photo">
            <img src="images/${esc(x.image)}" alt="${esc(x.name)}"
              onerror="this.style.display='none';this.parentElement.querySelector('.fallback').style.display='block';">
            <span class="fallback" style="display:none">${esc(x.icon || "💻")}</span>
          </div>
          <div class="txt">
            <span class="tag">${esc(x.kind)}</span>
            <h3>${esc(x.name)}</h3>
            <p>${esc(x.info)}</p>
            <div class="tip"><b>Tip</b> ${esc(x.tip)}</div>
          </div>
        </article>`).join("")}</div>`;
    } else if(l.type === "steps"){
      body = `<ol class="steps">${l.items.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`;
    } else {
      body = `<div class="keys">${l.items.map(k => `<div><span>${esc(k.action)}</span><kbd>${esc(k.keys)}</kbd></div>`).join("")}</div>`;
    }

    content.innerHTML = `<div class="section-head"><span class="eyebrow">${esc(l.icon)} DIGILEARN TOPIC</span><h2>${esc(l.title)}</h2><p class="lead">${esc(l.intro)}</p></div>${body}`;
  }catch(err){
    content.innerHTML = `<p class="msg">⚠️ This lesson could not be loaded.</p>`;
  }
}

function showSoftware(){
  content.innerHTML = `
    <div class="section-head"><span class="eyebrow">💿 SOFTWARE</span><h2>Software & Applications</h2>
    <p class="lead">Software is a set of programs that tells the computer what to do.</p></div>
    <div class="info-grid">
      <article class="info-box"><h3>🪟 Windows</h3><p>An operating system used to manage the computer, files, devices and applications.</p><ul><li>Desktop and Start menu</li><li>File and folder management</li><li>Settings and device control</li></ul></article>
      <article class="info-box"><h3>📝 Microsoft Word</h3><p>Used for letters, notices, assignments and other documents.</p><ul><li>Formatting text</li><li>Tables and pictures</li><li>Printing documents</li></ul></article>
      <article class="info-box"><h3>📊 Microsoft Excel</h3><p>A spreadsheet program for tables, calculations, lists and simple data analysis.</p><ul><li>Rows and columns</li><li>Formulas</li><li>Sorting and filtering</li></ul></article>
      <article class="info-box"><h3>📽️ PowerPoint</h3><p>Used to create presentations with slides, text, images and diagrams.</p><ul><li>Create slides</li><li>Add pictures</li><li>Present information</li></ul></article>
      <article class="info-box"><h3>🌐 Web Browser</h3><p>Software such as Chrome, Edge or Firefox used to visit websites and web applications.</p><ul><li>Open websites</li><li>Search information</li><li>Download files safely</li></ul></article>
      <article class="info-box"><h3>📁 File Explorer</h3><p>Windows tool for viewing, creating, copying, moving and organizing files and folders.</p><ul><li>Create folders</li><li>Rename files</li><li>Copy and move data</li></ul></article>
      <article class="info-box"><h3>🎨 Paint</h3><p>A simple graphics program for drawing, colouring, cropping and basic image editing.</p></article>
      <article class="info-box"><h3>🛡️ Antivirus</h3><p>Security software that helps detect and remove malicious software. Keep security software and Windows updated.</p></article>
    </div>`;
}

function showPractical(){
  content.innerHTML = `
    <div class="section-head"><span class="eyebrow">🛠️ PRACTICAL SKILLS</span><h2>Everyday Computer Skills</h2>
    <p class="lead">These are useful tasks for beginners working with a Windows computer.</p></div>
    <div class="info-grid">
      <article class="info-box"><h3>📂 Files & Folders</h3><ol><li>Open File Explorer.</li><li>Create a folder with Ctrl + Shift + N.</li><li>Give it a clear name.</li><li>Copy, move or rename files when needed.</li></ol></article>
      <article class="info-box"><h3>🪟 Windows Basics</h3><ol><li>Use Start to open apps.</li><li>Use the taskbar to switch windows.</li><li>Use Settings to manage devices.</li><li>Shut down or restart from the Power menu.</li></ol></article>
      <article class="info-box"><h3>🌐 Internet Basics</h3><ol><li>Open a web browser.</li><li>Use a search engine for information.</li><li>Check website addresses before entering information.</li><li>Do not download unknown files.</li></ol></article>
      <article class="info-box"><h3>🔧 Basic Troubleshooting</h3><ol><li>Check power and cables.</li><li>Restart the computer.</li><li>Check Wi-Fi or network connection.</li><li>Check Device Manager for hardware issues.</li></ol></article>
      <article class="info-box"><h3>💾 Storage Care</h3><ol><li>Keep important files backed up.</li><li>Leave free space on the system drive.</li><li>Eject removable drives safely.</li><li>Avoid sudden power loss during updates.</li></ol></article>
      <article class="info-box"><h3>🧹 Computer Care</h3><ol><li>Keep vents clear.</li><li>Clean keyboard and screen carefully.</li><li>Keep liquids away from the computer.</li><li>Do not open electrical equipment while powered.</li></ol></article>
    </div>`;
}

async function showQuiz(){
  try{
    const quiz = await get("/api/quiz");
    content.innerHTML = `<div class="section-head"><span class="eyebrow">📝 KNOWLEDGE CHECK</span><h2>Computer Skills Quiz</h2><p class="lead">Choose one answer for each question and check your score.</p></div>
      <p><input type="text" id="name" placeholder="Enter your name" maxlength="30"></p>
      ${quiz.map((q,i) => `<div class="q"><h3>${i+1}. ${esc(q.q)}</h3>${q.options.map((o,j) =>
        `<label class="opt"><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`
      ).join("")}</div>`).join("")}
      <button class="go" id="submit">Check My Answers</button>
      <div id="out"></div>`;

    document.getElementById("submit").onclick = async () => {
      const name = document.getElementById("name").value.trim();
      if(!name) return alert("Please enter your name first.");

      const answers = quiz.map((_,i) => {
        const c = document.querySelector(`input[name="q${i}"]:checked`);
        return c ? Number(c.value) : -1;
      });

      try{
        const res = await fetch(API + "/api/quiz/submit",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({name,answers})
        });
        const result = await res.json();
        if(!res.ok) throw new Error(result.error || "Quiz submission failed");

        document.querySelectorAll(".q").forEach((box,i) => {
          box.querySelectorAll(".opt").forEach((opt,j) => {
            if(j === result.correct[i]) opt.classList.add("right");
            else if(j === answers[i]) opt.classList.add("wrong");
          });
        });

        const top = await get("/api/scores");
        document.getElementById("out").innerHTML = `
          <div class="result">🎉 <strong>${esc(name)}</strong>, your score is <strong>${result.score}/${result.total}</strong>.</div>
          <div class="q"><h3>🏆 Recent Top Scores</h3><ol class="board">${top.map(s => `<li>${esc(s.name)} — <strong>${s.score}/${s.total}</strong></li>`).join("")}</ol></div>`;
        document.getElementById("out").scrollIntoView({behavior:"smooth"});
      }catch(err){
        alert("Could not submit the quiz. Please check that the server is running.");
      }
    };
  }catch(err){
    content.innerHTML = `<p class="msg">⚠️ Cannot load the quiz. Start the server first.</p>`;
  }
}

init();
