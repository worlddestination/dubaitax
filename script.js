// VAT Calculator
let currentRate=5,base=10000;
function setRate(el,color,r){
  document.querySelectorAll('.rp').forEach(p=>{p.className='rp'});
  el.className='rp active-'+color;
  currentRate=r;
  const tax=Math.round(base*currentRate/100);
  document.getElementById('resTax').textContent=tax.toLocaleString('en-AE')+' AED';
  document.getElementById('resTotal').textContent=(base+tax).toLocaleString('en-AE')+' AED';
}

// Count-up
document.querySelectorAll('[data-count]').forEach(el=>{
  const t=+el.dataset.count;let c=0;
  const step=t/55;
  const ti=setInterval(()=>{
    c=Math.min(c+step,t);
    el.textContent=Math.floor(c).toLocaleString();
    if(c>=t)clearInterval(ti);
  },18);
});

// Mouse 3D tilt on hero card
const card=document.getElementById('heroCard');
document.addEventListener('mousemove',e=>{
  if(!card)return;
  const rect=card.getBoundingClientRect();
  const cx=rect.left+rect.width/2;
  const cy=rect.top+rect.height/2;
  const dx=(e.clientX-cx)/(window.innerWidth/2);
  const dy=(e.clientY-cy)/(window.innerHeight/2);
  card.style.animation='none';
  card.style.transform=`perspective(1000px) rotateX(${-dy*10}deg) rotateY(${dx*10}deg) translateY(-6px)`;
});
document.addEventListener('mouseleave',()=>{
  if(card){card.style.animation='cardFloat 7s ease-in-out infinite';card.style.transform='';}
});

// Counter from localStorage
let bCount=parseInt(localStorage.getItem('bCount')||'0')||1240;
bCount++;localStorage.setItem('bCount',bCount);
let tCount=parseInt(localStorage.getItem('tCount')||'0')||8500;
document.querySelector('[data-count="1240"]').dataset.count=bCount;
document.querySelector('[data-count="8500"]').dataset.count=tCount;
document.querySelectorAll('[data-count]').forEach(el=>{
  el.textContent=parseInt(el.dataset.count).toLocaleString();
});

// Tool click counter
['vat.html','corporate-tax.html','ai-assistant.html'].forEach(href=>{
  const link=document.querySelector(`a[href="${href}"]`);
  if(link)link.addEventListener('click',()=>{
    let t=parseInt(localStorage.getItem('tCount')||'8500');
    t++;localStorage.setItem('tCount',t);
  });
});
