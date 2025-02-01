const products = [];
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('search');
let editingProductId = null;

productForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const code = document.getElementById('productCode').value;
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const unit = document.getElementById('unit').value;
  const dateAdded = document.getElementById('dateAdded').value;
  const supplier = document.getElementById('supplier').value;

  // ถ้ามีการแก้ไขสินค้า
  if (editingProductId) {
    const productIndex = products.findIndex(p => p.id === editingProductId);
    if (productIndex !== -1) {
      products[productIndex] = {
        id: editingProductId,
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
  } else {
    const id = Date.now();
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

  renderProducts(products);
  productForm.reset();
  editingProductId = null;
});

searchInput.addEventListener('input', function () {
  const searchTerms = searchInput.value.toLowerCase().split(',').map(term => term.trim());  // แยกคำค้นหาโดยใช้คอมม่า

  const filteredProducts = products.filter(product => 
    searchTerms.every(term => 
      product.code.toLowerCase().includes(term) ||    // ค้นหาจากรหัสสินค้า หรือ
      product.name.toLowerCase().includes(term) ||    // ค้นหาจากชื่อสินค้า หรือ
      product.category.toLowerCase().includes(term) || // ค้นหาจากหมวดหมู่ หรือ
      product.price.toLowerCase().includes(term) ||    // ค้นหาจากราคา หรือ
      product.quantity.toLowerCase().includes(term) || // ค้นหาจากจำนวน หรือ
      product.unit.toLowerCase().includes(term) ||     // ค้นหาจากหน่วยสินค้า หรือ
      product.dateAdded.toLowerCase().includes(term) ||// ค้นหาจากวันที่เพิ่มสินค้า หรือ
      product.supplier.toLowerCase().includes(term)    // ค้นหาจากซัพพลายเออร์
    )
  );

  renderProducts(filteredProducts);
});

function renderProducts(productListArray) {
  productList.innerHTML = '';
  
  //จัดเรียง (จากใหม่ไปเก่า)
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
