   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbys1OiImS7wBHXum1LSDeQKZuHpU2aoMN17ZwVdbtHtTJswtmwAG8mkpm1fX1afop-z/exec"; 
    
    const trips = [
        { id: 101, origin: 'กรุงเทพฯ', destination: 'อุบลราชธานี', time: '20:30', price: 685, type: 'VIP 24' },
        { id: 102, origin: 'กรุงเทพฯ', destination: 'อุบลราชธานี', time: '21:30', price: 685, type: 'VIP 24' },
		{ id: 103, origin: 'อุบลราชธานี', destination: 'กรุงเทพฯ', time: '22:30', price: 685, type: 'VIP 24' },
		{ id: 104, origin: 'อุบลราชธานี', destination: 'กรุงเทพฯ', time: '23:30', price: 685, type: 'VIP 24' },
        { id: 201, origin: 'กรุงเทพฯ', destination: 'นครราชสีมา', time: '18:00', price: 385, type: 'VIP 24' },
		{ id: 202, origin: 'กรุงเทพฯ', destination: 'นครราชสีมา', time: '17:00', price: 385, type: 'VIP 24' },
		{ id: 203, origin: 'นครราชสีมา', destination: 'กรุงเทพฯ', time: '18:30', price: 385, type: 'VIP 24' },
        { id: 204, origin: 'นครราชสีมา', destination: 'กรุงเทพฯ', time: '19:30', price: 385, type: 'VIP 24' },
		{ id: 301, origin: 'กรุงเทพฯ', destination: 'เชียงใหม่', time: '07:30', price: 785, type: 'VIP 24' },
		{ id: 302, origin: 'กรุงเทพฯ', destination: 'เชียงใหม่', time: '08:35', price: 785, type: 'VIP 24' },
        { id: 303, origin: 'เชียงใหม่', destination: 'กรุงเทพฯ', time: '18:00', price: 785, type: 'VIP 24' },
        { id: 304, origin: 'เชียงใหม่', destination: 'กรุงเทพฯ', time: '19:00', price: 785, type: 'VIP 24' }
    ];
    let bookedSeatsStore = []; 
    let selectedSeats = [];
    let currentTrip = null;

    function showSearchPage() { hideAllPages(); document.getElementById('search-page').classList.remove('hidden-section'); updateStepper(1); }
    function hideAllPages() { document.querySelectorAll('[id$="-page"]').forEach(el => el.classList.add('hidden-section')); document.getElementById('summary-bar').classList.add('translate-y-full'); }
    
    async function showSeatPage(tripId) { 
        currentTrip = trips.find(t => t.id === tripId); 
        selectedSeats = []; 
        hideAllPages(); 
        document.getElementById('seat-page').classList.remove('hidden-section');
        document.getElementById('seat-trip-info').innerText = `${currentTrip.origin} - ${currentTrip.destination} (${currentTrip.time})`;
        document.getElementById('seat-date-info').innerText = document.getElementById('travel-date').value;
        await loadBookedSeats();
        updateSummary(); 
        updateStepper(2); 
    }

    function showSeatPageDirect() {
        hideAllPages();
        document.getElementById('seat-page').classList.remove('hidden-section');
        updateSummary();
        updateStepper(2);
    }

    async function loadBookedSeats() {
        const grid = document.getElementById('seat-grid');
        grid.innerHTML = '<div class="text-center py-10 text-gray-400 animate-pulse">กำลังตรวจสอบที่นั่งล่าสุด...</div>';
        try {
            const travelDate = document.getElementById('travel-date').value;
            const tripDetail = `${currentTrip.origin}-${currentTrip.destination} (${currentTrip.time})`;
            const res = await fetch(`${SCRIPT_URL}?date=${travelDate}&trip=${encodeURIComponent(tripDetail)}&_t=${Date.now()}`);
            const data = await res.json();
            bookedSeatsStore = Array.isArray(data) ? data.map(s => s.toString().trim().toUpperCase()) : [];
            renderSeats(); 
        } catch (e) { 
            grid.innerHTML = '<div class="text-center text-red-500">โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่</div>';
        }
    }

    function renderSeats() {
        const grid = document.getElementById('seat-grid');
        grid.innerHTML = '<div class="flex justify-between mb-4 border-b pb-2 text-[10px] text-gray-300 uppercase font-bold"><span>ประตู (DOOR)</span><span>คนขับ (DRIVER)</span></div>';
        for(let i=1; i<=8; i++) {
            grid.innerHTML += `
                <div class="flex justify-between items-center mb-4">
                    ${createSeatHtml(i+'A')}
                    <div class="w-10"></div>
                    <div class="flex gap-3">
                        ${createSeatHtml(i+'B')}
                        ${createSeatHtml(i+'C')}
                    </div>
                </div>`;
        }
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

        container.innerHTML += `
            <div class="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm ${isTooLate ? 'opacity-60' : ''}">
                <div>
                    <div class="text-2xl font-bold">${trip.time}</div>
                    <div class="text-xs text-blue-500 font-bold">${trip.type}</div>
                    ${isTooLate ? '<div class="text-[10px] text-red-500 font-bold">ปิดจอง (ต้องจองล่วงหน้าอย่างน้อย 6 ชม.)</div>' : ''}
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-red-600">฿${trip.price}</div>
                    <button 
                        onclick="showSeatPage(${trip.id})" 
                        ${isTooLate ? 'disabled' : ''} 
                        class="mt-2 ${isTooLate ? 'bg-gray-400' : 'bg-red-600'} text-white px-6 py-2 rounded-lg text-sm font-bold">
                        ${isTooLate ? 'ปิดจอง' : 'เลือกที่นั่ง'}
                    </button>
                </div>
            </div>`; 
    }); 
}

    setupDateLimits(); 

    handleSearch();     
