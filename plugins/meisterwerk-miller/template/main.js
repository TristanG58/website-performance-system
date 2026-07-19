(function(){
  var card=document.getElementById('quizCard'); if(!card) return;
  var steps=[].slice.call(card.querySelectorAll('.qstep'));
  var total=steps.length, cur=0;
  var bar=document.getElementById('qBar'), lbl=document.getElementById('qProgLbl');
  var back=document.getElementById('qBack'), next=document.getElementById('qNext');
  var nav=document.getElementById('qNav'), done=document.getElementById('qDone');
  var prog=card.querySelector('.quiz-prog'), barWrap=card.querySelector('.quiz-bar');

  // option selection (checkbox = multi, radio = single)
  card.querySelectorAll('.qopts').forEach(function(g){
    var multi=g.getAttribute('data-type')==='multi';
    g.querySelectorAll('.opt-row').forEach(function(row){
      row.addEventListener('click',function(){
        var inp=row.querySelector('input');
        if(multi){ inp.checked=!inp.checked; }
        else{
          g.querySelectorAll('.opt-row').forEach(function(r){r.classList.remove('sel');r.querySelector('input').checked=false;});
          inp.checked=true;
        }
        row.classList.toggle('sel', inp.checked);
      });
    });
  });

  function render(){
    steps.forEach(function(s,i){ s.classList.toggle('active', i===cur); });
    bar.style.width=((cur+1)/total*100)+'%';
    lbl.textContent='Schritt '+(cur+1)+' von '+total;
    back.style.display=cur===0?'none':'grid';
    next.textContent=cur===total-1?'Jetzt beraten lassen':'Zum nächsten Schritt';
  }
  next.addEventListener('click',function(){
    if(cur<total-1){ cur++; render(); }
    else{
      steps.forEach(function(s){s.classList.remove('active');});
      nav.style.display='none'; prog.style.display='none'; barWrap.style.display='none';
      done.classList.add('show');
    }
  });
  back.addEventListener('click',function(){ if(cur>0){ cur--; render(); } });
  render();
})();

// team circular 3D gallery
(function(){
  var cg=document.getElementById('cg'), stage=document.getElementById('cgStage');
  if(!cg||!stage) return;
  var cards=[].slice.call(stage.querySelectorAll('.cg-card'));
  var N=cards.length, ang=360/N;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function radius(){ return window.innerWidth<=680 ? 300 : 420; }
  function layout(){ var r=radius(); cards.forEach(function(c,i){ c.style.transform='rotateY('+(i*ang)+'deg) translateZ('+r+'px)'; }); }
  layout();
  window.addEventListener('resize', layout);

  var rot=0, autoSpeed=0.05, over=false, spun=0, released=false;
  var TURNS=1, LIMIT=360*TURNS;         // release after 1 full rotation (360°)

  // pointer INSIDE the gallery → wheel rotates the cards & the page does NOT scroll,
  // until it has spun 2 full turns; then the lock releases and the page glides on.
  // pointer OUTSIDE → normal page scrolling (this listener simply doesn't fire).
  cg.addEventListener('wheel', function(e){
    if(released) return;                // 2 turns done → let the wheel scroll the page
    e.preventDefault();                 // block page scroll while spinning the gallery
    var d=e.deltaY * 0.20;
    rot += d;
    spun += Math.abs(d);
    if(spun >= LIMIT){                   // one full turn done → continue in the SCROLL direction
      released=true;
      var down = e.deltaY > 0;
      var target = down ? document.querySelector('.faq') : document.querySelector('.vorteile');
      if(target) target.scrollIntoView({behavior:'smooth', block: down ? 'start' : 'end'});
    }
  }, {passive:false});

  function frame(){
    if(!over && !reduce) rot+=autoSpeed;   // gentle auto-rotate only when NOT hovering
    stage.style.transform='rotateY('+rot+'deg)';
    var t=((rot%360)+360)%360;
    cards.forEach(function(c,i){
      var rel=((i*ang)+t)%360; if(rel<0)rel+=360;
      var norm=rel>180?360-rel:rel;                 // 0 = front, 180 = back
      var op=Math.max(0.22,1-(norm/180));
      c.style.opacity=op.toFixed(3);
      c.style.pointerEvents = norm<70 ? 'auto' : 'none';
      c.style.zIndex = String(Math.round(1000-norm));
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // hovering pauses auto-rotation; re-entering grants a fresh 2 turns before releasing
  cg.addEventListener('mouseenter', function(){ over=true; spun=0; released=false; });
  cg.addEventListener('mouseleave', function(){ over=false; });
})();

// kontakt form -> n8n-Webhook (forms.endpoint aus config/site.js).
// KERNREGEL: Erfolg wird NIE vor HTTP 200 gemeldet. Hier stand frueher ein
// Attrappen-Handler, der "Ihre Anfrage ist eingegangen" anzeigte und die
// Anfrage verwarf — der Betrieb hat nie erfahren, dass es sie gab.
// build.mjs prueft das; siehe dort den Formular-Block.
(function(){
  var f=document.getElementById('ktForm'); if(!f) return;
  var note=document.getElementById('ktNote');
  var cfgEl=document.getElementById('wps-form-config');
  var CFG={}; try{ CFG=JSON.parse(cfgEl.textContent); }catch(e){}
  var T=CFG.texts||{};
  var btn=f.querySelector('button[type=submit]');
  var btnLabel=btn?btn.textContent:'';
  var renderedAt=Date.now();
  var busy=false;

  function say(msg,color){
    note.style.display='block';
    note.style.color=color;
    note.textContent=msg;
  }
  function val(id){ var el=document.getElementById(id); return el?el.value.trim():''; }

  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(busy) return;

    var mail=val('ktMail');
    var consent=document.getElementById('ktConsent').checked;
    if(!mail || !consent){ say(T.validation,'#8A1F1F'); return; }
    if(!CFG.enabled || !CFG.endpoint){ say(T.error,'#8A1F1F'); return; }

    var payload={
      clientId:  CFG.clientId,                // n8n schlaegt damit den Empfaenger nach
      vorname:   val('ktVor'),
      nachname:  val('ktNach'),
      email:     mail,
      telefon:   val('ktTel'),
      thema:     val('ktThema'),
      nachricht: val('ktMsg'),
      website:   val('ktHp'),                 // Honeypot — Bots fuellen das aus
      elapsedMs: Date.now()-renderedAt        // Time-Trap
    };

    busy=true;
    if(btn){ btn.disabled=true; btn.textContent=T.sending; }
    say(T.sending,'#6B7280');

    fetch(CFG.endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    })
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); })
    .then(function(){
      say(T.success,'#1f9d6b');
      if(btn) btn.textContent=T.sent;
    })
    .catch(function(){
      busy=false;
      if(btn){ btn.disabled=false; btn.textContent=btnLabel; }
      say(T.error,'#8A1F1F');   // ehrlich scheitern statt still verlieren
    });
  });
})();

// footer blur-in reveal
(function(){
  var inner=document.getElementById('sfInner'), foot=document.querySelector('.site-footer');
  if(!inner||!foot) return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){ inner.classList.add('in'); return; }
  if(!('IntersectionObserver' in window)){ inner.classList.add('in'); return; }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ inner.classList.add('in'); io.disconnect(); } });
  },{threshold:0.12});
  io.observe(foot);
})();

// faq accordions (single-open)
(function(){
  var items=[].slice.call(document.querySelectorAll('.faq .fq'));
  items.forEach(function(it){
    it.querySelector('.fq-head').addEventListener('click',function(){
      var was=it.classList.contains('open');
      items.forEach(function(o){o.classList.remove('open');});
      if(!was) it.classList.add('open');
    });
  });
})();

// ============ GSAP scroll-reveal + stat count-up ============
(function(){
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  // fallback: if GSAP/ScrollTrigger missing or reduced motion → reveal everything, no anim
  if(reduce || typeof gsap==='undefined' || typeof ScrollTrigger==='undefined'){ root.classList.remove('anim-on'); return; }
  gsap.registerPlugin(ScrollTrigger);

  var SEL='.sec-head,.svc-card,.reason,.vt-top,.vcard,.job,.lst-row,.split>*,.statband .st,.fq,.faq-cta,.cta-band,.page-hero .ph-inner,.kt-grid';
  var els=gsap.utils.toArray(SEL);
  if(els.length){
    gsap.set(els,{opacity:0,y:26});
    ScrollTrigger.batch(els,{
      start:'top 88%',
      onEnter:function(batch){ gsap.to(batch,{opacity:1,y:0,duration:.7,ease:'power2.out',stagger:.1,overwrite:true}); }
    });
  }

  // stat count-up (e.g. "80+", "10", "4,9 / 5", "100%")
  gsap.utils.toArray('.statband .st b').forEach(function(b){
    var raw=b.textContent.trim();
    var m=raw.match(/^([\d.,]+)(.*)$/);
    if(!m) return;
    var numStr=m[1], suffix=m[2];
    var hasComma=numStr.indexOf(',')>-1;
    var target=parseFloat(numStr.replace(',','.'));
    if(isNaN(target)) return;
    var decimals=(numStr.split(/[.,]/)[1]||'').length;
    var obj={v:0};
    b.textContent='0'+(hasComma?',0':'')+suffix;
    ScrollTrigger.create({trigger:b, start:'top 90%', once:true, onEnter:function(){
      gsap.to(obj,{v:target,duration:1.4,ease:'power2.out',onUpdate:function(){
        var val=obj.v.toFixed(decimals);
        if(hasComma) val=val.replace('.',',');
        b.textContent=val+suffix;
      }});
    }});
  });

  ScrollTrigger.refresh();
})();
