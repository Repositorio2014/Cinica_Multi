import React from 'react';
import { ViewTab, AuthUser } from '../types';
import { Logo } from './Logo';
import { 
  Calendar, 
  Users, 
  FileText, 
  UserCheck, 
  DoorOpen, 
  LayoutDashboard, 
  Plus, 
  Server,
  LogOut,
  ShieldCheck,
  Stethoscope,
  ChevronDown,
  BarChart3
} from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenNovoAgendamento: () => void;
  onOpenJavaModal: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNovoAgendamento,
  onOpenJavaModal,
  currentUser,
  onLogout
}) => {
  const tabs: { id: ViewTab; label: string; icon: React.ReactNode; roles?: string[] }[] = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'agenda', label: 'Agenda & Sessões', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pacientes', label: 'Pacientes', icon: <Users className="w-4 h-4" /> },
    { id: 'prontuarios', label: 'Prontuário (PEP)', icon: <FileText className="w-4 h-4" /> },
    { id: 'profissionais', label: 'Corpo Clínico', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'salas', label: 'Salas & Espaços', icon: <DoorOpen className="w-4 h-4" /> },
  ];

  const dataAtualFormatada = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Top Banner / Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 border-b border-slate-100 py-2">
          {/* Authentic Logo */}
          <div className="flex items-center gap-4">
            <Logo size="md" showSubtitle={true} />
            <div className="hidden lg:block border-l border-slate-200 pl-4 py-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {dataAtualFormatada}
              </span>
              <span className="text-xs text-fuchsia-800 font-bold">
                Gestão Multidisciplinar Integrada
              </span>
            </div>
          </div>

          {/* Right Header: Actions + Current User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Java Integration Guide Button */}
            <button
              id="btn-java-integration"
              onClick={onOpenJavaModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors shadow-2xs"
              title="Mapeamento e arquitetura Java + Spring Boot do repositório"
            >
              <Server className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">Java / Spring Boot</span>
            </button>

            {/* Quick Action Button */}
            <button
              id="btn-header-novo-agendamento"
              onClick={onOpenNovoAgendamento}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-fuchsia-700 to-pink-600 hover:from-fuchsia-800 hover:to-pink-700 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Sessão</span>
            </button>

            {/* User Profile Card & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0"
                  style={{ backgroundColor: currentUser.avatarCor || '#c026d3' }}
                  title={`${currentUser.nome} (${currentUser.role})`}
                >
                  {currentUser.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                      {currentUser.nome}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-fuchsia-800 block">
                    {currentUser.role === 'ROLE_ADMIN' ? 'Administrador' :
                     currentUser.role === 'ROLE_TERAPEUTA' ? 'Terapeuta' : 'Recepção'}
                  </span>
                </div>

                <button
                  id="btn-header-logout"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                  title="Sair do Sistema (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none" aria-label="Abas de navegação">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-fuchsia-50 text-fuchsia-900 font-bold border border-fuchsia-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-fuchsia-700' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
