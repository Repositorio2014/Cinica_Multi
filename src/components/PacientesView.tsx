import React, { useState } from 'react';
import { Paciente, Agenda, Prontuario, StatusAgendamento } from '../types';
import { ESPECIALIDADES_INFO, STATUS_AGENDAMENTO_INFO, TIPO_PRONTUARIO_INFO } from '../data/constants';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  Edit3, 
  Trash2, 
  X, 
  UserCheck, 
  AlertCircle,
  Clock,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  ExternalLink,
  Eye,
  Filter
} from 'lucide-react';

interface PacientesViewProps {
  pacientes: Paciente[];
  agendas: Agenda[];
  prontuarios: Prontuario[];
  onSavePaciente: (p: Paciente) => void;
  onDeletePaciente: (id: string) => void;
  onOpenNovoAgendamentoParaPaciente: (pacienteId: string) => void;
  onOpenNovoProntuarioParaPaciente: (pacienteId: string) => void;
}

export const PacientesView: React.FC<PacientesViewProps> = ({
  pacientes,
  agendas,
  prontuarios,
  onSavePaciente,
  onDeletePaciente,
  onOpenNovoAgendamentoParaPaciente,
  onOpenNovoProntuarioParaPaciente
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Paciente>>({});
  const [showNovoModal, setShowNovoModal] = useState(false);
  
  // Default to Grid / Tabela as explicitly requested by user
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  // Filter patients
  const filteredPacientes = pacientes.filter(p => {
    if (filtroStatus === 'ativos' && !p.ativo) return false;
    if (filtroStatus === 'inativos' && p.ativo) return false;

    const term = searchTerm.toLowerCase();
    const matchName = p.nome.toLowerCase().includes(term);
    const matchCpf = p.cpf.toLowerCase().includes(term);
    const matchResp = p.nomeResponsavel ? p.nomeResponsavel.toLowerCase().includes(term) : false;
    const matchConvenio = p.convenio ? p.convenio.toLowerCase().includes(term) : false;
    const matchObs = p.observacoes ? p.observacoes.toLowerCase().includes(term) : false;
    return matchName || matchCpf || matchResp || matchConvenio || matchObs;
  });

  // Calculate age from birth date
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    return `${years} anos`;
  };

  const handleOpenNovo = () => {
    setEditingData({
      id: 'pac-' + Date.now(),
      nome: '',
      cpf: '',
      dataNascimento: '2018-01-01',
      telefone: '',
      email: '',
      nomeResponsavel: '',
      telefoneResponsavel: '',
      endereco: '',
      convenio: 'Particular',
      observacoes: '',
      ativo: true
    });
    setIsEditing(false);
    setShowNovoModal(true);
  };

  const handleOpenEdit = (p: Paciente) => {
    setEditingData({ ...p });
    setIsEditing(true);
    setShowNovoModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingData.nome || !editingData.cpf || !editingData.telefone) {
      alert('Por favor, preencha os campos obrigatórios (Nome, CPF e Telefone).');
      return;
    }
    const saved: Paciente = {
      id: editingData.id || 'pac-' + Date.now(),
      nome: editingData.nome,
      cpf: editingData.cpf,
      dataNascimento: editingData.dataNascimento || '2018-01-01',
      telefone: editingData.telefone,
      email: editingData.email || '',
      nomeResponsavel: editingData.nomeResponsavel || '',
      telefoneResponsavel: editingData.telefoneResponsavel || '',
      endereco: editingData.endereco || '',
      convenio: editingData.convenio || 'Particular',
      observacoes: editingData.observacoes || '',
      ativo: editingData.ativo ?? true
    };
    onSavePaciente(saved);
    if (selectedPaciente?.id === saved.id) {
      setSelectedPaciente(saved);
    }
    setShowNovoModal(false);
  };

  // Cores de avatar consistentes para os pacientes
  const getAvatarBg = (nome: string) => {
    const cores = ['#c026d3', '#db2777', '#9333ea', '#4f46e5', '#0284c7', '#0d9488'];
    const charCode = nome.charCodeAt(0) || 0;
    return cores[charCode % cores.length];
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Search / Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Cadastro Geral de Pacientes
              </h2>
              <p className="text-xs text-slate-500">
                Visualização em Data Grid com prontuário integrado e histórico clínico
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, responsável, convênio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 w-full sm:w-64"
            />
          </div>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as any)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos ({pacientes.length})</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>

          {/* Alternador de Modo: Grid (Tabela) vs Cards */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-fuchsia-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Exibição em Tabela Data Grid"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-fuchsia-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Exibição em Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>

          {/* Botão Novo Paciente */}
          <button
            onClick={handleOpenNovo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Paciente</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Data Grid or Cards */}
        <div className={selectedPaciente ? 'lg:col-span-7' : 'lg:col-span-12'}>
          {filteredPacientes.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Nenhum paciente localizado</p>
              <p className="text-xs text-slate-400 mt-1">Verifique o termo pesquisado ou cadastre um novo paciente.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* DATA GRID / TABELA EMPRESARIAL */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider select-none">
                    <tr>
                      <th className="py-3.5 px-4">Paciente</th>
                      <th className="py-3.5 px-3">CPF</th>
                      <th className="py-3.5 px-3">Contato & Responsável</th>
                      <th className="py-3.5 px-3">Convênio</th>
                      <th className="py-3.5 px-3">Hipótese / Diagnóstico</th>
                      <th className="py-3.5 px-3 text-center">Sessões</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPacientes.map((paciente) => {
                      const isSelected = selectedPaciente?.id === paciente.id;
                      const age = calculateAge(paciente.dataNascimento);
                      const totalSessoes = agendas.filter(a => a.pacienteId === paciente.id).length;
                      const avatarBg = getAvatarBg(paciente.nome);

                      return (
                        <tr
                          key={paciente.id}
                          onClick={() => setSelectedPaciente(paciente)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-fuchsia-50/70 border-l-4 border-l-fuchsia-600'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {/* Coluna 1: Paciente */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0"
                                style={{ backgroundColor: avatarBg }}
                              >
                                {paciente.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                                  {paciente.nome}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {age} • Nasc: {paciente.dataNascimento.split('-').reverse().join('/')}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Coluna 2: CPF */}
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                            {paciente.cpf}
                          </td>

                          {/* Coluna 3: Contato & Responsável */}
                          <td className="py-3 px-3">
                            <div className="min-w-0 max-w-[170px]">
                              <span className="font-semibold text-slate-800 block truncate text-[11px]">
                                {paciente.telefone}
                              </span>
                              {paciente.nomeResponsavel && (
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {paciente.nomeResponsavel}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Coluna 4: Convênio */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {paciente.convenio || 'Particular'}
                            </span>
                          </td>

                          {/* Coluna 5: Diagnóstico / Hipótese */}
                          <td className="py-3 px-3">
                            <p 
                              className="text-[11px] text-slate-600 line-clamp-2 max-w-[200px]"
                              title={paciente.observacoes || 'Sem observações'}
                            >
                              {paciente.observacoes || 'Acompanhamento integrado'}
                            </p>
                          </td>

                          {/* Coluna 6: Sessões */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200">
                              {totalSessoes}
                            </span>
                          </td>

                          {/* Coluna 7: Status */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              paciente.ativo
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {paciente.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>

                          {/* Coluna 8: Ações Rápidas */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onOpenNovoProntuarioParaPaciente(paciente.id)}
                                className="p-1.5 rounded-lg text-fuchsia-700 hover:bg-fuchsia-100/70 transition-colors"
                                title="Abrir Prontuário (PEP)"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onOpenNovoAgendamentoParaPaciente(paciente.id)}
                                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100/70 transition-colors"
                                title="Agendar Sessão"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(paciente)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                title="Editar Cadastro"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja remover o paciente ${paciente.nome}?`)) {
                                    onDeletePaciente(paciente.id);
                                    if (selectedPaciente?.id === paciente.id) setSelectedPaciente(null);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedPaciente(paciente)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-fuchsia-700 hover:bg-fuchsia-50 transition-colors"
                                title="Ver Dossiê Completo"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grid Footer Counter */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Exibindo <strong>{filteredPacientes.length}</strong> de {pacientes.length} pacientes</span>
                <span className="text-[11px] text-slate-400">Clique na linha para visualizar prontuários e agendamentos</span>
              </div>
            </div>
          ) : (
            /* CARDS VIEW (OPÇÃO ALTERNATIVA) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPacientes.map(paciente => {
                const isSelected = selectedPaciente?.id === paciente.id;
                const age = calculateAge(paciente.dataNascimento);
                const totalSessoes = agendas.filter(a => a.pacienteId === paciente.id).length;

                return (
                  <div
                    key={paciente.id}
                    onClick={() => setSelectedPaciente(paciente)}
                    className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-fuchsia-600 ring-2 ring-fuchsia-600/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {paciente.nome}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {age} • Nasc: {paciente.dataNascimento.split('-').reverse().join('/')}
                        </p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        paciente.ativo ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {paciente.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{paciente.telefone}</span>
                      </div>
                      {paciente.nomeResponsavel && (
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{paciente.nomeResponsavel}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Convênio: {paciente.convenio || 'Particular'}</span>
                      </div>
                    </div>

                    {paciente.observacoes && (
                      <p className="text-xs text-slate-500 mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 line-clamp-2">
                        {paciente.observacoes}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {totalSessoes} sessões registradas
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenNovoProntuarioParaPaciente(paciente.id);
                        }}
                        className="text-fuchsia-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Ver prontuário →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Patient Dossier (when selected) */}
        {selectedPaciente && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            {/* Dossier Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-fuchsia-700 uppercase tracking-wider block">
                  Dossiê Clínico do Paciente
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedPaciente.nome}
                </h3>
                <p className="text-xs text-slate-500">
                  CPF: {selectedPaciente.cpf} • {calculateAge(selectedPaciente.dataNascimento)}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(selectedPaciente)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Editar Dados"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Deseja remover o paciente ${selectedPaciente.nome}?`)) {
                      onDeletePaciente(selectedPaciente.id);
                      setSelectedPaciente(null);
                    }
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPaciente(null)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 cursor-pointer"
                  title="Fechar Painel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action buttons for this patient */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenNovoAgendamentoParaPaciente(selectedPaciente.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-fuchsia-50 text-fuchsia-800 hover:bg-fuchsia-100 border border-fuchsia-200 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-fuchsia-700" />
                Agendar Sessão
              </button>
              <button
                onClick={() => onOpenNovoProntuarioParaPaciente(selectedPaciente.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 text-pink-800 hover:bg-pink-100 border border-pink-200 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-pink-700" />
                Nova Evolução PEP
              </button>
            </div>

            {/* Clinical Overview / Diagnostics */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Hipóteses Diagnósticas & Observações Multidisciplinares
              </div>
              <p className="text-xs text-amber-950/80 leading-relaxed">
                {selectedPaciente.observacoes || 'Nenhuma observação clínica preliminar registrada.'}
              </p>
              {selectedPaciente.nomeResponsavel && (
                <p className="text-xs text-amber-900 pt-1 font-medium">
                  Responsável Legal: {selectedPaciente.nomeResponsavel} • Tel: {selectedPaciente.telefoneResponsavel || selectedPaciente.telefone}
                </p>
              )}
            </div>

            {/* Multidisciplinary Medical Record (Prontuário Integrado) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-fuchsia-700" />
                Linha do Tempo de Evoluções Multidisciplinares
              </h4>

              {(() => {
                const pacProntuarios = prontuarios.filter(p => p.pacienteId === selectedPaciente.id);
                if (pacProntuarios.length === 0) {
                  return (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                      Nenhum registro de evolução ou anamnese para este paciente ainda.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {pacProntuarios.map(pront => {
                      const specInfo = ESPECIALIDADES_INFO[pront.especialidade];
                      const tipoInfo = TIPO_PRONTUARIO_INFO[pront.tipo];
                      const dataFormatada = new Date(pront.dataAtendimento).toLocaleDateString('pt-BR');

                      return (
                        <div key={pront.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tipoInfo.cor}`}>
                                {tipoInfo.label}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${specInfo.corBg} ${specInfo.corTexto} ${specInfo.corBorda}`}>
                                {specInfo.nome}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {dataFormatada} • {pront.profissionalNome}
                            </span>
                          </div>

                          <h5 className="font-bold text-slate-900 text-xs">{pront.titulo}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {pront.conteudo}
                          </p>

                          {pront.resumoEvolucao?.orientacoesCasa && (
                            <div className="text-[11px] text-fuchsia-900 bg-fuchsia-50/70 p-2 rounded-lg border border-fuchsia-100">
                              <span className="font-bold">Orientações para os pais/casa:</span> {pront.resumoEvolucao.orientacoesCasa}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Historical Sessions (Agendas) */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-fuchsia-700" />
                Histórico de Sessões Agendadas
              </h4>

              {(() => {
                const pacAgendas = agendas.filter(a => a.pacienteId === selectedPaciente.id);
                if (pacAgendas.length === 0) {
                  return (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                      Nenhuma sessão agendada.
                    </div>
                  );
                }

                return (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {pacAgendas.map(ag => {
                      const stInfo = STATUS_AGENDAMENTO_INFO[ag.status];
                      const dataFormatada = new Date(ag.dataHoraInicio).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <div key={ag.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {dataFormatada} • {ag.profissionalNome}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {ag.salaNome || 'Sala não definida'}
                            </span>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stInfo.bg} ${stInfo.text}`}>
                            {stInfo.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Cadastro / Edição de Paciente */}
      {showNovoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Editar Dados do Paciente' : 'Novo Paciente da Clínica'}
              </h3>
              <button
                onClick={() => setShowNovoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo do Paciente *
                </label>
                <input
                  type="text"
                  required
                  value={editingData.nome || ''}
                  onChange={(e) => setEditingData({ ...editingData, nome: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  placeholder="ex: João Silva Santos"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingData.cpf || ''}
                    onChange={(e) => setEditingData({ ...editingData, cpf: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingData.dataNascimento || '2018-01-01'}
                    onChange={(e) => setEditingData({ ...editingData, dataNascimento: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telefone de Contato (WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingData.telefone || ''}
                    onChange={(e) => setEditingData({ ...editingData, telefone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="(11) 98765-4321"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={editingData.email || ''}
                    onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="contato@familia.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome do Responsável Legal (Mãe/Pai)
                  </label>
                  <input
                    type="text"
                    value={editingData.nomeResponsavel || ''}
                    onChange={(e) => setEditingData({ ...editingData, nomeResponsavel: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="ex: Maria da Silva"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Convênio / Plano de Saúde
                  </label>
                  <input
                    type="text"
                    value={editingData.convenio || ''}
                    onChange={(e) => setEditingData({ ...editingData, convenio: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="Unimed, Bradesco ou Particular"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hipóteses Diagnósticas & Observações Multidisciplinares
                </label>
                <textarea
                  rows={3}
                  value={editingData.observacoes || ''}
                  onChange={(e) => setEditingData({ ...editingData, observacoes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  placeholder="Diagnóstico preliminar, histórico de desenvolvimento e objetivos terapêuticos..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-ativo"
                  checked={editingData.ativo ?? true}
                  onChange={(e) => setEditingData({ ...editingData, ativo: e.target.checked })}
                  className="rounded text-fuchsia-600 focus:ring-fuchsia-500 h-4 w-4"
                />
                <label htmlFor="chk-ativo" className="text-xs font-semibold text-slate-700">
                  Paciente Ativo (pode receber novos agendamentos)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNovoModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
