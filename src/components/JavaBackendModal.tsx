import React, { useState } from 'react';
import { SPRING_BOOT_ENDPOINTS, CORS_CONFIG_JAVA } from '../services/springBootIntegration';
import { BackendConfig } from '../types';
import { 
  Server, 
  X, 
  Code2, 
  Check, 
  Copy, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Database,
  ArrowRight
} from 'lucide-react';

interface JavaBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackendConfig;
  onSaveConfig: (cfg: BackendConfig) => void;
}

export const JavaBackendModal: React.FC<JavaBackendModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [activeTab, setActiveTab] = useState<'comparativo' | 'endpoints' | 'cors' | 'conexao'>('comparativo');
  const [apiUrl, setApiUrl] = useState(config.apiUrl);
  const [useRealApi, setUseRealApi] = useState(config.useRealApi);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveConfig({
      ...config,
      apiUrl,
      useRealApi
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                Guia de Arquitetura: Java (Spring Boot) + Frontend
              </h3>
              <p className="text-xs text-slate-500">
                Comparativo: Refatorar o Angular JHipster vs. Criar Novo Frontend desacoplado
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('comparativo')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'comparativo'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Refactory vs. Novo App
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'endpoints'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mapeamento de Endpoints (clinica.jdl)
          </button>
          <button
            onClick={() => setActiveTab('cors')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'cors'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            CORS & Segurança no Spring
          </button>
          <button
            onClick={() => setActiveTab('conexao')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'conexao'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Configurar Conexão REST
          </button>
        </div>

        {/* Tab 1: Comparativo Direto */}
        {activeTab === 'comparativo' && (
          <div className="py-4 space-y-4 text-xs">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
              <h4 className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                Veredito Recomendado: Crie o Novo Frontend Desacoplado mantendo o Spring Boot
              </h4>
              <p className="text-teal-950/80 leading-relaxed">
                Como desenvolvedor Java, o seu maior valor está no robusto ecossistema do <strong>Spring Boot</strong> (JPA, Hibernate, MapStruct, Liquibase, validações de regras de negócio e segurança JWT). O JHipster gerou um backend Spring Boot excelente a partir do seu modelo <code>clinica.jdl</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Refactoring Angular JHipster */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block">
                  Opção 1: Refatorar o Angular do JHipster
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    O Angular gerado pelo JHipster vem com Bootstrap 5 acoplado e tabelas brutas orientadas a banco de dados, sem visão de clínica.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    Refatorar exige brigar com módulos gerados, roteamento rígido e CSS legado.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    Qualquer novo comando JDL pode sobrescrever ou conflitar com suas customizações manuais.
                  </li>
                </ul>
              </div>

              {/* Option B: New Decoupled Frontend */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider block">
                  Opção 2: Novo Frontend Moderno (Abordagem Deste App)
                </span>
                <ul className="space-y-1.5 text-emerald-950">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <strong>100% aderente ao seu clinica.jdl</strong>: mesmos DTOs (Paciente, Agenda, Prontuario, Sala, Profissional).
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <strong>UX de Clínica Real</strong>: grade de horários, detecção de choque em salas, prontuário multidisciplinar (PEP) integrado.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    Desacoplado: você executa seu Spring Boot na porta <code>8080</code> e o Frontend consome via chamadas HTTP REST limpas.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Endpoints REST */}
        {activeTab === 'endpoints' && (
          <div className="py-4 space-y-3 text-xs">
            <p className="text-slate-600">
              Estes são os endpoints REST que o JHipster já gera no seu projeto Spring Boot e que este frontend consome:
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {SPRING_BOOT_ENDPOINTS.map((ep, idx) => (
                <div key={idx} className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                        ep.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                        ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                        ep.method === 'PUT' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{ep.endpoint}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{ep.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 self-start sm:self-center">
                    {ep.javaController}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: CORS Configuration */}
        {activeTab === 'cors' && (
          <div className="py-4 space-y-3 text-xs">
            <p className="text-slate-600">
              Para permitir que este frontend se comunique com seu Spring Boot local, adicione ou configure o filtro CORS no seu projeto Java:
            </p>

            <div className="relative">
              <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                {CORS_CONFIG_JAVA}
              </pre>
              <button
                onClick={() => handleCopyCode(CORS_CONFIG_JAVA)}
                className="absolute top-2.5 right-2.5 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] flex items-center gap-1 font-sans"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Conexão REST */}
        {activeTab === 'conexao' && (
          <div className="py-4 space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-use-api"
                  checked={useRealApi}
                  onChange={(e) => setUseRealApi(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="chk-use-api" className="font-bold text-slate-800">
                  Habilitar requisições ativas para o Spring Boot REST API
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Base do Backend Spring Boot
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono"
                  placeholder="http://localhost:8080/api"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Quando desabilitado, a aplicação utiliza o armazenamento local reativo (localStorage com dados padrão de demonstração), permitindo testar toda a interface de imediato sem precisar subir o banco de dados PostgreSQL/H2 local.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 text-xs"
          >
            Fechar
          </button>
          {activeTab === 'conexao' && (
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs shadow-xs"
            >
              Salvar Configuração
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
