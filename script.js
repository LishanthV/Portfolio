// ─── CURSOR ───────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);})();

// ─── PARTICLES ────────────────────────
const canvas=document.getElementById('particles-canvas');
const ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize(); window.addEventListener('resize',resize);
for(let i=0;i<80;i++){
  particles.push({
    x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
    vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
    r:Math.random()*1.8+0.3,
    color:Math.random()>.6?'93,202,165':Math.random()>.5?'127,119,221':'216,90,48',
    opacity:Math.random()*.35+.08
  });
}
let pmx=W/2,pmy=H/2;
document.addEventListener('mousemove',e=>{pmx=e.clientX;pmy=e.clientY;});
function drawP(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;
    if(p.y<0||p.y>H)p.vy*=-1;
    const dx=p.x-pmx,dy=p.y-pmy,dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<120){const f=(120-dist)/120;p.vx+=dx/dist*f*.05;p.vy+=dy/dist*f*.05;}
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${p.color},${p.opacity})`;ctx.fill();
    particles.forEach(q=>{
      const d=Math.sqrt((p.x-q.x)**2+(p.y-q.y)**2);
      if(d<90){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
        ctx.strokeStyle=`rgba(93,202,165,${.07*(1-d/90)})`;ctx.lineWidth=.4;ctx.stroke();}
    });
  });
  requestAnimationFrame(drawP);
}
drawP();

// ─── NAV SCROLL ───────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
});

// ─── TILT CARDS ───────────────────────
document.querySelectorAll('[data-tilt]').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const cx=r.left+r.width/2,cy=r.top+r.height/2;
    const rx=((e.clientY-cy)/r.height)*18;
    const ry=-((e.clientX-cx)/r.width)*18;
    el.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.03)`;
    el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
  el.addEventListener('mouseleave',()=>{el.style.transform='';});
});

// ─── COUNT UP ─────────────────────────
function countUp(id,target,suffix,dur){
  const el=document.getElementById(id); if(!el)return;
  let v=0; const step=target/(dur/16);
  const t=setInterval(()=>{v=Math.min(v+step,target);el.innerHTML=Math.round(v)+'<span>'+suffix+'</span>';if(v>=target)clearInterval(t);},16);
}
setTimeout(()=>{countUp('ctr-projects',12,'+',1200);countUp('ctr-commits',340,'+',1600);countUp('ctr-lines',25,'k',1400);countUp('ctr-tech',15,'+',1000);},600);

// ─── SCROLL REVEAL ────────────────────
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.classList.contains('skill-bar')){e.target.style.width=e.target.dataset.width+'%';}}});
},{threshold:0.12,rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revealObs.observe(el));

// Skill bars
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){
    e.target.querySelectorAll('.skill-bar').forEach(b=>{b.style.width=b.dataset.width+'%';});
  }});
},{threshold:0.3});
document.querySelectorAll('.skill-category').forEach(el=>barObs.observe(el));

// ─── RIPPLE BTN ───────────────────────
document.querySelectorAll('.btn-primary').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const r=document.createElement('span');
    r.style.cssText='position:absolute;border-radius:50%;background:rgba(255,255,255,.25);width:8px;height:8px;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);animation:ripple .5s ease forwards;pointer-events:none';
    btn.appendChild(r);setTimeout(()=>r.remove(),600);
  });
});

// Add ripple keyframe
const styleEl=document.createElement('style');
styleEl.textContent='@keyframes ripple{0%{transform:translate(-50%,-50%) scale(0);opacity:.8}100%{transform:translate(-50%,-50%) scale(4);opacity:0}}';
document.head.appendChild(styleEl);

// ─── SKILL PILL PARTICLES ─────────────
document.querySelectorAll('.pchip').forEach(chip=>{
  chip.addEventListener('click',e=>{
    for(let i=0;i<6;i++){
      const d=document.createElement('div');
      const ang=Math.random()*360,dist=40+Math.random()*40;
      d.style.cssText=`position:fixed;width:5px;height:5px;border-radius:50%;background:#5DCAA5;
        left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:9999;
        transition:all .5s ease;transform:translate(-50%,-50%)`;
      document.body.appendChild(d);
      requestAnimationFrame(()=>{
        d.style.transform=`translate(calc(-50% + ${Math.cos(ang)*dist}px),calc(-50% + ${Math.sin(ang)*dist}px)) scale(0)`;
        d.style.opacity='0';
      });
      setTimeout(()=>d.remove(),500);
    }
  });
});

// ─── CONTACT FORM MAILTO ──────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    
    const subject = encodeURIComponent(`Portfolio Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    window.location.href = `mailto:lishanth@email.com?subject=${subject}&body=${body}`;
  });
}
