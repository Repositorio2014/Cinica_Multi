import React, { useState } from 'react';
import { Prontuario, Paciente, Profissional, TipoEspecialidade, TipoProntuario } from '../types';
import { ESPECIALIDADES_INFO, TIPO_PRONTUARIO_INFO } from '../data/constants';
import { Logo } from './Logo';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  Lock, 
  Unlock, 
  Printer, 
  Calendar, 
  User, 
  Sparkles, 
  CheckCircle2, 
  X,
  Stethoscope,
  Trash2
} from 'lucide-react';

interface ProntuarioViewProps {
  prontuarios: Prontuario[];
  pacientes: Paciente[];
  profissionais: Profissional[];
  onSaveProntuario: (p: Prontuario) => void;
  onDeleteProntuario: (id: string) => void;
  initialPacienteFilter?: string;
}

export const ProntuarioView: React.FC<ProntuarioViewProps> = ({
  prontuarios,
  pacientes,
  profissionais,
  onSaveProntuario,
  onDeleteProntuario,
  initialPacienteFilter
}) => {
  const [filterPaciente, setFilterPaciente] = useState<string>(initialPacienteFilter || 'TODOS');
  const [filterEspecialidade, setFilterEspecialidade] = useState<string>('TODAS');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovoModal, setShowNovoModal] = useState(false);
  const [selectedProntuarioForPrint, setSelectedProntuarioForPrint] = useState<Prontuario | null>(null);

  // New Prontuario Form State
  const [novoForm, setNovoForm] = useState<Partial<Prontuario>>({
    tipo: TipoProntuario.EVOLUCAO,
    titulo: '',
    conteudo: '',
    confidencial: false,
    especialidade: TipoEspecialidade.TERAPIA_OCUPACIONAL,
    resumoEvolucao: {
      objetivos: '',
      atividades: '',
      respostaPaciente: '',
      orientacoesCasa: ''
    }
  });

  // Filtered records
  const filteredRecords = prontuarios.filter(record => {
    if (filterPaciente !== 'TODOS' && record.pacienteId !== filterPaciente) return false;
    if (filterEspecialidade !== 'TODAS' && record.especialidade !== filterEspecialidade) return false;
    if (filterTipo !== 'TODOS' && record.tipo !== filterTipo) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = record.titulo.toLowerCase().includes(term);
      const matchContent = record.conteudo.toLowerCase().includes(term);
      const matchPac = record.pacienteNome.toLowerCase().includes(term);
      const matchProf = record.profissionalNome.toLowerCase().includes(term);
      if (!matchTitle && !matchContent && !matchPac && !matchProf) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.dataAtendimento).getTime() - new Date(a.dataAtendimento).getTime());

  const handleOpenNovo = (pacId?: string) => {
    const defaultPac = pacId && pacId !== 'TODOS' 
      ? pacientes.find(p => p.id === pacId) 
      : pacientes[0];

    const defaultProf = profissionais[0];

    setNovoForm({
      id: 'pront-' + Date.now(),
      tipo: TipoProntuario.EVOLUCAO,
      titulo: 'Evolução Clínica de ' + (defaultProf ? defaultProf.especialidades[0] : 'Terapia'),
      conteudo: '',
      confidencial: false,
      pacienteId: defaultPac?.id || '',
      pacienteNome: defaultPac?.nome || '',
      profissionalId: defaultProf?.id || '',
      profissionalNome: defaultProf?.nome || '',
      especialidade: defaultProf?.especialidades[0] || TipoEspecialidade.TERAPIA_OCUPACIONAL,
      dataAtendimento: new Date().toISOString(),
      resumoEvolucao: {
        objetivos: '',
        atividades: '',
        respostaPaciente: '',
        orientacoesCasa: ''
      }
    });
    setShowNovoModal(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoForm.pacienteId || !novoForm.profissionalId || !novoForm.titulo || !novoForm.conteudo) {
      alert('Preencha os campos obrigatórios (Paciente, Profissional, Título e Relato Clínico).');
      return;
    }

    const pac = pacientes.find(p => p.id === novoForm.pacienteId);
    const prof = profissionais.find(p => p.id === novoForm.profissionalId);

    const saved: Prontuario = {
      id: novoForm.id || 'pront-' + Date.now(),
      tipo: novoForm.tipo || TipoProntuario.EVOLUCAO,
      dataAtendimento: novoForm.dataAtendimento || new Date().toISOString(),
      titulo: novoForm.titulo,
      conteudo: novoForm.conteudo,
      confidencial: novoForm.confidencial ?? false,
      pacienteId: novoForm.pacienteId,
      pacienteNome: pac?.nome || novoForm.pacienteNome || 'Paciente',
      profissionalId: novoForm.profissionalId,
      profissionalNome: prof?.nome || novoForm.profissionalNome || 'Profissional',
      especialidade: novoForm.especialidade || prof?.especialidades[0] || TipoEspecialidade.OUTRA,
      resumoEvolucao: novoForm.resumoEvolucao
    };

    onSaveProntuario(saved);
    setShowNovoModal(false);
  };

  const handlePrint = (pront: Prontuario) => {
    setSelectedProntuarioForPrint(pront);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            Prontuário Eletrônico Multidisciplinar (PEP)
          </h2>
          <p className="text-xs text-slate-500">
            Histórico integrado compartilhado entre fonoaudiólogos, psicólogos, terapeutas ocupacionais e médicos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenNovo(filterPaciente)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Evolução / Laudo</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
          <Filter className="w-3.5 h-3.5" />
          Filtros:
        </div>

        {/* Paciente Filter */}
        <select
          value={filterPaciente}
          onChange={(e) => setFilterPaciente(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium max-w-xs"
        >
          <option value="TODOS">Todos os Pacientes</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        {/* Especialidade Filter */}
        <select
          value={filterEspecialidade}
          onChange={(e) => setFilterEspecialidade(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium"
        >
          <option value="TODAS">Todas as Terapias</option>
          {Object.entries(ESPECIALIDADES_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.nome}</option>
          ))}
        </select>

        {/* Tipo Filter */}
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium"
        >
          <option value="TODOS">Todos os Tipos de Registro</option>
          {Object.entries(TIPO_PRONTUARIO_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.label}</option>
          ))}
        </select>

        {/* Search */}
        <div className="relative ml-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar por palavras-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 w-48 sm:w-56"
          />
        </div>
      </div>

      {/* Records Timeline Feed */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Nenhum registro encontrado para estes filtros.</p>
            <button
              onClick={() => handleOpenNovo(filterPaciente)}
              className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800"
            >
              Criar primeiro registro
            </button>
          </div>
        ) : (
          filteredRecords.map(record => {
            const specInfo = ESPECIALIDADES_INFO[record.especialidade];
            const tipoInfo = TIPO_PRONTUARIO_INFO[record.tipo];
            const dataExtensa = new Intl.DateTimeFormat('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(record.dataAtendimento));

            return (
              <div 
                key={record.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all p-5 space-y-4"
              >
                {/* Header of Record */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tipoInfo.cor}`}>
                      {tipoInfo.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${specInfo.corBg} ${specInfo.corTexto} ${specInfo.corBorda}`}>
                      {specInfo.nome}
                    </span>
                    {record.confidencial ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <Lock className="w-3 h-3" /> Restrito ao Terapeuta
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Unlock className="w-3 h-3" /> Compartilhado com Equipe
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dataExtensa}</span>

                    <button
                      onClick={() => handlePrint(record)}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-600 ml-2"
                      title="Imprimir / Exportar Relatório"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Deseja excluir este registro de prontuário?')) {
                          onDeleteProntuario(record.id);
                        }
                      }}
                      className="p-1 rounded-md hover:bg-rose-50 text-rose-600"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Patient & Therapist details */}
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400">Paciente:</span>{' '}
                    <span className="font-bold text-slate-900">{record.pacienteNome}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Responsável pelo registro:</span>{' '}
                    <span className="font-medium text-slate-800">{record.profissionalNome}</span>
                  </div>
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{record.titulo}</h4>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                    {record.conteudo}
                  </div>
                </div>

                {/* Structured Multi-Therapy Clinical Evolution Fields */}
                {record.resumoEvolucao && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    {record.resumoEvolucao.objetivos && (
                      <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-100">
                        <span className="font-bold text-teal-900 block mb-0.5">🎯 Objetivos Terapêuticos da Sessão</span>
                        <p className="text-teal-950/80">{record.resumoEvolucao.objetivos}</p>
                      </div>
                    )}
                    {record.resumoEvolucao.atividades && (
                      <div className="p-2.5 rounded-lg bg-sky-50/50 border border-sky-100">
                        <span className="font-bold text-sky-900 block mb-0.5">🧩 Atividades / Recursos Utilizados</span>
                        <p className="text-sky-950/80">{record.resumoEvolucao.atividades}</p>
                      </div>
                    )}
                    {record.resumoEvolucao.respostaPaciente && (
                      <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                        <span className="font-bold text-emerald-900 block mb-0.5">💡 Resposta e Desempenho do Paciente</span>
                        <p className="text-emerald-950/80">{record.resumoEvolucao.respostaPaciente}</p>
                      </div>
                    )}
                    {record.resumoEvolucao.orientacoesCasa && (
                      <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
                        <span className="font-bold text-amber-900 block mb-0.5">🏠 Orientações para os Pais / Escola</span>
                        <p className="text-amber-950/80">{record.resumoEvolucao.orientacoesCasa}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Nova Evolução / Laudo */}
      {showNovoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Registro de Evolução Clínica Multidisciplinar
                </h3>
                <p className="text-xs text-slate-500">
                  Documentação formal do atendimento integrado
                </p>
              </div>
              <button
                onClick={() => setShowNovoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Paciente *
                  </label>
                  <select
                    required
                    value={novoForm.pacienteId || ''}
                    onChange={(e) => {
                      const pac = pacientes.find(p => p.id === e.target.value);
                      setNovoForm({ 
                        ...novoForm, 
                        pacienteId: e.target.value,
                        pacienteNome: pac?.nome || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="">Selecione o paciente...</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Terapeuta Responsável *
                  </label>
                  <select
                    required
                    value={novoForm.profissionalId || ''}
                    onChange={(e) => {
                      const prof = profissionais.find(p => p.id === e.target.value);
                      setNovoForm({ 
                        ...novoForm, 
                        profissionalId: e.target.value,
                        profissionalNome: prof?.nome || '',
                        especialidade: prof?.especialidades[0] || TipoEspecialidade.OUTRA
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="">Selecione o terapeuta...</option>
                    {profissionais.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} ({p.registroConselho})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tipo de Registro *
                  </label>
                  <select
                    value={novoForm.tipo || TipoProntuario.EVOLUCAO}
                    onChange={(e) => setNovoForm({ ...novoForm, tipo: e.target.value as TipoProntuario })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    {Object.entries(TIPO_PRONTUARIO_INFO).map(([key, info]) => (
                      <option key={key} value={key}>{info.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Especialidade Terapêutica *
                  </label>
                  <select
                    value={novoForm.especialidade || TipoEspecialidade.TERAPIA_OCUPACIONAL}
                    onChange={(e) => setNovoForm({ ...novoForm, especialidade: e.target.value as TipoEspecialidade })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    {Object.entries(ESPECIALIDADES_INFO).map(([key, info]) => (
                      <option key={key} value={key}>{info.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título do Registro *
                </label>
                <input
                  type="text"
                  required
                  value={novoForm.titulo || ''}
                  onChange={(e) => setNovoForm({ ...novoForm, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  placeholder="Ex: Evolução de T.O. - Modulação Vestibular e Práxis"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Relato Clínico Completo *
                </label>
                <textarea
                  rows={4}
                  required
                  value={novoForm.conteudo || ''}
                  onChange={(e) => setNovoForm({ ...novoForm, conteudo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  placeholder="Descreva a conduta terapêutica detalhada, estado do paciente, cooperação, avanços e intercorrências..."
                />
              </div>

              {/* Structured Evolution Guide */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">
                  Campos Estruturados de Intervenção Multidisciplinar (Opcionais)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">
                      Objetivos Terapêuticos
                    </label>
                    <input
                      type="text"
                      value={novoForm.resumoEvolucao?.objetivos || ''}
                      onChange={(e) => setNovoForm({
                        ...novoForm,
                        resumoEvolucao: { ...novoForm.resumoEvolucao, objetivos: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                      placeholder="Ex: Estabilidade postural e foco atencional"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">
                      Atividades & Recursos
                    </label>
                    <input
                      type="text"
                      value={novoForm.resumoEvolucao?.atividades || ''}
                      onChange={(e) => setNovoForm({
                        ...novoForm,
                        resumoEvolucao: { ...novoForm.resumoEvolucao, atividades: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                      placeholder="Ex: Balanço rede, rampa proprioceptiva"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">
                      Resposta do Paciente
                    </label>
                    <input
                      type="text"
                      value={novoForm.resumoEvolucao?.respostaPaciente || ''}
                      onChange={(e) => setNovoForm({
                        ...novoForm,
                        resumoEvolucao: { ...novoForm.resumoEvolucao, respostaPaciente: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                      placeholder="Ex: Maior tolerância tátil e autorregulação"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">
                      Orientações para Casa / Família
                    </label>
                    <input
                      type="text"
                      value={novoForm.resumoEvolucao?.orientacoesCasa || ''}
                      onChange={(e) => setNovoForm({
                        ...novoForm,
                        resumoEvolucao: { ...novoForm.resumoEvolucao, orientacoesCasa: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                      placeholder="Ex: Manter rotina visual antecipatória"
                    />
                  </div>
                </div>
              </div>

              {/* Confidentiality toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-confidencial"
                  checked={novoForm.confidencial ?? false}
                  onChange={(e) => setNovoForm({ ...novoForm, confidencial: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="chk-confidencial" className="font-semibold text-slate-700">
                  Marcar como confidencial (visível apenas para este terapeuta / sigilo profissional)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNovoModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-fuchsia-700 to-pink-600 hover:from-fuchsia-800 hover:to-pink-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Salvar Registro no Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Visualização de Impressão Formal com Logo da Clínica */}
      {selectedProntuarioForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-8">
            {/* Header Documento Timbrado */}
            <div className="flex items-center justify-between border-b-2 border-fuchsia-700/20 pb-4 mb-6">
              <Logo size="md" showSubtitle={true} />
              <div className="text-right text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block text-xs">Prontuário Multidisciplinar</span>
                <span>Registro emitido em {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Dados do Paciente e Terapeuta */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-3 text-xs mb-6">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Paciente</span>
                <span className="font-bold text-slate-900 text-sm">{selectedProntuarioForPrint.pacienteNome}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Profissional / Registro</span>
                <span className="font-bold text-slate-900">{selectedProntuarioForPrint.profissionalNome}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Especialidade</span>
                <span className="font-medium text-slate-700">
                  {ESPECIALIDADES_INFO[selectedProntuarioForPrint.especialidade]?.nome || selectedProntuarioForPrint.especialidade}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Data do Atendimento</span>
                <span className="font-medium text-slate-700">
                  {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(selectedProntuarioForPrint.dataAtendimento))}
                </span>
              </div>
            </div>

            {/* Conteúdo do Registro */}
            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-1">
                {selectedProntuarioForPrint.titulo}
              </h4>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedProntuarioForPrint.conteudo}
              </p>

              {selectedProntuarioForPrint.resumoEvolucao && (
                <div className="grid grid-cols-1 gap-2 pt-2 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                  {selectedProntuarioForPrint.resumoEvolucao.objetivos && (
                    <div>
                      <strong className="text-slate-800">Objetivos Terapêuticos:</strong>{' '}
                      <span className="text-slate-600">{selectedProntuarioForPrint.resumoEvolucao.objetivos}</span>
                    </div>
                  )}
                  {selectedProntuarioForPrint.resumoEvolucao.atividades && (
                    <div>
                      <strong className="text-slate-800">Recursos e Atividades:</strong>{' '}
                      <span className="text-slate-600">{selectedProntuarioForPrint.resumoEvolucao.atividades}</span>
                    </div>
                  )}
                  {selectedProntuarioForPrint.resumoEvolucao.respostaPaciente && (
                    <div>
                      <strong className="text-slate-800">Evolução do Paciente:</strong>{' '}
                      <span className="text-slate-600">{selectedProntuarioForPrint.resumoEvolucao.respostaPaciente}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Linha de Assinatura */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
              <div>
                <span className="block text-[10px]">Autenticação Digital: {selectedProntuarioForPrint.id}</span>
                <span className="text-[10px]">Documento arquivado no prontuário eletrônico unificado</span>
              </div>
              <div className="text-center w-60">
                <div className="border-b border-slate-400 mb-1" />
                <span className="font-bold text-slate-800 block">{selectedProntuarioForPrint.profissionalNome}</span>
                <span className="text-[10px] text-slate-500">Assinatura do Profissional</span>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setSelectedProntuarioForPrint(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Fechar Visualização
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-700 to-pink-600 hover:from-fuchsia-800 hover:to-pink-700 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Imprimir Documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
