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
// ADD PRODUCT
// ======================

window.addProduct = async function(){

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const desc = document.getElementById("desc").value;


  if(!name || !price){
    alert("Please complete product details");
    return;
  }


  await addDoc(collection(db,"products"),{

    name:name,
    price:Number(price),
    desc:desc

  });


  alert("Product Added!");

  document.getElementById("name").value="";
  document.getElementById("price").value="";
  document.getElementById("desc").value="";


  showProducts();

};



// ======================
// SHOW PRODUCTS
// ======================

async function showProducts(){

  const productList = document.getElementById("productList");

  productList.innerHTML="";


  const snapshot = await getDocs(collection(db,"products"));


  snapshot.forEach((item)=>{

    const product = item.data();


    productList.innerHTML += `

    <div class="card">

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

  orderList.innerHTML="";


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
      <p>

      <button onclick="completeOrder('${orderId}')">
      Mark as Done
      </button>

    </div>

    `;


  });


}


window.completeOrder = async function(id){
  await updateDoc(doc(db,"orders",id),{
status:"Completed"
 });
  alert("Order completed!");
  showOrders();
 }; 
// LOAD DATA

showProducts();
showOrders();
