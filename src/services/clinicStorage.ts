import { Paciente, Profissional, Sala, Agenda, Prontuario, BackendConfig, StatusAgendamento, AuthUser } from '../types';
import { INITIAL_PACIENTES, INITIAL_PROFISSIONAIS, INITIAL_SALAS, INITIAL_AGENDAS, INITIAL_PRONTUARIOS } from '../data/mockData';

const STORAGE_KEYS = {
  PACIENTES: 'clinica_pacientes_v1',
  PROFISSIONAIS: 'clinica_profissionais_v1',
  SALAS: 'clinica_salas_v1',
  AGENDAS: 'clinica_agendas_v1',
  PRONTUARIOS: 'clinica_prontuarios_v1',
  BACKEND_CONFIG: 'clinica_backend_config_v1',
  AUTH_USER: 'clinica_auth_user_v1'
};

export class ClinicStorageService {
  private static getItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error loading key ${key}:`, e);
      return defaultVal;
    }
  }

  private static setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(`Error saving key ${key}:`, e);
    }
  }

  // Pacientes
  static getPacientes(): Paciente[] {
    return this.getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, INITIAL_PACIENTES);
  }

  static savePaciente(paciente: Paciente): Paciente[] {
    const list = this.getPacientes();
    const index = list.findIndex(p => p.id === paciente.id);
    if (index >= 0) {
      list[index] = paciente;
    } else {
      list.unshift(paciente);
    }
    this.setItem(STORAGE_KEYS.PACIENTES, list);
    return list;
  }

  static deletePaciente(id: string): Paciente[] {
    const list = this.getPacientes().filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PACIENTES, list);
    return list;
  }

  // Profissionais
  static getProfissionais(): Profissional[] {
    return this.getItem<Profissional[]>(STORAGE_KEYS.PROFISSIONAIS, INITIAL_PROFISSIONAIS);
  }

  static saveProfissional(prof: Profissional): Profissional[] {
    const list = this.getProfissionais();
    const index = list.findIndex(p => p.id === prof.id);
    if (index >= 0) {
      list[index] = prof;
    } else {
      list.unshift(prof);
    }
    this.setItem(STORAGE_KEYS.PROFISSIONAIS, list);
    return list;
  }

  static deleteProfissional(id: string): Profissional[] {
    const list = this.getProfissionais().filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PROFISSIONAIS, list);
    return list;
  }

  // Salas
  static getSalas(): Sala[] {
    return this.getItem<Sala[]>(STORAGE_KEYS.SALAS, INITIAL_SALAS);
  }

  static saveSala(sala: Sala): Sala[] {
    const list = this.getSalas();
    const index = list.findIndex(s => s.id === sala.id);
    if (index >= 0) {
      list[index] = sala;
    } else {
      list.unshift(sala);
    }
    this.setItem(STORAGE_KEYS.SALAS, list);
    return list;
  }

  static deleteSala(id: string): Sala[] {
    const list = this.getSalas().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.SALAS, list);
    return list;
  }

  // Agendas
  static getAgendas(): Agenda[] {
    return this.getItem<Agenda[]>(STORAGE_KEYS.AGENDAS, INITIAL_AGENDAS);
  }

  static saveAgenda(agenda: Agenda): Agenda[] {
    const list = this.getAgendas();
    const index = list.findIndex(a => a.id === agenda.id);
    if (index >= 0) {
      list[index] = agenda;
    } else {
      list.unshift(agenda);
    }
    this.setItem(STORAGE_KEYS.AGENDAS, list);
    return list;
  }

  static updateAgendaStatus(id: string, status: StatusAgendamento): Agenda[] {
    const list = this.getAgendas();
    const target = list.find(a => a.id === id);
    if (target) {
      target.status = status;
      this.setItem(STORAGE_KEYS.AGENDAS, list);
    }
    return list;
  }

  static deleteAgenda(id: string): Agenda[] {
    const list = this.getAgendas().filter(a => a.id !== id);
    this.setItem(STORAGE_KEYS.AGENDAS, list);
    return list;
  }

  // Prontuarios
  static getProntuarios(): Prontuario[] {
    return this.getItem<Prontuario[]>(STORAGE_KEYS.PRONTUARIOS, INITIAL_PRONTUARIOS);
  }

  static saveProntuario(prontuario: Prontuario): Prontuario[] {
    const list = this.getProntuarios();
    const index = list.findIndex(p => p.id === prontuario.id);
    if (index >= 0) {
      list[index] = prontuario;
    } else {
      list.unshift(prontuario);
    }
    this.setItem(STORAGE_KEYS.PRONTUARIOS, list);
    return list;
  }

  static deleteProntuario(id: string): Prontuario[] {
    const list = this.getProntuarios().filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PRONTUARIOS, list);
    return list;
  }

  // Backend config
  static getBackendConfig(): BackendConfig {
    return this.getItem<BackendConfig>(STORAGE_KEYS.BACKEND_CONFIG, {
      useRealApi: false,
      apiUrl: 'http://localhost:8080/api',
      jwtToken: ''
    });
  }

  static setBackendConfig(config: BackendConfig): void {
    this.setItem(STORAGE_KEYS.BACKEND_CONFIG, config);
  }

  // Auth User Session
  static getAuthUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (!data) return null;
      return JSON.parse(data) as AuthUser;
    } catch {
      return null;
    }
  }

  static setAuthUser(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }

  static logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }

  // Reset to initial mock data
  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.PACIENTES);
    localStorage.removeItem(STORAGE_KEYS.PROFISSIONAIS);
    localStorage.removeItem(STORAGE_KEYS.SALAS);
    localStorage.removeItem(STORAGE_KEYS.AGENDAS);
    localStorage.removeItem(STORAGE_KEYS.PRONTUARIOS);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }
}
