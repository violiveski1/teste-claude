// Pontos de descarte em São Borja - RS
const pontos = [
  {
    id: 1,
    nome: "Secretaria Municipal de Meio Ambiente",
    tipo: "Ponto Permanente",
    lat: -28.6608,
    lng: -56.0031,
    endereco: "Rua Batista Luzardo, 500 – Centro, São Borja – RS",
    horario: "Seg a Sex: 8h às 17h",
    aceita: "Computadores, monitores, celulares, pilhas, baterias, carregadores, cabos",
    descricao: "Ponto oficial da Prefeitura Municipal. Destinação correta garantida por empresa parceira certificada.",
    icon: "🏛️"
  },
  {
    id: 2,
    nome: "Parque Esportivo General Vargas",
    tipo: "Coleta Especial",
    lat: -28.6650,
    lng: -56.0078,
    endereco: "Av. General Vargas, São Borja – RS",
    horario: "Eventos mensais – consulte o calendário",
    aceita: "Todos os eletrônicos, eletrodomésticos de pequeno porte, cabos e fios",
    descricao: "Local de realização das campanhas mensais de coleta de lixo eletrônico organizadas pela Prefeitura.",
    icon: "🏟️"
  },
  {
    id: 3,
    nome: "SENAI São Borja",
    tipo: "Ponto Parceiro",
    lat: -28.6575,
    lng: -55.9985,
    endereco: "Rua Quatorze de Agosto, 700 – São Borja – RS",
    horario: "Seg a Sex: 7h30 às 17h30",
    aceita: "Computadores, periféricos, celulares e eletrônicos em geral",
    descricao: "O SENAI parceiro do programa de reciclagem auxilia na triagem e destinação dos equipamentos recebidos.",
    icon: "🎓"
  },
  {
    id: 4,
    nome: "Hipermercado São Borja",
    tipo: "Ponto de Pilhas",
    lat: -28.6630,
    lng: -56.0095,
    endereco: "Av. Presidente Vargas, 1200 – São Borja – RS",
    horario: "Todos os dias: 7h às 22h",
    aceita: "Pilhas, baterias de celular e baterias pequenas",
    descricao: "Coletor específico para pilhas e baterias localizado na entrada do estabelecimento.",
    icon: "🏪"
  },
  {
    id: 5,
    nome: "Farmácia Popular Centro",
    tipo: "Ponto de Pilhas",
    lat: -28.6618,
    lng: -56.0042,
    endereco: "Rua Sete de Setembro, 300 – Centro, São Borja – RS",
    horario: "Seg a Sáb: 7h às 21h · Dom: 8h às 18h",
    aceita: "Pilhas e baterias de todos os tipos",
    descricao: "Farmácia participa do programa estadual de coleta de pilhas e baterias do Rio Grande do Sul.",
    icon: "💊"
  },
  {
    id: 6,
    nome: "Escola Municipal José do Patrocínio",
    tipo: "Ponto Educativo",
    lat: -28.6592,
    lng: -56.0015,
    endereco: "Rua Tiradentes, 450 – São Borja – RS",
    horario: "Dias letivos: 7h às 18h",
    aceita: "Computadores, tablets, celulares e periféricos",
    descricao: "A escola integra o programa Escola Sustentável e recebe equipamentos para uso educativo ou descarte responsável.",
    icon: "🏫"
  }
];

// Cores por tipo
const tipoColors = {
  "Ponto Permanente": "#2ecc71",
  "Coleta Especial": "#3498db",
  "Ponto Parceiro": "#9b59b6",
  "Ponto de Pilhas": "#f39c12",
  "Ponto Educativo": "#e67e22"
};

function initMap() {
  // Inicializar mapa centralizado em São Borja
  const map = L.map('map', {
    center: [-28.6615, -56.0050],
    zoom: 14,
    zoomControl: true
  });

  // Tile layer estilizado
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Adicionar marcadores
  const markers = {};

  pontos.forEach(ponto => {
    const cor = tipoColors[ponto.tipo] || '#2ecc71';

    // Ícone customizado
    const customIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:42px;height:42px;
        background:${cor};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 12px rgba(0,0,0,0.3);
        border:3px solid white;
      ">
        <span style="transform:rotate(45deg);font-size:16px;">${ponto.icon}</span>
      </div>`,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -44]
    });

    const marker = L.marker([ponto.lat, ponto.lng], { icon: customIcon }).addTo(map);

    const popupContent = `
      <div style="min-width:220px;max-width:280px;font-family:'Inter',sans-serif;">
        <div class="popup-title">${ponto.icon} ${ponto.nome}</div>
        <div class="popup-type">🏷️ ${ponto.tipo}</div>
        <div class="popup-info">
          <div class="popup-row"><span class="ic">📍</span><span>${ponto.endereco}</span></div>
          <div class="popup-row"><span class="ic">🕐</span><span>${ponto.horario}</span></div>
          <div class="popup-row"><span class="ic">♻️</span><span>${ponto.aceita}</span></div>
          <hr style="border:none;border-top:1px solid #eee;margin:8px 0;">
          <p style="font-size:0.78rem;color:#666;line-height:1.5;">${ponto.descricao}</p>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 300 });
    markers[ponto.id] = marker;

    marker.on('click', () => {
      highlightCard(ponto.id);
    });
  });

  // Renderizar cards laterais
  const lista = document.getElementById('pontosList');
  if (lista) {
    pontos.forEach(ponto => {
      const cor = tipoColors[ponto.tipo] || '#2ecc71';
      const card = document.createElement('div');
      card.className = 'ponto-card';
      card.id = `card-${ponto.id}`;
      card.innerHTML = `
        <div class="ponto-card-header">
          <span class="ponto-card-icon">${ponto.icon}</span>
          <h3>${ponto.nome}</h3>
        </div>
        <p>📍 ${ponto.endereco}</p>
        <p>🕐 ${ponto.horario}</p>
        <span class="ponto-tag" style="background:${cor}20;color:${cor};">${ponto.tipo}</span>
      `;
      card.addEventListener('click', () => {
        map.flyTo([ponto.lat, ponto.lng], 16, { duration: 1 });
        markers[ponto.id].openPopup();
        highlightCard(ponto.id);
      });
      lista.appendChild(card);
    });
  }

  function highlightCard(id) {
    document.querySelectorAll('.ponto-card').forEach(c => c.classList.remove('active'));
    const el = document.getElementById(`card-${id}`);
    if (el) {
      el.classList.add('active');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Legenda
  const legenda = L.control({ position: 'bottomleft' });
  legenda.onAdd = () => {
    const div = L.DomUtil.create('div');
    div.style.cssText = 'background:white;padding:12px 16px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.12);font-family:Inter,sans-serif;font-size:12px;';
    div.innerHTML = '<b style="display:block;margin-bottom:8px;font-size:13px;">🗺️ Tipos de Ponto</b>';
    Object.entries(tipoColors).forEach(([tipo, cor]) => {
      div.innerHTML += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <div style="width:10px;height:10px;border-radius:50%;background:${cor};flex-shrink:0;"></div>
        <span>${tipo}</span>
      </div>`;
    });
    return div;
  };
  legenda.addTo(map);
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initMap);
