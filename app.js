import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
getFirestore, 
collection, 
getDocs, 
addDoc,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================
// FIREBASE CONFIG
// ======================

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
// ======================
// LOAD SHOP SETTINGS
// ======================

async function loadShopSettings(){

const snap = await getDoc(
doc(db,"settings","shopInfo")
);


if(snap.exists()){

const data = snap.data();


const shop =
document.getElementById("shopName");


const tagline =
document.getElementById("tagline");

const facebook =
document.getElementById("facebookLink");


const contact =
document.getElementById("contactInfo");  


if(shop){

shop.innerHTML =
data.shop || "L’Atelier Syne";

}



if(tagline){

tagline.innerHTML =
data.tag || "Flowers made for your sweetest moments.";

}
if(facebook){

facebook.href =
data.facebook || "#";


facebook.innerHTML =
data.facebook || "Visit our page";

}



if(contact){

contact.innerHTML =
data.contact && data.contact.trim() !== ""
? data.contact
: "Contact us for inquiries";

}

}

}



loadShopSettings();

// ======================
// PREMIUM TOAST NOTIFICATION
// ======================

function showToast(message){

    const toast = document.getElementById("toast");

    if(!toast) return;


    toast.innerHTML = message;

    toast.classList.add("show");


    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}



// ======================
// LOAD PRODUCTS
// ======================

let box = document.getElementById("products");


async function loadProducts(){

  const snapshot = await getDocs(
    collection(db,"products")
  );


  snapshot.forEach((doc)=>{

    let p = doc.data();


    box.innerHTML += `

    <div class="card">

      ${p.image 
      ? `<img src="${p.image}">`
      : `<div class="photo-placeholder">🌸</div>`
      }


      <h3>${p.name}</h3>

      <div class="price">
      ₱${p.price}
      </div>


      <p>${p.desc}</p>


      <button onclick='addToCart(${JSON.stringify(p)})'>
      Add to Cart
      </button>


    </div>

    `;

  });

}


loadProducts();


// ======================
// CUSTOM BOUQUET PREVIEW
// ======================

function preview(){

    const customData = {

        name:"Custom Bouquet",

        flower:flower.value,

        color:color.value,

        wrapper:wrapper.value,

        message:message.value,

        price:0

    };


    window.customBouquet = customData;


    document.getElementById('customPreview').innerHTML =

    `

    🌸 ${customData.flower}<br>

    🎨 ${customData.color}<br>

    🎀 ${customData.wrapper}<br>

    💌 ${customData.message}

    `;

}
// ======================
// SUBMIT ORDER
// ======================

async function submitOrder(){

let orders =
JSON.parse(localStorage.orders || '[]');


const orderData = {

customer:customer.value,

phone:phone.value,

address:address.value,

items:cart,

notes:notes.value,

custom:
document.getElementById('customPreview').innerHTML,

date:new Date().toLocaleString()

};


orders.push(orderData);


localStorage.orders =
JSON.stringify(orders);



await addDoc(
collection(db,"orders"),
{

customer:customer.value,

phone:phone.value,

address:address.value,

items:cart,

notes:notes.value,

custom:
document.getElementById('customPreview').innerHTML,

status:"Pending",

date:new Date().toLocaleString()

}

);



showToast("🌸 Order submitted successfully!");

}



// ======================
// PAYMENT METHOD
// ======================

function getPaymentMethod(){

const payment =
document.getElementById('paymentMethod');

return payment ? payment.value : '';

}



// ======================
// CART SYSTEM
// ======================


let cart =
JSON.parse(localStorage.cart || "[]");



function addToCart(product){

cart.push(product);


localStorage.cart =
JSON.stringify(cart);



showToast(
"🌸 " + product.name + " added to cart!"
);



showCart();

}




function addCustomBouquet(){


if(!window.customBouquet){

showToast(
"🌸 Please preview your custom bouquet first"
);

return;

}



cart.push(window.customBouquet);



localStorage.cart =
JSON.stringify(cart);



showToast(
"🌸 Custom Bouquet added to cart!"
);



showCart();


}



window.addCustomBouquet =
addCustomBouquet;



function showCart(){

let cartBox =
document.getElementById("cart");


let totalBox =
document.getElementById("total");



cartBox.innerHTML="";


let total=0;



cart.forEach((item,index)=>{


cartBox.innerHTML += `


<div class="cart-item">


${
item.image
?
`
<img class="cart-image" src="${item.image}">
`
:
""
}



<div class="cart-details">


<h3>${item.name}</h3>



${
item.flower
?
`

<p>🌸 Flower: ${item.flower}</p>

<p>🎨 Color: ${item.color}</p>

<p>🎀 Wrapper: ${item.wrapper}</p>

<p>💌 Message: ${item.message}</p>

`
:
""
}



<p class="cart-price">
₱${item.price}
</p>



<button onclick="removeCart(${index})">

Remove

</button>



</div>


</div>


`;



total += Number(item.price);



});



totalBox.innerHTML =
"Total: ₱" + total;


}




function removeCart(index){


cart.splice(index,1);



localStorage.cart =
JSON.stringify(cart);



showToast(
"🌸 Item removed from cart"
);



showCart();


}
// ======================
// TRACK ORDER
// ======================

async function trackOrder(){

let phoneNumber =
document.getElementById("trackPhone").value;


let result =
document.getElementById("trackResult");



if(!phoneNumber){

result.innerHTML =
"Please enter your contact number.";

return;

}



const snapshot =
await getDocs(
collection(db,"orders")
);



let found=false;



snapshot.forEach((doc)=>{


let order = doc.data();



if(order.phone === phoneNumber){


found=true;



result.innerHTML = `

<h3>
Order Found 🌸
</h3>


<p>
Name: ${order.customer}
</p>


<p>
Date: ${order.date}
</p>


<p>
Status: ${order.status || "Pending"}
</p>

`;

}

});



if(!found){

result.innerHTML =
"No order found.";

}

}




// ======================
// FLOATING PETALS
// ======================

const petals =
document.getElementById("petals");


if(petals){


const flowers =
[
"🌸",
"🌷",
"🌺",
"🌼"
];



for(let i=0;i<10;i++){


setTimeout(()=>{


const flower =
document.createElement("span");


flower.innerHTML =
flowers[
Math.floor(Math.random()*flowers.length)
];



flower.style.position="fixed";

flower.style.top="-40px";

flower.style.left =
Math.random()*100+"vw";


flower.style.fontSize =
(18 + Math.random()*12)+"px";


flower.style.opacity="0.75";

flower.style.zIndex="9999";


flower.style.transition =
"transform 7s linear, opacity 7s";



petals.appendChild(flower);



setTimeout(()=>{

flower.style.transform =
`translateY(110vh) rotate(360deg)`;

flower.style.opacity="0";


},100);



setTimeout(()=>{

flower.remove();

},7500);



},Math.random()*3000);


}

}



// =============================
// LOAD CUSTOMIZE OPTIONS
// =============================


async function loadCustomizeOptions(){


// FLOWERS

const flowerSnap =
await getDocs(
collection(db,"customFlowers")
);


const flowerSelect =
document.getElementById("flower");


flowerSelect.innerHTML="";


flowerSnap.forEach((doc)=>{


flowerSelect.innerHTML += `

<option>

${doc.data().name}

</option>

`;

});



// COLORS

const colorSnap =
await getDocs(
collection(db,"customColors")
);


const colorSelect =
document.getElementById("color");


colorSelect.innerHTML="";


colorSnap.forEach((doc)=>{


colorSelect.innerHTML += `

<option>

${doc.data().name}

</option>

`;

});



// WRAPPERS

const wrapperSnap =
await getDocs(
collection(db,"customWrappers")
);


const wrapperSelect =
document.getElementById("wrapper");


wrapperSelect.innerHTML="";


wrapperSnap.forEach((doc)=>{


wrapperSelect.innerHTML += `

<option>

${doc.data().name}

</option>

`;

});



// ADDONS

const addonSnap =
await getDocs(
collection(db,"customAddons")
);


const addonSelect =
document.getElementById("addon");


addonSelect.innerHTML =
`
<option value="">
No Add-on
</option>
`;



addonSnap.forEach((doc)=>{


addonSelect.innerHTML += `

<option>

${doc.data().name}

</option>

`;

});


}



loadCustomizeOptions();




// ======================
// CHECKOUT
// ======================


window.goCheckout = function(){

const orderSection =
document.getElementById("orderDetails");


if(orderSection){

orderSection.scrollIntoView({

behavior:"smooth"

});

}

};



// ======================
// EXPORT FUNCTIONS
// ======================


window.addToCart =
addToCart;


window.preview =
preview;


window.submitOrder =
submitOrder;


window.showCart =
showCart;


window.removeCart =
removeCart;


window.trackOrder =
trackOrder;
