// =============================================
// CU SmartDesk | Attendance Analytics Engine
// =============================================

const studentAttendance = {
    totalLectures: 120,
    presentLectures: 94,
    minThreshold: 0.75,
    proThreshold: 0.85
};

function updateAttendanceDashboard() {
    const total = studentAttendance.totalLectures;
    const present = studentAttendance.presentLectures;
    const currentPercent = (present / total) * 100;

    // Update percentage display
    const attValue = document.getElementById('att-value');
    if (attValue) attValue.innerText = `${currentPercent.toFixed(1)}%`;

    // Update gauge color based on status
    const gauge = document.querySelector('.att-gauge');
    if (gauge) {
        if (currentPercent >= 85) {
            gauge.style.borderColor = '#16a34a';
            gauge.style.color = '#16a34a';
        } else if (currentPercent >= 75) {
            gauge.style.borderColor = '#d97706';
            gauge.style.color = '#d97706';
        } else {
            gauge.style.borderColor = '#CC0000';
            gauge.style.color = '#CC0000';
        }
    }

    // Safe to skip: how many can you miss and still stay above 75%?
    // If present/( total + x ) >= 0.75, then x = floor(present/0.75 - total)
    const safeToSkip = Math.floor(present / 0.75 - total);
    const safeEl = document.getElementById('safe-skip');
    if (safeEl) {
        safeEl.innerText = safeToSkip > 0 ? `${safeToSkip} Classes` : '0 (At Risk!)';
        safeEl.style.color = safeToSkip > 0 ? '#16a34a' : '#CC0000';
    }

    // Recovery plan: attend X consecutive classes to reach 85%
    // Need: (present + x) / (total + x) >= 0.85
    // Solving: x >= (0.85*total - present) / 0.15
    const recoveryNeeded = Math.ceil((0.85 * total - present) / 0.15);
    const recoverEl = document.getElementById('recover-val');
    if (recoverEl) {
        recoverEl.innerText = recoveryNeeded > 0 ? `Attend ${recoveryNeeded} more` : '✅ Goal Met!';
        recoverEl.style.color = recoveryNeeded > 0 ? '#d97706' : '#16a34a';
    }

    // Update progress bar if exists
    const progressBar = document.getElementById('att-progress');
    if (progressBar) {
        progressBar.style.width = `${Math.min(currentPercent, 100)}%`;
    }
}

function setAttendance(present, total) {
    studentAttendance.presentLectures = present;
    studentAttendance.totalLectures = total;
    updateAttendanceDashboard();
}

window.addEventListener('load', updateAttendanceDashboard);
