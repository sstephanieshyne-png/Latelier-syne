// ======================
// FIREBASE SETUP
// ======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const firebaseConfig = {

apiKey:"AIzaSyDvtUJOmtU9zP76h_GEBiNRjstRQ3IEpaA",

authDomain:"latelier-syne.firebaseapp.com",

projectId:"latelier-syne",

storageBucket:"latelier-syne.firebasestorage.app",

messagingSenderId:"785009872575",

appId:"1:785009872575:web:cb2b2ac9dd51fe823b800a",

measurementId:"G-PVBCNJTSTW"

};



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



// ======================
// TOAST
// ======================


function showToast(message){

const toast =
document.getElementById("toast");


if(!toast) return;


toast.innerHTML = message;

toast.classList.add("show");


setTimeout(()=>{

toast.classList.remove("show");

},2500);

}



// ======================
// IMAGE UPLOAD
// ======================


const IMGBB_API_KEY =
"78157b4e1e63790ce09bee450d5acd5c";



// ======================
// ADD PRODUCT
// ======================


window.addProduct = async function(){


const name =
document.getElementById("name").value;


const price =
document.getElementById("price").value;


const desc =
document.getElementById("desc").value;


const photo =
document.getElementById("photo").files[0];



if(!name || !price){

showToast("🌸 Please complete product details");

return;

}



let imageURL="";



if(photo){


try{


let formData = new FormData();

formData.append(
"image",
photo
);



const response =
await fetch(

`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,

{

method:"POST",

body:formData

}

);



const data =
await response.json();



if(data.success){

imageURL =
data.data.url;

}



}catch(error){

console.log(error);

}

}




await addDoc(

collection(db,"products"),

{

name:name,

price:Number(price),

desc:desc,

image:imageURL

}

);



showToast(
"🌸 Product Added Successfully!"
);



document.getElementById("name").value="";

document.getElementById("price").value="";

document.getElementById("desc").value="";

document.getElementById("photo").value="";


showProducts();


};



// ======================
// SHOW PRODUCTS
// ======================


async function showProducts(){


const productList =
document.getElementById("productList");


if(!productList) return;


productList.innerHTML="";



try{


const snapshot =
await getDocs(
collection(db,"products")
);



snapshot.forEach((item)=>{


const product =
item.data();



productList.innerHTML += `


<div class="card">


${product.image ?

`

<img src="${product.image}"
style="width:200px;border-radius:20px;">

`

:

""

}



<h3>
${product.name}
</h3>


<p>
₱${product.price}
</p>


<p>
${product.desc || ""}
</p>



<button onclick="deleteProduct('${item.id}')">

Delete

</button>


</div>


`;


});


}

catch(error){

console.log(
"Product Error:",
error
);

}


}




// ======================
// DELETE PRODUCT
// ======================


window.deleteProduct =
async function(id){


await deleteDoc(
doc(db,"products",id)
);



showToast(
"🌸 Product Deleted"
);



showProducts();


};
// ======================
// SHOW ORDERS
// ======================


async function showOrders(){


const orderList =
document.getElementById("orderList");


if(!orderList) return;


orderList.innerHTML="";



try{


const snapshot =
await getDocs(
collection(db,"orders")
);



snapshot.forEach((item)=>{


const order =
item.data();


const orderId =
item.id;



let orderedItems="";



if(order.items && Array.isArray(order.items)){


order.items.forEach(product=>{


orderedItems += `

🌸 ${product.name} - ₱${product.price}<br>

`;


});


}




const currentStatus =
order.status || "Pending";




orderList.innerHTML += `


<div class="card order-card">


<h3>
🌸 ${order.customer || "Customer"}
</h3>



<p>
📞 ${order.phone || "No contact"}
</p>


<p>
📍 ${order.address || "No address"}
</p>



<h4>
🛍 Order:
</h4>


<p>

${orderedItems || "No items"}

</p>



<p>

💌 ${order.notes || "No notes"}

</p>




<p>

Status:

<span class="status-badge">

${currentStatus}

</span>

</p>




<select
onchange="updateStatus('${orderId}', this.value)"
>


<option value="Pending"
${currentStatus==="Pending" ? "selected":""}>

Pending

</option>



<option value="Preparing"
${currentStatus==="Preparing" ? "selected":""}>

Preparing

</option>



<option value="Ready for Delivery"
${currentStatus==="Ready for Delivery" ? "selected":""}>

Ready for Delivery

</option>



<option value="Completed"
${currentStatus==="Completed" ? "selected":""}>

Completed

</option>


</select>



</div>


`;


});


}


catch(error){

console.log(
"Order Error:",
error
);


}



}




// ======================
// UPDATE ORDER STATUS
// ======================


window.updateStatus =
async function(id,status){


try{


await updateDoc(

doc(db,"orders",id),

{

status:status

}

);



showToast(
"🌸 Status Updated!"
);



showOrders();



}

catch(error){

console.log(error);

}


};
// ======================
// CUSTOMIZATION OPTIONS
// ======================


// ADD COLOR

window.addColor = async function(){


const color =
document.getElementById("newColor").value;



if(!color){

showToast("🌸 Enter color first");

return;

}



await addDoc(

collection(db,"customColors"),

{

name:color

}

);



document.getElementById("newColor").value="";


showToast("🎨 Color Added!");


showCustomizeOptions();


};




// ======================
// ADD FLOWER WITH PRICE
// ======================


window.addFlower = async function(){


const flower =
document.getElementById("newFlower").value;


const price =
document.getElementById("flowerPrice").value;



if(!flower){

showToast("🌸 Enter flower first");

return;

}



await addDoc(

collection(db,"customFlowers"),

{

name:flower,

price:Number(price) || 0

}

);



document.getElementById("newFlower").value="";

document.getElementById("flowerPrice").value="";


showToast("🌸 Flower Added!");


showCustomizeOptions();


};





// ======================
// ADD WRAPPER WITH PRICE
// ======================


window.addWrapper = async function(){


const wrapper =
document.getElementById("newWrapper").value;


const price =
document.getElementById("wrapperPrice").value;



if(!wrapper){

showToast("🎀 Enter wrapper first");

return;

}



await addDoc(

collection(db,"customWrappers"),

{

name:wrapper,

price:Number(price) || 0

}

);



document.getElementById("newWrapper").value="";

document.getElementById("wrapperPrice").value="";


showToast("🎀 Wrapper Added!");


showCustomizeOptions();


};





// ======================
// ADD ADDON WITH PRICE
// ======================


window.addAddon = async function(){


const addon =
document.getElementById("newAddon").value;


const price =
document.getElementById("addonPrice").value;



if(!addon){

showToast("🍫 Enter add-on first");

return;

}



await addDoc(

collection(db,"customAddons"),

{

name:addon,

price:Number(price) || 0

}

);



document.getElementById("newAddon").value="";

document.getElementById("addonPrice").value="";


showToast("🍫 Add-on Added!");


showCustomizeOptions();


};





// ======================
// SHOW CUSTOM OPTIONS
// ======================


async function showCustomizeOptions(){



const flowers =
document.getElementById("flowers");


const colors =
document.getElementById("colors");


const wrappers =
document.getElementById("wrappers");


const addons =
document.getElementById("addons");



if(!flowers || !colors || !wrappers || !addons)
return;



flowers.innerHTML="";

colors.innerHTML="";

wrappers.innerHTML="";

addons.innerHTML="";




// FLOWERS


const flowerSnap =
await getDocs(
collection(db,"customFlowers")
);



flowerSnap.forEach((item)=>{


const data =
item.data();



flowers.innerHTML += `

<p>

🌸 ${data.name}

 ₱${data.price || 0}


<button onclick="deleteFlower('${item.id}')">

Delete

</button>

</p>

`;



});





// COLORS


const colorSnap =
await getDocs(
collection(db,"customColors")
);



colorSnap.forEach((item)=>{


colors.innerHTML += `

<p>

🎨 ${item.data().name}


<button onclick="deleteColor('${item.id}')">

Delete

</button>

</p>

`;



});






// WRAPPERS


const wrapperSnap =
await getDocs(
collection(db,"customWrappers")
);



wrapperSnap.forEach((item)=>{


const data =
item.data();



wrappers.innerHTML += `

<p>

🎀 ${data.name}

 ₱${data.price || 0}


<button onclick="deleteWrapper('${item.id}')">

Delete

</button>


</p>

`;



});







// ADDONS


const addonSnap =
await getDocs(
collection(db,"customAddons")
);



addonSnap.forEach((item)=>{


const data =
item.data();



addons.innerHTML += `

<p>

🍫 ${data.name}

 ₱${data.price || 0}


<button onclick="deleteAddon('${item.id}')">

Delete

</button>


</p>

`;



});



}
// ======================
// DELETE CUSTOM OPTIONS
// ======================


// DELETE FLOWER

window.deleteFlower =
async function(id){


await deleteDoc(
doc(db,"customFlowers",id)
);



showToast("🌸 Flower Deleted");


showCustomizeOptions();


};




// DELETE COLOR

window.deleteColor =
async function(id){


await deleteDoc(
doc(db,"customColors",id)
);



showToast("🎨 Color Deleted");


showCustomizeOptions();


};




// DELETE WRAPPER

window.deleteWrapper =
async function(id){


await deleteDoc(
doc(db,"customWrappers",id)
);



showToast("🎀 Wrapper Deleted");


showCustomizeOptions();


};




// DELETE ADDON

window.deleteAddon =
async function(id){


await deleteDoc(
doc(db,"customAddons",id)
);



showToast("🍫 Add-on Deleted");


showCustomizeOptions();


};





// ======================
// SHOP SETTINGS
// ======================


window.saveSettings =
async function(){


const shop =
document.getElementById("shop").value;


const tag =
document.getElementById("tag").value;


const fb =
document.getElementById("fb").value;


const contact =
document.getElementById("contact").value;



await setDoc(

doc(db,"settings","shopInfo"),

{

shop,

tag,

facebook:fb,

contact

}

);



showToast(
"🌸 Shop Settings Saved!"
);


};





async function loadSettings(){


try{


const snap =
await getDoc(
doc(db,"settings","shopInfo")
);



if(snap.exists()){


const data =
snap.data();



if(document.getElementById("shop"))

document.getElementById("shop").value =
data.shop || "";



if(document.getElementById("tag"))

document.getElementById("tag").value =
data.tag || "";



if(document.getElementById("fb"))

document.getElementById("fb").value =
data.facebook || "";



if(document.getElementById("contact"))

document.getElementById("contact").value =
data.contact || "";



}


}

catch(error){

console.log(
"Settings Error:",
error
);

}


}





// ======================
// FINAL LOAD
// ======================


async function loadAdmin(){


try{


await showProducts();


await showOrders();


await showCustomizeOptions();


await loadSettings();



console.log(
"ADMIN JS LOADED"
);



}

catch(error){

console.log(
"ADMIN ERROR:",
error
);

}


}



loadAdmin();
