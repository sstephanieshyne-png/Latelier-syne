import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
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
// IMGBB SETTINGS
// ======================

const IMGBB_API_KEY = "78157b4e1e63790ce09bee450d5acd5c";


// ======================
// ADD PRODUCT
// ======================

window.addProduct = async function(){

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const desc = document.getElementById("desc").value;
  const photo = document.getElementById("photo").files[0];


  if(!name || !price){
    alert("Please complete product details");
    return;
  }


  let imageURL = "";


  if(photo){

    try{

      let formData = new FormData();

      formData.append("image", photo);


      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method:"POST",
          body:formData
        }
      );


      const data = await response.json();


      if(data.success){

        imageURL = data.data.url;

      }


    }catch(error){

      console.log(error);

      alert("Image upload failed");

    }

  }



  await addDoc(collection(db,"products"),{

    name:name,

    price:Number(price),

    desc:desc,

    image:imageURL

  });



  alert("Product Added!");


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

  const productList = document.getElementById("productList");

  productList.innerHTML = "";


  const snapshot = await getDocs(collection(db,"products"));


  snapshot.forEach((item)=>{

    const product = item.data();


    productList.innerHTML += `

    <div class="card">

      ${product.image ? 
      `<img src="${product.image}" style="width:200px;border-radius:20px;">`
      : ""}

      <h3>${product.name}</h3>

      <p>₱${product.price}</p>

      <p>${product.desc || ""}</p>


      <button onclick="deleteProduct('${item.id}')">
      Delete
      </button>

    </div>

    `;


  });

}



// ======================
// DELETE PRODUCT
// ======================

window.deleteProduct = async function(id){

  await deleteDoc(doc(db,"products",id));


  alert("Product Deleted!");


  showProducts();

};




// ======================
// SHOW ORDERS
// ======================

async function showOrders(){

  const orderList = document.getElementById("orderList");

  orderList.innerHTML = "";


  const snapshot = await getDocs(collection(db,"orders"));


  snapshot.forEach((item)=>{


    const order = item.data();

    const orderId = item.id;


    let orderedItems = "";


    if(order.items){

      order.items.forEach(product=>{

        orderedItems += `

        🌸 ${product.name} - ₱${product.price}<br>

        `;

      });

    }



    orderList.innerHTML += `


    <div class="card">

      <h3>${order.customer || ""}</h3>

      Phone: ${order.phone || ""}<br>

      Address: ${order.address || ""}<br>


      <h4>Order:</h4>

      ${orderedItems}


      <p>${order.notes || ""}</p>


      <p>
      Status: ${order.status || "Pending"}
      </p>


      <select onchange="updateStatus('${orderId}', this.value)">

        <option value="Pending">Pending</option>

        <option value="Preparing">Preparing</option>

        <option value="Ready for Delivery">
        Ready for Delivery
        </option>

        <option value="Completed">
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

window.updateStatus = async function(id,status){


  await updateDoc(doc(db,"orders",id),{

    status:status

  });


  alert("Status updated!");

  showOrders();

};


// ======================
// CUSTOMIZE OPTIONS
// ======================

window.addColor = async function(){

  const color = document.getElementById("newColor").value;

  if(!color){
    alert("Enter color");
    return;
  }

  await addDoc(collection(db,"customColors"),{
    name: color
  });

  alert("Color Added!");

  document.getElementById("newColor").value="";

};
window.addFlower = async function(){

const flower =

document.getElementById("newFlower").value;

if(!flower){

alert("Enter flower");

return;

}

await addDoc(

collection(db,"customFlowers"),

{

name: flower

}

);

alert("Flower Added!");

document.getElementById("newFlower").value="";

loadFlowers();

}


window.addWrapper = async function(){

  const wrapper = document.getElementById("newWrapper").value;

  if(!wrapper){
    alert("Enter wrapper");
    return;
  }

  await addDoc(collection(db,"customWrappers"),{
    name: wrapper
  });

  alert("Wrapper Added!");

  document.getElementById("newWrapper").value="";

};



window.addAddon = async function(){

  const addon = document.getElementById("newAddon").value;

  if(!addon){
    alert("Enter add-on");
    return;
  }

  await addDoc(collection(db,"customAddons"),{
    name:addon
  });

  alert("Add-on Added!");

  document.getElementById("newAddon").value="";

};
// ======================
// SHOW CUSTOM OPTIONS
// ======================

async function showCustomizeOptions(){

  const colors = document.getElementById("colors");
  const wrappers = document.getElementById("wrappers");
  const addons = document.getElementById("addons");


  colors.innerHTML = "";
  wrappers.innerHTML = "";
  addons.innerHTML = "";


  const colorSnap = await getDocs(collection(db,"customColors"));

  colorSnap.forEach((item)=>{

    colors.innerHTML += `
    <p>
    🌸 ${item.data().name}
    <button onclick="deleteColor('${item.id}')">
    Delete
    </button>
    </p>
    `;

  });



  const wrapperSnap = await getDocs(collection(db,"customWrappers"));

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



  const addonSnap = await getDocs(collection(db,"customAddons"));

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
window.deleteColor = async function(id){

await deleteDoc(doc(db,"customColors",id));

showCustomizeOptions();

};


window.deleteWrapper = async function(id){

await deleteDoc(doc(db,"customWrappers",id));

showCustomizeOptions();

};


window.deleteAddon = async function(id){

await deleteDoc(doc(db,"customAddons",id));

showCustomizeOptions();

};
// ======================
// LOAD DATA
// ======================

showProducts();
showOrders();
showCustomizeOptions();
