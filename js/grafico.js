/**
 * graficos.js
 * Requer Chart.js 4 (carregado via CDN na página).
 * Sem arrow functions em callbacks críticos para compatibilidade (RNF1).
 */

// ── Paleta alinhada ao CSS ──────────────────────────────
var VERDE_ESCURO  = '#0a3d2b';
var VERDE_MEDIO   = '#1a6b47';
var VERDE         = '#1e8f5e';
var VERDE_VIVO    = '#3ddc84';
var AZUL          = '#1a6fa8';
var AZUL_CEU      = '#5bc8f5';
var LARANJA       = '#c45e1a';
var AMARELO       = '#d4900a';
var CINZA_TEXTO   = '#3d5c48';

// Defaults globais
Chart.defaults.font.family  = "'DM Sans', sans-serif";
Chart.defaults.font.size    = 12;
Chart.defaults.color        = CINZA_TEXTO;
Chart.defaults.plugins.legend.labels.boxWidth = 14;
Chart.defaults.plugins.legend.labels.padding  = 16;

// Opções de escala reutilizáveis
function escalaBase() {
  return {
    grid:  { color: 'rgba(0,0,0,0.06)', drawBorder: false },
    ticks: { color: CINZA_TEXTO }
  };
}
function semGrade() {
  return { grid: { display: false }, ticks: { color: CINZA_TEXTO } };
}

// ── 1. DONUT — Composição ──────────────────────────────
new Chart(document.getElementById('graficoPizza'), {
  type: 'doughnut',
  data: {
    labels: [
      'Eletrodomésticos', 'Equipamentos TI',
      'Telas (TVs/Monitores)', 'Telecomunicações',
      'Pequenos Equipamentos', 'Outros'
    ],
    datasets: [{
      data: [35, 25, 18, 12, 7, 3],
      backgroundColor: [VERDE, AZUL, VERDE_VIVO, AZUL_CEU, AMARELO, '#b0c8ba'],
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '60%',
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: function(ctx) { return '  ' + ctx.label + ': ' + ctx.parsed + '%'; }
        }
      }
    }
  }
});

// ── 2. BARRAS — Crescimento Brasil ─────────────────────
new Chart(document.getElementById('graficoBarras'), {
  type: 'bar',
  data: {
    labels: ['2015','2016','2017','2018','2019','2020','2021','2022','2023'],
    datasets: [{
      label: 'Milhões de toneladas',
      data: [1.4, 1.5, 1.6, 1.7, 1.8, 1.85, 1.9, 2.0, 2.1],
      backgroundColor: [
        '#1a8a5a','#1a8f5e','#1e9562','#22a068',
        '#26a86e','#2aaf74','#2eb87a','#33c080','#3ddc84'
      ],
      borderRadius: 6,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(ctx) { return '  ' + ctx.parsed.y + 'M toneladas'; }
        }
      }
    },
    scales: {
      y: Object.assign(escalaBase(), {
        beginAtZero: false, min: 1.2,
        ticks: Object.assign(escalaBase().ticks, {
          callback: function(v) { return v + 'M'; }
        })
      }),
      x: semGrade()
    }
  }
});

// ── 3. BARRAS HORIZONTAIS — Reciclagem ─────────────────
new Chart(document.getElementById('graficoReciclagem'), {
  type: 'bar',
  data: {
    labels: ['Noruega','Suíça','U. Europeia','Japão','EUA','Mundo','China','Brasil'],
    datasets: [{
      label: '% Reciclado',
      data: [74, 72, 48, 38, 15, 22, 10, 3],
      backgroundColor: [
        VERDE_VIVO, VERDE_VIVO, VERDE, VERDE,
        AZUL_CEU, AMARELO, AZUL, LARANJA
      ],
      borderRadius: 5,
      borderSkipped: false
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(ctx) { return '  ' + ctx.parsed.x + '% reciclado'; }
        }
      }
    },
    scales: {
      x: Object.assign(escalaBase(), {
        max: 80,
        ticks: Object.assign(escalaBase().ticks, {
          callback: function(v) { return v + '%'; }
        })
      }),
      y: semGrade()
    }
  }
});

// ── 4. LINHA — Crescimento Global ──────────────────────
new Chart(document.getElementById('graficoLinha'), {
  type: 'line',
  data: {
    labels: ['2014','2016','2018','2019','2021','2022','2023','2024*','2030*'],
    datasets: [{
      label: 'E-lixo global (Mt)',
      data: [44.7, 47.8, 50.0, 53.6, 57.4, 59.4, 62.0, 64.5, 82.0],
      borderColor: VERDE_VIVO,
      backgroundColor: 'rgba(61,220,132,0.10)',
      borderWidth: 2.5,
      pointBackgroundColor: VERDE_VIVO,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      tension: 0.35,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(ctx) { return '  ' + ctx.parsed.y + 'Mt'; }
        }
      }
    },
    scales: {
      y: Object.assign(escalaBase(), {
        ticks: Object.assign(escalaBase().ticks, {
          callback: function(v) { return v + 'Mt'; }
        })
      }),
      x: semGrade()
    }
  }
});

// ── 5. BARRAS — Materiais recuperáveis ─────────────────
new Chart(document.getElementById('graficoMateriais'), {
  type: 'bar',
  data: {
    labels: ['Ferro/Aço','Plásticos','Outros Metais','Cobre','Alumínio','Ouro/Prata','Vidro'],
    datasets: [{
      label: '% da composição',
      data: [47, 21, 13, 7, 5, 3, 4],
      backgroundColor: [AZUL, VERDE, AMARELO, LARANJA, AZUL_CEU, '#d4af00', '#7ab8a0'],
      borderRadius: 7,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(ctx) { return '  ' + ctx.parsed.y + '% da composição'; }
        }
      }
    },
    scales: {
      y: Object.assign(escalaBase(), {
        ticks: Object.assign(escalaBase().ticks, {
          callback: function(v) { return v + '%'; }
        })
      }),
      x: semGrade()
    }
  }
});
