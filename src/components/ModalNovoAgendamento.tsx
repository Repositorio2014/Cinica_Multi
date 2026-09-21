import React, { useState, useEffect } from 'react';
import { Agenda, Paciente, Profissional, Sala, StatusAgendamento, TipoEspecialidade } from '../types';
import { ESPECIALIDADES_INFO } from '../data/constants';
import { X, Calendar, Clock, User, DoorOpen, DollarSign, AlertTriangle } from 'lucide-react';

interface ModalNovoAgendamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agenda: Agenda) => void;
  pacientes: Paciente[];
  profissionais: Profissional[];
  salas: Sala[];
  existingAgendas: Agenda[];
  initialDateTime?: string;
  initialPacienteId?: string;
}

export const ModalNovoAgendamento: React.FC<ModalNovoAgendamentoProps> = ({
  isOpen,
  onClose,
  onSave,
  pacientes,
  profissionais,
  salas,
  existingAgendas,
  initialDateTime,
  initialPacienteId
}) => {
  const [pacienteId, setPacienteId] = useState<string>('');
  const [profissionalId, setProfissionalId] = useState<string>('');
  const [salaId, setSalaId] = useState<string>('');
  const [especialidade, setEspecialidade] = useState<TipoEspecialidade>(TipoEspecialidade.TERAPIA_OCUPACIONAL);
  const [dataStr, setDataStr] = useState<string>('');
  const [horaInicioStr, setHoraInicioStr] = useState<string>('09:00');
  const [horaFimStr, setHoraFimStr] = useState<string>('09:50');
  const [valorCobrado, setValorCobrado] = useState<number>(200);
  const [observacoes, setObservacoes] = useState<string>('');
  const [status, setStatus] = useState<StatusAgendamento>(StatusAgendamento.CONFIRMADO);
  const [conflitoMensagem, setConflitoMensagem] = useState<string | null>(null);

  // Initialize values when opened
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      let initialDate = today;
      let initialTime = '09:00';

      if (initialDateTime) {
        if (initialDateTime.includes('T')) {
          const parts = initialDateTime.split('T');
          initialDate = parts[0];
          initialTime = parts[1].substring(0, 5) || '09:00';
        } else {
          initialDate = initialDateTime;
        }
      }

      setDataStr(initialDate);
      setHoraInicioStr(initialTime);

      // Add 50 minutes for standard session
      const [h, m] = initialTime.split(':').map(Number);
      const totalMin = h * 60 + m + 50;
      const endH = String(Math.floor(totalMin / 60)).padStart(2, '0');
      const endM = String(totalMin % 60).padStart(2, '0');
      setHoraFimStr(`${endH}:${endM}`);

      const firstProf = profissionais[0];
      setProfissionalId(firstProf ? firstProf.id : '');
      if (firstProf) {
        setEspecialidade(firstProf.especialidades[0] || TipoEspecialidade.OUTRA);
        setValorCobrado(firstProf.valorSessao || 200);
      }

      setSalaId(salas[0]?.id || '');
      setPacienteId(initialPacienteId || pacientes[0]?.id || '');
      setObservacoes('');
      setStatus(StatusAgendamento.CONFIRMADO);
      setConflitoMensagem(null);
    }
  }, [isOpen, initialDateTime, initialPacienteId, profissionais, pacientes, salas]);

  // Check conflicts
  useEffect(() => {
    if (!dataStr || !horaInicioStr || !horaFimStr) return;

    const startIso = `${dataStr}T${horaInicioStr}:00`;
    const endIso = `${dataStr}T${horaFimStr}:00`;

    // Check therapist conflict
    const profConflict = existingAgendas.find(a => 
      a.profissionalId === profissionalId &&
      a.status !== StatusAgendamento.CANCELADO &&
      a.dataHoraInicio < endIso &&
      a.dataHoraFim > startIso
    );

    if (profConflict) {
      setConflitoMensagem(`Atenção: O profissional já possui atendimento agendado com ${profConflict.pacienteNome} neste mesmo horário.`);
      return;
    }

    // Check room conflict
    if (salaId) {
      const roomConflict = existingAgendas.find(a => 
        a.salaId === salaId &&
        a.status !== StatusAgendamento.CANCELADO &&
        a.dataHoraInicio < endIso &&
        a.dataHoraFim > startIso
      );

      if (roomConflict) {
        setConflitoMensagem(`Atenção: A sala selecionada já estará ocupada (${roomConflict.profissionalNome} com ${roomConflict.pacienteNome}).`);
        return;
      }
    }

    setConflitoMensagem(null);
  }, [dataStr, horaInicioStr, horaFimStr, profissionalId, salaId, existingAgendas]);

  if (!isOpen) return null;

  const handleProfChange = (profId: string) => {
    setProfissionalId(profId);
    const prof = profissionais.find(p => p.id === profId);
    if (prof) {
      setEspecialidade(prof.especialidades[0] || TipoEspecialidade.OUTRA);
      setValorCobrado(prof.valorSessao || 200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !profissionalId || !dataStr || !horaInicioStr || !horaFimStr) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const pac = pacientes.find(p => p.id === pacienteId);
    const prof = profissionais.find(p => p.id === profissionalId);
    const sala = salas.find(s => s.id === salaId);

    const newAgenda: Agenda = {
      id: 'ag-' + Date.now(),
      dataHoraInicio: `${dataStr}T${horaInicioStr}:00`,
      dataHoraFim: `${dataStr}T${horaFimStr}:00`,
      status,
      observacoes: observacoes.trim(),
      valorCobrado: Number(valorCobrado) || 0,
      pacienteId,
      pacienteNome: pac?.nome || 'Paciente',
      profissionalId,
      profissionalNome: prof?.nome || 'Profissional',
      salaId: sala?.id,
      salaNome: sala?.nome,
      especialidade
    };

    onSave(newAgenda);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Agendar Nova Sessão Terapêutica
              </h3>
              <p className="text-xs text-slate-500">
                Alocação multidisciplinar de horário e espaço clínico
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {conflitoMensagem && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{conflitoMensagem}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Paciente */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Paciente *
            </label>
            <select
              required
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="">Selecione o paciente...</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} {p.nomeResponsavel ? `(Resp: ${p.nomeResponsavel})` : ''} - {p.convenio || 'Particular'}
                </option>
              ))}
            </select>
          </div>

          {/* Profissional e Especialidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Terapeuta Responsável *
              </label>
              <select
                required
                value={profissionalId}
                onChange={(e) => handleProfChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="">Selecione o profissional...</option>
                {profissionais.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.registroConselho})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Especialidade da Sessão *
              </label>
              <select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value as TipoEspecialidade)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {Object.entries(ESPECIALIDADES_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sala */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Espaço / Sala Terapêutica
            </label>
            <select
              value={salaId}
              onChange={(e) => setSalaId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="">Sem sala específica designada</option>
              {salas.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          {/* Data e Horários */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data do Atendimento *
              </label>
              <input
                type="date"
                required
                value={dataStr}
                onChange={(e) => setDataStr(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Horário de Início *
              </label>
              <input
                type="time"
                required
                value={horaInicioStr}
                onChange={(e) => {
                  setHoraInicioStr(e.target.value);
                  const [h, m] = e.target.value.split(':').map(Number);
                  const totalMin = h * 60 + m + 50;
                  const endH = String(Math.floor(totalMin / 60)).padStart(2, '0');
                  const endM = String(totalMin % 60).padStart(2, '0');
                  setHoraFimStr(`${endH}:${endM}`);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Horário de Término *
              </label>
              <input
                type="time"
                required
                value={horaFimStr}
                onChange={(e) => setHoraFimStr(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Valor e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Valor Cobrado da Sessão (R$)
              </label>
              <input
                type="number"
                value={valorCobrado}
                onChange={(e) => setValorCobrado(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusAgendamento)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value={StatusAgendamento.CONFIRMADO}>Confirmado</option>
                <option value={StatusAgendamento.AGENDADO}>Agendado (Aguardando Confirmação)</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Observações / Objetivos da Sessão
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="Ex: Sessão para avaliação de integração sensorial, trazer brinquedo de transição..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-xs"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
