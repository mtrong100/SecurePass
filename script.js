document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        lengthSlider: document.getElementById('length'),
        lengthValue: document.getElementById('lengthValue'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols'),
        excludeSimilar: document.getElementById('excludeSimilar'),
        passwordField: document.getElementById('password'),
        generateBtn: document.getElementById('generateBtn'),
        copyBtn: document.getElementById('copyBtn'),
        refreshBtn: document.getElementById('refreshBtn'),
        strengthBar: document.getElementById('strengthBar'),
        strengthLabel: document.getElementById('strengthLabel'),
        themeToggle: document.getElementById('themeToggle')
    };

    // Character sets
    const charSets = {
        uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
        lowercase: 'abcdefghijkmnpqrstuvwxyz',
        numbers: '23456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        similar: 'il1Lo0O'
    };

    // Initialize
    updateLengthDisplay();
    generatePassword();
    checkThemePreference();

    // Event Listeners
    elements.lengthSlider.addEventListener('input', updateLengthDisplay);
    elements.generateBtn.addEventListener('click', generatePassword);
    elements.refreshBtn.addEventListener('click', generatePassword);
    elements.copyBtn.addEventListener('click', copyPassword);
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Functions
    function updateLengthDisplay() {
        elements.lengthValue.textContent = elements.lengthSlider.value;
    }

    function generatePassword() {
        let charset = '';
        let password = '';
        
        // Build character set based on selected options
        if (elements.uppercase.checked) charset += charSets.uppercase;
        if (elements.lowercase.checked) charset += charSets.lowercase;
        if (elements.numbers.checked) charset += charSets.numbers;
        if (elements.symbols.checked) charset += charSets.symbols;
        
        // If no character types are selected, use all
        if (!charset) {
            charset = Object.values(charSets).slice(0, 4).join('');
            elements.uppercase.checked = true;
            elements.lowercase.checked = true;
            elements.numbers.checked = true;
            elements.symbols.checked = true;
        }
        
        // Exclude similar characters if option is checked
        if (elements.excludeSimilar.checked) {
            charset = [...charset].filter(char => !charSets.similar.includes(char)).join('');
        }
        
        // Generate password
        const length = elements.lengthSlider.value;
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        elements.passwordField.value = password;
        updatePasswordStrength(password);
    }

    function updatePasswordStrength(password) {
        let strength = 0;
        const length = password.length;
        
        // Length contributes to strength
        if (length >= 8) strength += 1;
        if (length >= 12) strength += 2;
        if (length >= 16) strength += 2;
        
        // Character variety contributes to strength
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 2;
        
        // Update UI
        elements.strengthBar.className = 'strength-bar';
        
        if (strength <= 3) {
            elements.strengthBar.classList.add('strength-weak');
            elements.strengthLabel.textContent = 'Weak';
            elements.strengthLabel.style.color = 'var(--strength-weak)';
        } else if (strength <= 5) {
            elements.strengthBar.classList.add('strength-medium');
            elements.strengthLabel.textContent = 'Medium';
            elements.strengthLabel.style.color = 'var(--strength-medium)';
        } else if (strength <= 7) {
            elements.strengthBar.classList.add('strength-strong');
            elements.strengthLabel.textContent = 'Strong';
            elements.strengthLabel.style.color = 'var(--strength-strong)';
        } else {
            elements.strengthBar.classList.add('strength-very-strong');
            elements.strengthLabel.textContent = 'Very Strong';
            elements.strengthLabel.style.color = 'var(--strength-very-strong)';
        }
    }

    function copyPassword() {
        elements.passwordField.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalIcon = elements.copyBtn.innerHTML;
        elements.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        elements.copyBtn.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
            elements.copyBtn.innerHTML = originalIcon;
            elements.copyBtn.style.backgroundColor = '';
        }, 2000);
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const icon = elements.themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    function checkThemePreference() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
        updateThemeIcon();
    }
});