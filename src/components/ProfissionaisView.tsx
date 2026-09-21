import React, { useState } from 'react';
import { Profissional, TipoEspecialidade } from '../types';
import { ESPECIALIDADES_INFO } from '../data/constants';
import { 
  UserCheck, 
  Plus, 
  Mail, 
  Phone, 
  Award, 
  DollarSign, 
  Edit3, 
  Trash2, 
  X,
  Stethoscope,
  Search,
  Table as TableIcon,
  LayoutGrid,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface ProfissionaisViewProps {
  profissionais: Profissional[];
  onSaveProfissional: (prof: Profissional) => void;
  onDeleteProfissional: (id: string) => void;
}

export const ProfissionaisView: React.FC<ProfissionaisViewProps> = ({
  profissionais,
  onSaveProfissional,
  onDeleteProfissional
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProf, setEditingProf] = useState<Partial<Profissional>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');

  const filteredProfissionais = profissionais.filter(prof => {
    const term = searchTerm.toLowerCase();
    const matchName = prof.nome.toLowerCase().includes(term);
    const matchConselho = prof.registroConselho.toLowerCase().includes(term);
    const matchEmail = prof.email.toLowerCase().includes(term);
    const matchTel = prof.telefone.toLowerCase().includes(term);
    const matchEsp = prof.especialidades.some(e => 
      ESPECIALIDADES_INFO[e]?.nome.toLowerCase().includes(term)
    );
    return matchName || matchConselho || matchEmail || matchTel || matchEsp;
  });

  const handleOpenNovo = () => {
    setEditingProf({
      id: 'prof-' + Date.now(),
      nome: '',
      cpf: '',
      registroConselho: '',
      telefone: '',
      email: '',
      ativo: true,
      valorSessao: 200,
      especialidades: [TipoEspecialidade.PSICOLOGIA],
      cor: '#c026d3'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (p: Profissional) => {
    setEditingProf({ ...p });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProf.nome || !editingProf.cpf || !editingProf.registroConselho || !editingProf.telefone || !editingProf.email) {
      alert('Preencha os campos obrigatórios (Nome, CPF, Registro no Conselho, Telefone e E-mail).');
      return;
    }

    const saved: Profissional = {
      id: editingProf.id || 'prof-' + Date.now(),
      nome: editingProf.nome,
      cpf: editingProf.cpf,
      registroConselho: editingProf.registroConselho,
      telefone: editingProf.telefone,
      email: editingProf.email,
      ativo: editingProf.ativo ?? true,
      valorSessao: Number(editingProf.valorSessao) || 200,
      especialidades: editingProf.especialidades || [TipoEspecialidade.PSICOLOGIA],
      cor: editingProf.cor || '#c026d3'
    };

    onSaveProfissional(saved);
    setShowModal(false);
  };

  const toggleEspecialidade = (esp: TipoEspecialidade) => {
    const current = editingProf.especialidades || [];
    if (current.includes(esp)) {
      if (current.length > 1) {
        setEditingProf({ ...editingProf, especialidades: current.filter(e => e !== esp) });
      }
    } else {
      setEditingProf({ ...editingProf, especialidades: [...current, esp] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Corpo Clínico & Terapeutas
              </h2>
              <p className="text-xs text-slate-500">
                Visualização em Data Grid de conselhos de classe, especialidades e contatos
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
              placeholder="Buscar terapeuta, conselho, especialidade..."
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

          {/* Novo Profissional */}
          <button
            onClick={handleOpenNovo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Profissional</span>
          </button>
        </div>
      </div>

      {filteredProfissionais.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <UserCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">Nenhum profissional encontrado</p>
          <p className="text-xs text-slate-400 mt-1">Verifique o termo digitado ou cadastre um novo membro no corpo clínico.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* DATA GRID / TABELA EMPRESARIAL */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider select-none">
                <tr>
                  <th className="py-3.5 px-4">Profissional</th>
                  <th className="py-3.5 px-3">Conselho Regional</th>
                  <th className="py-3.5 px-3">Especialidades Multidisciplinares</th>
                  <th className="py-3.5 px-3">Contato Direto</th>
                  <th className="py-3.5 px-3">Valor / Sessão</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfissionais.map((prof) => (
                  <tr
                    key={prof.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Profissional Nome & Iniciais */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0"
                          style={{ backgroundColor: prof.cor || '#c026d3' }}
                        >
                          {prof.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {prof.nome}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            CPF: {prof.cpf}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Conselho */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Award className="w-3.5 h-3.5 text-fuchsia-700" />
                        {prof.registroConselho}
                      </span>
                    </td>

                    {/* Especialidades */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {prof.especialidades.map(esp => {
                          const specInfo = ESPECIALIDADES_INFO[esp];
                          return (
                            <span 
                              key={esp}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${specInfo.corBg} ${specInfo.corTexto} ${specInfo.corBorda}`}
                            >
                              {specInfo.nome}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Contato */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{prof.telefone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{prof.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Valor da Sessão */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-bold text-slate-900 text-xs">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prof.valorSessao || 200)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prof.ativo
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {prof.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prof)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-fuchsia-700 hover:bg-fuchsia-50 transition-colors cursor-pointer"
                          title="Editar Cadastro"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Deseja remover o profissional ${prof.nome}?`)) {
                              onDeleteProfissional(prof.id);
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total de <strong>{filteredProfissionais.length}</strong> profissionais cadastrados</span>
            <span className="text-[11px] text-slate-400">Equipe habilitada nos respectivos conselhos regionais</span>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfissionais.map(prof => (
            <div 
              key={prof.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-fuchsia-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-2xs"
                      style={{ backgroundColor: prof.cor || '#c026d3' }}
                    >
                      {prof.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{prof.nome}</h3>
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                        <Award className="w-3 h-3 text-fuchsia-700" />
                        {prof.registroConselho}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(prof)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja remover o profissional ${prof.nome}?`)) {
                          onDeleteProfissional(prof.id);
                        }
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {prof.especialidades.map(esp => {
                    const specInfo = ESPECIALIDADES_INFO[esp];
                    return (
                      <span 
                        key={esp}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${specInfo.corBg} ${specInfo.corTexto} ${specInfo.corBorda}`}
                      >
                        {specInfo.nome}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prof.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{prof.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Valor padrão da sessão:</span>
                <span className="font-bold text-slate-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prof.valorSessao || 200)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit Professional */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {isEditing ? 'Editar Terapeuta / Médico' : 'Cadastrar Novo Profissional'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome Completo com Titulação *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProf.nome || ''}
                    onChange={(e) => setEditingProf({ ...editingProf, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="Ex: Dra. Mariana Albuquerque"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProf.cpf || ''}
                    onChange={(e) => setEditingProf({ ...editingProf, cpf: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Registro de Conselho (CRM/CRP/CREFITO) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProf.registroConselho || ''}
                    onChange={(e) => setEditingProf({ ...editingProf, registroConselho: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="Ex: CRP 06/123456"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Valor Padrão da Sessão (R$)
                  </label>
                  <input
                    type="number"
                    value={editingProf.valorSessao || 200}
                    onChange={(e) => setEditingProf({ ...editingProf, valorSessao: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telefone de Contato (WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProf.telefone || ''}
                    onChange={(e) => setEditingProf({ ...editingProf, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    E-mail Profissional *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingProf.email || ''}
                    onChange={(e) => setEditingProf({ ...editingProf, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="terapeuta@clinicamulti.com.br"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Especialidades Multidisciplinares Habilitadas
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(TipoEspecialidade).map(esp => {
                    const info = ESPECIALIDADES_INFO[esp];
                    const isChecked = (editingProf.especialidades || []).includes(esp);
                    return (
                      <button
                        type="button"
                        key={esp}
                        onClick={() => toggleEspecialidade(esp)}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between text-xs transition-colors ${
                          isChecked 
                            ? 'bg-fuchsia-50 border-fuchsia-400 text-fuchsia-900 font-bold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{info.nome}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-prof-ativo"
                  checked={editingProf.ativo ?? true}
                  onChange={(e) => setEditingProf({ ...editingProf, ativo: e.target.checked })}
                  className="rounded text-fuchsia-600 focus:ring-fuchsia-500 h-4 w-4"
                />
                <label htmlFor="chk-prof-ativo" className="text-xs font-semibold text-slate-700">
                  Profissional Ativo (visível para novos agendamentos e prontuário)
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
                  Salvar Profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
