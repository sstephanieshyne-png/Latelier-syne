let products=JSON.parse(localStorage.products||'[]');
let orders=JSON.parse(localStorage.orders||'[]');

function addProduct(){
let f=document.getElementById('photo').files[0];
let save=(img)=>{
products.push({name:document.getElementById('name').value,price:Number(document.getElementById('price').value),desc:document.getElementById('desc').value,image:img});
localStorage.products=JSON.stringify(products);
showProducts();
};
if(f){let r=new FileReader();r.onload=()=>save(r.result);r.readAsDataURL(f)}
else save('');
}

function deleteProduct(i){
products.splice(i,1);
localStorage.products=JSON.stringify(products);
showProducts();
}

function showProducts(){
document.getElementById('productList').innerHTML=products.map((p,i)=>
`<div class="card">${p.image?'<img src="'+p.image+'">':''}<h3>${p.name}</h3><p>₱${p.price}</p><button onclick="deleteProduct(${i})">Delete</button></div>`
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

document.getElementById('orderList').innerHTML=orders.map(o=>
`<div class="card"><b>${o.customer}</b><br>${o.phone}<br>${o.address}<br>${o.notes}</div>`
).join('');
showProducts();


let options=JSON.parse(localStorage.options||'{"colors":["Pink","Lavender","White"],"wrappers":["Korean Wrap","Kraft Wrap"],"addons":["Chocolate","Message Card"]}');
function saveOptions(){localStorage.options=JSON.stringify(options);showOptions();}
function addColor(){if(newColor.value){options.colors.push(newColor.value);saveOptions();newColor.value='';}}
function addWrapper(){if(newWrapper.value){options.wrappers.push(newWrapper.value);saveOptions();newWrapper.value='';}}
function addAddon(){if(newAddon.value){options.addons.push(newAddon.value);saveOptions();newAddon.value='';}}
function showOptions(){colors.innerHTML=options.colors.join(', ');wrappers.innerHTML=options.wrappers.join(', ');addons.innerHTML=options.addons.join(', ');}
showOptions();
