// ----------------------
// EVENT DATA ARCHIVE
// ----------------------
const events = [
  {
    event: "Completing Graphs",
    date: "16th Feb 2022",
    place: "At your Nani's place",
    question: "Who were you spying on?",
    options: ["Dog on the road", "ultimate ex-crush.", "His sister Hiya"],
    correct: 1,
    photos: ["ku.jpeg"],
    videos: [],
    caption: "Seems like you were trying to max out the crush graph lol"
  },
  {
    event: "Little Garden Date",
    date: "28 July 2023",
    place: "Aapda ghar pase nu garden",
    question: "After wandering, we went to eat something. Do you remember what?",
    options: ["Pani Puri", "Ice Cream", "Manchurian"],
    correct: 2,
    photos: ["manchurian.jpeg"],
    videos: [],
    caption: "Out of all things, we ate Manchurian, I never thought of it idk why"
  },
  {
    event: "Night Stay",
    date: "3–4 June",
    place: "Ofc tara ghare ",
    question: "Which drink did we have?",
    options: ["Coolberg", "Coldcoco", "Amul Masti Chaas"],
    correct: 0,
    photos: ["coolberg.jpeg"],
    videos: ["coolberg.mp4"],
    caption: "High on Cranberry? Wrong. High on Sunrise"
  },
  {
    event: "Matching Bags",
    date: "Aato to kai event nai badhu same",
    place: "Aapdi j duniya ma",
    question: "We have the same kind of bag. I have a yellow duck. You have a?",
    options: ["Green turtle", "Green frog", "Green crocodile"],
    correct: 1,
    photos: ["duck.jpeg", "frog.jpeg"],
    videos: [],
    caption: "The cutest matching bags ever and ur comment was ketla weird legs dekahi che"
  },
  {
    event: " ONLY Mirror Selfie",
    date: "3 Nov 2022",
    place: "Some mysterious shop",
    question: "We took a cute picture in a round mirror. Which shop was it?",
    options: ["Miniso", "The shop where we spent 20 minutes deciding nothing", "IDK"],
    correct: 2,
    photos: ["mirror.jpeg"],
    videos: [],
    caption: "One of my favourite memory with you where we went together"
  },
  {
    event: "Christmas Celebration",
    date: "24th December",
    place: "At My College",
    question: "Which year did we decorate the Christmas tree together?",
    options: ["2022", "2023", "2020"],
    correct: 0,
    photos: [],
    videos: ["tree.mp4"],
    caption: "Tiny ornaments. Big memories LOL!"
  }
];

let current = 0;
let score = 0;

const startBtn = document.getElementById("startBtn");
const welcomeSection = document.getElementById("welcome");
const quizSection = document.getElementById("quizSection");
const questionBox = document.getElementById("questionBox");
const quizResult = document.getElementById("quizResult");

// ----------------------
// START APP FLOW
// ----------------------
startBtn.onclick = () => {
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic) {
    bgMusic.volume = 0.8;
    bgMusic.play().catch(err => console.log("Audio block context handled:", err));
  }
  welcomeSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  loadQuestion();
};

// ----------------------
// LOAD QUESTION CARD
// ----------------------
function loadQuestion() {
  const q = events[current];
  quizResult.innerHTML = "";

  questionBox.innerHTML = `
    <div class="topBar">
      <div>Question ${current + 1} / ${events.length}</div>
      <div>Score: ${score}</div>
    </div>
    <div class="qMeta">
      <strong>Event:</strong> ${q.event}<br>
      <strong>Date:</strong> ${q.date || "-"}<br>
      <strong>Place:</strong> ${q.place || "-"}
    </div>
    <h3>${q.question}</h3>
    <div class="options">
      ${q.options.map((opt, i) => `
        <label class="optionCard">
          <input type="radio" name="opt" value="${i}">
          <span>${opt}</span>
        </label>
      `).join("")}
    </div>
    <div class="navButtons">
      ${current !== 0 ? `<button id="prevBtn">Previous</button>` : ""}
      <button id="submit">Submit</button>
      ${current !== events.length - 1 ? `<button id="nextBtn">Next</button>` : ""}
    </div>
  `;

  document.getElementById("submit").onclick = checkAnswer;
  if(document.getElementById("prevBtn")) {
    document.getElementById("prevBtn").onclick = () => { current--; loadQuestion(); };
  }
  if(document.getElementById("nextBtn")) {
    document.getElementById("nextBtn").onclick = () => { current++; loadQuestion(); };
  }
}

// ----------------------
// RUN ANSWER CHECK
// ----------------------
function checkAnswer() {
  const selected = document.querySelector("input[name='opt']:checked");
  if (!selected) { alert("Please select an option."); return; }

  const answer = parseInt(selected.value);
  const q = events[current];

  if (!q.answered) {
    q.answered = true;
    if (answer === q.correct) {
      score++;
      quizResult.innerHTML = `<div class="successMsg">Correct</div>`;
    } else {
      quizResult.innerHTML = `<div class="wrongMsg">Incorrect</div>`;
    }
    showMemory(q);
  }

  quizResult.innerHTML += `
    <div class="scoreBoard">
      Current Score: ${score} / ${events.length}
    </div>
  `;

  if (current === events.length - 1) {
    quizResult.innerHTML += `
      <div class="final-notice">
        Note: Please hit the music icon in the corner to pause the song
      </div>
      <button id="finishQuizBtn" style="margin-top: 5px; width: 100%;">
        Now Open Surprise!
      </button>
    `;
    document.getElementById("finishQuizBtn").onclick = showFinalResult;
  }
}

// ----------------------
// LIGHTBOX CONTROLS (FIXED MULTI-MEDIA ARROWS)
// ----------------------
const lightbox = document.getElementById("lightbox");
const lightboxOverlay = document.getElementById("lightboxOverlay");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxCaption = document.getElementById("lightboxCaption");
let lightboxMedia = [];
let lightboxIndex = 0;

function showMemory(eventObj) {
  // Combine all images and videos into a single clean list
  lightboxMedia = [...eventObj.photos, ...eventObj.videos].filter(Boolean);
  lightboxIndex = 0; 
  
  if (lightboxMedia.length === 0) return;

  // Render the initial asset and caption text
  showLightboxItem();
  lightboxCaption.innerHTML = eventObj.caption;

  // Safely show or hide directional arrows based on total items available
  const prevArrow = document.getElementById("lightboxPrev");
  const nextArrow = document.getElementById("lightboxNext");
  const displayMode = lightboxMedia.length > 1 ? "block" : "none";
  
  prevArrow.style.display = displayMode;
  nextArrow.style.display = displayMode;

  // Clear previous click configurations to prevent overlapping track steps
  prevArrow.onclick = null;
  nextArrow.onclick = null;

  // Assign clean, independent rotation steps
  prevArrow.onclick = (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex - 1 + lightboxMedia.length) % lightboxMedia.length;
    showLightboxItem();
  };

  nextArrow.onclick = (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex + 1) % lightboxMedia.length;
    showLightboxItem();
  };

  lightboxOverlay.classList.remove("hidden");
  lightbox.classList.remove("hidden");
}

function showLightboxItem() {
  const item = lightboxMedia[lightboxIndex];
  if (item.endsWith(".mp4")) {
    lightboxContent.innerHTML = `<video controls autoplay loop style="width:100%; max-height:50vh; border-radius:12px;"><source src="assets/videos/${item}" type="video/mp4"></video>`;
  } else {
    lightboxContent.innerHTML = `<img src="assets/images/${item}" style="width:100%; max-height:50vh; border-radius:12px; object-fit:contain;">`;
  }
}

function closeLightbox() {
  lightboxOverlay.classList.add("hidden");
  lightbox.classList.add("hidden");
  lightboxContent.innerHTML = "";
}

document.getElementById("lightboxClose").onclick = closeLightbox;
lightboxOverlay.onclick = closeLightbox;

// FIXED: Navigating forwards and backwards now works perfectly across arrays with 2+ entries
document.getElementById("lightboxPrev").onclick = (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex - 1 + lightboxMedia.length) % lightboxMedia.length;
  showLightboxItem();
};
document.getElementById("lightboxNext").onclick = (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex + 1) % lightboxMedia.length;
  showLightboxItem();
};

// ----------------------
// SURPRISE FINAL DESTINATION CONTROLS
// ----------------------
const surpriseModal = document.getElementById("surpriseModal");
const surpriseOverlay = document.getElementById("surpriseOverlay");

function showFinalResult() {
  quizSection.classList.add("hidden");

  if (score >= 5) {
    surpriseOverlay.classList.remove("hidden");
    surpriseModal.classList.remove("hidden");
    const surpriseVideo = document.getElementById("surpriseVideo");
    if (surpriseVideo) {
      surpriseVideo.load();
      surpriseVideo.play().catch(e => console.log("Playback interaction traced:", e));
    }
  } else {
    alert(`You scored ${score}/${events.length}\n\nRequirements unfulfilled.`);
    showLoveYouScreen();
  }
}

document.getElementById("surpriseClose").onclick = closeSurprise;
surpriseOverlay.onclick = closeSurprise;

function closeSurprise() {
  surpriseOverlay.classList.add("hidden");
  surpriseModal.classList.add("hidden");
  const surpriseVideo = document.getElementById("surpriseVideo");
  if (surpriseVideo) surpriseVideo.pause();
  
  showLoveYouScreen();
}

function showLoveYouScreen() {
  const container = document.querySelector(".container");
  if (container) {
    container.innerHTML = `
      <div class="love-layout">
        <h1>Love you ❤️</h1>
      </div>
    `;
  }
}

// ----------------------
// AUDIO TOGGLE CONTEXT
// ----------------------
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
musicToggle.onclick = () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.innerHTML = "🎶";
  } else {
    bgMusic.pause();
    musicToggle.innerHTML = "🔇";
  }
};