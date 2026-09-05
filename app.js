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

measurementId:"G-PVBCNJTSTW"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



// ======================
// TOAST
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
// SHOP SETTINGS
// ======================


async function loadShopSettings(){

try{


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



if(shop)
shop.innerHTML =
data.shop || "L’Atelier Syne";



if(tagline)
tagline.innerHTML =
data.tag || "Flowers made for your sweetest moments.";



if(facebook){

facebook.href =
data.facebook || "#";

facebook.innerHTML =
data.facebook || "Visit our page";

}



if(contact){

contact.innerHTML =
data.contact || "Contact us for inquiries";

}



}


}catch(error){

console.log("Settings error:",error);

}


}


loadShopSettings();




// ======================
// PRODUCTS
// ======================


const productBox =
document.getElementById("products");



async function loadProducts(){


if(!productBox) return;


productBox.innerHTML="";


try{


const snapshot =
await getDocs(
collection(db,"products")
);



snapshot.forEach((item)=>{


const p = item.data();



productBox.innerHTML += `


<div class="card">


${p.image ?

`<img src="${p.image}">`

:

`<div class="photo-placeholder">🌸</div>`

}



<h3>${p.name}</h3>


<div class="price">
₱${p.price}
</div>


<p>
${p.desc || ""}
</p>


<button onclick='addToCart(${JSON.stringify(p)})'>

Add to Cart

</button>



</div>


`;


});



}catch(error){

console.log("Products error:",error);

}


}



loadProducts();




// ======================
// CUSTOM BOUQUET VARIABLES
// ======================


window.customBouquet = null;



// ======================
// CUSTOM PREVIEW
// ======================


async function preview(){


const flower =
document.getElementById("flower")?.value || "";


const color =
document.getElementById("color")?.value || "";


const wrapper =
document.getElementById("wrapper")?.value || "";


const addon =
document.getElementById("addon")?.value || "";


const quantity =
Number(
document.getElementById("quantity")?.value || 1
);



const style =
document.getElementById("style")?.value || "";


const occasion =
document.getElementById("occasion")?.value || "";


const message =
document.getElementById("message")?.value || "";



let price = 0;



try{


// FLOWER PRICE

const flowerSnap =
await getDocs(
collection(db,"customFlowers")
);



flowerSnap.forEach((item)=>{


const data = item.data();


if(data.name === flower){

price +=
Number(data.price || 0)
*
quantity;


}


});
  id="7km8ok"
    
// WRAPPER PRICE

const wrapperSnap =
await getDocs(
collection(db,"customWrappers")
);


wrapperSnap.forEach((item)=>{


const data = item.data();


if(data.name === wrapper){

price += Number(data.price || 0);


}


});



// ADDON PRICE

const addonSnap =
await getDocs(
collection(db,"customAddons")
);


addonSnap.forEach((item)=>{


const data = item.data();


if(data.name === addon){

price += Number(data.price || 0);


}


});



}catch(error){

console.log("Customize price error:",error);

}



// SHOW PREVIEW


const previewBox =
document.getElementById("customPreview");


if(previewBox){


previewBox.innerHTML = `


🌸 Flower: ${flower || "None"}

<br><br>


🎨 Color: ${color || "None"}

<br><br>


🎀 Wrapper: ${wrapper || "None"}

<br><br>


🌷 Quantity: ${quantity} pcs

<br><br>


✨ Style: ${style || "None"}

<br><br>


🌺 Occasion: ${occasion || "None"}

<br><br>


🎁 Add-on: ${addon || "None"}

<br><br>


💌 Message: ${message || "None"}



<h3>

Estimated Price: ₱${price}

</h3>


`;

}



const priceBox =
document.getElementById("estimatedPrice");


if(priceBox){

priceBox.innerHTML =
`Estimated Price: ₱${price}`;

}



window.customBouquet = {


flower,

color,

wrapper,

addon,

quantity,

style,

occasion,

message,

price


};



}



window.preview = preview;




// ======================
// CART
// ======================


let cart =
JSON.parse(localStorage.getItem("cart")) || [];



function addToCart(product){


cart.push(product);


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


showToast("🌸 Added to cart");


}



window.addToCart =
addToCart;
// ======================
// ADD CUSTOM BOUQUET
// ======================


function addCustomBouquet(){


if(!window.customBouquet){


showToast(
"🌸 Please preview your bouquet first"
);


return;


}



cart.push(
window.customBouquet
);



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



showToast(
"🌸 Custom bouquet added!"
);


showCart();


}



window.addCustomBouquet =
addCustomBouquet;




// ======================
// SHOW CART
// ======================


function showCart(){


const cartBox =
document.getElementById("cart");


const totalBox =
document.getElementById("total");



if(!cartBox) return;



cartBox.innerHTML="";


let total = 0;



cart.forEach((item,index)=>{


cartBox.innerHTML += `


<div class="cart-item">


<h3>
${item.name}
</h3>



${
item.flower
?
`

<p>🌸 Flower: ${item.flower}</p>

<p>🎨 Color: ${item.color}</p>

<p>🎀 Wrapper: ${item.wrapper}</p>

<p>🌷 Quantity: ${item.quantity} pcs</p>

`
:

""

}



<p>
₱${item.price}
</p>


<button onclick="removeCart(${index})">

Remove

</button>


</div>


`;



total += Number(item.price || 0);


});



if(totalBox){

totalBox.innerHTML =
"Total: ₱" + total;

}



}




window.showCart =
showCart;





// ======================
// REMOVE CART
// ======================


function removeCart(index){


cart.splice(index,1);



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



showCart();


showToast(
"🌸 Item removed"
);



}



window.removeCart =
removeCart;





// ======================
// LOAD CUSTOMIZE OPTIONS
// ======================


async function loadCustomizeOptions(){


try{


const flower =
document.getElementById("flower");


const color =
document.getElementById("color");


const wrapper =
document.getElementById("wrapper");


const addon =
document.getElementById("addon");



if(flower){


flower.innerHTML="";


const snap =
await getDocs(
collection(db,"customFlowers")
);



snap.forEach(item=>{


flower.innerHTML += `

<option>

${item.data().name}

</option>

`;

});


}




if(color){


color.innerHTML="";


const snap =
await getDocs(
collection(db,"customColors")
);



snap.forEach(item=>{


color.innerHTML += `

<option>

${item.data().name}

</option>

`;

});


}





if(wrapper){


wrapper.innerHTML="";


const snap =
await getDocs(
collection(db,"customWrappers")
);



snap.forEach(item=>{


wrapper.innerHTML += `

<option>

${item.data().name}

</option>

`;

});


}




if(addon){


addon.innerHTML = `

<option value="">

No Add-on

</option>

`;



const snap =
await getDocs(
collection(db,"customAddons")
);



snap.forEach(item=>{


addon.innerHTML += `

<option>

${item.data().name}

</option>

`;

});


}



}

catch(error){

console.log(
"Customize loading error:",
error
);


}


}




loadCustomizeOptions();





// ======================
// INITIAL LOAD
// ======================


showCart();





// ======================
// EXPORT
// ======================


window.submitOrder =
submitOrder;


window.trackOrder =
trackOrder;
