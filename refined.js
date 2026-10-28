(() => {
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
 function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Otevřít menu');nav.classList.remove('expanded');}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Zavřít menu':'Otevřít menu');nav.classList.toggle('expanded',open);});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 const hdr=document.querySelector('#hdr');
 function onScroll(){hdr.classList.toggle('solid',!document.querySelector('#hero')||scrollY>innerHeight*.6);}
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 const scene=document.querySelector('#scene'),hero=document.querySelector('#hero');
 if(scene&&hero){function fit(){const w=hero.clientWidth,h=hero.clientHeight,a=1434/938,W=Math.max(w,h*a),H=W/a,x=Math.min(0,Math.max(w-W,w/2-W*.558));Object.assign(scene.style,{width:W+'px',height:H+'px',left:x+'px',top:(h-H)/2+'px'});}fit();addEventListener('resize',fit);hero.classList.add('open','mat');}
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
 document.querySelectorAll('.rv').forEach(el=>io.observe(el));
})();
