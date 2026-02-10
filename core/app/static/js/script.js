document.addEventListener('DOMContentLoaded', () => {

    // ==================== Tema ====================
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // ==================== Toggle de senha ====================
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.type = 'button';
        toggle.textContent = '👁️';

        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            if (!input) return;

            if (input.type === 'password') {
                input.type = 'text';
                toggle.textContent = '🙈';
            } else {
                input.type = 'password';
                toggle.textContent = '👁️';
            }
        });
    });

    // ==================== Modal de exclusão ====================
    document.querySelectorAll('form[action*="excluir"]').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const modal = createConfirmModal(
                'Confirmar exclusão',
                'Tem certeza que deseja excluir este gasto? Essa ação não pode ser desfeita.',
                () => form.submit()
            );

            document.body.appendChild(modal);
            modal.classList.add('active');
        });
    });

    // ==================== Auto-hide mensagens ====================
    document.querySelectorAll('.message').forEach(msg => {
        setTimeout(() => {
            msg.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        }, 5000);
    });

});


// ==================== Modal ====================
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

    const close = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('.modal-cancel').addEventListener('click', close);
    modal.querySelector('.modal-confirm').addEventListener('click', () => {
        onConfirm();
        close();
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) close();
    });

    return modal;
}


// ==================== Animação ====================
const style = document.createElement('style');
style.textContent = `
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}`;
document.head.appendChild(style);
