// 1. ฐานข้อมูลสินค้า
const products = [
    {
        id: "P0001",
        brandSeries: "TP-LINK Tapo Series",
        modelName: "Tapo C530WS",
        subTitle: "Outdoor Pan/Tilt Security Wi-Fi Camera",
        sku: "A0170731",
        price: 1590,
        originalPrice: 2000,
        images: [
            "productimage/P0001/Tapo_C530WS01.jpg",
            "productimage/P0001/Tapo_C530WS02.jpg",
            "productimage/P0001/Tapo_C530WS03.jpg",
			"productimage/P0001/Tapo_C530WS04.jpg",
			"productimage/P0001/Tapo_C530WS05.jpg",
			"productimage/P0001/Tapo_C530WS06.jpg",
            "productimage/P0001/Tapo_C530WS07.jpg"
        ],
        features: [
            "Starlight Color Night Vision",
            "360° All-Round Protection",
			"Comprehensive AI Detection",
			"360° All-Round Protection",
            "3K 5MP Live View"

        ],
        lineLink: "https://line.me/R/ti/p/@yourid",
        specLink: "https://www.tp-link.com/th/home-networking/cloud-camera/tapo-c530ws/"
    },
    {
        id: "P0002",
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
        lineLink: "https://line.me/R/ti/p/@yourid",
        specLink: "https://www.tp-link.com/th/home-networking/cloud-camera/tapo-c425/"
    }
	
	,
    {
        id: "P0003",
        brandSeries: "TP-LINK Tapo Series",
        modelName: "Tapo C645D KIT",
        subTitle: "Solar-Powered Dual-Lens Pan",
        sku: "B0288897",
        price: 1700,
        originalPrice: 2300,
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
        lineLink: "https://line.me/R/ti/p/@yourid",
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
        <div class="max-w-7xl mx-auto bg-[#fafafa] p-6 md:p-12 rounded-[2rem] shadow-[0_10px_50px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-16 items-start">
            <div class="md:w-5/12 w-full">
                <div class="group relative cursor-zoom-in bg-white rounded-3xl overflow-hidden mb-6 border border-gray-50 shadow-sm transition-all duration-500 hover:shadow-xl">
                    <img id="mainImage" src="${product.images[0]}" class="w-full h-auto min-h-[400px] object-contain p-8 transition-transform duration-700 group-hover:scale-105" onclick="openModal(this.src)">
                </div>
                <div class="flex gap-4 justify-center overflow-x-auto py-2">
                    ${product.images.map((img, idx) => `
                        <img src="${img}" class="w-20 h-20 rounded-2xl border-2 ${idx === 0 ? 'border-[#c27803]' : 'border-transparent'} p-2 cursor-pointer object-contain bg-white transition-all hover:border-[#c27803]" onclick="changeImage(this.src, this)">
                    `).join('')}
                </div>
            </div>

            <div class="md:w-7/12 w-full">
                <div class="mb-8">
                    <span class="text-[10px] tracking-[0.3em] font-bold text-[#c27803] uppercase">${product.brandSeries}</span>
                    <h1 class="text-3xl md:text-4xl font-semibold mt-2 text-gray-900 tracking-tight leading-tight">
                        ${product.modelName} <br><span class="text-gray-400 font-light">${product.subTitle}</span>
                    </h1>
                </div>

                <div class="mb-10 p-8 rounded-3xl bg-white border border-gray-50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-widest mb-1">Online Exclusive Price</p>
                        <p class="text-4xl font-bold text-gray-900 tracking-tighter">฿${product.price.toLocaleString()}</p>
                    </div>
                    <div class="text-left sm:text-right border-l sm:border-l-0 sm:border-r border-gray-100 pl-4 sm:pl-0 sm:pr-4">
                        <p class="text-xs text-gray-400 line-through mb-1">ปกติ ฿${product.originalPrice.toLocaleString()}</p>
                        <span class="text-[11px] bg-[#c27803]/10 text-[#c27803] px-3 py-1.5 rounded-lg font-bold">
                            ประหยัดได้ ฿${discount.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div class="mb-8">
                    <p class="text-sm font-semibold text-gray-800 mb-4">รายละเอียดเบื้องต้น</p>
                    <ul class="text-[13px] text-gray-500 space-y-3">
                        ${product.features.map(f => `<li class="flex items-center gap-2"><span class="w-1 h-1 bg-gray-300 rounded-full"></span> ${f}</li>`).join('')}
                    </ul>
                    <a href="${product.specLink}" class="inline-block text-[#c27803] text-xs font-semibold mt-6 border-b border-[#c27803]/30 hover:border-[#c27803] transition-all pb-0.5 uppercase tracking-widest">Full Specifications</a>
                </div>

                <div class="flex gap-4">
                    <a href="${product.lineLink}" target="_blank" class="flex-grow text-center bg-[#c27803] text-white text-sm font-bold py-4 px-8 rounded-2xl hover:bg-[#a66602] transition-all uppercase tracking-widest shadow-lg">
                        สั่งซื้อทันที
                    </a>
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
