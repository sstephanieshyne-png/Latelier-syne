let products = [];

let box=document.getElementById('products');
products.forEach(p=>{
box.innerHTML+=`
<div class="card">
${p.image?`<img src="${p.image}">`:`<div class="photo-placeholder">🌸</div>`}
<h3>${p.name}</h3>
<div class="price">₱${p.price}</div>
<p>${p.desc}</p>
<button>Add to Cart</button>
</div>`;
});

let savedLogo=localStorage.shopLogo;
if(savedLogo && document.getElementById('logo')) document.getElementById('logo').src=savedLogo;

function preview(){
document.getElementById('customPreview').innerHTML=
`🌸 ${flower.value}<br>🎨 ${color.value}<br>🎀 ${wrapper.value}<br>💌 ${message.value}`;
}

function submitOrder(){
let orders=JSON.parse(localStorage.orders||'[]');
orders.push({
customer:customer.value,
phone:phone.value,
address:address.value,
notes:notes.value,
custom:document.getElementById('customPreview').innerHTML,
date:new Date().toLocaleString()
});
localStorage.orders=JSON.stringify(orders);
alert('Order submitted!');
}


// Payment option capture only. Existing functions preserved.
function getPaymentMethod(){
  const payment = document.getElementById('paymentMethod');
  return payment ? payment.value : '';
}
