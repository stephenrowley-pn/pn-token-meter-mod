/* PUBLIC:NECTAR token meter card. Hosted once, so each reply only sends its numbers.
   Usage: <div id="pn-tm" data-d='{...}'></div><script src=".../card.js"></script> */
(function () {
  var el = document.getElementById('pn-tm')
  if (!el) return
  var d = {}
  try { d = JSON.parse(el.getAttribute('data-d') || '{}') } catch (e) {}
  var base = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '')
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var fmt = function (n) { return n == null ? '–' : n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'k' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(Math.round(n)) }
  var money = function (n) { return n > 0 && n < 0.01 ? '<$0.01' : '$' + (+n).toFixed(2) }
  var tone = function (p) { return p >= 90 ? 'danger' : p >= 70 ? 'warning' : 'success' }
  var mood = d.m || 'idle'
  var css = [
    '.tm{--surface-2:#141414;--surface-1:#232321;--border:rgba(204,255,0,.22);--text-primary:#f4f4ef;--text-secondary:#bdbdb6;--text-muted:#8c8c85;--text-accent:#ccff00;--text-success:#ccff00;--fill-success:#ccff00;--fill-warning:#ffb547;--fill-danger:#ff5c5c;color-scheme:dark}',
    '.tm{border:1px solid var(--border);border-radius:14px;padding:14px 16px;background:var(--surface-2);font-size:13px;color:var(--text-secondary)}',
    '.tm-brand{font-weight:500;letter-spacing:.06em;color:#f4f4ef}.tm-brand i{font-style:normal;color:#ccff00}.tm-sub{font-weight:400;color:var(--text-muted);margin-left:2px}',
    '.tm-h{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:var(--text-primary);font-weight:500}',
    '.tm-d{width:8px;height:8px;border-radius:50%;background:var(--fill-success);animation:tmp 1.8s ease-in-out infinite}',
    '.tm-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-bottom:12px}',
    '.tm-s{background:var(--surface-1);border-radius:var(--radius,8px);padding:10px 12px;animation:tmu .5s var(--ease-out,ease-out) both}',
    '.tm-l{font-size:12px;color:var(--text-muted)}.tm-v{font-size:20px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums}',
    '.tm-m{margin-top:8px}.tm-r{display:flex;justify-content:space-between;margin-bottom:4px}.tm-p{color:var(--text-primary);font-variant-numeric:tabular-nums}.tm-p em{font-style:normal;color:var(--text-muted);margin-left:4px}',
    '.tm-t{height:6px;border-radius:3px;background:var(--surface-1);overflow:hidden}.tm-f{height:100%;width:var(--w);border-radius:3px;transform-origin:left;animation:tmg .9s cubic-bezier(.2,.8,.2,1) both}',
    '.tm-sec{margin-top:12px;padding-top:10px;border-top:0.5px solid var(--border)}.tm-ic{font-size:14px;vertical-align:-2px;margin-right:4px}',
    '@keyframes tmg{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes tmu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes tmp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}',
    '.tm-b{display:grid;grid-template-rows:1fr;transition:grid-template-rows .35s cubic-bezier(.2,.8,.2,1),opacity .25s}.tm-b>div{overflow:hidden;min-height:0}',
    '.tm.min .tm-b{grid-template-rows:0fr;opacity:0}.tm.min .tm-h{margin-bottom:0}',
    '.tm-x{margin-left:8px;width:28px;height:28px;padding:0;display:inline-flex;align-items:center;justify-content:center}.tm-x i{transition:transform .3s}.tm.min .tm-x i{transform:rotate(180deg)}',
    '.tm-q{font-weight:400;color:var(--text-muted);max-width:0;overflow:hidden;white-space:nowrap;opacity:0;transition:max-width .35s,opacity .25s}.tm.min .tm-q{max-width:320px;opacity:1}',
    '.tm-pet{display:flex;align-items:flex-end;gap:10px;margin:2px 0 12px}.tm-volt{flex:none;width:56px;height:61px;transform-origin:50% 100%}',
    '.tm-spr{width:56px;height:61px;background-size:224px 61px;animation:vf .6s steps(4) infinite}.tm-busy .tm-spr{animation-duration:.5s}.tm-thinking .tm-spr,.tm-idle .tm-spr{animation-duration:1s}.tm-worried .tm-spr{animation:vf 1.2s steps(4) infinite alternate}',
    '@keyframes vf{from{background-position:0 0}to{background-position:-224px 0}}.tm-say b{font-weight:700;color:#141414;margin-right:4px}',
    '.tm-say{position:relative;background:#ccff00;border-radius:14px 14px 14px 4px;padding:9px 13px;color:#141414;line-height:1.45;margin-bottom:14px;animation:tmu .4s .3s both}.tm-say:before{content:"";position:absolute;left:-7px;bottom:8px;border:7px solid transparent;border-right-color:#ccff00;border-left:0}',
    '.tm-idle,.tm-tip{animation:vb 2.4s ease-in-out infinite}.tm-hello{animation:vw 1.2s ease-in-out infinite}.tm-busy{animation:vrun .25s ease-in-out infinite alternate}',
    '.tm-celebrate{animation:vj .9s cubic-bezier(.3,.6,.4,1) infinite}.tm-worried{animation:vs 2.8s ease-in-out infinite}.tm-thinking{animation:vt 3s ease-in-out infinite}.tm-sneaky{animation:vk 2.2s ease-in-out infinite}',
    '@keyframes vb{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes vw{0%,100%{transform:rotate(0)}30%{transform:rotate(-6deg)}60%{transform:rotate(4deg)}}',
    '@keyframes vrun{from{transform:translateY(0)}to{transform:translateY(-2px)}}@keyframes vj{0%,100%{transform:translateY(0) scale(1,1)}15%{transform:scale(1.08,.92)}45%{transform:translateY(-14px) scale(.96,1.04)}75%{transform:translateY(0) scale(1.05,.95)}}',
    '@keyframes vs{0%,100%{transform:rotate(0)}20%{transform:rotate(-3deg)}40%{transform:rotate(3deg)}60%{transform:rotate(-2deg)}}@keyframes vt{0%,100%{transform:rotate(0)}50%{transform:rotate(2deg) translateY(-1px)}}@keyframes vk{0%,100%{transform:translateX(0)}40%{transform:translateX(-4px)}70%{transform:translateX(3px)}}',
    '@media (prefers-reduced-motion:reduce){.tm *{animation:none!important;transition:none!important}}',
  ].join('')
  var stat = function (label, n, shown, i) {
    return '<div class="tm-s" style="animation-delay:' + i * 70 + 'ms"><div class="tm-l">' + label + '</div><div class="tm-v" data-n="' + n + '" data-f="' + esc(shown) + '">' + esc(shown) + '</div></div>'
  }
  var meter = function (label, pct, sub, i) {
    return '<div class="tm-m"><div class="tm-r"><span>' + esc(label) + '</span><span class="tm-p">' + pct + '%' + (sub ? ' <em>' + esc(sub) + '</em>' : '') + '</span></div>' +
      '<div class="tm-t"><div class="tm-f" style="--w:' + Math.min(100, pct) + '%;background:var(--fill-' + tone(pct) + ');animation-delay:' + (200 + i * 120) + 'ms"></div></div></div>'
  }
  var cell = function (label, v, shown, on) {
    return '<div><div class="tm-l">' + label + '</div><div class="tm-v" style="font-size:16px' + (on ? ';color:var(--text-success)' : '') + '" data-n="' + Math.round(v * 100) + '" data-f="' + esc(shown) + '">' + esc(shown) + '</div></div>'
  }
  var net = (d.sv || 0) - (d.mc || 0)
  var sprite = el.getAttribute('data-sp') || base + 'cardstrip-' + esc(mood) + '.webp'
  var h = '<style>' + css + '</style><div class="tm">' +
    '<div class="tm-h"><span class="tm-d" aria-hidden="true"></span><span class="tm-brand">PUBLIC<i>:</i>NECTAR</span><span class="tm-sub">Token meter</span>' +
    '<span class="tm-q">· context ' + (d.c || 0) + '% · ' + fmt(d.st) + (d.usd != null ? ' · ' + money(d.usd) : '') + '</span>' +
    '<span style="margin-left:auto;font-weight:400;color:var(--text-muted)">' + (d.n || 0) + ' replies</span>' +
    '<button class="tm-x" type="button" aria-label="Minimise token meter" aria-expanded="true"><i class="ti ti-chevron-up" aria-hidden="true" style="font-size:16px"></i></button></div>' +
    '<div class="tm-b"><div>' +
    (d.say ? '<div class="tm-pet"><div class="tm-volt tm-' + esc(mood) + '" role="img" aria-label="Volt the ninja, ' + esc(mood) + '"><div class="tm-spr" style="background-image:url(' + sprite + ')"></div></div><div class="tm-say"><b>Volt</b> ' + esc(d.say) + '</div></div>' : '') +
    '<div class="tm-g">' + stat('Last reply in', d.li || 0, fmt(d.li || 0), 0) + stat('Last reply out', d.lo || 0, fmt(d.lo || 0), 1) + stat('Session total', d.st || 0, fmt(d.st || 0), 2) +
    (d.usd != null ? stat('Session cost', Math.round(d.usd * 100), money(d.usd), 3) : stat('Replies', d.n || 0, String(d.n || 0), 3)) + '</div>' +
    meter('Context', d.c || 0, fmt(d.ct) + ' of ' + fmt(d.cw), 0) +
    (d.lim || []).map(function (x, i) { return meter(x[0] + ' limit', x[1], x[2], i + 1) }).join('') +
    (d.cn ? '<div class="tm-r tm-sec"><span><i class="ti ti-plug tm-ic" aria-hidden="true"></i>Connectors</span><span class="tm-p">' + esc(d.cn) + '</span></div>' : '') +
    '<div class="tm-sec"><div class="tm-r"><span><i class="ti ti-scale tm-ic" aria-hidden="true"></i>Is the meter paying for itself?</span><span style="color:var(--text-muted)">estimates at list price</span></div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:6px">' +
    cell('Meter cost', d.mc || 0, money(d.mc || 0)) + cell('Saved', d.sv || 0, money(d.sv || 0), (d.sv || 0) > 0) + cell('Net', Math.abs(net), (net < 0 ? '-' : '+') + money(Math.abs(net)), net >= 0) + '</div>' +
    '<div style="margin-top:6px;color:var(--text-muted)">' + (d.top ? 'Biggest saving: ' + esc(d.top) : 'Savings show up once you act on one of Volt\'s tips.') + '</div></div>' +
    '</div></div></div>'
  el.innerHTML = h
  var c = el.querySelector('.tm'), b = el.querySelector('.tm-x'), K = 'token-meter-min'
  var set = function (m, save) { c.classList.toggle('min', m); b.setAttribute('aria-expanded', String(!m)); b.setAttribute('aria-label', (m ? 'Expand' : 'Minimise') + ' token meter'); if (save) { try { localStorage.setItem(K, m ? '1' : '0') } catch (e) {} } }
  try { if (localStorage.getItem(K) === '1') set(true, false) } catch (e) {}
  b.addEventListener('click', function () { set(!c.classList.contains('min'), true) })
  // Figures count up as the card appears.
  el.querySelectorAll('.tm-v').forEach(function (v) {
    var n = +v.getAttribute('data-n'), f = v.getAttribute('data-f'), t0 = performance.now()
    var sign = f.charAt(0) == '-' || f.charAt(0) == '+' ? f.charAt(0) : ''
    var k = f.charAt(sign ? 1 : 0) == '$' ? '$' : f.slice(-1) == '%' ? '%' : ''
    if (!n) return
    ;(function step(t) {
      var p = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - p, 3), x = n * e
      v.textContent = p < 1 ? (k == '$' ? sign + '$' + (x / 100).toFixed(2) : k == '%' ? Math.round(x) + '%' : fmt(x)) : f
      if (p < 1) requestAnimationFrame(step)
    })(t0)
  })
})()
