const $=s=>document.querySelector(s);
const img=(f,w)=>`obrazky/${f}-${w}.webp`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* počítadlo let */
const REF = window.REFS, RY = Object.fromEntries(window.ROKY.map(r => [r.y, r]));
const PH = {2026:'Rezidence Turbová', 2023:'Rekonstrukce Palác Dunaj Národní třída Praha 1', 2020:'Rekonstrukce PK Hořín'}; // rok bez vlastní fotky → hlavní stavba roku
const OWN = {'Rezidence Turbová':'w_turbova', 'Rekonstrukce PK Hořín':'w_komora'}; // naše fotka stavby má přednost
const BEFORE = window.PRED || {}; // stavba → {f: fotka před, lic}
const KN = Object.fromEntries(window.ROKY.map(r => [r.n, r])); // fotka patří stavbě, ne roku → stejná stavba = stejná fotka
const span = y => { const m = String(y).match(/(\d{4})\D*(\d{1,4})?/), a = +m[1]; return [a, m[2] ? +(String(a).slice(0, 4 - m[2].length) + m[2]) : a]; };
REF.forEach(r => [r.a, r.b] = span(r.y));
// každá stavba má jeden rok: rok své fotky, jinak nejméně obsazený rok svého rozsahu; prázdný rok doplní stavba, která v něm ještě běžela
const load = {}; REF.filter(r => r.a === r.b).forEach(r => { r.h = r.a; load[r.a] = (load[r.a] || 0) + 1; });
REF.filter(r => r.a !== r.b).sort((p, q) => (p.b - p.a) - (q.b - q.a)).forEach(r => { const k = window.ROKY.find(x => x.n === r.n && +x.y >= r.a && +x.y <= r.b); let h = k ? +k.y : r.b; if (!k) for (let Y = r.b; Y >= r.a; Y--) if ((load[Y] || 0) < (load[h] || 0)) h = Y; r.h = h; load[h] = (load[h] || 0) + 1; });
const R = [];
for (let Y = Math.max(...REF.map(r => r.b)); Y >= Math.min(...REF.map(r => r.a)); Y--) {
  let it = REF.filter(r => r.h === Y); if (!it.length) it = REF.filter(r => r.a <= Y && Y <= r.b);
  it = it.sort((p, q) => (q.a === Y) - (p.a === Y));
  if (!it.length) continue;
  const k = RY[Y], top = it.find(r => r.n === (k ? k.n : PH[Y]));
  const f = top || it[0];
  const kn = KN[f.n], own = OWN[f.n];
  R.push({y: String(Y), bf: BEFORE[f.n], f: own || (kn ? kn.f : 'r04'), ok: !own && kn && kn.ok, lic: kn && kn.lic, cap: '', n: f.n, o: f.o, p: k ? k.p : f.p, l: f.y, it: it.filter(r => r !== f), cnt: it.length, nov: it.filter(r => r.a === Y).length});
}
const N = R.length, pl = n => n === 1 ? 'stavba' : n < 5 ? 'stavby' : 'staveb';
$('#rintro').textContent = `Reference · ${R[0].y} → ${R[N - 1].y} · ${REF.length} staveb`;
const odo = $('#odo');
odo.innerHTML = [0,1,2,3].map(() => `<div class="d"><span>${[...Array(10)].map((_, i) => `<i>${i}</i>`).join('')}</span></div>`).join('');
const digs = [...odo.querySelectorAll('.d span')];
$('#rail').innerHTML = R.map(() => '<b></b>').join('');
const ticks = [...document.querySelectorAll('#rail b')];
const cards = [$('#cA'), $('#cB')]; let cur = -1, flip = 0;
const mob = matchMedia('(max-width:860px)'), drum = $('#drum');
drum.firstChild.innerHTML = R.map(r => `<li>${r.y}</li>`).join('');
const dli = [...drum.querySelectorAll('li')]; let drumSync = false;
function drumTo(i) { if (!mob.matches) return; drumSync = true; drum.scrollTo({top: i * dli[0].offsetHeight, behavior: RM || spinOn ? 'auto' : 'smooth'}); clearTimeout(drumTo.t); drumTo.t = setTimeout(() => drumSync = false, 650); }

function cardHTML(r) {
  const cr = r.bf && r.bf.lic ? `<span class="cr">Foto před: ${esc(r.bf.lic)}${r.ok ? ` · po: ${esc(r.lic)}` : ''}</span>` : r.ok ? `<span class="cr">Foto: ${esc(r.lic)}</span>` : r.cap ? `<span class="cr">Ilustrační foto · ${esc(r.cap)}</span>` : '';
  const pic = (f, a) => `<img src="${img(f, 800)}" srcset="${img(f, 800)} 800w, ${img(f, 1600)} 1600w" sizes="(max-width:860px) 50vw, 420px" alt="${esc(a)}">`;
  const pred = r.bf ? `<figure>${pic(r.bf.f, r.n + ' – před')}<b>Před</b></figure>` : '';
  const yl = r.it.length ? `<div class="ylist"><h4>Další stavby ${r.y}</h4><ol>${r.it.map(x => `<li class="${x.a < +r.y ? 'run' : ''}"><b>${esc(x.n)}</b><span>${esc(x.y)} · ${esc(x.o)} · ${esc(x.p)}</span></li>`).join('')}</ol></div>` : '';
  const po = `<figure${r.bf ? ' class="af"' : ''}>${pic(r.f, r.bf ? r.n + ' – po' : r.n)}${r.bf ? '<b>Po</b>' : ''}</figure>`;
  return `<div class="sd L">${pred || yl ? '<div class="lk"></div>' : ''}${pred}${yl}</div>
    <div class="sd R"><div class="lk"></div>${po}
    <div class="meta"><em>${esc(r.l)} · ${esc(r.o)}</em><h3>${esc(r.n)}</h3><p>${esc(r.p)}</p>${cr}${r.it.length ? `<ul>${r.it.map(x => `<li class="${x.a < +r.y ? 'run' : ''}"><span>${esc(x.n)}</span><i>${x.a === x.b ? esc(x.p) : esc(x.y)}</i></li>`).join('')}</ul>` : ''}</div></div>`;
}
function show(i, fromDrum) {
  if (i === cur) return; cur = i; const r = R[i];
  dli.forEach((li, k) => li.classList.toggle('on', k === i)); if (!fromDrum) drumTo(i);
  [...r.y].forEach((d, k) => digs[k].style.transform = `translateY(-${d}em)`);
  $('#rcount').innerHTML = `<b>${r.cnt}</b> ${pl(r.cnt)} v běhu${r.nov && r.nov < r.cnt ? ` · ${r.nov} ${r.nov === 1 ? 'nová' : r.nov < 5 ? 'nové' : 'nových'}` : ''}`;
  ticks.forEach((t, k) => t.classList.toggle('on', k === i));
  $('#rbg').style.backgroundImage = `url(${img(r.bf ? r.bf.f : r.f, 800)})`; clearTimeout(show.t);
  const old = cards[flip]; flip ^= 1; const c = cards[flip];
  old.classList.remove('on');
  c.className = 'card pair' + (r.bf ? '' : ' one'); c.innerHTML = cardHTML(r);
  requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('on')));
  if (r.bf) show.t = setTimeout(() => { const a = c.querySelector('.af'); if (a) a.classList.add('in'); $('#rbg').style.backgroundImage = `url(${img(r.f, 800)})`; }, 1000); // 1. s před, 2.–3. s po
  $('#ylist').className = 'ylist'; // seznam staveb je nově v levém panelu pod fotkou před
}
/* roky se přepínají jen nad letopočtem: kolečko, tah prstem, šipky, klik na rail */
const ctr = $('#counter'); let acc = 0, ty = null, ctrLock = 0, ctrDone = false;
const step = d => { const i = Math.max(0, Math.min(N - 1, cur + d)); if (i === cur) return false; show(i); return true; };
ctr.addEventListener('wheel', e => {
  const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  const dir = Math.sign(d);
  if (spinOn) { e.preventDefault(); return; }
  if ((dir > 0 && cur === N - 1) || (dir < 0 && cur === 0)) { acc = 0; return; } // na konci pustí stránku dál
  e.preventDefault();
  // jeden rok na gesto: gesto = série eventů bez 250ms ticha; krok jen jednou na gesto, setrvačnost touchpadu se zahodí
  const now = performance.now();
  if (now - ctrLock > 250) { acc = 0; ctrDone = false; } // nové gesto
  ctrLock = now;
  if (ctrDone) return;
  acc += e.deltaMode === 1 ? d * 40 : d;
  if (Math.abs(acc) >= 40) { step(Math.sign(acc)); ctrDone = true; }
}, {passive:false});
ctr.addEventListener('touchstart', e => { if (mob.matches) return; ty = e.touches[0].clientY; acc = 0; ctrDone = false; }, {passive:true});
ctr.addEventListener('touchmove', e => {
  if (ty === null) return; e.preventDefault();
  const y = e.touches[0].clientY; acc += ty - y; ty = y;
  if (!ctrDone && Math.abs(acc) >= 40) { ctrDone = true; if (step(Math.sign(acc))) ctrMoved = true; } // jeden rok na tah
}, {passive:false});
ctr.addEventListener('touchend', () => { ty = null; });
drum.addEventListener('scroll', () => { // prst točí bubnem → rok se mění průběžně
  if (drumSync) return; const i = Math.max(0, Math.min(N - 1, Math.round(drum.scrollTop / dli[0].offsetHeight))); if (i !== cur) show(i, true);
}, {passive:true});
dli.forEach((li, k) => li.onclick = () => show(k));
mob.addEventListener('change', () => { drum.scrollTop = cur * dli[0].offsetHeight; });
ctr.addEventListener('keydown', e => {
  const d = {ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1}[e.key];
  if (d) { e.preventDefault(); step(d); }
});
ticks.forEach((t, k) => { t.setAttribute('role','button'); t.tabIndex=0; t.setAttribute('aria-label', 'Reference ' + R[k].y); t.onclick = () => show(k); t.onkeydown = e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();show(k);} }; });
/* příjezd do sekce: roky jdou samy 2026 → nejstarší, každý rok 3 s (1. s fotka před, 2.–3. s po), bez zrychlování */
let spinOn = false; let ctrMoved = false;
const rk = $('#roky');
function stopSpin(e) {
  if (!spinOn || (e && e.type === 'wheel' && performance.now() - spin.at < 1300)) return; // doznívající kolečko z příjezdu točení nezastaví
  spinOn = false; clearTimeout(spin.t); odo.classList.remove('fast'); rk.classList.remove('spin');
  clearTimeout(drumTo.t); drumTo.t = setTimeout(() => drumSync = false, 150);
}
function spin() {
  if (RM || spinOn) return; if (cur !== 0) show(0);
  spinOn = true; spin.at = performance.now(); rk.classList.add('spin'); odo.style.setProperty('--td', '.6s'); rk.style.setProperty('--td', '.6s');
  const seq = [...R.keys()].slice(1), D = 3000; let k = 0;
  const tick = () => {
    if (!spinOn) return; const i = seq[k++];
    show(i);
    if (k >= seq.length) { stopSpin(); return; }
    spin.t = setTimeout(tick, D);
  };
  spin.t = setTimeout(tick, D);
}
['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(ev => $('#roky').addEventListener(ev, stopSpin, {capture:true, passive:true}));
let rokyIn = false;
new IntersectionObserver(es => es.forEach(e => {
  const now = e.intersectionRatio > .6;
  if (now && !rokyIn) stopSpin(); if (!now) stopSpin(); rokyIn = now;
}), {threshold:[0, .6, .61]}).observe($('#roky'));
if (matchMedia('(hover:none)').matches) $('#rhint').textContent = mob.matches ? 'točte palcem · fotku táhněte do strany' : 'táhněte prstem po letopočtu';
show(0);


document.querySelector('#year-prev').onclick=()=>step(-1);
document.querySelector('#year-next').onclick=()=>step(1);
