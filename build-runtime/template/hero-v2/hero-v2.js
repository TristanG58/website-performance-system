/* HERO V2 — Scroll-Scrub-Logik (Kairos-Prinzip). Vanilla JS, keine Dependencies.
   Guard-Pattern wie main.js: no-op, wenn kein .hv2-stage auf der Seite ist.
   Timings fix: Bild raus 0.55–0.74 · Copy raus 0–0.28 · Wortmarke rein 0.28–0.48,
   raus 0.93–1 · Lerp 0.14. Messung im rAF-Loop (robuster als Scroll-Events). */
(function(){
  var stage=document.querySelector('.hv2-stage'); if(!stage) return;
  if(!document.documentElement.classList.contains('anim-on')) return; // reduced motion
  var img=stage.querySelector('.hv2-img'),
      copy=stage.querySelector('.hv2-copy'),
      word=stage.querySelector('.hv2-wordmark');
  if(!img||!copy||!word) return;

  function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
  function map(v,a,b,c,d){return c+((v-a)/(b-a))*(d-c);}

  var target=0,cur=0;

  function measure(){
    var scrollable=stage.offsetHeight-window.innerHeight;
    if(scrollable<=0){target=0;return;}
    target=clamp(-stage.getBoundingClientRect().top/scrollable,0,1);
  }

  function frame(){
    measure();
    cur+=(target-cur)*0.14;
    var p=cur;

    img.style.transform='translateY('+(-p*10)+'%) scale('+(1+p*1.5)+') rotate('+(p*4)+'deg)';
    img.style.opacity=String(clamp(map(p,0.55,0.74,1,0),0,1));

    copy.style.opacity=String(clamp(map(p,0,0.28,1,0),0,1));
    copy.style.transform='translateY('+(-p*40)+'px)';

    var wIn=clamp(map(p,0.28,0.48,0,1),0,1);
    var wOut=clamp(map(p,0.93,1,1,0),0,1);
    word.style.opacity=String(wIn*wOut);
    word.style.transform='translateY(-50%) scale('+(0.9+p*0.35)+')';

    requestAnimationFrame(frame);
  }

  measure(); cur=target; // bei Deep-Link mitten auf der Seite nicht hochanimieren
  requestAnimationFrame(frame);
})();
