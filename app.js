import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
      <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
    </div>
    `;

  });

}

loadProducts();


function preview(){
document.getElementById('customPreview').innerHTML=
`🌸 ${flower.value}<br>🎨 ${color.value}<br>🎀 ${wrapper.value}<br>💌 ${message.value}`;
}


async function submitOrder(){
let orders=JSON.parse(localStorage.orders||'[]');

orders.push({
customer:customer.value,
phone:phone.value,
address:address.value,
items:cart,
notes:notes.value,
custom:document.getElementById('customPreview').innerHTML,
date:new Date().toLocaleString()
});

await addDoc(collection(db,"orders"),{
customer:customer.value,
phone:phone.value,
address:address.value,
items:cart,
notes:notes.value,
custom:document.getElementById('customPreview').innerHTML,
status:"Pending",
date:new Date().toLocaleString()
});

alert("Order submitted!");
}

function getPaymentMethod(){
const payment = document.getElementById('paymentMethod');
return payment ? payment.value : '';
}
let cart = JSON.parse(localStorage.cart || "[]");

function addToCart(product){
    cart.push(product);
    localStorage.cart = JSON.stringify(cart);
    alert(product.name + " added to cart!");
    showCart();
}

function showCart(){

let cartBox = document.getElementById("cart");
let totalBox = document.getElementById("total");

cartBox.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

cartBox.innerHTML += `
<p>
${item.name} - ₱${item.price}
<button onclick="removeCart(${index})">Remove</button>
</p>
`;

total += Number(item.price);

});

totalBox.innerHTML = "Total: ₱" + total;

}


function removeCart(index){

cart.splice(index,1);

localStorage.cart = JSON.stringify(cart);

showCart();

}
async function trackOrder(){

    let phoneNumber = document.getElementById("trackPhone").value;

    let result = document.getElementById("trackResult");

    if(!phoneNumber){

        result.innerHTML = "Please enter your contact number.";

        return;

    }

    const snapshot = await getDocs(collection(db,"orders"));

    let found = false;

    snapshot.forEach((doc)=>{

        let order = doc.data();

        if(order.phone === phoneNumber){

            found = true;

            result.innerHTML = `

            <h3>Order Found 🌸</h3>

            <p>Name: ${order.customer}</p>

            <p>Date: ${order.date}</p>

            <p>Status: ${order.status ||"Pending"}</p>

            `;

        }

    });

    if(!found){

        result.innerHTML = "No order found.";

    }
}

window.addToCart = addToCart;
window.preview = preview;
window.submitOrder = submitOrder;
window.showCart = showCart;
window.removeCart = removeCart;
window.trackOrder = trackOrder;

// Luxury opening flower animation
const petals = document.getElementById("petals");

if (petals) {
    const flowers = ["🌸","🌷","🌺","🌼"];

    for(let i = 0; i < 25; i++){

        const flower = document.createElement("span");

        flower.innerHTML = flowers[Math.floor(Math.random()*flowers.length)];

        flower.style.position = "fixed";
        flower.style.top = "-40px";
        flower.style.left = Math.random()*100 + "vw";
        flower.style.fontSize = (18 + Math.random()*20) + "px";
        flower.style.opacity = "0.8";
        flower.style.transition = "transform 5s linear, opacity 5s";

        petals.appendChild(flower);

        setTimeout(()=>{
            flower.style.transform =
            `translateY(110vh) rotate(360deg)`;

            flower.style.opacity = "0";

        },100);

        setTimeout(()=>{
            flower.remove();
        },5500);
    }
}
