import { AuthUser, TipoEspecialidade } from '../types';

export const MOCK_USERS: (AuthUser & { senhaPadrao: string })[] = [
  {
    id: 'user-admin',
    login: 'admin',
    senhaPadrao: 'admin',
    nome: 'Dr. Carlos Mendes',
    email: 'diretoria@clinicamulti.com.br',
    role: 'ROLE_ADMIN',
    cargo: 'Diretor Clínico & Administrador Geral',
    avatarCor: '#c026d3'
  },
  {
    id: 'user-terapeuta',
    login: 'user',
    senhaPadrao: 'user',
    nome: 'Dra. Mariana Albuquerque',
    email: 'mariana.to@clinicamulti.com.br',
    role: 'ROLE_TERAPEUTA',
    cargo: 'Terapeuta Ocupacional (CREFITO-3/19842)',
    especialidade: TipoEspecialidade.TERAPIA_OCUPACIONAL,
    avatarCor: '#d946ef'
  },
  {
    id: 'user-recepcao',
    login: 'recepcao',
    senhaPadrao: 'recepcao',
    nome: 'Beatriz Santos',
    email: 'recepcao@clinicamulti.com.br',
    role: 'ROLE_RECEPCAO',
    cargo: 'Secretária & Gestão de Atendimento',
    avatarCor: '#ec4899'
  }
];
