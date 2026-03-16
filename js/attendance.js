const studentAttendance = {
    totalLectures: 120,
    presentLectures: 94
};

function updateAttendanceDashboard() {
    const total = studentAttendance.totalLectures;
    const present = studentAttendance.presentLectures;
    const currentPercent = (present / total) * 100;

    document.getElementById('att-value').innerText = `${currentPercent.toFixed(1)}%`;
    
    const safeToSkip = Math.floor((present / 0.75) - total);
    document.getElementById('safe-skip').innerText = safeToSkip > 0 ? `${safeToSkip} Classes` : "0 (Warning)";

    const recoveryNeeded = Math.ceil((0.85 * total - present) / 0.15);
    document.getElementById('recover-val').innerText = recoveryNeeded > 0 ? `Attend ${recoveryNeeded} more` : "Goal Met";
}

function setAttendance(present, total) {
    studentAttendance.presentLectures = present;
    studentAttendance.totalLectures = total;
    updateAttendanceDashboard();
}

window.addEventListener('load', updateAttendanceDashboard);
