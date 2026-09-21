import React, { useState, useMemo } from 'react';
import { Agenda, Sala, Profissional, StatusAgendamento, TipoEspecialidade } from '../types';
import { ESPECIALIDADES_INFO } from '../data/constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell
} from 'recharts';
import { 
  BarChart3, 
  Calendar, 
  DoorOpen, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Users, 
  Filter, 
  Printer, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface RelatoriosViewProps {
  agendas: Agenda[];
  salas: Sala[];
  profissionais: Profissional[];
}

export const RelatoriosView: React.FC<RelatoriosViewProps> = ({
  agendas,
  salas,
  profissionais
}) => {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'todos'>('semana');
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>('todas');

  // Filtragem dos dados de agendamento baseada nos controles
  const agendasFiltradas = useMemo(() => {
    return agendas.filter((ag) => {
      if (filtroEspecialidade !== 'todas' && ag.especialidade !== filtroEspecialidade) {
        return false;
      }
      return true;
    });
  }, [agendas, filtroEspecialidade]);

  // 1. Dados para o gráfico de atendimentos por dia da semana
  const dadosAtendimentosPorDia = useMemo(() => {
    const diasSemana = [
      { id: 1, dia: 'Segunda', abreviado: 'Seg' },
      { id: 2, dia: 'Terça', abreviado: 'Ter' },
      { id: 3, dia: 'Quarta', abreviado: 'Qua' },
      { id: 4, dia: 'Quinta', abreviado: 'Qui' },
      { id: 5, dia: 'Sexta', abreviado: 'Sex' },
      { id: 6, dia: 'Sábado', abreviado: 'Sáb' },
    ];

    return diasSemana.map((d) => {
      // Filtrar sessões correspondentes ao dia da semana
      const sessoesNoDia = agendasFiltradas.filter((ag) => {
        try {
          const date = new Date(ag.dataHoraInicio);
          return date.getDay() === d.id;
        } catch {
          return false;
        }
      });

      const realizados = sessoesNoDia.filter(
        (ag) => ag.status === StatusAgendamento.ATENDIDO
      ).length;

      const agendados = sessoesNoDia.filter(
        (ag) => ag.status === StatusAgendamento.AGENDADO || ag.status === StatusAgendamento.CONFIRMADO
      ).length;

      const cancelados = sessoesNoDia.filter(
        (ag) => ag.status === StatusAgendamento.CANCELADO || ag.status === StatusAgendamento.FALTA
      ).length;

      return {
        dia: d.abreviado,
        nomeCompleto: d.dia,
        Realizados: realizados,
        Agendados: agendados,
        Cancelados: cancelados,
        Total: sessoesNoDia.length
      };
    });
  }, [agendasFiltradas]);

  // 2. Dados para o gráfico de ocupação das salas
  const dadosOcupacaoSalas = useMemo(() => {
    // Horas diárias disponíveis por sala (8h às 19h = 11h/dia x 6 dias = ~66 horas semanais)
    const horasSemanaisDisponiveis = 66;

    const coresSalas = [
      '#c026d3', // fuchsia-600
      '#db2777', // pink-600
      '#9333ea', // purple-600
      '#4f46e5', // indigo-600
      '#0284c7', // sky-600
      '#0d9488', // teal-600
      '#e11d48'  // rose-600
    ];

    return salas.map((sala, index) => {
      const sessoesNaSala = agendasFiltradas.filter((ag) => ag.salaId === sala.id);

      // Calcular tempo total ocupado em horas (estimando média de 50 min / 0.83h por sessão se não houver fim explícito)
      const horasOcupadas = sessoesNaSala.reduce((total, ag) => {
        try {
          const inicio = new Date(ag.dataHoraInicio).getTime();
          const fim = new Date(ag.dataHoraFim).getTime();
          const horas = Math.max(0.5, (fim - inicio) / (1000 * 60 * 60));
          return total + horas;
        } catch {
          return total + 0.83;
        }
      }, 0);

      // Taxa percentual de ocupação
      const taxaOcupacao = Math.min(100, Math.round((horasOcupadas / horasSemanaisDisponiveis) * 100));

      return {
        id: sala.id,
        nome: sala.nome.replace('Sala ', 'S. ').replace(' - ', ' '),
        nomeCompleto: sala.nome,
        sessoes: sessoesNaSala.length,
        horasOcupadas: Number(horasOcupadas.toFixed(1)),
        taxaOcupacao: taxaOcupacao,
        capacidade: sala.capacidade,
        cor: coresSalas[index % coresSalas.length]
      };
    });
  }, [salas, agendasFiltradas]);

  // Indicadores de Resumo (KPIs)
  const totalRealizados = useMemo(() => {
    return agendasFiltradas.filter(
      (ag) => ag.status === StatusAgendamento.ATENDIDO
    ).length;
  }, [agendasFiltradas]);

  const totalAgendados = useMemo(() => {
    return agendasFiltradas.filter(
      (ag) => ag.status === StatusAgendamento.AGENDADO || ag.status === StatusAgendamento.CONFIRMADO
    ).length;
  }, [agendasFiltradas]);

  const taxaOcupacaoMedia = useMemo(() => {
    if (dadosOcupacaoSalas.length === 0) return 0;
    const soma = dadosOcupacaoSalas.reduce((acc, curr) => acc + curr.taxaOcupacao, 0);
    return Math.round(soma / dadosOcupacaoSalas.length);
  }, [dadosOcupacaoSalas]);

  const salaMaisUtilizada = useMemo(() => {
    if (dadosOcupacaoSalas.length === 0) return null;
    return [...dadosOcupacaoSalas].sort((a, b) => b.sessoes - a.sessoes)[0];
  }, [dadosOcupacaoSalas]);

  return (
    <div className="space-y-6">
      {/* Header do Relatório e Controles de Filtro */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fuchsia-50 text-fuchsia-800 text-xs font-bold mb-1.5 border border-fuchsia-200">
            <BarChart3 className="w-3.5 h-3.5 text-fuchsia-700" />
            Métricas & Indicadores Recharts
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Relatórios de Atendimento e Ocupação de Salas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Análise gráfica do volume diário de terapias realizadas e utilização dos espaços clínicos
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filtro por Especialidade */}
          <div className="relative">
            <select
              value={filtroEspecialidade}
              onChange={(e) => setFiltroEspecialidade(e.target.value)}
              className="appearance-none pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 cursor-pointer"
            >
              <option value="todas">Todas as Especialidades</option>
              {Object.entries(ESPECIALIDADES_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.nome}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Seletor de Período */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setPeriodo('semana')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodo === 'semana'
                  ? 'bg-white text-fuchsia-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setPeriodo('mes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodo === 'mes'
                  ? 'bg-white text-fuchsia-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setPeriodo('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodo === 'todos'
                  ? 'bg-white text-fuchsia-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Histórico
            </button>
          </div>

          {/* Botão de Impressão */}
          <button
            onClick={() => window.print()}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Imprimir Relatório"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cartões de Indicadores Rápidos (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Atendimentos Realizados */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-fuchsia-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Atendimentos Realizados
            </span>
            <div className="w-8 h-8 rounded-lg bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-sans tracking-tight">
              {totalRealizados}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Concluídos
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            + {totalAgendados} agendamentos futuros confirmados
          </p>
        </div>

        {/* KPI 2: Taxa de Ocupação Média */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-pink-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ocupação Média das Salas
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center">
              <DoorOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-sans tracking-tight">
              {taxaOcupacaoMedia}%
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              {salas.length} salas ativas
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Média de horas alocadas por turno
          </p>
        </div>

        {/* KPI 3: Sala Mais Requisitada */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Espaço Mais Requisitado
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-sm font-bold text-slate-900 block truncate">
              {salaMaisUtilizada ? salaMaisUtilizada.nomeCompleto : 'Nenhuma'}
            </span>
            <span className="text-xs text-purple-700 font-semibold">
              {salaMaisUtilizada ? `${salaMaisUtilizada.sessoes} sessões alocadas` : '-'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Alta demanda multidisciplinar
          </p>
        </div>

        {/* KPI 4: Média Diária de Sessões */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Média de Atendimentos / Dia
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-sans tracking-tight">
              {Math.round((totalRealizados + totalAgendados) / 6)}
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              sessões/dia
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Considerando funcionamento de Seg a Sáb
          </p>
        </div>
      </div>

      {/* Gráficos Recharts em Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 1: Atendimentos por Dia */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Atendimentos Realizados por Dia
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativo de atendimentos realizados vs. agendados ao longo da semana
              </p>
            </div>
            <span className="text-[10px] font-bold text-fuchsia-800 bg-fuchsia-50 px-2 py-0.5 rounded-full border border-fuchsia-200">
              Recharts Bar
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosAtendimentosPorDia}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="dia" 
                  tickLine={false} 
                  stroke="#94a3b8" 
                  fontSize={11}
                  fontWeight={600}
                />
                <YAxis 
                  allowDecimals={false} 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]?.payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800 space-y-1">
                          <p className="font-bold text-fuchsia-300 mb-1 border-b border-slate-800 pb-1">
                            {item.nomeCompleto}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-2 h-2 rounded-full bg-fuchsia-500" /> Realizados:
                            </span>
                            <span className="font-bold text-white">{item.Realizados}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-2 h-2 rounded-full bg-pink-400" /> Agendados:
                            </span>
                            <span className="font-bold text-white">{item.Agendados}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[11px]">
                            <span className="text-slate-400">Total de Sessões:</span>
                            <span className="font-extrabold text-fuchsia-400">{item.Total}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontWeight: 600 }} 
                  iconType="circle"
                />
                <Bar 
                  dataKey="Realizados" 
                  name="Realizados" 
                  fill="#c026d3" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={32}
                />
                <Bar 
                  dataKey="Agendados" 
                  name="Agendados" 
                  fill="#f472b6" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: Ocupação das Salas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Ocupação e Horas das Salas Clínicas
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Taxa de utilização percentual (%) e horas alocadas por ambiente terapêutico
              </p>
            </div>
            <span className="text-[10px] font-bold text-pink-800 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
              Taxa de Ocupação (%)
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosOcupacaoSalas}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                />
                <YAxis 
                  dataKey="nome" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#64748b" 
                  fontSize={10} 
                  width={110}
                  fontWeight={600}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800 space-y-1.5">
                          <p className="font-bold text-pink-300 border-b border-slate-800 pb-1">
                            {data.nomeCompleto}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-300">Taxa de Ocupação:</span>
                            <span className="font-bold text-pink-400">{data.taxaOcupacao}%</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-300">Horas Utilizadas:</span>
                            <span className="font-bold text-white">{data.horasOcupadas}h</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-300">Total de Sessões:</span>
                            <span className="font-bold text-white">{data.sessoes} atendimentos</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-300">Capacidade Simultânea:</span>
                            <span className="font-bold text-slate-300">{data.capacidade} pessoa(s)</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="taxaOcupacao" 
                  name="Ocupação (%)" 
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                >
                  {dadosOcupacaoSalas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela Detalhada de Utilização dos Espaços Terapêuticos */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Detalhamento de Salas e Equipamentos Multidisciplinares
            </h4>
            <p className="text-xs text-slate-500">
              Relação de recursos, sessões realizadas e status de ocupação por ambiente
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total de {salas.length} salas cadastradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Espaço / Sala</th>
                <th className="py-3 px-4">Capacidade</th>
                <th className="py-3 px-4">Sessões Registradas</th>
                <th className="py-3 px-4">Horas em Uso</th>
                <th className="py-3 px-4">Nível de Ocupação</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dadosOcupacaoSalas.map((salaData) => {
                const salaOriginal = salas.find((s) => s.id === salaData.id);
                return (
                  <tr key={salaData.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: salaData.cor }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {salaData.nomeCompleto}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {salaOriginal?.recursos && salaOriginal.recursos.length > 0 
                              ? `${salaOriginal.recursos.slice(0, 2).join(', ')}...` 
                              : 'Ambiente terapêutico'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {salaData.capacidade} pessoa(s)
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {salaData.sessoes}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {salaData.horasOcupadas}h
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 max-w-[140px]">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${salaData.taxaOcupacao}%`,
                              backgroundColor: salaData.cor 
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">
                          {salaData.taxaOcupacao}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {salaData.taxaOcupacao > 70 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Alta Procura
                        </span>
                      ) : salaData.taxaOcupacao > 20 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Equilibrada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Disponível
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
