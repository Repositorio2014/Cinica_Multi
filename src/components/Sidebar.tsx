import React from 'react';
import { ViewTab, AuthUser } from '../types';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  BarChart3, 
  Calendar, 
  Users, 
  FileText, 
  UserCheck, 
  DoorOpen, 
  Plus, 
  Server, 
  LogOut, 
  X,
  Sparkles,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenNovoAgendamento: () => void;
  onOpenJavaModal: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenNovoAgendamento,
  onOpenJavaModal,
  currentUser,
  onLogout,
  isMobileOpen,
  onCloseMobile
}) => {
  const tabs: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'relatorios', label: 'Relatórios & Gráficos', icon: <BarChart3 className="w-4 h-4" />, badge: 'Recharts' },
    { id: 'agenda', label: 'Agenda & Sessões', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pacientes', label: 'Pacientes', icon: <Users className="w-4 h-4" /> },
    { id: 'prontuarios', label: 'Prontuário (PEP)', icon: <FileText className="w-4 h-4" /> },
    { id: 'profissionais', label: 'Corpo Clínico', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'salas', label: 'Salas & Espaços', icon: <DoorOpen className="w-4 h-4" /> },
  ];

  const handleSelectTab = (tabId: ViewTab) => {
    onTabChange(tabId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Top Header / Logo - Clickable to Home / Dashboard */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={() => handleSelectTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer text-left hover:opacity-85 transition-opacity group focus:outline-none"
          title="Ir para o Dashboard Principal / Tela Inicial"
          aria-label="Ir para a Tela Inicial"
        >
          <Logo size="sm" showSubtitle={true} />
        </button>
        
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Button: Nova Sessão */}
      <div className="p-4 border-b border-slate-100">
        <button
          id="btn-sidebar-novo-agendamento"
          onClick={() => {
            onOpenNovoAgendamento();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Sessão</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Módulos Clínicos
        </div>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`sidebar-tab-${tab.id}`}
              onClick={() => handleSelectTab(tab.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-fuchsia-50 text-fuchsia-900 font-bold border border-fuchsia-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-fuchsia-700' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: Java Backend Modal + Current User */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        {/* Java / Spring Boot Button */}
        <button
          onClick={() => {
            onOpenJavaModal();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
          title="Arquitetura Java (Spring Boot) & JHipster"
        >
          <Server className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">Java / Spring Boot API</span>
        </button>

        {/* User Profile & Logout */}
        {currentUser && (
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0"
                style={{ backgroundColor: currentUser.avatarCor || '#c026d3' }}
              >
                {currentUser.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.nome}
                </p>
                <p className="text-[10px] font-semibold text-fuchsia-700 truncate">
                  {currentUser.role === 'ROLE_ADMIN' ? 'Administrador' :
                   currentUser.role === 'ROLE_TERAPEUTA' ? 'Terapeuta' : 'Recepção'}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
              title="Sair do sistema (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (w-64 fixed on md+) */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Visible when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
