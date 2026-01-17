// 1. ฐานข้อมูลสินค้า
const products = [
    {
        id: "P0001",
		category: "Computer",
        brandSeries: "AMD Tapo Series",
        modelName: "Tapo C530WS",
        subTitle: "กล้อง Wi-Fi ภายนอกอัจฉริยะ สั่งหมุน-ก้มเงยได้",
        sku: "A0170731t",
        price: 1190,
        originalPrice: 2000,

        images: [
            "productimage/P0001/Tapo_C530WS01.jpg",
            "productimage/P0001/Tapo_C530WS02.jpg",
            "productimage/P0001/Tapo_C530WS03.jpg",
			"productimage/P0001/Tapo_C530WS04.jpg",
			"productimage/P0001/Tapo_C530WS05.jpg",

        ],
        features: [
            "คมชัดระดับ 3K (5 ล้านพิกเซล)",
            "ภาพสีชัดในที่มืดสนิท (Starlight)",
			"ระบบตรวจจับอัจฉริยะ (AI)",
			"ดูแลความปลอดภัยรอบทิศทาง 360 องศา",
            "คมชัดระดับ 3K (5 ล้านพิกเซล)",
            "ภาพสีชัดในที่มืดสนิท (Starlight)",


        ],
        lineLink: "order.html?id=P0001",
        specLink: "https://www.tp-link.com/th/home-networking/cloud-camera/tapo-c530ws/"
    },
    {
        id: "P0002",
		category: "Smartphone",
        brandSeries: "TP-LINK Tapo Series",
        modelName: "Tapo C425 V1.2",
        subTitle: "Smart Wire-Free Security Camera",
        sku: "B0288899A",
        price: 1290,
        originalPrice: 1590,

        images: [
            "productimage/P0002/Tapo C425_01.jpg",
            "productimage/P0002/Tapo C425_02.jpg",
			"productimage/P0002/Tapo C425_03.jpg",
            "productimage/P0002/Tapo C425_04.jpg"

        ],
        features: [
            "Wire-Free, Installs Almost Anywhere",
            "Easily Adjust to the Best Angle",
			"Power that Lasts",
			"2K QHD Live View",
            "Color Night Vision"
	
        ],
        lineLink: "order.html?id=P0002",
        specLink: "https://www.tp-link.com/th/home-networking/cloud-camera/tapo-c425/"
    }
	
	,
    {
        id: "P0003",
		category: "CCTV",
        brandSeries: "TP-LINK Tapo Series",
        modelName: "Tapo C645D KIT",
        subTitle: "Solar-Powered Dual-Lens Pan",
        sku: "B0288897",
        price: 1700,
        originalPrice: 2300,
		category: "CCTV",
        images: [
            "productimage/P0003/Tapo_C645D_KIT01.jpg",
            "productimage/P0003/Tapo_C645D_KIT02.jpg",
			"productimage/P0003/Tapo_C645D_KIT03.jpg"

        ],
        features: [
            "Dual 2K Lenses for Wide Coverage and Precise Zoom",
            "Panoramic Coverage of Two Areas at Once",
			"Detect People, Vehicles & Pets Without a Subscription",
			"Synchronized Smart Tracking",
            "One-Tap Smart Focus"
	
        ],
        lineLink: "order.html?id=P0003",
        specLink: "https://www.tp-link.com/th/home-networking/cloud-camera/tapo-c645d-kit/"
    }
];

// 2. ฟังก์ชันหลักสำหรับแสดงผล (Render)
function renderProduct(targetId) {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // ค้นหาสินค้า
    const product = products.find(p => p.id === targetId);

    if (!product) {
        container.innerHTML = `
            <div class="text-center py-20">
                <h2 class="text-2xl font-bold text-gray-400">ไม่พบข้อมูลสินค้า</h2>
                <a href="index.html" class="text-[#c27803] underline mt-4 inline-block">กลับหน้าหลัก</a>
            </div>`;
        return;
    }

    const discount = product.originalPrice - product.price;

container.innerHTML = `
    <style>
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
    </style>

    <div class="max-w-7xl mx-auto relative p-4 md:p-8 overflow-hidden">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/20 rounded-full blur-[120px] -z-10"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full blur-[120px] -z-10"></div>

        <div class="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-8 md:p-14 flex flex-col lg:flex-row gap-16 relative overflow-hidden">
            
            <div class="lg:w-5/12 w-full reveal">
                <div class="group relative bg-slate-50/50 rounded-[2.5rem] mb-8 overflow-hidden border border-slate-50">
                    <div class="absolute top-8 left-8 z-20">
                        <div class="flex items-center gap-3 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                            <span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Pre-Order</span>
                        </div>
                    </div>

                    <img id="mainImage" src="${product.images[0]}" 
                         class="w-full h-auto min-h-[400px] object-contain p-12 transition-all duration-700 group-hover:scale-110 drop-shadow-2xl cursor-zoom-in" 
                         onclick="openModal(this.src)">
                </div>
                
                <div class="flex gap-4 justify-center">
                    ${product.images.map((img, idx) => `
                        <button onclick="changeImage('${img}', this)" class="group focus:outline-none transition-all duration-300 ${idx === 0 ? 'scale-110' : 'opacity-60 hover:opacity-100'}">
                            <div class="w-16 h-16 rounded-2xl border-2 transition-all p-1 bg-white ${idx === 0 ? 'border-cyan-500 shadow-lg shadow-cyan-100' : 'border-slate-50 hover:border-slate-200'}">
                                <img src="${img}" class="w-full h-full object-contain">
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="lg:w-7/12 w-full flex flex-col">
                
                <div class="mb-10 reveal delay-1">
                    <div class="flex items-center gap-4 mb-4">
                        <span class="h-10 w-1.5 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"></span>
                        <div class="flex flex-col">
                            <span class="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-black leading-none mb-1">
                                ${product.brandSeries}
                            </span>
                            <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                                ${product.modelName}
                            </h1>
                        </div>
                    </div>
                    <p class="text-xl text-slate-400 font-light italic pl-6">
                        ${product.subTitle}
                    </p>
                </div>

                <div class="flex flex-col gap-2 mb-10 pb-10 border-b border-slate-50 reveal delay-1">
                    <div class="flex items-baseline gap-4">
                        <span class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 tracking-tighter">
                            ฿${product.price.toLocaleString()}
                        </span>
                        <span class="text-xl font-bold text-slate-300 line-through">฿${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div class="inline-flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-50 w-fit px-4 py-1.5 rounded-full border border-green-100">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                        ประหยัด ฿${(product.originalPrice - product.price).toLocaleString()}
                    </div>
                </div>

                <div class="mb-12 reveal delay-2">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-2">
                        <span class="w-1 h-1 rounded-full bg-cyan-500"></span> รายละเอียดสินค้า
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        ${product.features.map(f => `
                            <div class="flex items-center gap-3 group">
                                <div class="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-cyan-500 transition-colors"></div>
                                <span class="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                                    ${f}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-5 mt-auto reveal delay-2">
                    <a href="order.html?id=${product.id}" 
                       class="group relative flex-[2] bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-slate-200 hover:shadow-cyan-200 text-center">
                        <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span class="relative z-10 flex items-center justify-center gap-3">
                            สั่งซื้อทันที
                            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                    </a>
                    
                    <a href="${product.specLink}" 
                       class="flex-1 border-2 border-slate-100 text-slate-500 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-center hover:border-slate-900 hover:text-slate-900 transition-all duration-300">
                        รายละเอียด
                    </a>
                </div>

                <div class="mt-8 flex items-center gap-3 text-slate-400 reveal delay-2">
                    <svg class="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    <p class="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                        สินค้าของแท้รับประกันศูนย์ 100%
                    </p>
                </div>

            </div>
        </div>
    </div>
`;
}

// 3. ฟังก์ชันเปลี่ยนรูป
function changeImage(src, el) {
    document.getElementById('mainImage').src = src;
    const thumbs = el.parentElement.querySelectorAll('img');
    thumbs.forEach(t => {
        t.classList.remove('border-[#c27803]');
        t.classList.add('border-transparent');
    });
    el.classList.add('border-[#c27803]');
    el.classList.remove('border-transparent');
}

// 4. ฟังก์ชันเริ่มการทำงาน (อ่าน URL)
function initPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // ถ้าไม่มี ID ใน URL ให้แสดงชิ้นแรกเป็นค่าเริ่มต้น
    renderProduct(productId || products[0].id);
}

// เรียกใช้งานเมื่อหน้าจอโหลดเสร็จ
window.addEventListener('DOMContentLoaded', initPage);

