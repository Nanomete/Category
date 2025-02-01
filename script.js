const products = [];
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('search');
let editingProductId = null;  // ตัวแปรสำหรับเก็บ ID ของสินค้าที่กำลังแก้ไข

productForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // รับข้อมูลทั้งหมดจากฟอร์ม
  const code = document.getElementById('productCode').value;  // รหัสสินค้า
  const name = document.getElementById('name').value;  // ชื่อสินค้า
  const category = document.getElementById('category').value;  // หมวดหมู่
  const price = document.getElementById('price').value;  // ราคา
  const quantity = document.getElementById('quantity').value;  // จำนวน
  const unit = document.getElementById('unit').value;  // หน่วยสินค้า
  const dateAdded = document.getElementById('dateAdded').value;  // วันที่เพิ่มสินค้า
  const supplier = document.getElementById('supplier').value;  // ซัพพลายเออร์

  // ถ้ามีการแก้ไขสินค้า
  if (editingProductId) {
    const productIndex = products.findIndex(p => p.id === editingProductId);
    if (productIndex !== -1) {
      products[productIndex] = {
        id: editingProductId,  // ใช้ ID เดิมของสินค้าที่จะถูกแก้ไข
        code,
        name,
        category,
        price,
        quantity,
        unit,
        dateAdded,
        supplier
      };
    }
  } else {  // ถ้าไม่ได้แก้ไขสินค้า แค่เพิ่มสินค้าใหม่
    const id = Date.now();  // สร้าง ID โดยใช้เวลาในปัจจุบัน
    const product = {
      id,
      code,
      name,
      category,
      price,
      quantity,
      unit,
      dateAdded,
      supplier
    };
    products.push(product);
  }

  renderProducts(products);  // รีเฟรชการแสดงผล
  productForm.reset();  // รีเซ็ตฟอร์ม
  editingProductId = null;  // รีเซ็ต ID ของสินค้าที่กำลังแก้ไข
});

searchInput.addEventListener('input', function () {
  const searchTerms = searchInput.value.toLowerCase().split(',').map(term => term.trim());  // แยกคำค้นหาโดยใช้คอมม่า

  const filteredProducts = products.filter(product => 
    searchTerms.every(term => 
      product.code.toLowerCase().includes(term) ||    // ค้นหาจากรหัสสินค้า
      product.name.toLowerCase().includes(term) ||    // ค้นหาจากชื่อสินค้า
      product.category.toLowerCase().includes(term) || // ค้นหาจากหมวดหมู่
      product.price.toLowerCase().includes(term) ||    // ค้นหาจากราคา
      product.quantity.toLowerCase().includes(term) || // ค้นหาจากจำนวน
      product.unit.toLowerCase().includes(term) ||     // ค้นหาจากหน่วยสินค้า
      product.dateAdded.toLowerCase().includes(term) ||// ค้นหาจากวันที่เพิ่มสินค้า
      product.supplier.toLowerCase().includes(term)    // ค้นหาจากซัพพลายเออร์
    )
  );

  renderProducts(filteredProducts);  // แสดงผลสินค้าที่ตรงกับคำค้น
});

function renderProducts(productListArray) {
  productList.innerHTML = '';
  
  // การจัดเรียงสินค้าตามวันที่ เพิ่มการจัดเรียง (จากใหม่ไปเก่า)
  const sortedProducts = productListArray.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  sortedProducts.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('p-4', 'border', 'border-gray-300', 'rounded-lg');
    
    productItem.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">${product.code} | ${product.name}) </h3>
          <span class="text-gray-600">${product.category}</span>
          <div class="mt-2 text-sm text-gray-600">
            ราคา: ฿${product.price} | คงเหลือ: ${product.quantity} ${product.unit} |
            <br>วันที่เพิ่ม: ${product.dateAdded} | ซัพพลายเออร์: ${product.supplier}
          </div>
        </div>
        <div class="flex gap-2">
          <button class="editBtn text-blue-500">แก้ไข</button>
          <button class="deleteBtn text-red-500">ลบ</button>
        </div>
      </div>
    `;

    const editBtn = productItem.querySelector('.editBtn');
    const deleteBtn = productItem.querySelector('.deleteBtn');

    editBtn.addEventListener('click', () => editProduct(product.id));
    deleteBtn.addEventListener('click', () => deleteProduct(product.id));

    productList.appendChild(productItem);
  });
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    document.getElementById('productCode').value = product.code;
    document.getElementById('name').value = product.name;
    document.getElementById('category').value = product.category;
    document.getElementById('price').value = product.price;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('unit').value = product.unit;
    document.getElementById('dateAdded').value = product.dateAdded;
    document.getElementById('supplier').value = product.supplier;
    
    // ตั้งค่าตัวแปรเพื่อเก็บ ID ของสินค้าที่กำลังแก้ไข
    editingProductId = product.id;
  }
}

function deleteProduct(id) {
  const index = products.findIndex(p => p.id === id);
  if (index > -1) {
    products.splice(index, 1);
    renderProducts(products);
  }
}
