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

alert(message);

}



// ======================
// IMAGE UPLOAD
// ======================

const IMGBB_API_KEY =
"78157b4e1e63790ce09bee450d5acd5c";



// ======================
// PRODUCTS
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

showToast("Complete product details");

return;

}



let imageURL="";



if(photo){


let formData = new FormData();

formData.append(
"image",
photo
);



let response =
await fetch(

`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,

{

method:"POST",

body:formData

}

);



let data =
await response.json();



if(data.success){

imageURL =
data.data.url;

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



showToast("Product Added");


showProducts();


};



async function showProducts(){


const productList =
document.getElementById("productList");


if(!productList)return;


productList.innerHTML="";


const snapshot =
await getDocs(
collection(db,"products")
);



snapshot.forEach(item=>{


const product =
item.data();



productList.innerHTML += `

<div class="card">

${product.image ?

`<img src="${product.image}" style="width:200px;border-radius:20px;">`

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




window.deleteProduct =
async function(id){


await deleteDoc(

doc(db,"products",id)

);


showToast("Product Deleted");


showProducts();


};
// ======================
// ORDERS
// ======================


let allOrders = [];

let currentFilter = "All";



// LOAD ORDERS

async function showOrders(){


const orderList =
document.getElementById("orderList");


if(!orderList)return;


orderList.innerHTML="";


allOrders = [];



const snapshot =
await getDocs(
collection(db,"orders")
);



snapshot.forEach(item=>{


allOrders.push({

id:item.id,

...item.data()

});


});



displayOrders();

updateOrderCounts();


}



// DISPLAY ORDERS

function displayOrders(){


const orderList =
document.getElementById("orderList");


if(!orderList)return;


orderList.innerHTML="";



let filteredOrders =

currentFilter === "All"

?

allOrders

:

allOrders.filter(order=>

(order.status || "Pending")
=== currentFilter

);




filteredOrders.forEach(order=>{


let items="";


if(order.items && Array.isArray(order.items)){


order.items.forEach(product=>{


items += `

🌸 ${product.name} - ₱${product.price}

<br>

`;


});


}



orderList.innerHTML += `

<div class="card order-card">


<h3>
🌸 ${order.customer || "Customer"}
</h3>


<p>
📞 ${order.phone || ""}
</p>


<p>
📍 ${order.address || ""}
</p>



<h4>
🛍 Order:
</h4>


<p>
${items}
</p>



<p>

Status:

<select onchange="changeStatus('${order.id}',this.value)">

<option ${order.status=="Pending"?"selected":""}>
Pending
</option>


<option ${order.status=="Preparing"?"selected":""}>
Preparing
</option>


<option ${order.status=="Ready for Delivery"?"selected":""}>
Ready for Delivery
</option>


<option ${order.status=="Completed"?"selected":""}>
Completed
</option>


</select>

</p>


</div>

`;



});


}




// FILTER TABS


window.filterOrders = function(status){


currentFilter = status;


displayOrders();


};




// SEARCH


window.searchOrders = function(keyword){


keyword =
keyword.toLowerCase();



const orderList =
document.getElementById("orderList");


orderList.innerHTML="";



let filtered =

allOrders.filter(order=>


(order.customer || "")
.toLowerCase()
.includes(keyword)


||

(order.phone || "")
.includes(keyword)


);



filtered.forEach(order=>{


orderList.innerHTML += `

<div class="card order-card">


<h3>
🌸 ${order.customer || "Customer"}
</h3>


<p>
📞 ${order.phone || ""}
</p>


<p>
📍 ${order.address || ""}
</p>


</div>

`;


});


};





// UPDATE STATUS


window.changeStatus = async function(id,status){


await updateDoc(

doc(db,"orders",id),

{

status:status

}

);



showOrders();


};





// COUNTS


function updateOrderCounts(){


const counts = {


countAll: allOrders.length,


countPending:
allOrders.filter(o=>
(o.status || "Pending")
==="Pending").length,


countPreparing:
allOrders.filter(o=>
o.status==="Preparing").length,


countReady:
allOrders.filter(o=>
o.status==="Ready for Delivery").length,


countCompleted:
allOrders.filter(o=>
o.status==="Completed").length


};



Object.keys(counts).forEach(id=>{


let el =
document.getElementById(id);


if(el){

el.innerHTML =
counts[id];

}


});


}
// ======================
// CUSTOMIZATION OPTIONS
// ======================


// FLOWERS

window.addFlower = async function(){


const flower =
document.getElementById("newFlower").value;


const price =
document.getElementById("flowerPrice").value;



if(!flower){

alert("Enter flower");

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


showCustomizeOptions();


};




// COLORS

window.addColor = async function(){


const color =
document.getElementById("newColor").value;



if(!color){

alert("Enter color");

return;

}



await addDoc(

collection(db,"customColors"),

{

name:color

}

);



document.getElementById("newColor").value="";


showCustomizeOptions();


};




// WRAPPER

window.addWrapper = async function(){


const wrapper =
document.getElementById("newWrapper").value;


const price =
document.getElementById("wrapperPrice").value;



if(!wrapper){

alert("Enter wrapper");

return;

}



await addDoc(

collection(db,"customWrappers"),

{

name:wrapper,

price:Number(price)||0

}

);



document.getElementById("newWrapper").value="";

document.getElementById("wrapperPrice").value="";


showCustomizeOptions();


};




// ADDON

window.addAddon = async function(){


const addon =
document.getElementById("newAddon").value;


const price =
document.getElementById("addonPrice").value;



if(!addon){

alert("Enter addon");

return;

}



await addDoc(

collection(db,"customAddons"),

{

name:addon,

price:Number(price)||0

}

);



document.getElementById("newAddon").value="";

document.getElementById("addonPrice").value="";


showCustomizeOptions();


};





// SHOW CUSTOM OPTIONS


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


flowerSnap.forEach(item=>{


let data =
item.data();



flowers.innerHTML += `

<p>
🌸 ${data.name} ₱${data.price}

</p>

`;

});




// COLORS

const colorSnap =
await getDocs(
collection(db,"customColors")
);



colorSnap.forEach(item=>{


colors.innerHTML += `

<p>
🎨 ${item.data().name}
</p>

`;

});




// WRAPPERS

const wrapperSnap =
await getDocs(
collection(db,"customWrappers")
);



wrapperSnap.forEach(item=>{


let data =
item.data();



wrappers.innerHTML += `

<p>
🎀 ${data.name} ₱${data.price}
</p>

`;

});




// ADDONS

const addonSnap =
await getDocs(
collection(db,"customAddons")
);



addonSnap.forEach(item=>{


let data =
item.data();



addons.innerHTML += `

<p>
🍫 ${data.name} ₱${data.price}
</p>

`;

});


}





// ======================
// SHOP SETTINGS
// ======================


window.saveSettings = async function(){


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



alert("Settings Saved");


};





async function loadSettings(){


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





// ======================
// FINAL LOAD
// ======================


async function loadAdmin(){


await showProducts();

await showOrders();

await showCustomizeOptions();

await loadSettings();


console.log("ADMIN READY");


}



loadAdmin();
