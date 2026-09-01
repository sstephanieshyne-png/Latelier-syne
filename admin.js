let products = [];
console.log("ADMIN JS LOADED");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDvtUJOmtU9zP76h_GEBiNRjstRQ3IEpaA",
  authDomain: "latelier-syne.firebaseapp.com",
  projectId: "latelier-syne",
  storageBucket: "latelier-syne.firebasestorage.app",
  messagingSenderId: "785009872575",
  appId: "1:785009872575:web:cb2b2ac9dd51fe823b800a",
  measurementId: "G-PVBCNJTSTW"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

let orders = [];

async function addProduct(){

let name = document.getElementById('name').value;
let price = Number(document.getElementById('price').value);
let desc = document.getElementById('desc').value;

let file = document.getElementById('photo').files[0];

let image = "";

if(file){
    let reader = new FileReader();

    reader.onload = async function(){
        image = reader.result;

        await addDoc(collection(db,"products"),{
            name:name,
            price:price,
            desc:desc,
            image:image
        });

        alert("Product Added");
        showProducts();
    }

    reader.readAsDataURL(file);

}else{

    await addDoc(collection(db,"products"),{
        name:name,
        price:price,
        desc:desc,
        image:""
    });

    alert("Product Added");
    showProducts();
}

}



async function showProducts(){

let snap = await getDocs(collection(db,"products"));

products=[];

snap.forEach((doc)=>{
products.push({

    id: doc.id,

    ...doc.data()

});

document.getElementById('productList').innerHTML =
products.map((p,i)=>

`<div class="card">
${p.image ? '<img src="'+p.image+'">' : ''}
<h3>${p.name}</h3>
<p>₱${p.price}</p>
<p>${p.desc}</p>
<button onclick="deleteProduct('${p.id}')">Delete</button>
</div>`

).join('');

}

function saveSettings(){
localStorage.settings=JSON.stringify({
shop:shop.value,tag:tag.value,fb:fb.value,contact:contact.value
});
let file=document.getElementById('logoUpload').files[0];
if(file){
let r=new FileReader();
r.onload=()=>{localStorage.shopLogo=r.result;document.getElementById('logoPreview').src=r.result;alert('Saved')};
r.readAsDataURL(file);
localStorage.setItem("owner","true");
}else alert('Saved');
}

async function showOrders(){

let snap = await getDocs(collection(db,"orders"));

orders=[];

snap.forEach((doc)=>{
orders.push(doc.data());
});


document.getElementById('orderList').innerHTML =
orders.map(o=>

`<div class="card">
<b>${o.customer}</b><br>
${o.phone}<br>
${o.address}<br>
<h4>Order:</h4>
${o.items ? o.items.map(item => `
<p>🌸 ${item.name} - ₱${item.price}</p>
`).join("") : ""}
${o.notes}
</div>`

).join('');

}



let options=JSON.parse(localStorage.options||'{"colors":["Pink","Lavender","White"],"wrappers":["Korean Wrap","Kraft Wrap"],"addons":["Chocolate","Message Card"]}');
function saveOptions(){localStorage.options=JSON.stringify(options);showOptions();}
function addColor(){if(newColor.value){options.colors.push(newColor.value);saveOptions();newColor.value='';}}
function addWrapper(){if(newWrapper.value){options.wrappers.push(newWrapper.value);saveOptions();newWrapper.value='';}}
function addAddon(){if(newAddon.value){options.addons.push(newAddon.value);saveOptions();newAddon.value='';}}
function showOptions(){colors.innerHTML=options.colors.join(', ');wrappers.innerHTML=options.wrappers.join(', ');addons.innerHTML=options.addons.join(', ');}
showOptions();
window.addProduct = addProduct;
window.showProducts = showProducts;
window.showOrders = showOrders;

window.saveSettings = saveSettings;
window.addColor = addColor;
window.addWrapper = addWrapper;
window.addAddon = addAddon;
async function deleteProduct(id){
await deleteDoc(doc(db,"products",id));
alert("Product deleted!");
showProducts();
}

window.deleteProduct = deleteProduct;
showOrders().catch(err => console.log("Orders Error:", err));
showProducts().catch(err => console.log("Products Error:", err));
