// Simple client-side "سوق الحي" demo
const MOCK = [
  {id:1,title:'كنبة مستعملة نظيفة',description:'كنبة 3 مقاعد بحالة جيدة، اللون رمادي.',price:350,neighbour:'الرياض - العليا',image:''},
  {id:2,title:'دراجة هوائية للأطفال',description:'دراجة بحالة ممتازة، مقاس صغير.',price:120,neighbour:'جدة - الحمراء',image:''},
  {id:3,title:'خدمة نقل أثاث',description:'نقل داخل المدينة وبأسعار مناسبة.',price:80,neighbour:'الدمام - المجمع',image:''}
];

const listingsEl = document.getElementById('listings');
const searchInput = document.getElementById('search');
const neighbourSelect = document.getElementById('neighbourSelect');
const openFormBtn = document.getElementById('openFormBtn');
const formPanel = document.getElementById('formPanel');
const addForm = document.getElementById('addForm');
const cancelBtn = document.getElementById('cancelBtn');

function loadData(){
  const stored = localStorage.getItem('souq_listings');
  if(stored) return JSON.parse(stored);
  localStorage.setItem('souq_listings', JSON.stringify(MOCK));
  return MOCK;
}

function saveData(data){
  localStorage.setItem('souq_listings', JSON.stringify(data));
}

function render(){
  const q = searchInput.value.trim().toLowerCase();
  const neighbourhood = neighbourSelect.value;
  const data = loadData();
  const filtered = data.filter(item => {
    const matchQ = !q || (item.title+item.description).toLowerCase().includes(q);
    const matchN = neighbourhood === 'all' || item.neighbour === neighbourhood;
    return matchQ && matchN;
  });
  listingsEl.innerHTML = '';
  if(filtered.length === 0){
    listingsEl.innerHTML = '<p>لا توجد نتائج.</p>';
    return;
  }
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/400x300?text=صورة+منتج'}" alt="">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="meta">${escapeHtml(item.neighbour)}</div>
      <div class="price">${item.price} SAR</div>
      <p>${escapeHtml(item.description)}</p>
      <div style="margin-top:8px">
        <button onclick="contact(${item.id})">تواصل</button>
      </div>
    `;
    listingsEl.appendChild(card);
  });
}

function escapeHtml(text){
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

window.contact = function(id){
  const data = loadData();
  const found = data.find(d=>d.id===id);
  if(!found){ alert('الاعلان غير موجود'); return; }
  const phone = prompt('اكتب رقمك أو بريدك للتواصل (مثال: 05xxxxxxxx)');
  if(phone) alert('تم إرسال رسالة تجريبية للبائع — هذا نموذج فقط في النسخة التجريبية.');
}

openFormBtn.addEventListener('click', ()=>{
  formPanel.classList.remove('hidden');
  formPanel.setAttribute('aria-hidden','false');
});
cancelBtn.addEventListener('click', ()=>{
  formPanel.classList.add('hidden');
  formPanel.setAttribute('aria-hidden','true');
});

addForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const f = new FormData(addForm);
  const item = {
    id: Date.now(),
    title: f.get('title'),
    description: f.get('description'),
    price: Number(f.get('price')||0),
    neighbour: f.get('neighbour'),
    image: f.get('image')||''
  };
  const data = loadData();
  data.unshift(item);
  saveData(data);
  addForm.reset();
  formPanel.classList.add('hidden');
  render();
});

searchInput.addEventListener('input', render);
neighbourSelect.addEventListener('change', render);

// initial render
render();
