document.addEventListener('DOMContentLoaded', () => {

    // --- Sidebar Toggle for Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // --- Modal Handling ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('show');
    }

    window.closeModal = function() {
        document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('show'));
    }

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
    });

    // --- Page-Specific Initializations ---
    const path = window.location.pathname.split("/").pop();

    if (path === 'live-results.html') initializeCharts();
    if (path === 'voting-page.html') setupVotingPage();
    
    // --- Event Listeners ---
    document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => handleLogin(e, 'admin-dashboard.html'));
    document.getElementById('voterLoginForm')?.addEventListener('submit', (e) => handleLogin(e, 'voting-page.html'));
    document.querySelectorAll('.logout-btn').forEach(btn => btn.addEventListener('click', handleLogout));
});

function handleLogin(event, redirectUrl) {
    event.preventDefault();
    showToast('Login Successful!', 'success');
    setTimeout(() => window.location.href = redirectUrl, 1000);
}

function handleLogout(event) {
    event.preventDefault();
    showToast('You have been logged out.');
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function setupVotingPage() {
    document.querySelectorAll('.vote-btn').forEach(button => {
        button.addEventListener('click', () => {
            const candidateName = button.getAttribute('data-candidate');
            document.getElementById('candidateNameSpan').textContent = candidateName;
            openModal('confirmationModal');
        });
    });

    document.getElementById('confirmVoteBtn')?.addEventListener('click', () => {
        showToast('Your vote has been recorded!', 'success');
        setTimeout(() => window.location.href = 'thankyou.html', 1500);
    });
}

function initializeCharts() {
    const ctxBar = document.getElementById('votesBarChart')?.getContext('2d');
    const ctxPie = document.getElementById('votesPieChart')?.getContext('2d');
    if (!ctxBar || !ctxPie) return;

    const candidateLabels = ['Alex Chen', 'Priya Patel', 'Diego Ruiz', 'Lena Novak'];
    let voteData = [112, 38, 41, 198];

    const barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: candidateLabels,
            datasets: [{
                label: 'Votes', data: voteData,
                backgroundColor: 'rgba(37, 99, 235, 0.8)', borderRadius: 8,
            }]
        },
        options: { scales: { y: { beginAtZero: true } }, responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }}}
    });

    const pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: candidateLabels,
            datasets: [{ data: voteData, backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}}
    });

    setInterval(() => {
        voteData[Math.floor(Math.random() * voteData.length)] += Math.floor(Math.random() * 5) + 1;
        barChart.data.datasets[0].data = [...voteData];
        pieChart.data.datasets[0].data = [...voteData];
        barChart.update('none');
        pieChart.update('none');
    }, 3000);
}

// --- Toast Notification ---
function showToast(message, type = 'default') {
    const existingToast = document.querySelector('.toast');
    if(existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    document.body.appendChild(toast);
    
    const styleId = 'toast-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .toast { position: fixed; bottom: 20px; left: 50%; background-color: #333; color: white;
                padding: 12px 24px; border-radius: 8px; font-family: 'Poppins', sans-serif;
                z-index: 3000; opacity: 0; transform: translate(-50%, 100px); transition: all 0.4s ease; }
            .toast.toast-success { background-color: var(--primary-green); }
            .toast.show { transform: translate(-50%, 0); opacity: 1; }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
