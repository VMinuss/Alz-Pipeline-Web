// Intro typing (no sound)
const introText = "Welcome to Alzheimer's Pipeline";
const introEl = document.getElementById("intro-text");
const introContainer = document.getElementById("intro");
let introIndex = 0;

function typeIntro() {
  if (introIndex < introText.length) {
    const span = document.createElement("span");
    span.textContent = introText.charAt(introIndex);
    span.classList.add("jump");
    introEl.appendChild(span);
    introIndex++;
    setTimeout(typeIntro, 100);
  } else {
    setTimeout(() => {
      const spans = introEl.querySelectorAll("span");
      spans.forEach((s, idx) => {
        s.style.animation = `fadeUp 1s forwards`;
        s.style.animationDelay = `${idx * 0.05}s`;
      });

      // Blobs pulse during intro
      const blobs = document.querySelectorAll(".blob");
      blobs.forEach(blob => blob.classList.add("pulse"));

      setTimeout(() => {
        introContainer.style.display = "none";
        blobs.forEach(blob => blob.classList.remove("pulse"));
        showPipey();
      }, 1200);
    }, 1000);
  }
}

// Pipey typing with blip
const dialogueContainer = document.getElementById("dialogue");
const pipeyTextEl = document.getElementById("pipey-text");
const optionsEl = document.getElementById("options");
const blip = document.getElementById("blip-sound");

function typePipeyText(text, callback) {
  let i = 0;
  pipeyTextEl.textContent = "";
  function typeChar() {
    if (i < text.length) {
      pipeyTextEl.textContent += text.charAt(i);
      
      // Play blip only if audio is ready and dialogue visible
      if (blip.readyState >= 2 && dialogueContainer.style.display === "flex") {
        blip.currentTime = 0;
        blip.playbackRate = 0.9 + Math.random() * 0.4;
        blip.play().catch(()=>{});
      }

      i++;
      setTimeout(typeChar, 80);
    } else if (callback) {
      callback();
    }
  }
  typeChar();
}

// Show Pipey + options
function showPipey() {
  dialogueContainer.style.display = "flex";
  typePipeyText("What can I help you with?", () => {
    optionsEl.innerHTML = `
      <button onclick="showOption('Option 1 Selected!')">Option 1</button>
      <button onclick="showOption('Option 2 Selected!')">Option 2</button>
    `;
  });
}

// Show selected option with iframe/text placeholders
function showOption(msg) {
  typePipeyText(msg, () => {
    let content = "";
    if(msg.includes("Option 1")) {
      content = `
        <div class='option-content'>
          <iframe src="tag_network.html"></iframe>
        </div>
      `;
    } else if(msg.includes("Option 2")) {
      content = `
        <div class='option-content'>
          <div>I guess there's nothing here lmao</div>
        </div>
      `;
    }

    optionsEl.innerHTML = `
      ${content}
      <button onclick="goBack()">I want to go back</button>
    `;
  });
}

function goBack() {
  showPipey();
}

// Blob spawner
function createBlob() {
  const blob = document.createElement("div");
  blob.classList.add("blob");
  document.getElementById("blobs").appendChild(blob);

  blob.style.width = `${100 + Math.random() * 200}px`;
  blob.style.height = blob.style.width;
  blob.style.top = `${Math.random() * 100}%`;
  blob.style.left = `${Math.random() * 100}%`;

  setTimeout(() => {
    blob.remove();
  }, 60000);
}

setInterval(createBlob, 5000);

// Start intro
typeIntro();
