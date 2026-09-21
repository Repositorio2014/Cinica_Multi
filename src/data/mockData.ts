import { Paciente, Profissional, Sala, Agenda, Prontuario, TipoEspecialidade, StatusAgendamento, TipoProntuario } from '../types';

export const INITIAL_SALAS: Sala[] = [
  {
    id: 'sala-1',
    nome: 'Sala 01 - Integração Sensorial (T.O.)',
    descricao: 'Equipada com balanços suspensos, piscina de bolinhas, rampa de escalada e tatames de alta densidade.',
    capacidade: 2,
    recursos: ['Balanço Suspenso', 'Piscina de Bolinhas', 'Tatames', 'Rampa Proprioceptiva', 'Colete Ponderado'],
    ativo: true
  },
  {
    id: 'sala-2',
    nome: 'Sala 02 - Fonoaudiologia & Audição',
    descricao: 'Consultório com isolamento acústico, espelho articulado, softwares de praxias orais e jogos fonoaudiológicos.',
    capacidade: 2,
    recursos: ['Espelho com Iluminação', 'Material de Deglutição', 'Software de Fonética', 'Jogos Fonoaudiológicos'],
    ativo: true
  },
  {
    id: 'sala-3',
    nome: 'Sala 03 - Psicoterapia & Ludoterapia Infantil',
    descricao: 'Ambiente acolhedor com caixa de areia (Sandplay), mesa baixa para desenho, jogos expressivos e fantoches.',
    capacidade: 3,
    recursos: ['Mesa de Ludoterapia', 'Caixa de Areia', 'Jogos Emocionais', 'Pufes Anatômicos'],
    ativo: true
  },
  {
    id: 'sala-4',
    nome: 'Sala 04 - Avaliação Neuropsicológica & Testagem',
    descricao: 'Sala silenciosa ideal para aplicação padronizada de baterias e escalas (WISC, BPA, Neupsilin, SRS-2).',
    capacidade: 2,
    recursos: ['Mesa Padronizada', 'Armário com Tranca para Testes', 'Cronômetro Digital', 'Iluminação Difusa'],
    ativo: true
  },
  {
    id: 'sala-5',
    nome: 'Sala 05 - Psiquiatria & Atendimento Adulto',
    descricao: 'Consultório médico elegante com poltronas confortáveis, mesa executiva e climatização silenciosa.',
    capacidade: 4,
    recursos: ['Mesa Médica', 'Maca Clínica', 'Poltronas Reclináveis', 'Prontuário Digital'],
    ativo: true
  }
];

export const INITIAL_PROFISSIONAIS: Profissional[] = [
  {
    id: 'prof-1',
    nome: 'Dra. Mariana Albuquerque',
    cpf: '123.456.789-10',
    registroConselho: 'CREFITO-3/19842-TO',
    telefone: '(11) 98765-4321',
    email: 'mariana.to@clinicamulti.com.br',
    ativo: true,
    valorSessao: 220,
    especialidades: [TipoEspecialidade.TERAPIA_OCUPACIONAL],
    cor: '#f59e0b'
  },
  {
    id: 'prof-2',
    nome: 'Dr. Lucas Silveira',
    cpf: '234.567.890-21',
    registroConselho: 'CRFa 2-17849',
    telefone: '(11) 97654-3210',
    email: 'lucas.fono@clinicamulti.com.br',
    ativo: true,
    valorSessao: 200,
    especialidades: [TipoEspecialidade.FONOAUDIOLOGIA],
    cor: '#0ea5e9'
  },
  {
    id: 'prof-3',
    nome: 'Dra. Camila Nogueira',
    cpf: '345.678.901-32',
    registroConselho: 'CRP 06/114920',
    telefone: '(11) 96543-2109',
    email: 'camila.psico@clinicamulti.com.br',
    ativo: true,
    valorSessao: 210,
    especialidades: [TipoEspecialidade.PSICOLOGIA, TipoEspecialidade.NEUROPSICOLOGIA],
    cor: '#10b981'
  },
  {
    id: 'prof-4',
    nome: 'Profª. Fernanda Guimarães',
    cpf: '456.789.012-43',
    registroConselho: 'ABPp 4120/SP',
    telefone: '(11) 95432-1098',
    email: 'fernanda.psicoped@clinicamulti.com.br',
    ativo: true,
    valorSessao: 190,
    especialidades: [TipoEspecialidade.PSICOPEDAGOGIA],
    cor: '#6366f1'
  },
  {
    id: 'prof-5',
    nome: 'Dr. Roberto Vasconcellos',
    cpf: '567.890.123-54',
    registroConselho: 'CRM/SP 148.910 - RQE 4921',
    telefone: '(11) 94321-0987',
    email: 'roberto.psiquiatria@clinicamulti.com.br',
    ativo: true,
    valorSessao: 380,
    especialidades: [TipoEspecialidade.PSIQUIATRIA],
    cor: '#e11d48'
  }
];

export const INITIAL_PACIENTES: Paciente[] = [
  {
    id: 'pac-1',
    nome: 'Enzo Gabriel Santos Pereira',
    cpf: '419.823.118-02',
    dataNascimento: '2018-05-14',
    telefone: '(11) 98112-9901',
    email: 'patricia.santos@email.com',
    nomeResponsavel: 'Patrícia Santos Pereira (Mãe)',
    telefoneResponsavel: '(11) 98112-9901',
    endereco: 'Rua das Camélias, 240, Apto 42 - São Paulo, SP',
    convenio: 'Unimed Pleno',
    observacoes: 'Diagnóstico de Transtorno do Espectro Autista (TEA nível 1). Acompanhamento integrado semanal com Terapia Ocupacional e Fonoaudiologia. Hiperfoco em dinossauros.',
    ativo: true,
    criadoEm: '2024-02-10'
  },
  {
    id: 'pac-2',
    nome: 'Alice Martins Vieira',
    cpf: '512.339.408-15',
    dataNascimento: '2016-09-22',
    telefone: '(11) 97233-4455',
    email: 'marcos.vieira@email.com',
    nomeResponsavel: 'Marcos Vieira (Pai)',
    telefoneResponsavel: '(11) 97233-4455',
    endereco: 'Av. Paulista, 1800, Conj 804 - São Paulo, SP',
    convenio: 'Bradesco Saúde Top',
    observacoes: 'Dificuldades específicas na alfabetização e consciência fonológica. Suspeita de Dislexia do Desenvolvimento em investigação com Psicopedagogia e Neuropsicologia.',
    ativo: true,
    criadoEm: '2024-03-01'
  },
  {
    id: 'pac-3',
    nome: 'Henrique Ramos Fontes',
    cpf: '388.901.442-88',
    dataNascimento: '2012-11-03',
    telefone: '(11) 96321-7788',
    email: 'renata.fontes@email.com',
    nomeResponsavel: 'Renata Ramos Fontes (Mãe)',
    telefoneResponsavel: '(11) 96321-7788',
    endereco: 'Rua Harmonia, 510 - Vila Madalena, São Paulo, SP',
    convenio: 'SulAmérica Especial',
    observacoes: 'Queixa de desatenção acentuada, impulsividade e desorganização escolar. Hipótese de TDAH subtipo desatento. Acompanhamento com Psicoterapia TCC.',
    ativo: true,
    criadoEm: '2024-01-15'
  },
  {
    id: 'pac-4',
    nome: 'Clara Meirelles Castanho',
    cpf: '499.112.839-40',
    dataNascimento: '2020-04-09',
    telefone: '(11) 95211-3322',
    email: 'juliana.meirelles@email.com',
    nomeResponsavel: 'Juliana Meirelles (Mãe)',
    telefoneResponsavel: '(11) 95211-3322',
    endereco: 'Rua Vergueiro, 1200 - Paraíso, São Paulo, SP',
    convenio: 'Particular',
    observacoes: 'Atraso expressivo da fala. Realiza treino articulatório, comunicação aumentativa e estimulação sensorial táctil.',
    ativo: true,
    criadoEm: '2024-04-18'
  },
  {
    id: 'pac-5',
    nome: 'Beatriz Vasconcelos Lima',
    cpf: '298.776.543-09',
    dataNascimento: '1995-08-30',
    telefone: '(11) 94122-8877',
    email: 'beatriz.v.lima@email.com',
    endereco: 'Rua Augusta, 920 - Consolação, São Paulo, SP',
    convenio: 'Amil Blue',
    observacoes: 'Acompanhamento psiquiátrico e psicológico para Transtorno de Ansiedade Generalizada (TAG) e esgotamento ocupacional.',
    ativo: true,
    criadoEm: '2024-05-02'
  }
];

// Helper to format ISO dates for today and neighboring days
const today = new Date();
const formatDate = (daysOffset: number, hour: number, minute: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const INITIAL_AGENDAS: Agenda[] = [
  {
    id: 'ag-1',
    dataHoraInicio: formatDate(0, 8, 30),
    dataHoraFim: formatDate(0, 9, 20),
    status: StatusAgendamento.ATENDIDO,
    observacoes: 'Sessão de Integração Sensorial: foco em desensibilização tátil e modulação vestibular.',
    valorCobrado: 220,
    pacienteId: 'pac-1',
    pacienteNome: 'Enzo Gabriel Santos Pereira',
    profissionalId: 'prof-1',
    profissionalNome: 'Dra. Mariana Albuquerque',
    salaId: 'sala-1',
    salaNome: 'Sala 01 - Integração Sensorial (T.O.)',
    especialidade: TipoEspecialidade.TERAPIA_OCUPACIONAL
  },
  {
    id: 'ag-2',
    dataHoraInicio: formatDate(0, 9, 30),
    dataHoraFim: formatDate(0, 10, 20),
    status: StatusAgendamento.ATENDIDO,
    observacoes: 'Treino de fonemas oclusivos e estimulação de vocabulário temático com figuras.',
    valorCobrado: 200,
    pacienteId: 'pac-1',
    pacienteNome: 'Enzo Gabriel Santos Pereira',
    profissionalId: 'prof-2',
    profissionalNome: 'Dr. Lucas Silveira',
    salaId: 'sala-2',
    salaNome: 'Sala 02 - Fonoaudiologia & Audição',
    especialidade: TipoEspecialidade.FONOAUDIOLOGIA
  },
  {
    id: 'ag-3',
    dataHoraInicio: formatDate(0, 10, 30),
    dataHoraFim: formatDate(0, 11, 20),
    status: StatusAgendamento.CONFIRMADO,
    observacoes: 'Intervenção psicopedagógica: jogos de rima, segmentação de palavras e atenção seletiva.',
    valorCobrado: 190,
    pacienteId: 'pac-2',
    pacienteNome: 'Alice Martins Vieira',
    profissionalId: 'prof-4',
    profissionalNome: 'Profª. Fernanda Guimarães',
    salaId: 'sala-3',
    salaNome: 'Sala 03 - Psicoterapia & Ludoterapia Infantil',
    especialidade: TipoEspecialidade.PSICOPEDAGOGIA
  },
  {
    id: 'ag-4',
    dataHoraInicio: formatDate(0, 13, 30),
    dataHoraFim: formatDate(0, 14, 20),
    status: StatusAgendamento.CONFIRMADO,
    observacoes: 'Treino de autorregulação emocional e manejo da frustração em ambiente escolar.',
    valorCobrado: 210,
    pacienteId: 'pac-3',
    pacienteNome: 'Henrique Ramos Fontes',
    profissionalId: 'prof-3',
    profissionalNome: 'Dra. Camila Nogueira',
    salaId: 'sala-3',
    salaNome: 'Sala 03 - Psicoterapia & Ludoterapia Infantil',
    especialidade: TipoEspecialidade.PSICOLOGIA
  },
  {
    id: 'ag-5',
    dataHoraInicio: formatDate(0, 14, 30),
    dataHoraFim: formatDate(0, 15, 20),
    status: StatusAgendamento.AGENDADO,
    observacoes: 'Avaliação da estimulação de linguagem precoce com os responsáveis.',
    valorCobrado: 200,
    pacienteId: 'pac-4',
    pacienteNome: 'Clara Meirelles Castanho',
    profissionalId: 'prof-2',
    profissionalNome: 'Dr. Lucas Silveira',
    salaId: 'sala-2',
    salaNome: 'Sala 02 - Fonoaudiologia & Audição',
    especialidade: TipoEspecialidade.FONOAUDIOLOGIA
  },
  {
    id: 'ag-6',
    dataHoraInicio: formatDate(0, 16, 0),
    dataHoraFim: formatDate(0, 17, 0),
    status: StatusAgendamento.AGENDADO,
    observacoes: 'Consulta médica de retorno: reavaliação de posologia e sintomas ansiosos.',
    valorCobrado: 380,
    pacienteId: 'pac-5',
    pacienteNome: 'Beatriz Vasconcelos Lima',
    profissionalId: 'prof-5',
    profissionalNome: 'Dr. Roberto Vasconcellos',
    salaId: 'sala-5',
    salaNome: 'Sala 05 - Psiquiatria & Atendimento Adulto',
    especialidade: TipoEspecialidade.PSIQUIATRIA
  },
  {
    id: 'ag-7',
    dataHoraInicio: formatDate(1, 9, 0),
    dataHoraFim: formatDate(1, 9, 50),
    status: StatusAgendamento.CONFIRMADO,
    observacoes: 'Aplicação de subtestes do WISC-IV (Cubos e Vocabulário).',
    valorCobrado: 250,
    pacienteId: 'pac-2',
    pacienteNome: 'Alice Martins Vieira',
    profissionalId: 'prof-3',
    profissionalNome: 'Dra. Camila Nogueira',
    salaId: 'sala-4',
    salaNome: 'Sala 04 - Avaliação Neuropsicológica & Testagem',
    especialidade: TipoEspecialidade.NEUROPSICOLOGIA
  }
];

export const INITIAL_PRONTUARIOS: Prontuario[] = [
  {
    id: 'pront-1',
    tipo: TipoProntuario.ANAMNESE,
    dataAtendimento: '2024-02-12T10:00:00Z',
    titulo: 'Anamnese Multidisciplinar Inicial',
    conteudo: 'Paciente trazido pela genitora com queixas de seletividade alimentar, dificuldade de socialização em ambiente escolar e estereotipias motoras quando exposto a sons altos. Parto a termo sem intercorrências neonatais. Marcos do desenvolvimento motor dentro do esperado, porém com atraso no balbucio e primeiras palavras. Triagem sensorial indica hipersensibilidade tátil e auditiva.',
    confidencial: false,
    pacienteId: 'pac-1',
    pacienteNome: 'Enzo Gabriel Santos Pereira',
    profissionalId: 'prof-1',
    profissionalNome: 'Dra. Mariana Albuquerque',
    especialidade: TipoEspecialidade.TERAPIA_OCUPACIONAL,
    agendaId: 'ag-1',
    resumoEvolucao: {
      objetivos: 'Traçar perfil sensorial e plano de intervenção em Terapia Ocupacional e Fonoaudiologia',
      atividades: 'Entrevista clínica semiestruturada com a mãe e observação lúdica livre do paciente',
      respostaPaciente: 'Boa interação mediada por brinquedos de encaixe e dinossauros. Rejeição a texturas úmidas.',
      orientacoesCasa: 'Manter rotina visual antecipatória antes das saídas de casa.'
    }
  },
  {
    id: 'pront-2',
    tipo: TipoProntuario.EVOLUCAO,
    dataAtendimento: formatDate(0, 9, 15),
    titulo: 'Evolução de T.O. - Modulação Vestibular e Práxis',
    conteudo: 'Sessão transcorreu com excelente engajamento. Utilizado o balanço suspenso tipo rede em movimentos anteroposteriores lineares para acalmia do sistema nervoso central. Na sequência, atividade no circuito proprioceptivo com rampa e colchonetes. Apresentou tolerância ampliada ao toque de gel e massinha de modelar, permanecendo 12 minutos na atividade.',
    confidencial: false,
    pacienteId: 'pac-1',
    pacienteNome: 'Enzo Gabriel Santos Pereira',
    profissionalId: 'prof-1',
    profissionalNome: 'Dra. Mariana Albuquerque',
    especialidade: TipoEspecialidade.TERAPIA_OCUPACIONAL,
    agendaId: 'ag-1',
    resumoEvolucao: {
      objetivos: 'Regulação sensorial através do sistema vestibular e proprioceptivo',
      atividades: 'Balanço rede linear, rampa de escalada com almofadas, manuseio de massinha',
      respostaPaciente: 'Menor agitação psicomotora ao final da sessão e contato visual sustentado de 4 segundos.',
      orientacoesCasa: 'Estimular brincadeira de massinha 10 minutos após o banho.'
    }
  },
  {
    id: 'pront-3',
    tipo: TipoProntuario.EVOLUCAO,
    dataAtendimento: formatDate(0, 10, 10),
    titulo: 'Evolução Fonoaudiológica - Estimulação Fonético-Fonológica',
    conteudo: 'Realizado treino dos fonemas oclusivos bilabiais (/p/, /b/, /m/). O paciente demonstrou evolução na imitação vocal com apoio de pistas visuais no espelho da sala. Mantivemos integração com as orientações da T.O. (usando o colete ponderado durante os 15 minutos de mesa para maior foco atencional).',
    confidencial: false,
    pacienteId: 'pac-1',
    pacienteNome: 'Enzo Gabriel Santos Pereira',
    profissionalId: 'prof-2',
    profissionalNome: 'Dr. Lucas Silveira',
    especialidade: TipoEspecialidade.FONOAUDIOLOGIA,
    agendaId: 'ag-2',
    resumoEvolucao: {
      objetivos: 'Ampliação do inventário fonético e fixação de fonemas oclusivos',
      atividades: 'Pareamento de figuras com cartelas sonoras no espelho e repetição lúdica',
      respostaPaciente: 'Produziu 8 de 10 tentativas corretas com pista tátil facial.',
      orientacoesCasa: 'Praticar o jogo da repetição labial com os pais em frente ao espelho do banheiro.'
    }
  },
  {
    id: 'pront-4',
    tipo: TipoProntuario.LAUDO,
    dataAtendimento: '2024-04-10T14:30:00Z',
    titulo: 'Laudo de Avaliação Neuropsicológica Compreensiva',
    conteudo: 'Relatório neuropsicológico emitido para fins pedagógicos e médicos. Foram administradas baterias psicométricas normatizadas para a faixa etária. O índice de compreensão verbal encontra-se na média superior (percentil 75), com rebaixamento em memória de trabalho auditiva e velocidade de processamento visual (percentil 16). Sugere-se flexibilização de tempo em provas e enunciados fracionados.',
    confidencial: false,
    pacienteId: 'pac-2',
    pacienteNome: 'Alice Martins Vieira',
    profissionalId: 'prof-3',
    profissionalNome: 'Dra. Camila Nogueira',
    especialidade: TipoEspecialidade.NEUROPSICOLOGIA,
    resumoEvolucao: {
      objetivos: 'Encaminhamento para coordenação pedagógica da escola e neuropediatra assistente',
      atividades: 'Síntese das 6 sessões de testagem e análise qualitativa do perfil de aprendizagem',
      respostaPaciente: 'Excelente cooperação durante todo o período avaliativo.',
      orientacoesCasa: 'Apresentar documento à equipe de inclusão escolar para adaptações no currículo.'
    }
  }
];
