import React, { useState } from 'react';
import { AuthUser } from '../types';
import { MOCK_USERS } from '../data/mockUsers';
import { Logo } from './Logo';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Stethoscope, 
  Users, 
  Sparkles, 
  KeyRound,
  Info,
  Server
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  onOpenJavaModal: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onOpenJavaModal
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      // Check credentials against mock/demo users (which match JHipster standard credentials)
      const found = MOCK_USERS.find(
        u => (u.login === username.trim() || u.email === username.trim()) && u.senhaPadrao === password.trim()
      );

      if (found) {
        const authUser: AuthUser = {
          id: found.id,
          login: found.login,
          nome: found.nome,
          email: found.email,
          role: found.role,
          cargo: found.cargo,
          especialidade: found.especialidade,
          avatarCor: found.avatarCor,
          token: 'jwt-session-token-' + Date.now()
        };
        onLoginSuccess(authUser);
      } else {
        setErrorMsg('Usuário ou senha inválidos. Utilize as credenciais de teste ou clique em um dos perfis rápidos abaixo.');
        setIsLoading(false);
      }
    }, 300);
  };

  const handleQuickLogin = (mockUser: typeof MOCK_USERS[0]) => {
    setUsername(mockUser.login);
    setPassword(mockUser.senhaPadrao);
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      onLoginSuccess({
        id: mockUser.id,
        login: mockUser.login,
        nome: mockUser.nome,
        email: mockUser.email,
        role: mockUser.role,
        cargo: mockUser.cargo,
        especialidade: mockUser.especialidade,
        avatarCor: mockUser.avatarCor,
        token: 'jwt-session-token-' + Date.now()
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-fuchsia-50/20 to-pink-50/40 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Container Principal com Estética Limpa e Acolhedora */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-fuchsia-100/50 border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
        {/* Glow sutil no topo do card */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-fuchsia-200/40 to-pink-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-gradient-to-tr from-pink-200/30 to-fuchsia-200/20 rounded-full blur-2xl pointer-events-none" />

        {/* Logo Centralizada e Apresentação da Marca */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-2 transition-transform hover:scale-102">
            <Logo size="lg" showSubtitle={false} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Portal Multidisciplinar
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Sistema integrado para gestão clínica, agendamento de sessões e prontuário eletrônico unificado
          </p>
        </div>

        {/* Mensagem de Erro se houver */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-shake">
            <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Usuário ou E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin, user ou seu e-mail"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-600 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Senha de Acesso
              </label>
              <button
                type="button"
                onClick={() => alert('Para este ambiente, as senhas padrão são: admin, user ou recepcao.')}
                className="text-[11px] text-fuchsia-700 hover:text-fuchsia-900 font-medium"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-600 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
              />
              <span className="text-xs text-slate-600">Manter conectado</span>
            </label>
          </div>

          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-700 via-fuchsia-600 to-pink-600 hover:from-fuchsia-800 hover:to-pink-700 active:scale-[0.99] transition-all shadow-md shadow-fuchsia-700/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-white px-3 text-slate-400">
              Acesso Rápido para Demonstração
            </span>
          </div>
        </div>

        {/* Perfis Pré-configurados (Compatíveis com JHipster Spring Security) */}
        <div className="space-y-2">
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleQuickLogin(user)}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-fuchsia-300 hover:bg-fuchsia-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-2xs"
                  style={{ backgroundColor: user.avatarCor || '#c026d3' }}
                >
                  {user.role === 'ROLE_ADMIN' ? <ShieldCheck className="w-4 h-4" /> :
                   user.role === 'ROLE_TERAPEUTA' ? <Stethoscope className="w-4 h-4" /> :
                   <Users className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-fuchsia-900">
                      {user.nome}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                      {user.login}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                    {user.cargo}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-fuchsia-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Entrar
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>

        {/* Info Spring Boot Backend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <button
            type="button"
            onClick={onOpenJavaModal}
            className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-900 font-semibold"
          >
            <Server className="w-3 h-3 text-amber-600" />
            Backend Spring Boot (REST)
          </button>
          <span className="font-mono text-slate-400">v1.2.0 • JDL Ready</span>
        </div>
      </div>

      {/* Footer discreto */}
      <p className="text-xs text-slate-400 text-center mt-6">
        Clínica Multi-Terapias © {new Date().getFullYear()} • Todos os direitos reservados
      </p>
    </div>
  );
};
