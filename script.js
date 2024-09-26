const container = document.querySelector('.container');
const addProductBtn = document.getElementById('addProductBtn');

// 加载产品
window.onload = function() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                addProductCard(product);
            });
        });
};

addProductBtn.addEventListener('click', () => {
    const newProduct = {
        name: '',
        videoLink: '',
        tapLink: '',
        imageSrc: 'product_placeholder.jpg'
    };
    addProductCard(newProduct);
});

// 添加产品卡片
function addProductCard(product) {
    const newProductCard = productCardTemplate.cloneNode(true);
    newProductCard.style.display = 'block';

    newProductCard.querySelector('h2').textContent = product.name || 'New Product';
    newProductCard.querySelector('.video-link').value = product.videoLink || '';
    newProductCard.querySelector('.tap-link').value = product.tapLink || '';
    newProductCard.querySelector('img').src = product.imageSrc;

    container.appendChild(newProductCard);
    attachButtonListeners(newProductCard);
}

// 其他功能代码保持不变

function saveProducts() {
    const products = Array.from(document.querySelectorAll('.product-card')).map(card => ({
        name: card.querySelector('h2').textContent,
        videoLink: card.querySelector('.video-link').value,
        tapLink: card.querySelector('.tap-link').value,
        imageSrc: card.querySelector('img').src
    }));

    // 发送产品数据到后端
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(products)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Products saved:', data);
    });
}

// 删除产品功能修改
function deleteProduct(button) {
    const card = button.closest('.product-card');
    const index = Array.from(container.children).indexOf(card);

    fetch(`/api/products/${index}`, {
        method: 'DELETE'
    }).then(() => {
        card.remove();
    });
}
function clearAllLinks() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.querySelector('.video-link').value = '';
        card.querySelector('.tap-link').value = '';
    });
    saveProducts(); // 保存清空后的状态
}
