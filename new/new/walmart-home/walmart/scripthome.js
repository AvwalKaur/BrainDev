const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.features');
hiddenElements.forEach((el) => observer.observe(el));

const cards = document.querySelectorAll('.flip-card-inner');

cards.forEach(card => {
  card.parentElement.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

function toggleBio(element) {
  element.classList.toggle("active");
}

const phrases = [
  "LIVE ORCHESTRATION",
  "CRISIS AVERSION",
  "CENTRALISATION",
  "SEARCHABLE DIRECTORY"
];

let phraseIndex = 0;
let charIndex = 0;
const typingText = document.getElementById("typingText");

function typePhrase() {
  if (charIndex <= phrases[phraseIndex].length) {
    typingText.textContent = phrases[phraseIndex].substring(0, charIndex++);
    setTimeout(typePhrase, 100);
  } else {
    setTimeout(() => {
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typePhrase();
    }, 2000);
  }
}

typePhrase();


// Same typing animation code as before
const featureTexts = [
  { title: "LIVE ORCHESTRATION", desc: "Enables real-time control over AI agents across delivery, inventory, and supply chain operations, including Start, Stop, and Reset functionality while providing key operational metrics such as uptime for each agent to support informed decision-making." },
  { title: "CRISIS AVERSION", desc: "In times of crisis, the platform enables immediate response by allowing administrators to halt all agent operations with a single action. During crises, the platform allows swift system-wide shutdown of all agents, helping contain disruptions and maintain stability." },
  { title: "CENTRALISATION", desc: "Enables real-time control over AI agents across delivery, inventory, and supply chain operations, including Start, Stop, and Reset functionality while providing key operational metrics such as uptime for each agent to support informed decision-making" },
  { title: "SEARCHABLE DIRECTORY", desc: "The website centralizes control by enabling quick search and access to AI agents based on name, type, location, or status—streamlining operations and decision-making." }
];

function typeWriter(element, text, speed, callback) {
  let i = 0;
  element.textContent = "";
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }
  typing();
}

function animateFeatures() {
  typeWriter(document.querySelector('.typing-title-1'), featureTexts[0].title, 50, () => {
    document.querySelector('.text-1').textContent = featureTexts[0].desc;
    document.querySelector('.text-1').classList.add('show');
    
    setTimeout(() => {
      typeWriter(document.querySelector('.typing-title-2'), featureTexts[1].title, 50, () => {
        document.querySelector('.text-2').textContent = featureTexts[1].desc;
        document.querySelector('.text-2').classList.add('show');
        
        setTimeout(() => {
          typeWriter(document.querySelector('.typing-title-3'), featureTexts[2].title, 50, () => {
            document.querySelector('.text-3').textContent = featureTexts[2].desc;
            document.querySelector('.text-3').classList.add('show');
            
            setTimeout(() => {
              typeWriter(document.querySelector('.typing-title-4'), featureTexts[3].title, 50, () => {
                document.querySelector('.text-4').textContent = featureTexts[3].desc;
                document.querySelector('.text-4').classList.add('show');
              });
            }, 500);
          });
        }, 500);
      });
    }, 500);
  });
}

// Same intersection observer
const featuresObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateFeatures();
      featuresObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.5});

featuresObserver.observe(document.querySelector('.features-flex'));
document.querySelectorAll('.team-member').forEach(member => {
    member.addEventListener('click', () => {
        member.classList.toggle('flipped');
    });
});


