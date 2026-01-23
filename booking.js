   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzkBW-2Y8e_tE8b3S2iuDFT4AadO7CNRAtsDUnwQZyg55GkvkxQeaD0ROlXYhXw0Kk2/exec"; 
    
    const trips = [
        { id: 101, origin: 'กรุงเทพฯ', destination: 'อุบลราชธานี', time: '20:30', arrival: '04:30', price: 685, type: 'VIP 24', boarding: 'สถานีขนส่งหมอชิต 2',dropoff: 'บขส. อุบลราชธานี',durationHours: 8},
        { id: 102, origin: 'กรุงเทพฯ', destination: 'อุบลราชธานี', time: '21:30', arrival: '05:30', price: 685, type: 'VIP 24', boarding: 'สถานีขนส่งหมอชิต 2',dropoff: 'บขส. อุบลราชธานี',durationHours: 8},
		{ id: 103, origin: 'อุบลราชธานี', destination: 'กรุงเทพฯ', time: '22:30', arrival: '06:30', price: 685, type: 'VIP 24', boarding: 'บขส. อุบลราชธานี',dropoff: 'สถานีขนส่งหมอชิต 2',durationHours: 8},
		{ id: 104, origin: 'อุบลราชธานี', destination: 'กรุงเทพฯ', time: '23:30', arrival: '07:30', price: 685, type: 'VIP 24', boarding: 'บขส. อุบลราชธานี',dropoff: 'สถานีขนส่งหมอชิต 2',durationHours: 8},
        { id: 201, origin: 'กรุงเทพฯ', destination: 'นครราชสีมา', time: '17:00', arrival: '20:00', price: 385, type: 'VIP 32', boarding: 'สถานีขนส่งหมอชิต 2',dropoff: 'บขส. นครราชสีมา',durationHours: 3},
		{ id: 202, origin: 'กรุงเทพฯ', destination: 'นครราชสีมา', time: '18:00', arrival: '21:00', price: 385, type: 'VIP 32', boarding: 'สถานีขนส่งหมอชิต 2',dropoff: 'บขส. นครราชสีมา',durationHours: 3},
		{ id: 203, origin: 'นครราชสีมา', destination: 'กรุงเทพฯ', time: '19:30', arrival: '22:30', price: 385, type: 'VIP 24', boarding: 'บขส. นครราชสีมา',dropoff: 'สถานีขนส่งหมอชิต 2',durationHours: 3},
        { id: 204, origin: 'นครราชสีมา', destination: 'กรุงเทพฯ', time: '20:30', arrival: '23:30', price: 385, type: 'VIP 24', boarding: 'บขส. นครราชสีมา',dropoff: 'สถานีขนส่งหมอชิต 2',durationHours: 3},
		{ id: 301, origin: 'กรุงเทพฯ', destination: 'เชียงใหม่', time: '07:30', arrival: '17:30', price: 785, type: 'VIP 32', boarding: 'สถานีขนส่งหมอชิต 2',dropoff: 'บขส. เชียงใหม่',durationHours: 9,},
		{ id: 302, origin: 'กรุงเทพฯ', destination: 'เชียงใหม่', time: '08:30', arrival: '18:30', price: 785, type: 'VIP 32', boarding: 'สถานีขนส่งหมอชิต 2',dropoff: 'บขส. เชียงใหม่',durationHours: 9,},
        { id: 303, origin: 'เชียงใหม่', destination: 'กรุงเทพฯ', time: '18:00', arrival: '04:30', price: 785, type: 'VIP 32', boarding: 'บขส. เชียงใหม่',dropoff: 'สถานีขนส่งหมอชิต 2',durationHours: 9,},
        { id: 304, origin: 'เชียงใหม่', destination: 'กรุงเทพฯ', time: '19:00', arrival: '05:30', price: 785, type: 'VIP 32', boarding: 'บขส. เชียงใหม่',dropoff: 'สถานีขนส่งหมอชิต 2',durationHours: 9,}
    ];
    let bookedSeatsStore = []; 
    let selectedSeats = [];
    let currentTrip = null;

    function showSearchPage() { hideAllPages(); document.getElementById('search-page').classList.remove('hidden-section'); updateStepper(1); }
    function hideAllPages() { document.querySelectorAll('[id$="-page"]').forEach(el => el.classList.add('hidden-section')); document.getElementById('summary-bar').classList.add('translate-y-full'); }
    
// 3. ปรับฟังก์ชันเปิดหน้าเลือกที่นั่งให้เป็นอันเดียว (เรียกจากปุ่มใน handleSearch)
async function showSeatPage(tripId) { 
    currentTrip = trips.find(t => t.id === tripId); 
    selectedSeats = []; 
    hideAllPages(); 
    document.getElementById('seat-page').classList.remove('hidden-section');
    document.getElementById('seat-trip-info').innerText = `${currentTrip.origin} - ${currentTrip.destination} (${currentTrip.time})`;
    document.getElementById('seat-date-info').innerText = document.getElementById('travel-date').value;
    
    updateSummary(); 
    updateStepper(2); 
    
    // โหลดข้อมูลจาก Google Sheets และวาดที่นั่ง
    await loadBookedSeats(); 
}

    function showSeatPageDirect() {
        hideAllPages();
        document.getElementById('seat-page').classList.remove('hidden-section');
        updateSummary();
        updateStepper(2);
    }
	

// 1. ปรับฟังก์ชันโหลดที่นั่ง ให้ใช้ค่าจาก currentTrip โดยตรง
async function loadBookedSeats() {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '<div class="text-center py-10 text-gray-400 animate-pulse">กำลังตรวจสอบที่นั่งล่าสุด...</div>';
    try {
        const travelDate = document.getElementById('travel-date').value;
        const tripDetail = `${currentTrip.origin}-${currentTrip.destination} (${currentTrip.time})`;
        const res = await fetch(`${SCRIPT_URL}?date=${travelDate}&trip=${encodeURIComponent(tripDetail)}&_t=${Date.now()}`);
        const data = await res.json();
        bookedSeatsStore = Array.isArray(data) ? data.map(s => s.toString().trim().toUpperCase()) : [];
        
        // แก้จุดนี้: ส่งประเภทรถที่ถูกต้องไปวาด Grid
        renderSeats(currentTrip.type); 
    } catch (e) { 
        grid.innerHTML = '<div class="text-center text-red-500">โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่</div>';
    }
}

// 2. ปรับการเช็คเงื่อนไข String ให้รองรับ 'VIP 24' และ 'VIP 32'
function renderSeats(busType) {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '<div class="flex justify-between mb-4 border-b pb-2 text-[10px] text-gray-300 uppercase font-bold"><span>ประตู (DOOR)</span><span>คนขับ (DRIVER)</span></div>';

    let html = '';
    // เช็คว่าในชื่อประเภทมีคำว่า '24' หรือไม่
    const isVIP24 = busType && busType.includes('24');
    
    if (isVIP24) {
        for (let i = 1; i <= 8; i++) {
            html += `
                <div class="flex justify-between items-center mb-4">
                    <div class="flex">${createSeatHtml(i + 'A')}</div>
                    <div class="w-10 text-center text-[10px] text-slate-200 opacity-0">.</div>
                    <div class="flex gap-3">
                        ${createSeatHtml(i + 'B')}
                        ${createSeatHtml(i + 'C')}
                    </div>
                </div>`;
        }
    } else {
        // สำหรับ 'VIP 32' หรืออื่นๆ
        for (let i = 1; i <= 8; i++) {
            html += `
                <div class="flex justify-between items-center mb-4">
                    <div class="flex gap-3">
                        ${createSeatHtml(i + 'A')}
                        ${createSeatHtml(i + 'B')}
                    </div>
                    <div class="w-6"></div>
                    <div class="flex gap-3">
                        ${createSeatHtml(i + 'C')}
                        ${createSeatHtml(i + 'D')}
                    </div>
                </div>`;
        }
    }
    grid.innerHTML += html;
}

function selectTrip(tripId) {
    // สมมติว่าหาข้อมูลจากรายการเที่ยวรถ
    const trip = trips.find(t => t.id === tripId); 
    const busType = trip.type; // 'VIP' หรือ 'STD'
    
    // แสดงหน้าเลือกที่นั่ง
    showPage('seat-page');
    
    // ส่งประเภทรถไปวาดที่นั่ง
    renderSeats(busType);
}
	
	function backToSeats() {
    // 1. ซ่อนหน้าปัจจุบัน
    hideAllPages();
    
    // 2. แสดงหน้าเลือกที่นั่ง (ID: seat-page ตามโค้ดเดิมของคุณ)
    const seatPage = document.getElementById('seat-page');
    if (seatPage) {
        seatPage.classList.remove('hidden-section');
    }
    
    // 3. อัปเดตตัวบอกขั้นตอน (Stepper) ให้กลับไปที่ขั้นตอนที่ 2
    updateStepper(2);
    
    // 4. เลื่อนหน้าจอขึ้นไปด้านบนสุดเพื่อให้เห็นข้อมูลชัดเจน
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



    function createSeatHtml(id) {
        const seatId = id.toUpperCase();
        const isOccupied = bookedSeatsStore.includes(seatId);
        if (isOccupied) return `<div class="seat seat-occupied">${id}</div>`;
        const isSelected = selectedSeats.includes(id);
        return `<div class="seat ${isSelected ? 'seat-selected' : 'seat-available'}" onclick="toggleSeat(this, '${id}')">${id}</div>`;
    }

    function toggleSeat(el, id) { 
        if (bookedSeatsStore.includes(id.toUpperCase())) return;
        if (selectedSeats.includes(id)) { 
            selectedSeats = selectedSeats.filter(s => s !== id); 
        } else { 
            selectedSeats.push(id); 
        } 
        renderSeats(); 
        updateSummary(); 
    }

    function updateSummary() { 
        const bar = document.getElementById('summary-bar'); 
        const text = document.getElementById('selected-seats-text');
        if (text) text.innerText = selectedSeats.join(', '); 
        document.getElementById('total-price').innerText = (selectedSeats.length * (currentTrip?.price || 0)).toLocaleString(); 
        selectedSeats.length > 0 ? bar.classList.remove('translate-y-full') : bar.classList.add('translate-y-full'); 
		// เพิ่มการอัปเดตข้อมูลลงในการ์ดสีน้ำเงิน
    if (currentTrip) {
        document.getElementById('summary-route').innerText = `${currentTrip.origin} ไป ${currentTrip.destination}`;
        document.getElementById('summary-type').innerText = currentTrip.type;
        document.getElementById('summary-date').innerText = document.getElementById('travel-date').value;
        document.getElementById('summary-seats').innerText = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'ยังไม่ได้เลือก';
        
        const total = selectedSeats.length * currentTrip.price;
        document.getElementById('final-price').innerText = total.toLocaleString();
    }
    }

    function showPaymentPage() { 
        if (selectedSeats.length === 0) return alert('กรุณาเลือกที่นั่งก่อนครับ'); 
        hideAllPages(); 
        document.getElementById('payment-page').classList.remove('hidden-section'); 
        document.getElementById('final-price').innerText = (selectedSeats.length * currentTrip.price).toLocaleString(); 
        updateStepper(3); 
    }

    async function finishBooking() {
        const btn = document.getElementById('btn-submit-payment');
        if (btn.disabled) return;

        const name = document.getElementById('p-name').value.trim();
        const phone = document.getElementById('p-phone').value.trim();
        const slipFile = document.getElementById('slip-upload').files[0];

        if (!name || !phone || !slipFile) {
            alert("กรุณากรอกข้อมูลและแนบสลิปให้ครบถ้วน");
            return;
        }

        btn.disabled = true;
        btn.innerText = "กำลังตรวจสอบที่นั่ง...";

        try {
            const travelDate = document.getElementById('travel-date').value;
            const tripDetail = `${currentTrip.origin}-${currentTrip.destination} (${currentTrip.time})`;

            const checkUrl = `${SCRIPT_URL}?date=${travelDate}&trip=${encodeURIComponent(tripDetail)}&_t=${Date.now()}`;
            const checkRes = await fetch(checkUrl);
            const latestBooked = await checkRes.json();

            const isAlreadyTaken = selectedSeats.some(s => latestBooked.map(v => v.toString().toUpperCase()).includes(s.toUpperCase()));
            
            if (isAlreadyTaken) {
                alert("ขออภัย! ที่นั่งที่คุณเลือกเพิ่งถูกจองไป ระบบจะอัปเดตสถานะที่นั่งใหม่");
                await loadBookedSeats();
                showSeatPageDirect();
                btn.disabled = false;
                btn.innerText = "แจ้งชำระเงิน";
                return;
            }

            btn.innerText = "กำลังบันทึกข้อมูล...";
            const reader = new FileReader();
            reader.onload = async function(e) {
                const payload = {
                    travelDate: travelDate,
                    trip: tripDetail,
                    seats: selectedSeats.join(','),
                    name: name,
                    phone: phone,
                    total: (selectedSeats.length * currentTrip.price).toLocaleString(),
                    imageBlob: e.target.result.split(',')[1]
                };

                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                if (result.status === "success") {
                    showSuccessPage(payload);
                } else {
                    alert("เกิดข้อผิดพลาด: " + result.message);
                    btn.disabled = false;
                    btn.innerText = "แจ้งชำระเงิน";
                }
            };
            reader.readAsDataURL(slipFile);

        } catch (err) {
            alert("การเชื่อมต่อขัดข้อง กรุณาลองใหม่");
            btn.disabled = false;
            btn.innerText = "แจ้งชำระเงิน";
        }
    }
	
function downloadTicketImage() {
    // 1. เลือก Element ที่เป็นตัวบัตรตั๋วทั้งหมด
    const ticketElement = document.querySelector("#success-page > div");

    // 2. ค้นหา Container ที่เก็บปุ่มด้านล่าง
    // เราจะหา div ที่มีปุ่มอยู่ข้างใน ซึ่งมักจะเป็น div สุดท้ายในส่วนเนื้อหาตั๋ว
    // (Selector นี้อิงตามโครงสร้าง HTML ล่าสุดที่คุณใช้)
    const buttonContainer = ticketElement.querySelector('.p-10.pt-12.space-y-6 > div:last-child');

    // 3. เก็บค่า display เดิมและซ่อนปุ่มชั่วคราว
    let originalDisplay = '';
    if (buttonContainer) {
        originalDisplay = buttonContainer.style.display;
        buttonContainer.style.display = 'none';
    }

    // --- ส่วนจัดการปุ่มกด (User Feedback) ---
    const btn = event.currentTarget;
    const originalText = btn.innerText;
    btn.innerText = "กำลังบันทึก...";
    btn.disabled = true;

    // 4. เริ่มการจับภาพ
    html2canvas(ticketElement, {
        scale: 3, // เพิ่มความชัดเป็น 3 เท่า (ชัดกริบแม้ซูมดู)
        useCORS: true, // รองรับรูปภาพจาก Domain อื่น
        backgroundColor: null, // ให้พื้นหลังโปร่งใส เพื่อให้ได้ไฟล์ PNG ที่สวยงาม
    }).then(canvas => {
        // สร้าง Link จำลองเพื่อดาวน์โหลดภาพ
        const link = document.createElement('a');
        link.download = 'Ticket-Sanguanchai-' + new Date().getTime() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // คืนค่าปุ่มกด
        btn.innerText = originalText;
        btn.disabled = false;

        // 5. แสดงปุ่มกลับมาเหมือนเดิม
        if (buttonContainer) {
            buttonContainer.style.display = originalDisplay;
        }
    }).catch(err => {
        console.error("การบันทึกภาพล้มเหลว:", err);
        alert("ไม่สามารถบันทึกภาพได้ในขณะนี้ กรุณาลองแคปหน้าจอแทนครับ");
        
        // คืนค่าปุ่มกด
        btn.innerText = originalText;
        btn.disabled = false;

        // 5. แสดงปุ่มกลับมาเหมือนเดิม (กรณีเกิด Error)
        if (buttonContainer) {
            buttonContainer.style.display = originalDisplay;
        }
    });
}

function shareToLine() {
    // ดึงข้อมูลจากหน้าจอโดยอ้างอิง ID (ตรวจสอบว่า ID ตรงกับใน HTML ของคุณ)
    const customerName = document.getElementById('display-name')?.innerText || 'ไม่ระบุชื่อ';
    const route = document.getElementById('display-route')?.innerText || 'ไม่ระบุเที่ยวรถ';
    const bookingCode = document.getElementById('display-booking-code')?.innerText || 'SCU-XXXXX';
    const date = document.getElementById('display-date')?.innerText || '';
    const time = document.getElementById('display-time')?.innerText || '';

    const shareText = `🎫 ตั๋วรถสงวนชัยอุบล
---------------------------
ผู้เดินทาง: ${customerName}
เที่ยวรถ: ${route}
วันที่: ${date}
เวลาออก: ${time}
รหัสการจอง: ${bookingCode}
---------------------------
*กรุณาแสดงข้อความนี้หรือรูปตั๋วแก่พนักงานเมื่อขึ้นรถ*`;

    if (navigator.share) {
        navigator.share({
            title: 'ตั๋วรถสงวนชัยอุบล',
            text: shareText,
            // url: window.location.href // เปิดไว้หากต้องการส่ง link เว็บไปด้วย
        }).then(() => console.log('แชร์สำเร็จ'))
          .catch((error) => console.log('การแชร์ล้มเหลว', error));
    } else {
        const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
        window.open(lineUrl, '_blank');
    }
}

    function showSuccessPage(data) {
        document.getElementById('res-name').innerText = data.name;
        document.getElementById('res-trip').innerText = data.trip;
        document.getElementById('res-date').innerText = data.travelDate;
        document.getElementById('res-seats').innerText = data.seats;
        document.getElementById('res-total').innerText = data.total;
        document.getElementById('res-id').innerText = "SCU-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        hideAllPages();
        document.getElementById('success-page').classList.remove('hidden-section');
        updateStepper(4);
    }

    function updateStepper(step) { 
        document.querySelectorAll('[id$="-label"]').forEach(el => el.classList.remove('stepper-active')); 
        if(step < 4) document.getElementById(`step-${step}-label`)?.classList.add('stepper-active');
    }

    function setupDateLimits() {
        const dateInput = document.getElementById('travel-date');
        const now = new Date();
        dateInput.min = now.toISOString().split('T')[0];
        dateInput.value = dateInput.min;
    }
	
function calculateArrival(startTime, durationHours) {
    const [hours, minutes] = startTime.split(':').map(Number);
    let arrivalHours = (hours + durationHours) % 24;
    // เติมเลข 0 ข้างหน้าถ้าหลักเดียว
    const formattedHours = arrivalHours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}	
	
	
	

function handleSearch() {
    const ori = document.getElementById('origin').value;
    const dest = document.getElementById('destination').value;
    const travelDateValue = document.getElementById('travel-date').value; // วันที่เลือกจอง
    const container = document.getElementById('trip-list');
    
    const filtered = trips.filter(t => t.origin === ori && t.destination === dest);
    container.innerHTML = filtered.length ? '' : '<p class="text-center py-10">ไม่พบเที่ยวรถ</p>'; 
    
    // เวลาปัจจุบัน
    const now = new Date();

    filtered.forEach(trip => { 
        // สร้าง Object วันเวลาของเที่ยวรถ เพื่อนำมาคำนวณ
        const tripDeparture = new Date(`${travelDateValue}T${trip.time}:00`);
        
        // คำนวณส่วนต่าง (มิลลิวินาที) แปลงเป็นชั่วโมง
        const diffInHours = (tripDeparture - now) / (1000 * 60 * 60);
        
        // เงื่อนไข: ถ้าจองล่วงหน้าน้อยกว่า 6 ชั่วโมง ให้ปิดปุ่ม
        const isTooLate = diffInHours < 6;

// ภายใน handleSearch ตอนที่วนลูป filtered.forEach(trip => { ... })

const arrivalTime = calculateArrival(trip.time, trip.durationHours || 8); // ถ้าไม่ระบุ ให้ Default ที่ 8 ชม.
const durationText = `ใช้เวลา ${trip.durationHours || 8} ชม.`;

container.innerHTML += `
    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4 ${isTooLate ? 'opacity-60' : ''}">
        <div class="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-slate-100">
            <div class="flex items-center gap-2">
                <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">${trip.type}</span>
                <span class="text-[10px] text-slate-400 font-medium italic">${durationText}</span>
            </div>
            <div class="text-xl font-black text-indigo-600">฿${trip.price}</div>
        </div>

        <div class="flex items-center gap-4">
            
            <div class="flex flex-1 gap-3">
                <div class="flex flex-col items-center py-1">
                    <div class="w-2.5 h-2.5 rounded-full border-2 border-indigo-500 bg-white shadow-sm"></div>
                    <div class="w-[2px] flex-1 bg-gradient-to-b from-indigo-500 to-slate-200 my-0.5"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                </div>

                <div class="flex-1 flex flex-col gap-3">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-sm font-black text-slate-800">${trip.time} น.</span>
                            <span class="text-[9px] px-1.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">ออก</span>
                        </div>
                        <div class="text-[11px] text-slate-500 truncate max-w-[140px] md:max-w-none">${trip.boarding || trip.origin}</div>
                    </div>
                    
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-sm font-black text-slate-800">${arrivalTime} น.</span>
                            <span class="text-[9px] px-1.5 bg-indigo-50 text-indigo-500 rounded font-bold uppercase">ถึง</span>
                        </div>
                        <div class="text-[11px] text-slate-500 truncate max-w-[140px] md:max-w-none">${trip.dropoff || trip.destination}</div>
                    </div>
                </div>
            </div>

            <div class="flex-shrink-0">
                <button 
                    onclick="showSeatPage(${trip.id})" 
                    ${isTooLate ? 'disabled' : ''} 
                    class="h-[74px] w-[95px] md:w-[125px] flex flex-col items-center justify-center gap-1 rounded-2xl transition-all active:scale-95 shadow-md ${isTooLate ? 'bg-slate-50 text-slate-400 border border-slate-100' : 'bg-indigo-600 text-white shadow-indigo-100'}">
                    
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${isTooLate ? 'hidden' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span class="text-[11px] font-bold leading-tight text-center">
                        ${isTooLate ? 'ไม่เปิดจอง' : 'จองที่นั่ง'}
                    </span>
                </button>
            </div>
        </div>

        ${isTooLate ? '<div class="mt-3 text-center text-[9px] text-red-400 font-medium">● กรุณาจองล่วงหน้าอย่างน้อย 6 ชั่วโมงก่อนเวลาออกเดินทาง</div>' : ''}
    </div>`;
    }); 
}


    setupDateLimits(); 
    handleSearch();     
	
	
