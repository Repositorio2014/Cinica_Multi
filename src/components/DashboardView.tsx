import React, { useState } from 'react';
import { Agenda, Paciente, Profissional, Sala, StatusAgendamento, TipoEspecialidade } from '../types';
import { ESPECIALIDADES_INFO, STATUS_AGENDAMENTO_INFO } from '../data/constants';
import { RelatoriosView } from './RelatoriosView';
import { 
  CalendarCheck, 
  Users, 
  DoorOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText,
  Plus,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  BarChart3
} from 'lucide-react';

interface DashboardViewProps {
  agendas: Agenda[];
  pacientes: Paciente[];
  profissionais: Profissional[];
  salas: Sala[];
  onUpdateStatus: (id: string, status: StatusAgendamento) => void;
  onOpenNovoAgendamento: () => void;
  onOpenNovoPaciente: () => void;
  onOpenProntuarioDoPaciente: (pacienteId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  agendas,
  pacientes,
  profissionais,
  salas,
  onUpdateStatus,
  onOpenNovoAgendamento,
  onOpenNovoPaciente,
  onOpenProntuarioDoPaciente,
  onNavigateToTab
}) => {
  // Filter appointments for today
  const hoje = new Date();
  const hojeStr = hoje.toISOString().split('T')[0];

  const agendasHoje = agendas.filter(a => a.dataHoraInicio.startsWith(hojeStr)).sort((a, b) => 
    new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime()
  );

  const totalHoje = agendasHoje.length;
  const atendidosHoje = agendasHoje.filter(a => a.status === StatusAgendamento.ATENDIDO).length;
  const confirmadosHoje = agendasHoje.filter(a => a.status === StatusAgendamento.CONFIRMADO).length;
  const faltasHoje = agendasHoje.filter(a => a.status === StatusAgendamento.FALTA).length;

  const faturamentoHoje = agendasHoje
    .filter(a => a.status !== StatusAgendamento.CANCELADO)
    .reduce((sum, a) => sum + (a.valorCobrado || 0), 0);

  // Group by specialty
  const specialtyCounts: Partial<Record<TipoEspecialidade, number>> = {};
  agendas.forEach(a => {
    specialtyCounts[a.especialidade] = (specialtyCounts[a.especialidade] || 0) + 1;
  });

  const [subTab, setSubTab] = useState<'visao_geral' | 'relatorios'>('visao_geral');

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-fuchsia-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-fuchsia-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Glow sutil de fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-fuchsia-200 text-xs font-semibold mb-2 backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            Visão Multidisciplinar Integrada
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Painel da Clínica Multi
          </h2>
          <p className="text-sm text-fuchsia-100/80 mt-1 max-w-xl">
            Acompanhe o fluxo diário de sessões, ocupação de salas de integração e registros evolutivos dos pacientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            id="btn-dash-novo-paciente"
            onClick={onOpenNovoPaciente}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
          >
            <Users className="w-4 h-4" />
            Cadastrar Paciente
          </button>
          <button
            id="btn-dash-nova-sessao"
            onClick={onOpenNovoAgendamento}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 text-white transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Agendar Sessão
          </button>
        </div>
      </div>

      {/* Abas Internas do Dashboard: Visão Geral vs Relatórios Recharts */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          id="btn-subtab-visao-geral"
          onClick={() => setSubTab('visao_geral')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'visao_geral'
              ? 'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Visão Geral do Dia
        </button>
        <button
          id="btn-subtab-relatorios"
          onClick={() => setSubTab('relatorios')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'relatorios'
              ? 'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Relatórios & Gráficos
          <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white rounded-full font-bold">
            Recharts
          </span>
        </button>
      </div>

      {subTab === 'relatorios' ? (
        <RelatoriosView
          agendas={agendas}
          salas={salas}
          profissionais={profissionais}
        />
      ) : (
        <>
          {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sessões Hoje */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-fuchsia-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sessões Hoje
            </span>
            <div className="w-9 h-9 rounded-lg bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalHoje}</span>
            <span className="text-xs text-slate-500">
              ({atendidosHoje} atendidos • {confirmadosHoje} confirmados)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {faltasHoje > 0 ? (
              <span className="text-amber-600 font-medium">{faltasHoje} falta registrada</span>
            ) : (
              <span className="text-emerald-600 font-medium">Nenhuma falta hoje</span>
            )}
          </div>
        </div>

        {/* Card 2: Pacientes Ativos */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pacientes Ativos
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{pacientes.filter(p => p.ativo).length}</span>
            <span className="text-xs text-slate-500">em acompanhamento</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {pacientes.filter(p => p.nomeResponsavel).length} com responsáveis legais
          </div>
        </div>

        {/* Card 3: Salas & Estrutura */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Espaços Terapêuticos
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{salas.length}</span>
            <span className="text-xs text-slate-500">salas especializadas</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            T.O., Fonoaudiologia, Ludoterapia, etc.
          </div>
        </div>

        {/* Card 4: Faturamento Diário */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Previsão do Dia
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamentoHoje)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {profissionais.length} terapeutas e médicos cadastrados
          </div>
        </div>
      </div>

      {/* Main Grid: Atendimentos de Hoje + Especialidades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atendimentos do Dia (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Sessões Agendadas para Hoje
              </h3>
              <p className="text-xs text-slate-500">
                Alocação por profissional, espaço e status de atendimento
              </p>
            </div>
            <button
              id="btn-ver-agenda-completa"
              onClick={() => onNavigateToTab('agenda')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Ver agenda completa <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {agendasHoje.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">Nenhum atendimento agendado para hoje.</p>
                <button
                  onClick={onOpenNovoAgendamento}
                  className="mt-3 text-xs text-teal-700 font-semibold underline"
                >
                  Agendar agora
                </button>
              </div>
            ) : (
              agendasHoje.map((agenda) => {
                const specInfo = ESPECIALIDADES_INFO[agenda.especialidade];
                const statusInfo = STATUS_AGENDAMENTO_INFO[agenda.status];
                const horaInicio = new Date(agenda.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const horaFim = new Date(agenda.dataHoraFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={agenda.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 rounded-lg px-2 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Horário */}
                      <div className="w-14 shrink-0 text-center py-1 px-1.5 bg-slate-100 rounded-lg text-slate-700">
                        <span className="text-xs font-bold block">{horaInicio}</span>
                        <span className="text-[10px] text-slate-500">{horaFim}</span>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">
                            {agenda.pacienteNome}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${specInfo.corBg} ${specInfo.corTexto} ${specInfo.corBorda}`}>
                            {specInfo.nome}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Terapeuta: <span className="font-medium text-slate-700">{agenda.profissionalNome}</span>
                          {agenda.salaNome && <> • <span>{agenda.salaNome}</span></>}
                        </p>
                        {agenda.observacoes && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                            "{agenda.observacoes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                        {statusInfo.label}
                      </span>

                      {/* Quick Status toggle dropdown or buttons */}
                      <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                        <button
                          title="Marcar Atendido"
                          onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.ATENDIDO)}
                          className={`p-1 rounded-md text-xs transition-colors ${
                            agenda.status === StatusAgendamento.ATENDIDO
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Confirmar Presença"
                          onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.CONFIRMADO)}
                          className={`p-1 rounded-md text-xs transition-colors ${
                            agenda.status === StatusAgendamento.CONFIRMADO
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50'
                          }`}
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Registrar Falta"
                          onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.FALTA)}
                          className={`p-1 rounded-md text-xs transition-colors ${
                            agenda.status === StatusAgendamento.FALTA
                              ? 'bg-amber-600 text-white'
                              : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Cancelar"
                          onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.CANCELADO)}
                          className={`p-1 rounded-md text-xs transition-colors ${
                            agenda.status === StatusAgendamento.CANCELADO
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-500 hover:text-rose-700 hover:bg-rose-50'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Open Patient Chart */}
                      <button
                        title="Ver Prontuário do Paciente"
                        onClick={() => onOpenProntuarioDoPaciente(agenda.pacienteId)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Info: Especialidades e Equipe */}
        <div className="space-y-6">
          {/* Especialidades Integradas */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Especialidades Terapêuticas
            </h3>
            <div className="space-y-2">
              {Object.values(ESPECIALIDADES_INFO).map(esp => {
                const count = specialtyCounts[esp.codigo] || 0;
                return (
                  <div key={esp.codigo} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${esp.corBg} border ${esp.corBorda}`} />
                      <span className="font-medium text-slate-700">{esp.nome}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {count} {count === 1 ? 'sessão' : 'sessões'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ocupação dos Espaços Terapêuticos */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Espaços e Salas
              </h3>
              <button 
                onClick={() => onNavigateToTab('salas')}
                className="text-xs text-teal-700 font-semibold"
              >
                Gerenciar
              </button>
            </div>
            <div className="space-y-2.5">
              {salas.map(sala => {
                // Find if this room is in use right now
                const nowIso = new Date().toISOString();
                const emUso = agendas.some(a => 
                  a.salaId === sala.id && 
                  a.status !== StatusAgendamento.CANCELADO &&
                  a.dataHoraInicio <= nowIso &&
                  a.dataHoraFim >= nowIso
                );

                return (
                  <div key={sala.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">
                        {sala.nome}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        emUso 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {emUso ? 'Em atendimento' : 'Livre'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {sala.descricao}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
