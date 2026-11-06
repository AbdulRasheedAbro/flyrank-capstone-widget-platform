(function () {
  var API = 'http://localhost:3000';
  var current = document.currentScript;
  var id = current ? new URL(current.src).searchParams.get('id') : null;
  if (!id) return;
  fetch(API + '/public/widgets/' + id + '/config')
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      var box = document.createElement('div');
      box.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#fff;border:1px solid #ccc;border-radius:8px;padding:16px;z-index:99999;font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:280px;';
      var html = '<h3 style="margin:0 0 8px;">' + cfg.title + '</h3>';
      if (cfg.description) html += '<p style="margin:0 0 8px;font-size:12px;color:#555;">' + cfg.description + '</p>';
      (cfg.fields || []).forEach(function (f) {
        html += '<input name="' + f.name + '" placeholder="' + (f.label || f.name) + '" style="display:block;width:100%;box-sizing:border-box;margin:6px 0;padding:6px;border:1px solid #ccc;border-radius:4px;"/>';
      });
      html += '<input name="_hp" style="display:none" tabindex="-1" autocomplete="off"/>';
      html += '<button style="margin-top:8px;padding:8px 12px;background:#2563eb;color:#fff;border:0;border-radius:4px;cursor:pointer;">' + cfg.button_text + '</button>';
      box.innerHTML = '<form>' + html + '</form>';
      document.body.appendChild(box);
      box.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var data = {};
        new FormData(e.target).forEach(function (v, k) { data[k] = v; });
        var hp = data._hp; delete data._hp;
        fetch(API + '/public/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ widgetId: id, data: data, _hp: hp })
        }).then(function (r) { return r.json(); }).then(function () { box.innerHTML = '<p>Thanks!</p>'; })
          .catch(function () { box.innerHTML = '<p style="color:red;">Try again later.</p>'; });
      });
    }).catch(function (err) { console.error('widget load failed', err); });
})();