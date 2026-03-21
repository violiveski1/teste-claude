/**
 * mapa.js — Carrega pontos do localStorage (via storage.js) e renderiza Leaflet.
 * RNF3: pontos carregados localmente = resposta < 3s garantida.
 * RNF4: dependências estáveis (Leaflet 1.9, OpenStreetMap).
 */

// Inicializa mapa centrado em São Borja
var map = L.map('map').setView([-28.6600, -56.0050], 14);

// RNF1: Tile layer compatível com todos os navegadores
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// Ícone customizado cross-browser
function criarIcone(tipo) {
  var cores = {
    'Ponto Permanente': { cor: '#0a3d2b', emoji: '🏛️' },
    'Coleta Especial':  { cor: '#1a4a6e', emoji: '🎪' },
    'Parceiro':         { cor: '#2980b9', emoji: '🤝' },
    'Educação':         { cor: '#1a6b47', emoji: '📚' },
    'Ponto de Entrega': { cor: '#2d9e6b', emoji: '📦' }
  };
  var c = cores[tipo] || { cor: '#2d9e6b', emoji: '♻️' };

  return L.divIcon({
    html: '<div style="' +
      'background:' + c.cor + ';' +
      'width:38px;height:38px;' +
      'border-radius:50% 50% 50% 0;' +
      '-webkit-transform:rotate(-45deg);transform:rotate(-45deg);' +
      'border:3px solid #3ddc84;' +
      'display:-webkit-box;display:-ms-flexbox;display:flex;' +
      'align-items:center;justify-content:center;' +
      '-webkit-box-shadow:0 4px 12px rgba(0,0,0,0.3);' +
      'box-shadow:0 4px 12px rgba(0,0,0,0.3);' +
    '"><span style="-webkit-transform:rotate(45deg);transform:rotate(45deg);font-size:14px;">' +
      c.emoji + '</span></div>',
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -40]
  });
}

// RF3: Exibe modal de detalhes ao clicar em "Ver detalhes" no popup
function abrirDetalhePublico(id) {
  var ponto = DB.getPontos().find(function(p){ return p.id === id; });
  if (!ponto) return;

  var tags = (ponto.aceita || []).map(function(a){
    return '<span style="display:inline-block;background:#e8f5ee;color:#1a6b47;' +
      'padding:3px 9px;border-radius:100px;font-size:.72rem;font-weight:700;margin:2px;">' +
      escHtml(a) + '</span>';
  }).join('');

  document.getElementById('det-titulo').textContent = ponto.nome;
  document.getElementById('det-body').innerHTML =
    row('🏷️ Tipo', ponto.tipo) +
    row('📍 Endereço', ponto.endereco) +
    row('🕐 Horário', ponto.horario) +
    (ponto.telefone ? row('📞 Telefone', ponto.telefone) : '') +
    row('📝 Descrição', ponto.descricao) +
    '<div style="margin-top:14px;">' +
      '<div style="font-size:.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#aaa;margin-bottom:6px;">Materiais aceitos</div>' +
      '<div>' + (tags || '<span style="color:#aaa;font-size:.83rem;">Não informado</span>') + '</div>' +
    '</div>';

  document.getElementById('modal-detalhe-pub').classList.add('open');
}

function row(label, val) {
  return '<div style="margin-bottom:12px;">' +
    '<div style="font-size:.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#aaa;margin-bottom:2px;">' + label + '</div>' +
    '<div style="font-size:.92rem;color:#2c3e30;">' + escHtml(String(val || '—')) + '</div>' +
  '</div>';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// RNF3: Renderização síncrona dos dados locais — tempo < 3s garantido
var pontos = DB.getPontos();
var marcadores = [];

pontos.forEach(function(ponto) {
  var tags = (ponto.aceita || []).map(function(a) {
    return '<span style="display:inline-block;background:#e8f5ee;color:#1a6b47;' +
      'padding:2px 7px;border-radius:100px;font-size:.7rem;font-weight:600;margin:2px;">' +
      escHtml(a) + '</span>';
  }).join('');

  var popup =
    '<div style="max-width:240px;font-family:\'DM Sans\',sans-serif;">' +
      '<div style="font-family:\'Syne\',sans-serif;font-weight:700;font-size:.97rem;color:#0a3d2b;margin-bottom:5px;">' + escHtml(ponto.nome) + '</div>' +
      '<div style="display:inline-block;background:#e8f5ee;color:#1a6b47;padding:2px 8px;border-radius:100px;font-size:.72rem;font-weight:700;margin-bottom:8px;">' + escHtml(ponto.tipo) + '</div>' +
      '<div style="font-size:.82rem;color:#5a7060;margin-bottom:3px;">📍 ' + escHtml(ponto.endereco) + '</div>' +
      '<div style="font-size:.8rem;color:#2980b9;font-weight:600;margin-bottom:8px;">🕐 ' + escHtml(ponto.horario) + '</div>' +
      '<div style="margin-bottom:8px;">' + tags + '</div>' +
      '<button onclick="abrirDetalhePublico(\'' + ponto.id + '\')" style="' +
        'width:100%;padding:8px;background:#0a3d2b;color:#3ddc84;border:none;' +
        'border-radius:7px;font-size:.82rem;font-weight:700;cursor:pointer;' +
        'font-family:\'Syne\',sans-serif;">' +
        '👁 Ver detalhes completos' +
      '</button>' +
    '</div>';

  var marker = L.marker([ponto.lat, ponto.lng], { icon: criarIcone(ponto.tipo) })
    .addTo(map)
    .bindPopup(popup, { maxWidth: 280 });

  marcadores.push({ ponto: ponto, marker: marker });
});

// Renderiza cards na lista
var lista = document.getElementById('pontos-lista');
pontos.forEach(function(ponto) {
  var card = document.createElement('div');
  card.className = 'ponto-card fade-in';
  card.innerHTML =
    '<h3>' + escHtml(ponto.nome) + '</h3>' +
    '<span class="ponto-tipo">' + escHtml(ponto.tipo) + '</span>' +
    '<p>📍 ' + escHtml(ponto.endereco) + '</p>' +
    '<p style="margin-top:6px;">' + escHtml(ponto.descricao) + '</p>' +
    '<div class="ponto-horario">🕐 ' + escHtml(ponto.horario) + '</div>' +
    '<button onclick="abrirDetalhePublico(\'' + ponto.id + '\')" style="' +
      'margin-top:14px;padding:8px 16px;background:var(--verde-escuro);color:var(--verde-vivo);' +
      'border:none;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;' +
      'font-family:\'Syne\',sans-serif;">' +
      '👁 Ver detalhes' +
    '</button>';
  lista.appendChild(card);
});

// Fade-in observer (RNF1: IntersectionObserver com fallback)
if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e, i) {
      if (e.isIntersecting) setTimeout(function(){ e.target.classList.add('visible'); }, i * 80);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(function(el){ observer.observe(el); });
} else {
  // Fallback para browsers antigos (Yandex, Safari <12)
  document.querySelectorAll('.fade-in').forEach(function(el){ el.classList.add('visible'); });
}
