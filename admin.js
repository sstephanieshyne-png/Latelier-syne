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
// PREMIUM TOAST
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
// IMGBB SETTINGS
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

showToast(
"🌸 Please complete product details"
);

return;

}



let imageURL = "";



if(photo){


try{


let formData =
new FormData();


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


showToast(
"🌸 Image upload failed"
);


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



const snapshot =
await getDocs(
collection(db,"products")
);
console.log("PRODUCT COUNT:", snapshot.size);


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
orderList.innerHTML = "";



const snapshot =
await getDocs(
collection(db,"orders")
);
console.log("ORDER COUNT:", snapshot.size);


snapshot.forEach((item)=>{


const order =
item.data();


const orderId =
item.id;



let orderedItems = "";



if(order.items){


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
🌸 ${order.customer || ""}
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

${orderedItems}

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
${currentStatus === "Pending" ? "selected" : ""}>
Pending
</option>



<option value="Preparing"
${currentStatus === "Preparing" ? "selected" : ""}>
Preparing
</option>



<option value="Ready for Delivery"
${currentStatus === "Ready for Delivery" ? "selected" : ""}>
Ready for Delivery
</option>



<option value="Completed"
${currentStatus === "Completed" ? "selected" : ""}>
Completed
</option>


</select>



</div>


`;



});


}





// ======================
// UPDATE STATUS
// ======================


window.updateStatus =
async function(id,status){



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



};
// ======================
// CUSTOMIZE OPTIONS
// ======================


window.addColor = async function(){


const color =
document.getElementById("newColor").value;



if(!color){

showToast(
"🌸 Enter color first"
);

return;

}



await addDoc(
collection(db,"customColors"),
{

name:color

}

);



showToast(
"🌸 Color Added!"
);



document.getElementById("newColor").value="";


showCustomizeOptions();


};






window.addFlower = async function(){



const flower =
document.getElementById("newFlower").value;
const price =
document.getElementById("flowerPrice").value;


if(!flower){


showToast(
"🌸 Enter flower first"
);


return;

}



await addDoc(
collection(db,"customFlowers"),
{

name:flower
price: Number(price)
}

);



showToast(
"🌸 Flower Added!"
);



document.getElementById("newFlower").value="";


showCustomizeOptions();


};






window.addWrapper = async function(){



const wrapper =
document.getElementById("newWrapper").value;
const price =
document.getElementById("wrapperPrice").value;


if(!wrapper){


showToast(
"🌸 Enter wrapper first"
);


return;

}



await addDoc(
collection(db,"customWrappers"),
{

name:wrapper
price: Number(price)
}

);



showToast(
"🌸 Wrapper Added!"
);



document.getElementById("newWrapper").value="";


showCustomizeOptions();


};


window.addAddon = async function(){



const addon =
document.getElementById("newAddon").value;
const price =
document.getElementById("addonPrice").value;


if(!addon){


showToast(
"🌸 Enter add-on first"
);


return;

}



await addDoc(
collection(db,"customAddons"),
{

name:addon
price: Number(price)
}

);



showToast(
"🌸 Add-on Added!"
);



document.getElementById("newAddon").value="";


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


flowers.innerHTML += `


<p>

🌸 ${item.data().name}


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


wrappers.innerHTML += `


<p>

🎀 ${item.data().name}


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


addons.innerHTML += `


<p>

🍫 ${item.data().name}


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


window.deleteFlower =
async function(id){


await deleteDoc(
doc(db,"customFlowers",id)
);



showToast(
"🌸 Flower Deleted"
);



showCustomizeOptions();


};





window.deleteColor =
async function(id){


await deleteDoc(
doc(db,"customColors",id)
);



showToast(
"🎨 Color Deleted"
);



showCustomizeOptions();


};






window.deleteWrapper =
async function(id){


await deleteDoc(
doc(db,"customWrappers",id)
);



showToast(
"🎀 Wrapper Deleted"
);



showCustomizeOptions();


};






window.deleteAddon =
async function(id){


await deleteDoc(
doc(db,"customAddons",id)
);



showToast(
"🍫 Add-on Deleted"
);



showCustomizeOptions();


};






// ======================
// LOAD DATA
// ======================


showProducts();

showOrders();

showCustomizeOptions();
console.log("ADMIN JS LOADED");
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


showToast(
"🌸 Shop Settings Saved!"
);


};

// ======================
// LOAD SHOP SETTINGS
// ======================

async function loadSettings(){


const snapshot =
await getDocs(
collection(db,"settings")
);


snapshot.forEach((item)=>{


const data=item.data();



document.getElementById("shop").value =
data.shop || "";



document.getElementById("tag").value =
data.tag || "";



document.getElementById("fb").value =
data.facebook || "";



document.getElementById("contact").value =
data.contact || "";


});


}



loadSettings();
