export enum TipoEspecialidade {
  PSIQUIATRIA = 'PSIQUIATRIA',
  PSICOLOGIA = 'PSICOLOGIA',
  PSICOPEDAGOGIA = 'PSICOPEDAGOGIA',
  FONOAUDIOLOGIA = 'FONOAUDIOLOGIA',
  TERAPIA_OCUPACIONAL = 'TERAPIA_OCUPACIONAL',
  NEUROPSICOLOGIA = 'NEUROPSICOLOGIA',
  OUTRA = 'OUTRA'
}

export enum StatusAgendamento {
  AGENDADO = 'AGENDADO',
  CONFIRMADO = 'CONFIRMADO',
  ATENDIDO = 'ATENDIDO',
  FALTA = 'FALTA',
  CANCELADO = 'CANCELADO'
}

export enum TipoProntuario {
  ANAMNESE = 'ANAMNESE',
  EVOLUCAO = 'EVOLUCAO',
  LAUDO = 'LAUDO',
  ATESTADO = 'ATESTADO',
  ENCAMINHAMENTO = 'ENCAMINHAMENTO'
}

export interface EspecialidadeConfig {
  codigo: TipoEspecialidade;
  nome: string;
  descricao: string;
  conselhoPadrao: string;
  corBg: string;
  corTexto: string;
  corBorda: string;
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email?: string;
  nomeResponsavel?: string;
  telefoneResponsavel?: string;
  endereco?: string;
  convenio?: string;
  observacoes?: string;
  ativo: boolean;
  criadoEm?: string;
}

export interface Profissional {
  id: string;
  nome: string;
  cpf: string;
  registroConselho: string;
  telefone: string;
  email: string;
  ativo: boolean;
  valorSessao?: number;
  especialidades: TipoEspecialidade[];
  cor?: string;
}

export interface Sala {
  id: string;
  nome: string;
  descricao?: string;
  capacidade: number;
  recursos?: string[];
  ativo?: boolean;
}

export interface Agenda {
  id: string;
  dataHoraInicio: string; // ISO format: YYYY-MM-DDTHH:mm:ss
  dataHoraFim: string;    // ISO format: YYYY-MM-DDTHH:mm:ss
  status: StatusAgendamento;
  observacoes?: string;
  valorCobrado?: number;
  pacienteId: string;
  pacienteNome: string;
  profissionalId: string;
  profissionalNome: string;
  salaId?: string;
  salaNome?: string;
  especialidade: TipoEspecialidade;
}

export interface Prontuario {
  id: string;
  tipo: TipoProntuario;
  dataAtendimento: string; // ISO
  titulo: string;
  conteudo: string;
  confidencial: boolean;
  pacienteId: string;
  pacienteNome: string;
  profissionalId: string;
  profissionalNome: string;
  especialidade: TipoEspecialidade;
  agendaId?: string;
  resumoEvolucao?: {
    objetivos?: string;
    atividades?: string;
    respostaPaciente?: string;
    orientacoesCasa?: string;
  };
}

export type ViewTab = 'dashboard' | 'agenda' | 'pacientes' | 'prontuarios' | 'profissionais' | 'salas' | 'relatorios';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_TERAPEUTA' | 'ROLE_RECEPCAO';

export interface AuthUser {
  id: string;
  login: string;
  nome: string;
  email: string;
  role: UserRole;
  cargo: string;
  especialidade?: TipoEspecialidade;
  token?: string;
  avatarCor?: string;
}

export interface BackendConfig {
  useRealApi: boolean;
  apiUrl: string;
  jwtToken?: string;
}
