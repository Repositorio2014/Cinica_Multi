import { TipoEspecialidade, StatusAgendamento, TipoProntuario, EspecialidadeConfig } from '../types';

export const ESPECIALIDADES_INFO: Record<TipoEspecialidade, EspecialidadeConfig> = {
  [TipoEspecialidade.PSICOLOGIA]: {
    codigo: TipoEspecialidade.PSICOLOGIA,
    nome: 'Psicologia Clínica',
    descricao: 'Psicoterapia para crianças, adolescentes, adultos e terapia familiar.',
    conselhoPadrao: 'CRP',
    corBg: 'bg-emerald-50',
    corTexto: 'text-emerald-700',
    corBorda: 'border-emerald-200'
  },
  [TipoEspecialidade.FONOAUDIOLOGIA]: {
    codigo: TipoEspecialidade.FONOAUDIOLOGIA,
    nome: 'Fonoaudiologia',
    descricao: 'Desenvolvimento da fala, linguagem, motricidade orofacial e deglutição.',
    conselhoPadrao: 'CRFa',
    corBg: 'bg-sky-50',
    corTexto: 'text-sky-700',
    corBorda: 'border-sky-200'
  },
  [TipoEspecialidade.TERAPIA_OCUPACIONAL]: {
    codigo: TipoEspecialidade.TERAPIA_OCUPACIONAL,
    nome: 'Terapia Ocupacional',
    descricao: 'Integração sensorial, autonomia diária, treino de AVDs e coordenação motora.',
    conselhoPadrao: 'CREFITO',
    corBg: 'bg-amber-50',
    corTexto: 'text-amber-800',
    corBorda: 'border-amber-200'
  },
  [TipoEspecialidade.PSICOPEDAGOGIA]: {
    codigo: TipoEspecialidade.PSICOPEDAGOGIA,
    nome: 'Psicopedagogia',
    descricao: 'Avaliação e intervenção em dificuldades e transtornos de aprendizagem.',
    conselhoPadrao: 'ABPp',
    corBg: 'bg-indigo-50',
    corTexto: 'text-indigo-700',
    corBorda: 'border-indigo-200'
  },
  [TipoEspecialidade.NEUROPSICOLOGIA]: {
    codigo: TipoEspecialidade.NEUROPSICOLOGIA,
    nome: 'Neuropsicologia',
    descricao: 'Avaliação das funções cognitivas, atenção, memória e funções executivas.',
    conselhoPadrao: 'CRP (Espec.)',
    corBg: 'bg-purple-50',
    corTexto: 'text-purple-700',
    corBorda: 'border-purple-200'
  },
  [TipoEspecialidade.PSIQUIATRIA]: {
    codigo: TipoEspecialidade.PSIQUIATRIA,
    nome: 'Psiquiatria da Infância e Adulto',
    descricao: 'Diagnóstico médico, acompanhamento psicofarmacológico e laudos.',
    conselhoPadrao: 'CRM',
    corBg: 'bg-rose-50',
    corTexto: 'text-rose-700',
    corBorda: 'border-rose-200'
  },
  [TipoEspecialidade.OUTRA]: {
    codigo: TipoEspecialidade.OUTRA,
    nome: 'Outra Terapia / Especialidade',
    descricao: 'Musicoterapia, Psicomotricidade, Fisioterapia Integrativa e Nutrição.',
    conselhoPadrao: 'Reg.',
    corBg: 'bg-slate-100',
    corTexto: 'text-slate-700',
    corBorda: 'border-slate-200'
  }
};

export const STATUS_AGENDAMENTO_INFO: Record<StatusAgendamento, { label: string; bg: string; text: string; dot: string }> = {
  [StatusAgendamento.AGENDADO]: {
    label: 'Agendado',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    dot: 'bg-slate-400'
  },
  [StatusAgendamento.CONFIRMADO]: {
    label: 'Confirmado',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500'
  },
  [StatusAgendamento.ATENDIDO]: {
    label: 'Atendido',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500'
  },
  [StatusAgendamento.FALTA]: {
    label: 'Falta / Não Compareceu',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500'
  },
  [StatusAgendamento.CANCELADO]: {
    label: 'Cancelado',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dot: 'bg-rose-500'
  }
};

export const TIPO_PRONTUARIO_INFO: Record<TipoProntuario, { label: string; descricao: string; cor: string }> = {
  [TipoProntuario.ANAMNESE]: {
    label: 'Anamnese Inicial',
    descricao: 'Histórico de vida, desenvolvimento neuropsicomotor e queixa principal',
    cor: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  [TipoProntuario.EVOLUCAO]: {
    label: 'Evolução da Sessão',
    descricao: 'Registro detalhado de conduta, respostas e avanços terapêuticos',
    cor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  [TipoProntuario.LAUDO]: {
    label: 'Laudo / Parecer Técnico',
    descricao: 'Relatório formal de avaliação para escolas, médicos e previdência',
    cor: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  [TipoProntuario.ATESTADO]: {
    label: 'Atestado / Declaração',
    descricao: 'Comprovante de comparecimento em consulta ou justificativa de terapia',
    cor: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  [TipoProntuario.ENCAMINHAMENTO]: {
    label: 'Encaminhamento',
    descricao: 'Referência formal para outro profissional da equipe ou especialidade médica',
    cor: 'text-sky-600 bg-sky-50 border-sky-200'
  }
};
