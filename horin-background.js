/* The V2 intro, layout and navigation remain intact. */
(()=>{
const hero=document.querySelector('#hero'),film=document.querySelector('#horin-film'),button=document.querySelector('#film-toggle');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let introDone=!document.querySelector('#intro'),enabled=!reduced.matches&&!navigator.connection?.saveData,visible=true,completed=false;
film.muted=true;film.defaultMuted=true;
// Hold the real last frame. Only after ended may the branded hero appear.
film.preload='auto';
hero.classList.toggle('film-finished',!enabled);
function reset(){hero.classList.remove('film-finished');film.classList.remove('settled');}
function state(){const playing=!film.paused&&!film.ended;button.setAttribute('aria-pressed',String(playing));button.textContent=completed?'Přehrát znovu':playing?'Pozastavit':'Přehrát proměnu'}
function sync(){if(introDone&&enabled&&visible&&!document.hidden&&!completed)film.play().catch(state);else film.pause()}
button.addEventListener('click',()=>{if(completed){completed=false;film.currentTime=0;reset();enabled=true}else {enabled=film.paused;if(enabled)reset()}sync();state()});
film.addEventListener('playing',()=>{film.classList.add('ready');state()});
film.addEventListener('pause',state);
film.addEventListener('ended',()=>{completed=true;enabled=false;hero.classList.add('film-finished');film.classList.add('settled');state()});
film.addEventListener('error',()=>{enabled=false;hero.classList.add('film-finished');film.classList.remove('ready');button.hidden=true});
document.addEventListener('visibilitychange',sync);
reduced.addEventListener('change',()=>{if(reduced.matches){enabled=false;film.pause();film.classList.remove('ready');hero.classList.add('film-finished')}state()});
if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()},{threshold:.05}).observe(hero);
if(!introDone){const intro=document.querySelector('#intro');const observer=new MutationObserver(()=>{if(!intro.isConnected||intro.classList.contains('out')){introDone=true;observer.disconnect();sync()}});observer.observe(document.body,{childList:true});observer.observe(intro,{attributes:true,attributeFilter:['class']})}
state();sync();
})();
