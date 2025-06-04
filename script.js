document.addEventListener("DOMContentLoaded", () => {
  const passwordField = document.getElementById("password");
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");
  const strengthBar = document.getElementById("strengthBar");
  const strengthLabel = document.getElementById("strengthLabel");
  const themeToggle = document.getElementById("themeToggle");

  const charset = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789",
    symbol: "@#$",
  };

  function generatePassword() {
    const length = 16;
    let all = charset.upper + charset.lower + charset.number + charset.symbol;
    let password = [
      randomChar(charset.upper),
      randomChar(charset.lower),
      randomChar(charset.number),
      randomChar(charset.symbol),
    ];

    for (let i = 4; i < length; i++) {
      password.push(randomChar(all));
    }

    password = shuffle(password).join("");
    passwordField.value = password;
    updateStrength(password);
    passwordField.classList.add("pop");
    setTimeout(() => passwordField.classList.remove("pop"), 300);
  }

  function randomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
  }

  function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
  }

  function copyPassword() {
    navigator.clipboard.writeText(passwordField.value);
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    copyBtn.style.backgroundColor = "var(--success)";
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy Password';
      copyBtn.style.backgroundColor = "";
    }, 2000);
  }

  function updateStrength(password) {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@#$]/.test(password)) score++;

    strengthBar.className = "strength-bar";
    if (score >= 5) {
      strengthBar.classList.add("strength-very-strong");
      strengthLabel.textContent = "Very Strong";
    } else if (score === 4) {
      strengthBar.classList.add("strength-strong");
      strengthLabel.textContent = "Strong";
    } else if (score === 3) {
      strengthBar.classList.add("strength-medium");
      strengthLabel.textContent = "Medium";
    } else {
      strengthBar.classList.add("strength-weak");
      strengthLabel.textContent = "Weak";
    }
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode") ? "enabled" : "disabled"
    );
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const icon = themeToggle.querySelector("i");
    icon.className = document.body.classList.contains("dark-mode")
      ? "fas fa-sun"
      : "fas fa-moon";
  }

  function checkThemePreference() {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
    }
    updateThemeIcon();
  }

  generateBtn.addEventListener("click", generatePassword);
  copyBtn.addEventListener("click", copyPassword);
  themeToggle.addEventListener("click", toggleTheme);

  checkThemePreference();
  generatePassword();
});
