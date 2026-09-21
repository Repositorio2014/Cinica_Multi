import React, { useState } from 'react';
import { Sala, Agenda, StatusAgendamento } from '../types';
import { 
  DoorOpen, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  X,
  PackageCheck,
  Search,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

interface SalasViewProps {
  salas: Sala[];
  agendas: Agenda[];
  onSaveSala: (sala: Sala) => void;
  onDeleteSala: (id: string) => void;
}

export const SalasView: React.FC<SalasViewProps> = ({
  salas,
  agendas,
  onSaveSala,
  onDeleteSala
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSala, setEditingSala] = useState<Partial<Sala>>({});
  const [novoRecursoInput, setNovoRecursoInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');

  const hojeStr = new Date().toISOString().split('T')[0];

  const filteredSalas = salas.filter(sala => {
    const term = searchTerm.toLowerCase();
    const matchName = sala.nome.toLowerCase().includes(term);
    const matchDesc = sala.descricao ? sala.descricao.toLowerCase().includes(term) : false;
    const matchRecursos = sala.recursos?.some(r => r.toLowerCase().includes(term));
    return matchName || matchDesc || matchRecursos;
  });

  const handleOpenNovo = () => {
    setEditingSala({
      id: 'sala-' + Date.now(),
      nome: '',
      descricao: '',
      capacidade: 2,
      recursos: [],
      ativo: true
    });
    setNovoRecursoInput('');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (s: Sala) => {
    setEditingSala({ ...s });
    setNovoRecursoInput('');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddRecurso = () => {
    if (!novoRecursoInput.trim()) return;
    const current = editingSala.recursos || [];
    setEditingSala({
      ...editingSala,
      recursos: [...current, novoRecursoInput.trim()]
    });
    setNovoRecursoInput('');
  };

  const handleRemoveRecurso = (index: number) => {
    const current = editingSala.recursos || [];
    setEditingSala({
      ...editingSala,
      recursos: current.filter((_, i) => i !== index)
    });
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSala.nome) {
      alert('Informe o nome da sala.');
      return;
    }

    const saved: Sala = {
      id: editingSala.id || 'sala-' + Date.now(),
      nome: editingSala.nome,
      descricao: editingSala.descricao || '',
      capacidade: Number(editingSala.capacidade) || 2,
      recursos: editingSala.recursos || [],
      ativo: editingSala.ativo ?? true
    };

    onSaveSala(saved);
    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center font-bold">
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Salas & Estrutura Terapêutica
              </h2>
              <p className="text-xs text-slate-500">
                Visualização em Data Grid de salas equipadas, ocupação diária e recursos
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
              placeholder="Buscar sala, recurso, equipamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 w-full sm:w-64"
            />
          </div>

          {/* Mode Switcher */}
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

          {/* Nova Sala */}
          <button
            onClick={handleOpenNovo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Sala</span>
          </button>
        </div>
      </div>

      {filteredSalas.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <DoorOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">Nenhuma sala encontrada</p>
          <p className="text-xs text-slate-400 mt-1">Verifique o termo digitado ou cadastre um novo espaço terapêutico.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* DATA GRID / TABELA EMPRESARIAL */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider select-none">
                <tr>
                  <th className="py-3.5 px-4">Espaço / Sala</th>
                  <th className="py-3.5 px-3">Capacidade</th>
                  <th className="py-3.5 px-3">Recursos & Equipamentos Instalados</th>
                  <th className="py-3.5 px-3 text-center">Atendimentos Hoje</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSalas.map((sala) => {
                  const bookingsHoje = agendas.filter(a => 
                    a.salaId === sala.id && 
                    a.dataHoraInicio.startsWith(hojeStr) &&
                    a.status !== StatusAgendamento.CANCELADO
                  );

                  return (
                    <tr
                      key={sala.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Sala Nome & Descrição */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center font-bold shadow-2xs shrink-0">
                            <DoorOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {sala.nome}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1 max-w-[240px]">
                              {sala.descricao || 'Ambiente terapêutico multifuncional'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Capacidade */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          {sala.capacidade} pessoa(s)
                        </span>
                      </td>

                      {/* Recursos & Equipamentos */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[320px]">
                          {sala.recursos && sala.recursos.length > 0 ? (
                            sala.recursos.map((rec, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200"
                              >
                                {rec}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Mobiliário clínico padrão</span>
                          )}
                        </div>
                      </td>

                      {/* Atendimentos Hoje */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bookingsHoje.length > 0
                            ? 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {bookingsHoje.length} sessão(ões)
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sala.ativo ?? true
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {sala.ativo ?? true ? 'Disponível' : 'Inativa'}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(sala)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-fuchsia-700 hover:bg-fuchsia-50 transition-colors cursor-pointer"
                            title="Editar Sala"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja remover a sala ${sala.nome}?`)) {
                                onDeleteSala(sala.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total de <strong>{filteredSalas.length}</strong> salas e ambientes configurados</span>
            <span className="text-[11px] text-slate-400">Salas com infraestrutura sensorial e acústica</span>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSalas.map(sala => {
            const bookingsHoje = agendas.filter(a => 
              a.salaId === sala.id && 
              a.dataHoraInicio.startsWith(hojeStr) &&
              a.status !== StatusAgendamento.CANCELADO
            ).sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

            return (
              <div 
                key={sala.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-fuchsia-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{sala.nome}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          sala.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sala.ativo ? 'Disponível' : 'Inativa'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {sala.descricao}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(sala)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja remover a sala ${sala.nome}?`)) {
                            onDeleteSala(sala.id);
                          }
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Capacidade: <strong>{sala.capacidade} pessoa(s)</strong> simultaneamente</span>
                  </div>

                  {sala.recursos && sala.recursos.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Recursos & Equipamentos:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sala.recursos.map((rec, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200"
                          >
                            <PackageCheck className="w-3 h-3 text-purple-600" />
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold flex items-center gap-1 text-slate-700">
                      <Clock className="w-3 h-3 text-fuchsia-700" />
                      Ocupação Hoje:
                    </span>
                    <span className="font-bold text-fuchsia-700">
                      {bookingsHoje.length} sessão(ões)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit Sala */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {isEditing ? 'Editar Sala Terapêutica' : 'Cadastrar Nova Sala'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome da Sala / Ambiente *
                </label>
                <input
                  type="text"
                  required
                  value={editingSala.nome || ''}
                  onChange={(e) => setEditingSala({ ...editingSala, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  placeholder="Ex: Sala 01 - Integração Sensorial e Psicomotricidade"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição e Finalidade Clínica
                </label>
                <textarea
                  rows={2}
                  value={editingSala.descricao || ''}
                  onChange={(e) => setEditingSala({ ...editingSala, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  placeholder="Espaço acolchoado com balanços suspensos, piscina de bolinhas e túneis..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Capacidade Máxima Simultânea (Pessoas)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={editingSala.capacidade || 2}
                  onChange={(e) => setEditingSala({ ...editingSala, capacidade: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recursos & Equipamentos Especiais
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={novoRecursoInput}
                    onChange={(e) => setNovoRecursoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRecurso();
                      }
                    }}
                    placeholder="Ex: Balanço suspenso, espelho acústico..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddRecurso}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {(editingSala.recursos || []).map((rec, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 text-[11px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md"
                    >
                      {rec}
                      <button
                        type="button"
                        onClick={() => handleRemoveRecurso(index)}
                        className="text-purple-400 hover:text-purple-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-sala-ativo"
                  checked={editingSala.ativo ?? true}
                  onChange={(e) => setEditingSala({ ...editingSala, ativo: e.target.checked })}
                  className="rounded text-fuchsia-600 focus:ring-fuchsia-500 h-4 w-4"
                />
                <label htmlFor="chk-sala-ativo" className="text-xs font-semibold text-slate-700">
                  Sala Disponível para Agendamento
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Salvar Sala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
