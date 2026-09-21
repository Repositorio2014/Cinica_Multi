import React from 'react';
import { ViewTab, AuthUser } from '../types';
import { Logo } from './Logo';
import { Menu, Plus, Calendar, Sparkles, LayoutDashboard, ChevronRight } from 'lucide-react';

interface TopNavProps {
  currentTab: ViewTab;
  onOpenMobileMenu: () => void;
  onOpenNovoAgendamento: () => void;
  onNavigateToDashboard?: () => void;
  currentUser: AuthUser | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenNovoAgendamento,
  onNavigateToDashboard,
  currentUser
}) => {
  const tabTitles: Record<ViewTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Principal', subtitle: 'Visão executiva diária e indicadores clínicos' },
    relatorios: { title: 'Relatórios & Gráficos', subtitle: 'Ocupação de salas e volume diário de atendimentos' },
    agenda: { title: 'Agenda & Sessões', subtitle: 'Grade de horários, turnos e confirmações' },
    pacientes: { title: 'Cadastro de Pacientes', subtitle: 'Histórico terapêutico, responsáveis e prontuário integrado' },
    prontuarios: { title: 'Prontuário Eletrônico (PEP)', subtitle: 'Evoluções clínicas, laudos e anamneses multidisciplinares' },
    profissionais: { title: 'Corpo Clínico & Terapeutas', subtitle: 'Equipe multidisciplinar e conselhos de classe' },
    salas: { title: 'Salas & Espaços Terapêuticos', subtitle: 'Salas equipadas, integração sensorial e ocupação' }
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Clínica Multi', subtitle: 'Saúde Integrada' };

  const dataAtualFormatada = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Mobile Hamburger + Branding */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5 text-slate-800" />
          </button>
          
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity focus:outline-none text-left"
            title="Ir para o Dashboard Principal / Tela Inicial"
          >
            <img 
              src="/logo_arvore_mult.png" 
              alt="Logo Clínica Multi" 
              className="h-8 w-auto object-contain"
            />
            <span className="font-extrabold text-sm text-slate-900 tracking-tight font-serif">
              Clínica Multi
            </span>
          </button>
        </div>

        {/* Desktop View Title & Breadcrumb */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-2">
            {currentTab !== 'dashboard' && onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className="inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-700 hover:text-fuchsia-800 hover:underline cursor-pointer mr-1"
                title="Voltar para o Dashboard Principal"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Início</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200">
              Integrada
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {currentInfo.subtitle}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 capitalize">
            <Calendar className="w-3.5 h-3.5 text-fuchsia-700" />
            {dataAtualFormatada}
          </span>

          <button
            onClick={onOpenNovoAgendamento}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Sessão</span>
            <span className="sm:hidden">Sessão</span>
          </button>

          {/* User badge on mobile */}
          {currentUser && (
            <div 
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0"
              style={{ backgroundColor: currentUser.avatarCor || '#c026d3' }}
              title={currentUser.nome}
            >
              {currentUser.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
