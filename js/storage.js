/**
 * storage.js — Camada de dados compartilhada (localStorage)
 * Gerencia pontos de coleta e usuários administradores.
 * Compatível com todos os navegadores modernos (Chrome, Firefox, Edge, Opera, Safari, Yandex).
 */

const DB = {
  PONTOS_KEY: 'dc_pontos',
  USUARIOS_KEY: 'dc_usuarios',
  SESSAO_KEY: 'dc_sessao',

  // ── PONTOS ──────────────────────────────────────────────
  getPontos: function () {
    try {
      var raw = localStorage.getItem(DB.PONTOS_KEY);
      return raw ? JSON.parse(raw) : DB._pontosIniciais();
    } catch (e) {
      return DB._pontosIniciais();
    }
  },

  savePontos: function (pontos) {
    try {
      localStorage.setItem(DB.PONTOS_KEY, JSON.stringify(pontos));
      return true;
    } catch (e) {
      return false;
    }
  },

  adicionarPonto: function (ponto) {
    var pontos = DB.getPontos();
    ponto.id = 'p_' + Date.now();
    ponto.criadoEm = new Date().toLocaleDateString('pt-BR');
    ponto.ativo = true;
    pontos.push(ponto);
    DB.savePontos(pontos);
    return ponto;
  },

  editarPonto: function (id, dados) {
    var pontos = DB.getPontos();
    var idx = pontos.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return false;
    Object.assign(pontos[idx], dados);
    pontos[idx].editadoEm = new Date().toLocaleDateString('pt-BR');
    DB.savePontos(pontos);
    return true;
  },

  removerPonto: function (id) {
    var pontos = DB.getPontos().filter(function (p) { return p.id !== id; });
    DB.savePontos(pontos);
  },

  // ── USUÁRIOS / AUTENTICAÇÃO ──────────────────────────────
  getUsuarios: function () {
    try {
      var raw = localStorage.getItem(DB.USUARIOS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveUsuarios: function (usuarios) {
    try {
      localStorage.setItem(DB.USUARIOS_KEY, JSON.stringify(usuarios));
      return true;
    } catch (e) {
      return false;
    }
  },

  cadastrarUsuario: function (nome, email, senha) {
    var usuarios = DB.getUsuarios();
    var existe = usuarios.some(function (u) { return u.email === email; });
    if (existe) return { ok: false, erro: 'E-mail já cadastrado.' };

    var usuario = {
      id: 'u_' + Date.now(),
      nome: nome,
      email: email,
      senha: DB._hash(senha), // hash simples para demonstração
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      role: 'admin'
    };
    usuarios.push(usuario);
    DB.saveUsuarios(usuarios);
    return { ok: true, usuario: usuario };
  },

  login: function (email, senha) {
    var usuarios = DB.getUsuarios();
    var usuario = usuarios.find(function (u) {
      return u.email === email && u.senha === DB._hash(senha);
    });
    if (!usuario) return { ok: false, erro: 'E-mail ou senha incorretos.' };
    var sessao = { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role };
    try {
      sessionStorage.setItem(DB.SESSAO_KEY, JSON.stringify(sessao));
    } catch (e) {
      localStorage.setItem(DB.SESSAO_KEY, JSON.stringify(sessao));
    }
    return { ok: true, usuario: sessao };
  },

  logout: function () {
    try { sessionStorage.removeItem(DB.SESSAO_KEY); } catch (e) {}
    try { localStorage.removeItem(DB.SESSAO_KEY); } catch (e) {}
  },

  getSessao: function () {
    try {
      var raw = sessionStorage.getItem(DB.SESSAO_KEY) || localStorage.getItem(DB.SESSAO_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  // ── UTILITÁRIOS ─────────────────────────────────────────
  _hash: function (str) {
    // Hash simples djb2 — apenas para demonstração sem backend
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(36);
  },

  _pontosIniciais: function () {
    var pontos = [
      {
        id: 'p_001', ativo: true, criadoEm: '01/01/2025',
        nome: 'Secretaria Municipal de Meio Ambiente',
        tipo: 'Ponto Permanente',
        lat: -28.6600, lng: -56.0031,
        endereco: 'Rua Tomás Flores, s/n – Centro, São Borja – RS',
        horario: 'Seg a Sex · 8h às 17h',
        telefone: '(55) 3431-1000',
        descricao: 'Ponto oficial da Prefeitura. Aceita celulares, computadores, TVs, eletrodomésticos, cabos, pilhas e baterias.',
        aceita: ['Celulares', 'Computadores', 'TVs', 'Pilhas', 'Baterias', 'Eletrodomésticos', 'Cabos']
      },
      {
        id: 'p_002', ativo: true, criadoEm: '01/01/2025',
        nome: 'Parque Esportivo General Vargas',
        tipo: 'Coleta Especial',
        lat: -28.6550, lng: -56.0110,
        endereco: 'Av. Presidente Vargas – São Borja – RS',
        horario: 'Campanhas periódicas',
        telefone: '(55) 3431-1200',
        descricao: 'Local utilizado para campanhas de coleta especial de lixo eletrônico organizadas pela Prefeitura.',
        aceita: ['Celulares', 'Computadores', 'Periféricos', 'Eletrodomésticos pequenos']
      },
      {
        id: 'p_003', ativo: true, criadoEm: '01/01/2025',
        nome: 'SENAI São Borja',
        tipo: 'Parceiro',
        lat: -28.6630, lng: -55.9970,
        endereco: 'Rua Getúlio Vargas – São Borja – RS',
        horario: 'Seg a Sex · 8h às 18h',
        telefone: '(55) 3431-2200',
        descricao: 'Parceiro no recolhimento de eletrônicos. Equipamentos são destinados à reciclagem e reaproveitamento.',
        aceita: ['Computadores', 'Monitores', 'Impressoras', 'Teclados', 'Mouses']
      },
      {
        id: 'p_004', ativo: true, criadoEm: '01/01/2025',
        nome: 'Supermercado Comunitário – Centro',
        tipo: 'Ponto de Entrega',
        lat: -28.6615, lng: -56.0050,
        endereco: 'Praça XV de Novembro – Centro, São Borja – RS',
        horario: 'Seg a Sáb · 7h às 20h',
        telefone: '(55) 3431-3300',
        descricao: 'Container de coleta para pilhas, baterias e pequenos eletrônicos. Disponível durante horário de funcionamento.',
        aceita: ['Pilhas', 'Baterias', 'Carregadores', 'Celulares']
      },
      {
        id: 'p_005', ativo: true, criadoEm: '01/01/2025',
        nome: 'Escola Estadual São Borja',
        tipo: 'Educação',
        lat: -28.6570, lng: -56.0080,
        endereco: 'Rua Duque de Caxias – São Borja – RS',
        horario: 'Seg a Sex · 7h30 às 17h',
        telefone: '(55) 3431-4400',
        descricao: 'Campanha educativa com caixa de coleta para pequenos eletrônicos e pilhas. Projeto de educação ambiental.',
        aceita: ['Pilhas', 'Celulares velhos', 'Carregadores', 'Cabos']
      },
      {
        id: 'p_006', ativo: true, criadoEm: '01/01/2025',
        nome: 'Câmara Municipal de Vereadores',
        tipo: 'Ponto de Entrega',
        lat: -28.6588, lng: -56.0020,
        endereco: 'Rua Andrade Neves – Centro, São Borja – RS',
        horario: 'Seg a Sex · 8h às 12h',
        telefone: '(55) 3431-5500',
        descricao: 'Ponto de coleta parceiro. Recebe pequenos eletrônicos e dispositivos móveis para destinação correta.',
        aceita: ['Celulares', 'Tablets', 'Carregadores', 'Cabos', 'Fones']
      }
    ];
    DB.savePontos(pontos);
    return pontos;
  }
};
