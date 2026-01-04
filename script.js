// ฟังก์ชันจัดการ Modal รูปใหญ่
function openModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modal.classList.remove('hidden');
    modalImg.src = src;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ปิด Modal ด้วยปุ่ม Esc
document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });