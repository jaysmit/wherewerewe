(function () {
  'use strict';
  var D = window.WWW_DATA;
  var state = { year: 2015, hidden: {}, q: 0 };

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function stayAt(p, y) { for (var i = 0; i < p.stays.length; i++) { var s = p.stays[i]; if (y >= s.from && y <= s.to) return s; } return null; }
  function xy(city) { var c = D.cities[city]; return { x: (c[1] + 180) * 4, y: (84 - c[0]) * 4, lat: c[0], lng: c[1] }; }
  function rad(d) { return d * Math.PI / 180; }
  function km(a, b) {
    var dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }
  function fmt(n) { return Math.round(n).toLocaleString('en-AU'); }
  function nameIn(p) { return p.id === 'you' ? 'you' : p.name; }

  // Pins are created once and moved, so they animate between years.
  var pinEls = {};
  D.people.forEach(function (p) {
    var el = document.createElement('div');
    el.className = 'pin';
    el.textContent = p.name.charAt(0);
    el.style.background = p.color;
    $('map').appendChild(el);
    pinEls[p.id] = el;
  });

  // Member toggles
  D.people.forEach(function (p) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'member';
    b.style.setProperty('--c', p.color);
    b.textContent = p.name.charAt(0);
    b.addEventListener('click', function () { state.hidden[p.id] = !state.hidden[p.id]; render(); });
    p._btn = b;
    $('members').appendChild(b);
  });

  function render() {
    var year = state.year;
    var shown = D.people.filter(function (p) { return !state.hidden[p.id]; });

    $('yearBig').textContent = year;
    $('yearSmall').textContent = year;
    $('year').value = year;

    D.people.forEach(function (p) {
      var on = !state.hidden[p.id];
      p._btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      p._btn.setAttribute('aria-label', (on ? 'Hide ' : 'Show ') + p.name);
    });

    // Trails
    $('trails').innerHTML = shown.map(function (p) {
      var pts = p.stays.filter(function (s) { return s.from <= year; }).map(function (s) { var q = xy(s.city); return q.x.toFixed(0) + ',' + q.y.toFixed(0); }).join(' ');
      return '<polyline class="trail" stroke="' + p.color + '" stroke-opacity="0.7" points="' + pts + '"/>';
    }).join('');

    // Pins
    var cityCount = {};
    D.people.forEach(function (p) {
      var el = pinEls[p.id];
      if (state.hidden[p.id]) { el.style.display = 'none'; return; }
      var s = stayAt(p, year), q = xy(s.city);
      var k = cityCount[s.city] || 0; cityCount[s.city] = k + 1;
      el.style.display = 'grid';
      el.style.left = (q.x / 14.4) + '%';
      el.style.top = (q.y / 5.76) + '%';
      el.style.transform = 'translate(calc(-50% + ' + (k * 22) + 'px), calc(-50% - ' + (k * 6) + 'px))';
      el.style.setProperty('--pin-ring', k > 0 ? '#FEDA75' : p.tint);
      el.title = p.name + ' — ' + s.city;
    });

    // In this year
    $('now').innerHTML = shown.map(function (p) {
      var s = stayAt(p, year);
      return '<div class="now-row" style="background:' + p.tint + '"><span class="avatar" style="background:' + p.color + '">' + esc(p.name.charAt(0)) + '</span><span class="txt"><b>' + esc(p.name) + ' · ' + esc(s.city) + '</b><span>“' + esc(s.note) + '”</span></span></div>';
    }).join('');

    // Pairs
    var pairs = [], sameCity = [];
    for (var i = 0; i < shown.length; i++) for (var j = i + 1; j < shown.length; j++) {
      var a = stayAt(shown[i], year), b = stayAt(shown[j], year);
      var d = a.city === b.city ? 0 : km(xy(a.city), xy(b.city));
      if (d === 0) sameCity.push({ a: shown[i], b: shown[j], city: a.city });
      pairs.push({ names: shown[i].name + ' & ' + shown[j].name, km: d });
    }
    $('pairs').innerHTML = pairs.map(function (p) {
      return '<div class="dist-row' + (p.km === 0 ? ' same' : '') + '"><span>' + esc(p.names) + '</span><span>' + (p.km === 0 ? 'Same city ♥' : fmt(p.km) + ' km') + '</span></div>';
    }).join('') || '<p class="hint">Show at least two people to compare.</p>';

    // Headline
    var headline;
    if (shown.length < 2) headline = 'Add someone to compare.';
    else if (sameCity.length === pairs.length) headline = 'All together in ' + sameCity[0].city + '!';
    else if (sameCity.length) headline = sameCity[0].a.name + ' and ' + sameCity[0].b.name + ' were both in ' + sameCity[0].city + '.';
    else {
      var near = pairs.slice().sort(function (p, q) { return p.km - q.km; })[0];
      headline = 'Closest: ' + near.names + ', ' + fmt(near.km) + ' km apart.';
    }
    $('headline').textContent = headline;

    // Prompts
    var qs = [];
    sameCity.forEach(function (sc) { qs.push('Both in ' + sc.city + ' in ' + year + '. Where might ' + nameIn(sc.a) + ' and ' + sc.b.name + ' have walked straight past each other?'); });
    shown.forEach(function (p) {
      var s = stayAt(p, year), me = p.id === 'you';
      if (s.from === year) qs.push((me ? 'What took you' : 'Ask ' + p.name + ': what took you') + ' to ' + s.city + ' in ' + year + '?');
      qs.push((me ? 'Tell them' : 'Ask ' + p.name) + ': what did a normal Saturday look like in ' + s.city + '?');
      qs.push((me ? 'Tell them' : 'Ask ' + p.name) + ': who was your closest friend in ' + s.city + '?');
    });
    $('prompt').textContent = qs.length ? qs[state.q % qs.length] : 'Add a friend to start asking.';

    // Crossed paths
    var crossings = [];
    for (var x = 0; x < shown.length; x++) for (var y2 = x + 1; y2 < shown.length; y2++) {
      var run = null;
      for (var yr = D.firstYear; yr <= D.lastYear + 1; yr++) {
        var sa = yr <= D.lastYear ? stayAt(shown[x], yr) : null, sb = yr <= D.lastYear ? stayAt(shown[y2], yr) : null;
        if (sa && sb && sa.city === sb.city) {
          if (run && run.city === sa.city) run.to = yr;
          else { if (run) crossings.push(run); run = { city: sa.city, from: yr, to: yr, who: shown[x].name + ' & ' + shown[y2].name }; }
        } else if (run) { crossings.push(run); run = null; }
      }
    }
    crossings.sort(function (p, q) { return p.from - q.from; });
    var box = $('crossings');
    box.innerHTML = '';
    if (!crossings.length) box.innerHTML = '<p class="hint">No shared cities yet.</p>';
    crossings.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cross' + (year >= c.from && year <= c.to ? ' on' : '');
      b.innerHTML = '<span><b>' + esc(c.city) + '</b><small>' + esc(c.who) + '</small></span><span class="yrs">' + (c.from === c.to ? c.from : c.from + '–' + c.to) + '</span>';
      b.addEventListener('click', function () { setYear(c.from); });
      box.appendChild(b);
    });
  }

  function setYear(y) {
    state.year = Math.max(D.firstYear, Math.min(D.lastYear, y));
    state.q = 0;
    render();
  }

  $('year').min = D.firstYear;
  $('year').max = D.lastYear;
  $('year').addEventListener('input', function (e) { setYear(parseInt(e.target.value, 10)); });
  $('prev').addEventListener('click', function () { setYear(state.year - 1); });
  $('next').addEventListener('click', function () { setYear(state.year + 1); });
  $('shuffle').addEventListener('click', function () { state.q++; render(); });
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') setYear(state.year - 1);
    if (e.key === 'ArrowRight') setYear(state.year + 1);
  });

  render();
})();
