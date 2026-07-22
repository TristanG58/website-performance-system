// ---------- Mobile-Navigation ----------
// Ab 980px blendet styles.css .hnav und .hcta aus und zeigt .hburger.
// Dieser Handler macht den Burger bedienbar (Panel, CTA-Klon, Tastatur, Escape).
// Backport aus dem Krause-Build 2026-07 — vorher war die Nav auf dem Handy tot.
(function(){
  var burger=document.querySelector('.hburger'), nav=document.querySelector('.hnav');
  if(!burger||!nav) return;
  var cta=document.querySelector('.hcta');
  var header=document.querySelector('.site-header');
  burger.setAttribute('role','button');
  burger.setAttribute('tabindex','0');
  burger.setAttribute('aria-expanded','false');
  burger.setAttribute('aria-controls','hnav');
  nav.id='hnav';

  // Die echte Headerhöhe messen, statt sie zu raten: das Logo macht die Leiste
  // höher als die 72px, mit denen das Panel sonst über dem Logo läge.
  function measure(){
    if(header) document.documentElement.style.setProperty('--hh', header.getBoundingClientRect().height+'px');
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  // Den CTA als Kopie ans Ende der Liste hängen, statt ihn per Pixelrechnung
  // frei zu platzieren. So folgt er immer der Menülänge.
  if(cta && !nav.querySelector('.hnav-cta')){
    var clone=cta.cloneNode(true);
    clone.className='hnav-cta';
    nav.appendChild(clone);
  }

  function toggle(force){
    var open = force !== undefined ? force : !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', function(){ toggle(); });
  burger.addEventListener('keydown', function(e){
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }
  });
  // Nach einem Klick auf einen Menüpunkt schließen, sonst bleibt das Panel beim
  // Sprung zu einem Anker offen stehen.
  nav.addEventListener('click', function(e){ if(e.target.tagName==='A') toggle(false); });
  if(cta) cta.addEventListener('click', function(){ toggle(false); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') toggle(false); });
  window.addEventListener('resize', function(){ if(window.innerWidth>980) toggle(false); });
})();

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

// ---------- Team-Karussell (3D) ----------
// Mausrad dreht die Karten und blockt das Seiten-Scrollen, bis eine volle
// Umdrehung erreicht ist (Signatur-Mechanik, unverändert).
// Backport aus dem Krause-Build 2026-07: Touch-Bedienung. Ohne sie war das
// Karussell auf dem Handy nur eine Endlosschleife ohne jeden Eingriff — kein
// Wischen, kein Anhalten, und die Detailtexte (nur :hover) blieben unerreichbar.
(function(){
  var cg=document.getElementById('cg'), stage=document.getElementById('cgStage');
  if(!cg||!stage) return;
  var cards=[].slice.call(stage.querySelectorAll('.cg-card'));
  var N=cards.length; if(!N) return;
  var ang=360/N;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Radius an die Kartenzahl koppeln: bei vier Karten stünde der feste
  // 420px-Ring so weit auseinander, dass der Kreis auseinanderfällt.
  function radius(){
    var w=window.innerWidth<=680?184:216;
    var need=(w*1.45)/(2*Math.tan(Math.PI/N));      // Karten dicht an dicht
    return Math.max(window.innerWidth<=680?230:300, Math.min(need, 460));
  }
  function layout(){ var r=radius(); cards.forEach(function(c,i){ c.style.transform='rotateY('+(i*ang)+'deg) translateZ('+r+'px)'; }); }
  layout();
  window.addEventListener('resize', layout);

  var rot=0, autoSpeed=0.05, paused=false, vel=0;
  var spun=0, released=false, LIMIT=360;

  cg.addEventListener('wheel', function(e){
    if(released) return;
    e.preventDefault();
    var d=e.deltaY*0.20;
    rot+=d; spun+=Math.abs(d);
    if(spun>=LIMIT){
      released=true;
      var down=e.deltaY>0;
      var target=down?document.querySelector('.faq'):document.querySelector('.vorteile');
      if(target) target.scrollIntoView({behavior:'smooth', block: down?'start':'end'});
    }
  }, {passive:false});

  // --- Zeigerbedienung: Maus UND Finger über dieselben Pointer-Events ---
  var down=false, lastX=0, startX=0, startY=0, moved=0, horizontal=null, pid=null;

  cg.addEventListener('pointerdown', function(e){
    down=true; paused=true; vel=0; moved=0; horizontal=null; pid=e.pointerId;
    lastX=startX=e.clientX; startY=e.clientY;
  });

  cg.addEventListener('pointermove', function(e){
    if(!down||e.pointerId!==pid) return;
    var dx=e.clientX-lastX, dy=e.clientY-startY;
    moved+=Math.abs(dx);

    // Erste nennenswerte Bewegung entscheidet: quer = drehen, hoch/runter =
    // Seite scrollen lassen. Sonst klebt die Seite beim Vorbeiwischen fest.
    if(horizontal===null && (Math.abs(e.clientX-startX)>6 || Math.abs(dy)>6))
      horizontal = Math.abs(e.clientX-startX) > Math.abs(dy);

    if(horizontal){
      if(e.cancelable) e.preventDefault();
      var d=dx*0.45;
      rot+=d; vel=d;
      lastX=e.clientX;
    }
  }, {passive:false});

  function endDrag(e){
    if(!down||(e&&e.pointerId!==pid)) return;
    down=false; pid=null;

    // Kurzer Tipp ohne Wischen = Karte auswählen. Auf dem Handy gibt es kein
    // :hover, ohne das hier bliebe der Detailtext unsichtbar.
    if(moved<8 && e){
      var card=e.target.closest? e.target.closest('.cg-card') : null;
      if(card){
        var was=card.classList.contains('is-active');
        cards.forEach(function(c){ c.classList.remove('is-active'); });
        if(!was) card.classList.add('is-active');
        paused=!was;          // ausgewählte Karte hält den Ring an
        return;
      }
      cards.forEach(function(c){ c.classList.remove('is-active'); });
    }
    // Nach dem Wischen weiterlaufen lassen; hält eine Karte offen, bleibt es stehen.
    paused = !!stage.querySelector('.cg-card.is-active');
  }
  cg.addEventListener('pointerup', endDrag);
  cg.addEventListener('pointercancel', endDrag);
  cg.addEventListener('pointerleave', function(e){ if(down) endDrag(e); });

  // Der Ring lief ab der ersten Millisekunde — obwohl er weit unterhalb des
  // Sichtfensters liegt. Er schrieb also während des Seitenaufbaus in jedem
  // Frame Transform/Opacity/z-Index auf jede Karte, parallel zu Erstlayout,
  // Schriftauswertung und GSAP-Init. Genau das war das Ruckeln zu Beginn.
  // Er dreht sich jetzt nur, wenn er wirklich zu sehen ist.
  var sichtbar=false, laeuft=false;
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      sichtbar=es[0].isIntersecting;
      if(sichtbar) start();
    }, {rootMargin:'200px 0px'}).observe(cg);
  } else { sichtbar=true; }

  function start(){ if(!laeuft){ laeuft=true; requestAnimationFrame(frame); } }

  function frame(){
    if(!sichtbar && !down){ laeuft=false; return; }   // außerhalb des Bildes: nichts tun
    if(!down){
      if(Math.abs(vel)>0.02){ rot+=vel; vel*=0.94; }        // Schwung ausrollen
      else if(!paused && !reduce){ rot+=autoSpeed; }
    }
    stage.style.transform='rotateY('+rot+'deg)';
    var t=((rot%360)+360)%360;
    cards.forEach(function(c,i){
      var rel=((i*ang)+t)%360; if(rel<0)rel+=360;
      var norm=rel>180?360-rel:rel;                 // 0 = vorn, 180 = hinten
      c.style.opacity=Math.max(0.22,1-(norm/180)).toFixed(3);
      c.style.pointerEvents = norm<70 ? 'auto' : 'none';
      c.style.zIndex = String(Math.round(1000-norm));
    });
    requestAnimationFrame(frame);
  }
  if(!('IntersectionObserver' in window)) start();

  // Maus-Hover pausiert weiterhin (Desktop-Verhalten des Templates).
  cg.addEventListener('mouseenter', function(){ paused=true; spun=0; released=false; });
  cg.addEventListener('mouseleave', function(){
    if(!stage.querySelector('.cg-card.is-active')) paused=false;
  });
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

// chat-assistent -> n8n-Webhook (chat.endpoint aus config/site.js).
// KERNREGEL: Bot-Antworten werden mit textContent gesetzt, NIE mit innerHTML.
// Der Text kommt aus einem Sprachmodell, das seinerseits Besuchereingaben
// gesehen hat — als HTML eingesetzt liefe fremder Code im Browser des Kunden.
// build.mjs prueft das; siehe dort den Chat-Block.
(function(){
  var cfgEl=document.getElementById('wps-chat-config'); if(!cfgEl) return;
  var CFG={}; try{ CFG=JSON.parse(cfgEl.textContent); }catch(e){ return; }
  if(!CFG.enabled || !CFG.endpoint || !CFG.clientId) return;
  var T=CFG.texts||{};

  var verlauf=[], busy=false, offen=false;

  function el(tag,cls,txt){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(txt!=null) n.textContent=txt;      // nie innerHTML
    return n;
  }

  var launcher=el('button','chat-launcher',T.launcher||'Fragen?');
  launcher.type='button';
  launcher.setAttribute('aria-expanded','false');

  var panel=el('div','chat-panel');
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label',T.title||'Chat');
  panel.hidden=true;

  var head=el('div','chat-head');
  head.appendChild(el('strong',null,T.title||'Ihre Frage an uns'));
  var closeBtn=el('button','chat-close','×');
  closeBtn.type='button';
  closeBtn.setAttribute('aria-label',T.close||'Schliessen');
  head.appendChild(closeBtn);

  var log=el('div','chat-log');
  log.setAttribute('aria-live','polite');
  if(T.intro) log.appendChild(bubble('bot',T.intro));

  var form=el('form','chat-form');
  var input=el('input','chat-input');
  input.type='text';
  input.maxLength=500;                    // gleiche Grenze wie im Workflow
  input.placeholder=T.placeholder||'Ihre Frage…';
  input.setAttribute('aria-label',T.placeholder||'Ihre Frage');
  var send=el('button','chat-send',T.send||'Senden');
  send.type='submit';
  form.appendChild(input); form.appendChild(send);

  var hint=el('p','chat-privacy');
  hint.appendChild(document.createTextNode((T.privacy||'')+' '));
  if(CFG.privacyHref){
    var a=el('a',null,'Datenschutz');
    a.href=CFG.privacyHref;
    hint.appendChild(a);
  }

  panel.appendChild(head); panel.appendChild(log);
  panel.appendChild(form); panel.appendChild(hint);
  document.body.appendChild(launcher); document.body.appendChild(panel);

  function bubble(wer,txt){
    var b=el('div','chat-msg chat-'+wer);
    b.appendChild(el('span',null,txt));   // textContent via el()
    return b;
  }
  function sag(wer,txt){
    var b=bubble(wer,txt);
    log.appendChild(b);
    log.scrollTop=log.scrollHeight;
    return b;
  }
  function auf(zu){
    offen=!zu;
    panel.hidden=zu;
    launcher.setAttribute('aria-expanded', String(offen));
    if(offen) input.focus();
  }

  launcher.addEventListener('click',function(){ auf(offen); });
  closeBtn.addEventListener('click',function(){ auf(true); launcher.focus(); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && offen){ auf(true); launcher.focus(); }
  });

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(busy) return;
    var frage=input.value.trim();
    if(!frage) return;

    sag('user',frage);
    input.value='';
    busy=true; send.disabled=true;
    var warte=sag('bot',T.sending||'Einen Moment…');

    fetch(CFG.endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ clientId:CFG.clientId, frage:frage, verlauf:verlauf })
    })
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(function(d){
      var antwort=(d && typeof d.antwort==='string' && d.antwort) ? d.antwort : (T.error||'');
      warte.firstChild.textContent=antwort;   // textContent, nie innerHTML
      verlauf.push({rolle:'user',text:frage});
      verlauf.push({rolle:'bot',text:antwort});
      if(verlauf.length>12) verlauf=verlauf.slice(-12);
    })
    .catch(function(){
      // ehrlich scheitern statt eine Antwort zu erfinden
      warte.firstChild.textContent=T.error||'Bitte nutzen Sie das Kontaktformular.';
    })
    .then(function(){
      busy=false; send.disabled=false;
      log.scrollTop=log.scrollHeight;
      input.focus();
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
