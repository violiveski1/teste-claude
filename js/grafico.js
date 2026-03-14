// Configuração global de cores
const CORES = {
  verde: '#2ecc71',
  azul: '#3498db',
  laranja: '#f39c12',
  vermelho: '#e74c3c',
  roxo: '#9b59b6',
  ciano: '#1abc9c',
  amarelo: '#f1c40f',
  cinzaEscuro: '#2c3e50'
};

const PALETA = [CORES.verde, CORES.azul, CORES.laranja, CORES.vermelho, CORES.roxo, CORES.ciano, CORES.amarelo];

// Defaults globais Chart.js
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#3d5a3d';

function initGraficos() {

  // 1. Gráfico de Pizza – Tipos de lixo eletrônico
  const ctxPizza = document.getElementById('graficoPizza');
  if (ctxPizza) {
    new Chart(ctxPizza, {
      type: 'doughnut',
      data: {
        labels: [
          'Eletrodomésticos',
          'Equipamentos TI',
          'Telas/Monitores',
          'Celulares',
          'Lâmpadas',
          'Pilhas/Baterias',
          'Outros'
        ],
        datasets: [{
          data: [44.9, 17.4, 6.7, 4.7, 4.7, 2.3, 19.3],
          backgroundColor: PALETA,
          borderWidth: 3,
          borderColor: '#f5f0e8',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 14, font: { size: 12 }, boxWidth: 14 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  // 2. Gráfico de Barras – Crescimento do lixo eletrônico no Brasil (Mt)
  const ctxBarras = document.getElementById('graficoBarras');
  if (ctxBarras) {
    new Chart(ctxBarras, {
      type: 'bar',
      data: {
        labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
          label: 'Gerado (milhões de toneladas)',
          data: [41.8, 44.7, 44.7, 46.0, 49.8, 53.6, 53.6, 57.4, 59.4, 62.0],
          backgroundColor: CORES.verde + 'cc',
          borderColor: CORES.verde,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }, {
          label: 'Reciclado (milhões de toneladas)',
          data: [8.5, 9.0, 9.2, 9.6, 9.8, 9.3, 9.8, 9.8, 10.2, 10.5],
          backgroundColor: CORES.azul + 'cc',
          borderColor: CORES.azul,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { padding: 16, font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} Mt`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            title: { display: true, text: 'Milhões de toneladas', font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.06)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Gráfico de Linha – Taxa de reciclagem (%)
  const ctxLinha = document.getElementById('graficoLinha');
  if (ctxLinha) {
    new Chart(ctxLinha, {
      type: 'line',
      data: {
        labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
          label: 'Taxa de reciclagem global (%)',
          data: [20.3, 20.1, 20.6, 20.8, 19.7, 17.4, 18.3, 17.1, 17.6, 17.0],
          borderColor: CORES.laranja,
          backgroundColor: CORES.laranja + '20',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: CORES.laranja,
          pointRadius: 5,
          pointHoverRadius: 8,
          borderWidth: 3
        }, {
          label: 'Taxa de reciclagem Brasil (%)',
          data: [3.0, 3.1, 3.0, 3.2, 2.9, 3.0, 3.1, 3.2, 3.0, 3.1],
          borderColor: CORES.vermelho,
          backgroundColor: CORES.vermelho + '15',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: CORES.vermelho,
          pointRadius: 5,
          pointHoverRadius: 8,
          borderWidth: 3,
          borderDash: [6, 3]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { padding: 16, font: { size: 12 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 30,
            title: { display: true, text: 'Taxa de reciclagem (%)', font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: {
              callback: v => v + '%'
            }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 4. Gráfico Horizontal – Materiais recuperáveis (valor estimado por tonelada)
  const ctxMateriais = document.getElementById('graficoMateriais');
  if (ctxMateriais) {
    new Chart(ctxMateriais, {
      type: 'bar',
      data: {
        labels: ['Ouro', 'Paládio', 'Prata', 'Cobre', 'Alumínio', 'Ferro/Aço', 'Plástico'],
        datasets: [{
          label: 'Valor estimado (R$/kg)',
          data: [290000, 210000, 3500, 42, 12, 8, 4],
          backgroundColor: [CORES.amarelo, CORES.laranja, CORES.cinzaEscuro, CORES.laranja+'aa', CORES.azul, CORES.verde, CORES.ciano],
          borderRadius: 6,
          borderWidth: 0
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
              label: ctx => ` R$ ${ctx.parsed.x.toLocaleString('pt-BR')}/kg`
            }
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: { display: true, text: 'Valor em R$/kg (escala logarítmica)', font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.06)' }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }

}

document.addEventListener('DOMContentLoaded', initGraficos);
