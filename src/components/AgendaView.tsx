import React, { useState } from 'react';
import { Agenda, Paciente, Profissional, Sala, StatusAgendamento, TipoEspecialidade } from '../types';
import { ESPECIALIDADES_INFO, STATUS_AGENDAMENTO_INFO } from '../data/constants';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  CalendarCheck,
  FileText,
  User,
  DoorOpen,
  Columns,
  List,
  Sparkles
} from 'lucide-react';

interface AgendaViewProps {
  agendas: Agenda[];
  pacientes: Paciente[];
  profissionais: Profissional[];
  salas: Sala[];
  onUpdateStatus: (id: string, status: StatusAgendamento) => void;
  onOpenNovoAgendamento: (initialDate?: string, initialProf?: string, initialSala?: string) => void;
  onOpenProntuarioDoPaciente: (pacienteId: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  agendas,
  profissionais,
  salas,
  onUpdateStatus,
  onOpenNovoAgendamento,
  onOpenProntuarioDoPaciente
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [viewMode, setViewMode] = useState<'timeline' | 'therapist' | 'list'>('timeline');
  const [filterEspecialidade, setFilterEspecialidade] = useState<string>('TODAS');
  const [filterProfissional, setFilterProfissional] = useState<string>('TODOS');
  const [filterSala, setFilterSala] = useState<string>('TODAS');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');

  // Change date helpers
  const handleDateShift = (days: number) => {
    const current = new Date(selectedDate + 'T12:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Filter agendas for this date
  const filteredAgendas = agendas.filter(agenda => {
    const isDateMatch = agenda.dataHoraInicio.startsWith(selectedDate);
    if (!isDateMatch) return false;

    if (filterEspecialidade !== 'TODAS' && agenda.especialidade !== filterEspecialidade) return false;
    if (filterProfissional !== 'TODOS' && agenda.profissionalId !== filterProfissional) return false;
    if (filterSala !== 'TODAS' && agenda.salaId !== filterSala) return false;
    if (filterStatus !== 'TODOS' && agenda.status !== filterStatus) return false;

    return true;
  }).sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

  // Hours array from 08:00 to 18:00
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  };

  return (
    <div className="space-y-5">
      {/* Top Controls: Date Navigator & View Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDateShift(-1)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSetToday}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hoje
          </button>

          <button
            onClick={() => handleDateShift(1)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Próximo dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="relative ml-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-600 cursor-pointer"
            />
          </div>

          <span className="text-sm font-bold text-slate-800 ml-2 capitalize hidden sm:inline-block">
            {formatDisplayDate(selectedDate)}
          </span>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Linha do Tempo
            </button>
            <button
              onClick={() => setViewMode('therapist')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'therapist'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Por Terapeuta
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Lista
            </button>
          </div>

          <button
            onClick={() => onOpenNovoAgendamento(selectedDate)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Sessão</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
          <Filter className="w-3.5 h-3.5" />
          Filtros:
        </div>

        {/* Especialidade Filter */}
        <select
          value={filterEspecialidade}
          onChange={(e) => setFilterEspecialidade(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium"
        >
          <option value="TODAS">Todas as Especialidades</option>
          {Object.entries(ESPECIALIDADES_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.nome}</option>
          ))}
        </select>

        {/* Profissional Filter */}
        <select
          value={filterProfissional}
          onChange={(e) => setFilterProfissional(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium"
        >
          <option value="TODOS">Todos os Terapeutas</option>
          {profissionais.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        {/* Sala Filter */}
        <select
          value={filterSala}
          onChange={(e) => setFilterSala(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium"
        >
          <option value="TODAS">Todas as Salas</option>
          {salas.map(s => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium"
        >
          <option value="TODOS">Todos os Status</option>
          {Object.entries(STATUS_AGENDAMENTO_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.label}</option>
          ))}
        </select>

        {(filterEspecialidade !== 'TODAS' || filterProfissional !== 'TODOS' || filterSala !== 'TODAS' || filterStatus !== 'TODOS') && (
          <button
            onClick={() => {
              setFilterEspecialidade('TODAS');
              setFilterProfissional('TODOS');
              setFilterSala('TODAS');
              setFilterStatus('TODOS');
            }}
            className="text-teal-700 hover:text-teal-900 font-semibold underline text-xs ml-auto"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Main View Area */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-700" />
              Grade de Horários do Dia ({filteredAgendas.length} sessões)
            </h3>
            <span className="text-xs text-slate-500">
              Sessões com duração padrão de 50 minutos
            </span>
          </div>

          {filteredAgendas.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <CalendarIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">Nenhuma sessão encontrada para os filtros selecionados.</p>
              <button
                onClick={() => onOpenNovoAgendamento(selectedDate)}
                className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800"
              >
                Agendar nesta data
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {hours.map(hour => {
                const hourPrefix = `${String(hour).padStart(2, '0')}:`;
                const sessaoNestaHora = filteredAgendas.filter(a => {
                  const horaStr = a.dataHoraInicio.split('T')[1] || '';
                  return horaStr.startsWith(hourPrefix);
                });

                return (
                  <div key={hour} className="flex items-start gap-4 py-2 border-b border-slate-100 last:border-0">
                    <div className="w-16 shrink-0 text-right font-mono text-xs font-semibold text-slate-400 pt-2">
                      {String(hour).padStart(2, '0')}:00
                    </div>

                    <div className="flex-1 space-y-2">
                      {sessaoNestaHora.length === 0 ? (
                        <div 
                          onClick={() => onOpenNovoAgendamento(`${selectedDate}T${String(hour).padStart(2, '0')}:00`)}
                          className="h-9 border border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 rounded-lg flex items-center px-3 text-slate-400 text-xs cursor-pointer group transition-colors"
                        >
                          <span className="group-hover:text-teal-700 font-medium flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Horário disponível — clique para agendar
                          </span>
                        </div>
                      ) : (
                        sessaoNestaHora.map(agenda => {
                          const specInfo = ESPECIALIDADES_INFO[agenda.especialidade];
                          const statusInfo = STATUS_AGENDAMENTO_INFO[agenda.status];
                          const hInicio = agenda.dataHoraInicio.split('T')[1].substring(0, 5);
                          const hFim = agenda.dataHoraFim.split('T')[1].substring(0, 5);

                          return (
                            <div 
                              key={agenda.id}
                              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-white hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold text-center shrink-0">
                                  {hInicio} - {hFim}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-slate-900 text-sm">
                                      {agenda.pacienteNome}
                                    </h4>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${specInfo.corBg} ${specInfo.corTexto} ${specInfo.corBorda}`}>
                                      {specInfo.nome}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <User className="w-3.5 h-3.5 text-slate-400" />
                                      {agenda.profissionalNome}
                                    </span>
                                    {agenda.salaNome && (
                                      <span className="flex items-center gap-1">
                                      <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                                      {agenda.salaNome}
                                    </span>
                                    )}
                                  </div>
                                  {agenda.observacoes && (
                                    <p className="text-xs text-slate-500 mt-1 italic">
                                      "{agenda.observacoes}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                  {statusInfo.label}
                                </span>

                                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                                  <button
                                    title="Marcar Atendido"
                                    onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.ATENDIDO)}
                                    className={`p-1 rounded-md text-xs transition-colors ${agenda.status === StatusAgendamento.ATENDIDO ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-emerald-700'}`}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    title="Confirmar"
                                    onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.CONFIRMADO)}
                                    className={`p-1 rounded-md text-xs transition-colors ${agenda.status === StatusAgendamento.CONFIRMADO ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-blue-700'}`}
                                  >
                                    <CalendarCheck className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    title="Falta"
                                    onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.FALTA)}
                                    className={`p-1 rounded-md text-xs transition-colors ${agenda.status === StatusAgendamento.FALTA ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-amber-700'}`}
                                  >
                                    <AlertCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    title="Cancelar"
                                    onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.CANCELADO)}
                                    className={`p-1 rounded-md text-xs transition-colors ${agenda.status === StatusAgendamento.CANCELADO ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-rose-700'}`}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <button
                                  title="Abrir Prontuário do Paciente"
                                  onClick={() => onOpenProntuarioDoPaciente(agenda.pacienteId)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 hover:text-teal-700 hover:bg-teal-50"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Prontuário</span>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Therapist Column View */}
      {viewMode === 'therapist' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-5 gap-3 pb-4 border-b border-slate-200">
              {profissionais.map(prof => (
                <div key={prof.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center mx-auto mb-1">
                    {prof.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prof.nome}</h4>
                  <p className="text-[10px] text-slate-500">{prof.registroConselho}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-3 mt-4">
              {profissionais.map(prof => {
                const sessoesProf = filteredAgendas.filter(a => a.profissionalId === prof.id);

                return (
                  <div key={prof.id} className="space-y-2 min-h-[300px] bg-slate-50/50 p-2 rounded-xl border border-dashed border-slate-200">
                    {sessoesProf.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 text-xs">
                        Sem sessões hoje
                      </div>
                    ) : (
                      sessoesProf.map(a => {
                        const statusInfo = STATUS_AGENDAMENTO_INFO[a.status];
                        const hInicio = a.dataHoraInicio.split('T')[1].substring(0, 5);
                        return (
                          <div key={a.id} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-teal-800">{hInicio}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="font-bold text-slate-800 line-clamp-1">{a.pacienteNome}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{a.salaNome || 'Sem sala'}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Horário</th>
                  <th className="py-3 px-4">Paciente</th>
                  <th className="py-3 px-4">Especialidade</th>
                  <th className="py-3 px-4">Terapeuta</th>
                  <th className="py-3 px-4">Espaço / Sala</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgendas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      Nenhum agendamento para esta data.
                    </td>
                  </tr>
                ) : (
                  filteredAgendas.map(agenda => {
                    const specInfo = ESPECIALIDADES_INFO[agenda.especialidade];
                    const statusInfo = STATUS_AGENDAMENTO_INFO[agenda.status];
                    const hInicio = agenda.dataHoraInicio.split('T')[1].substring(0, 5);
                    const hFim = agenda.dataHoraFim.split('T')[1].substring(0, 5);

                    return (
                      <tr key={agenda.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                          {hInicio} - {hFim}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {agenda.pacienteNome}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${specInfo.corBg} ${specInfo.corTexto} ${specInfo.corBorda}`}>
                            {specInfo.nome}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {agenda.profissionalNome}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {agenda.salaNome || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenProntuarioDoPaciente(agenda.pacienteId)}
                              className="p-1 rounded text-slate-500 hover:text-teal-700 hover:bg-slate-100"
                              title="Prontuário"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onUpdateStatus(agenda.id, StatusAgendamento.ATENDIDO)}
                              className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                              title="Marcar Atendido"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
