// ==================== Theme Toggle ====================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Toggle de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // ==================== Máscaras de Input ====================
    
    // Máscara de data (DD/MM/YYYY)
    const dateInputs = document.querySelectorAll('input[type="date"], input[name="data"]');
    dateInputs.forEach(input => {
        // Se for input type="date", não aplicar máscara (browser nativo é melhor)
        if (input.type === 'date') {
            return;
        }
        
        input.setAttribute('placeholder', 'DD/MM/AAAA');
        input.setAttribute('maxlength', '10');
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            if (value.length >= 5) {
                value = value.substring(0, 5) + '/' + value.substring(5, 9);
            }
            
            e.target.value = value;
        });
        
        input.addEventListener('blur', function(e) {
            validateDate(e.target);
        });
    });
    
    // Máscara de valor monetário
    const valorInputs = document.querySelectorAll('input[name="valor"]');
    valorInputs.forEach(input => {
        input.setAttribute('placeholder', '0,00');
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value === '') {
                e.target.value = '';
                return;
            }
            
            // Converter para float e formatar
            value = (parseInt(value) / 100).toFixed(2);
            value = value.replace('.', ',');
            
            e.target.value = value;
        });
        
        input.addEventListener('blur', function(e) {
            validateValor(e.target);
        });
    });
    
    // ==================== Validações de Formulário ====================
    
    // Formulário de Login
    const loginForm = document.querySelector('form[action*="login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = loginForm.querySelector('input[name="username"]');
            const password = loginForm.querySelector('input[name="password"]');
            
            let valid = true;
            
            if (!username.value.trim()) {
                showError(username, 'E-mail é obrigatório');
                valid = false;
            } else {
                clearError(username);
            }
            
            if (!password.value.trim()) {
                showError(password, 'Senha é obrigatória');
                valid = false;
            } else {
                clearError(password);
            }
            
            if (!valid) {
                e.preventDefault();
            }
        });
    }
    
    // Formulário de Cadastro
    const cadastroForm = document.querySelector('form[action*="cadastro"]');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            const nome = cadastroForm.querySelector('input[name="nome"]');
            const email = cadastroForm.querySelector('input[name="email"]');
            const password1 = cadastroForm.querySelector('input[name="password1"]');
            const password2 = cadastroForm.querySelector('input[name="password2"]');
            
            let valid = true;
            
            if (!nome || !nome.value.trim()) {
                if (nome) showError(nome, 'Nome é obrigatório');
                valid = false;
            } else {
                clearError(nome);
            }
            
            if (!email || !email.value.trim()) {
                if (email) showError(email, 'E-mail é obrigatório');
                valid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'E-mail inválido');
                valid = false;
            } else {
                clearError(email);
            }
            
            if (!password1 || !password1.value.trim()) {
                if (password1) showError(password1, 'Senha é obrigatória');
                valid = false;
            } else if (password1.value.length < 6) {
                showError(password1, 'Senha deve ter no mínimo 6 caracteres');
                valid = false;
            } else {
                clearError(password1);
            }
            
            if (!password2 || !password2.value.trim()) {
                if (password2) showError(password2, 'Confirmação de senha é obrigatória');
                valid = false;
            } else if (password1 && password1.value !== password2.value) {
                showError(password2, 'As senhas não coincidem');
                valid = false;
            } else {
                clearError(password2);
            }
            
            if (!valid) {
                e.preventDefault();
            }
        });
    }
    
    // Formulário de Gasto
    const gastoForm = document.querySelector('.standard-form');
    if (gastoForm && !gastoForm.getAttribute('action')?.includes('cadastro')) {
        gastoForm.addEventListener('submit', function(e) {
            const descricao = gastoForm.querySelector('input[name="descricao"], textarea[name="descricao"]');
            const valor = gastoForm.querySelector('input[name="valor"]');
            const data = gastoForm.querySelector('input[name="data"]');
            
            let valid = true;
            
            if (!descricao || !descricao.value.trim()) {
                if (descricao) showError(descricao, 'Descrição é obrigatória');
                valid = false;
            } else {
                clearError(descricao);
            }
            
            if (!valor || !valor.value.trim()) {
                if (valor) showError(valor, 'Valor é obrigatório');
                valid = false;
            } else if (!validateValor(valor)) {
                valid = false;
            } else {
                clearError(valor);
            }
            
            if (!data || !data.value.trim()) {
                if (data) showError(data, 'Data é obrigatória');
                valid = false;
            } else if (data.type !== 'date' && !validateDate(data)) {
                valid = false;
            } else {
                clearError(data);
            }
            
            if (!valid) {
                e.preventDefault();
            }
        });
    }
    
    // ==================== Toggle de Senha ====================
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        // Adicionar ícone de olho
        toggle.innerHTML = '👁️';
        toggle.type = 'button'; // Prevenir submit
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.parentElement.querySelector('input');
            
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '🙈';
            } else {
                input.type = 'password';
                this.innerHTML = '👁️';
            }
        });
    });
    
    // ==================== Confirmação de Exclusão ====================
    const deleteForms = document.querySelectorAll('form[action*="excluir"]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const modal = createConfirmModal(
                'Confirmar Exclusão',
                'Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita.',
                function() {
                    form.submit();
                }
            );
            
            document.body.appendChild(modal);
            modal.classList.add('active');
        });
    });
    
    // ==================== Auto-hide Messages ====================
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
});

// ==================== Funções de Validação ====================

function validateDate(input) {
    if (input.type === 'date') {
        return true; // Browser nativo já valida
    }
    
    const value = input.value;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    if (!regex.test(value)) {
        showError(input, 'Data inválida. Use o formato DD/MM/AAAA');
        return false;
    }
    
    const [, day, month, year] = value.match(regex);
    const date = new Date(year, month - 1, day);
    
    if (date.getDate() != day || date.getMonth() + 1 != month || date.getFullYear() != year) {
        showError(input, 'Data inválida');
        return false;
    }
    
    clearError(input);
    return true;
}

function validateValor(input) {
    const value = input.value.replace(',', '.');
    const numero = parseFloat(value);
    
    if (isNaN(numero) || numero <= 0) {
        showError(input, 'Valor deve ser maior que zero');
        return false;
    }
    
    clearError(input);
    return true;
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(input, message) {
    input.classList.add('error');
    
    // Remover erro anterior se existir
    const existingError = input.parentElement.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Adicionar novo erro
    const error = document.createElement('small');
    error.className = 'form-error';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function clearError(input) {
    if (input) {
        input.classList.remove('error');
        const error = input.parentElement.querySelector('.form-error');
        if (error && !error.textContent.includes('{{ form.')) {
            // Não remover erros do Django
            error.remove();
        }
    }
}

// ==================== Modal de Confirmação ====================

function createConfirmModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button type="button" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline modal-cancel">Cancelar</button>
                <button type="button" class="btn btn-danger modal-confirm">Confirmar</button>
            </div>
        </div>
    `;
    
    // Event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 200);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
        onConfirm();
        closeModal();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

// ==================== Animação de Slide Out ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);