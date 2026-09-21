import React, { useState } from 'react';
import { ViewTab, Agenda, Paciente, Profissional, Sala, Prontuario, StatusAgendamento, BackendConfig, AuthUser } from './types';
import { ClinicStorageService } from './services/clinicStorage';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AgendaView } from './components/AgendaView';
import { PacientesView } from './components/PacientesView';
import { ProntuarioView } from './components/ProntuarioView';
import { ProfissionaisView } from './components/ProfissionaisView';
import { SalasView } from './components/SalasView';
import { RelatoriosView } from './components/RelatoriosView';
import { ModalNovoAgendamento } from './components/ModalNovoAgendamento';
import { JavaBackendModal } from './components/JavaBackendModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => ClinicStorageService.getAuthUser());

  // Application Data States
  const [pacientes, setPacientes] = useState<Paciente[]>(() => ClinicStorageService.getPacientes());
  const [profissionais, setProfissionais] = useState<Profissional[]>(() => ClinicStorageService.getProfissionais());
  const [salas, setSalas] = useState<Sala[]>(() => ClinicStorageService.getSalas());
  const [agendas, setAgendas] = useState<Agenda[]>(() => ClinicStorageService.getAgendas());
  const [prontuarios, setProntuarios] = useState<Prontuario[]>(() => ClinicStorageService.getProntuarios());
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(() => ClinicStorageService.getBackendConfig());

  // Modal States
  const [isNovoAgendamentoOpen, setIsNovoAgendamentoOpen] = useState(false);
  const [novoAgendamentoDate, setNovoAgendamentoDate] = useState<string | undefined>();
  const [novoAgendamentoPacId, setNovoAgendamentoPacId] = useState<string | undefined>();
  const [isJavaModalOpen, setIsJavaModalOpen] = useState(false);
  const [prontuarioPacienteFilter, setProntuarioPacienteFilter] = useState<string>('TODOS');

  // Agenda Actions
  const handleUpdateStatus = (id: string, status: StatusAgendamento) => {
    const updated = ClinicStorageService.updateAgendaStatus(id, status);
    setAgendas([...updated]);
  };

  const handleSaveAgenda = (agenda: Agenda) => {
    const updated = ClinicStorageService.saveAgenda(agenda);
    setAgendas([...updated]);
  };

  // Pacientes Actions
  const handleSavePaciente = (paciente: Paciente) => {
    const updated = ClinicStorageService.savePaciente(paciente);
    setPacientes([...updated]);
  };

  const handleDeletePaciente = (id: string) => {
    const updated = ClinicStorageService.deletePaciente(id);
    setPacientes([...updated]);
  };

  // Profissionais Actions
  const handleSaveProfissional = (prof: Profissional) => {
    const updated = ClinicStorageService.saveProfissional(prof);
    setProfissionais([...updated]);
  };

  const handleDeleteProfissional = (id: string) => {
    const updated = ClinicStorageService.deleteProfissional(id);
    setProfissionais([...updated]);
  };

  // Salas Actions
  const handleSaveSala = (sala: Sala) => {
    const updated = ClinicStorageService.saveSala(sala);
    setSalas([...updated]);
  };

  const handleDeleteSala = (id: string) => {
    const updated = ClinicStorageService.deleteSala(id);
    setSalas([...updated]);
  };

  // Prontuarios Actions
  const handleSaveProntuario = (pront: Prontuario) => {
    const updated = ClinicStorageService.saveProntuario(pront);
    setProntuarios([...updated]);
  };

  const handleDeleteProntuario = (id: string) => {
    const updated = ClinicStorageService.deleteProntuario(id);
    setProntuarios([...updated]);
  };

  // Quick navigation helpers
  const handleOpenProntuarioDoPaciente = (pacienteId: string) => {
    setProntuarioPacienteFilter(pacienteId);
    setCurrentTab('prontuarios');
  };

  const handleOpenNovoAgendamento = (initialDateTime?: string) => {
    setNovoAgendamentoDate(initialDateTime);
    setNovoAgendamentoPacId(undefined);
    setIsNovoAgendamentoOpen(true);
  };

  const handleOpenNovoAgendamentoParaPaciente = (pacienteId: string) => {
    setNovoAgendamentoDate(undefined);
    setNovoAgendamentoPacId(pacienteId);
    setIsNovoAgendamentoOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    ClinicStorageService.setAuthUser(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    ClinicStorageService.logoutUser();
    setCurrentUser(null);
  };

  // If not authenticated, display authentication screen
  if (!currentUser) {
    return (
      <>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onOpenJavaModal={() => setIsJavaModalOpen(true)}
        />
        <JavaBackendModal
          isOpen={isJavaModalOpen}
          onClose={() => setIsJavaModalOpen(false)}
          config={backendConfig}
          onSaveConfig={(cfg) => {
            ClinicStorageService.setBackendConfig(cfg);
            setBackendConfig(cfg);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased">
      {/* Lateral Left Sidebar (Desktop Fixed + Mobile Slide-over Drawer) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'prontuarios') {
            setProntuarioPacienteFilter('TODOS');
          }
        }}
        onOpenNovoAgendamento={() => handleOpenNovoAgendamento()}
        onOpenJavaModal={() => setIsJavaModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {/* Top Navbar */}
        <TopNav
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNovoAgendamento={() => handleOpenNovoAgendamento()}
          onNavigateToDashboard={() => setCurrentTab('dashboard')}
          currentUser={currentUser}
        />

        {/* Dynamic Views Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              pacientes={pacientes}
              profissionais={profissionais}
              salas={salas}
              agendas={agendas}
              onUpdateStatus={handleUpdateStatus}
              onOpenNovoAgendamento={handleOpenNovoAgendamento}
              onOpenNovoPaciente={() => setCurrentTab('pacientes')}
              onOpenProntuarioDoPaciente={handleOpenProntuarioDoPaciente}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'relatorios' && (
            <RelatoriosView
              agendas={agendas}
              salas={salas}
              profissionais={profissionais}
            />
          )}

          {currentTab === 'agenda' && (
            <AgendaView
              agendas={agendas}
              pacientes={pacientes}
              profissionais={profissionais}
              salas={salas}
              onUpdateStatus={handleUpdateStatus}
              onOpenNovoAgendamento={handleOpenNovoAgendamento}
              onOpenProntuarioDoPaciente={handleOpenProntuarioDoPaciente}
            />
          )}

          {currentTab === 'pacientes' && (
            <PacientesView
              pacientes={pacientes}
              agendas={agendas}
              prontuarios={prontuarios}
              onSavePaciente={handleSavePaciente}
              onDeletePaciente={handleDeletePaciente}
              onOpenNovoAgendamentoParaPaciente={handleOpenNovoAgendamentoParaPaciente}
              onOpenNovoProntuarioParaPaciente={handleOpenProntuarioDoPaciente}
            />
          )}

          {currentTab === 'prontuarios' && (
            <ProntuarioView
              prontuarios={prontuarios}
              pacientes={pacientes}
              profissionais={profissionais}
              onSaveProntuario={handleSaveProntuario}
              onDeleteProntuario={handleDeleteProntuario}
              initialPacienteFilter={prontuarioPacienteFilter}
            />
          )}

          {currentTab === 'profissionais' && (
            <ProfissionaisView
              profissionais={profissionais}
              onSaveProfissional={handleSaveProfissional}
              onDeleteProfissional={handleDeleteProfissional}
            />
          )}

          {currentTab === 'salas' && (
            <SalasView
              salas={salas}
              agendas={agendas}
              onSaveSala={handleSaveSala}
              onDeleteSala={handleDeleteSala}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              Clínica Multi © {new Date().getFullYear()} • Sistema Especializado de Saúde e Terapias Integradas
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsJavaModalOpen(true)}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Mapeamento Java / Spring Boot
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  if (confirm('Deseja restaurar todos os dados para o padrão de demonstração?')) {
                    ClinicStorageService.resetToDefault();
                    window.location.reload();
                  }
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Restaurar Dados Demo
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal: Novo Agendamento */}
      <ModalNovoAgendamento
        isOpen={isNovoAgendamentoOpen}
        onClose={() => setIsNovoAgendamentoOpen(false)}
        onSave={handleSaveAgenda}
        pacientes={pacientes}
        profissionais={profissionais}
        salas={salas}
        existingAgendas={agendas}
        initialDateTime={novoAgendamentoDate}
        initialPacienteId={novoAgendamentoPacId}
      />

      {/* Modal: Guia Java Backend / Spring Boot */}
      <JavaBackendModal
        isOpen={isJavaModalOpen}
        onClose={() => setIsJavaModalOpen(false)}
        config={backendConfig}
        onSaveConfig={(cfg) => {
          ClinicStorageService.setBackendConfig(cfg);
          setBackendConfig(cfg);
        }}
      />
    </div>
  );
}
