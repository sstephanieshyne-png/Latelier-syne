import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvtUJOmtU9zP76h_GEBiNRjstRQ3IEpaA",
  authDomain: "latelier-syne.firebaseapp.com",
  projectId: "latelier-syne",
  storageBucket: "latelier-syne.firebasestorage.app",
  messagingSenderId: "785009872575",
  appId: "1:785009872575:web:cb2b2ac9dd51fe823b800a",
  measurementId: "G-PVBCNJTSTW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let box = document.getElementById("products");

async function loadProducts(){

  const snapshot = await getDocs(collection(db,"products"));

  snapshot.forEach((doc)=>{

    let p = doc.data();

    box.innerHTML += `
    <div class="card">
      ${p.image ? `<img src="${p.image}">` : `<div class="photo-placeholder">🌸</div>`}
      <h3>${p.name}</h3>
      <div class="price">₱${p.price}</div>
      <p>${p.desc}</p>
      <button>Add to Cart</button>
    </div>
    `;

  });

}

loadProducts();


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


function getPaymentMethod(){
const payment = document.getElementById('paymentMethod');
return payment ? payment.value : '';
}
