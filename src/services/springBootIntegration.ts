/**
 * Guia de Integração e Mapeamento REST para o desenvolvedor Java (Spring Boot)
 * Baseado no modelo JHipster clinica.jdl
 */

export interface SpringBootEndpointDoc {
  entity: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  javaController: string;
}

export const SPRING_BOOT_ENDPOINTS: SpringBootEndpointDoc[] = [
  {
    entity: 'Paciente',
    method: 'GET',
    endpoint: '/api/pacientes',
    description: 'Lista paginada de pacientes (suporta filtros ?ativo=true, ?nome.contains=)',
    javaController: 'PacienteResource.java (@GetMapping("/pacientes"))'
  },
  {
    entity: 'Paciente',
    method: 'POST',
    endpoint: '/api/pacientes',
    description: 'Cria novo paciente validando CPF único e campos obrigatórios',
    javaController: 'PacienteResource.java (@PostMapping("/pacientes"))'
  },
  {
    entity: 'Agenda',
    method: 'GET',
    endpoint: '/api/agendas',
    description: 'Busca agendamentos por intervalo de datas (?dataHoraInicio.greaterThanOrEqual=)',
    javaController: 'AgendaResource.java (@GetMapping("/agendas"))'
  },
  {
    entity: 'Agenda',
    method: 'PUT',
    endpoint: '/api/agendas/{id}',
    description: 'Atualiza status da sessão (AGENDADO, CONFIRMADO, ATENDIDO, FALTA, CANCELADO)',
    javaController: 'AgendaResource.java (@PutMapping("/agendas/{id}"))'
  },
  {
    entity: 'Prontuario',
    method: 'GET',
    endpoint: '/api/prontuarios?pacienteId.equals={id}',
    description: 'Recupera histórico clínico multidisciplinar ordenado por dataAtendimento desc',
    javaController: 'ProntuarioResource.java (@GetMapping("/prontuarios"))'
  },
  {
    entity: 'Profissional',
    method: 'GET',
    endpoint: '/api/profissionals',
    description: 'Lista terapeutas e médicos cadastrados com suas especialidades',
    javaController: 'ProfissionalResource.java (@GetMapping("/profissionals"))'
  },
  {
    entity: 'Sala',
    method: 'GET',
    endpoint: '/api/salas',
    description: 'Recupera salas de atendimento e suas capacidades para alocação',
    javaController: 'SalaResource.java (@GetMapping("/salas"))'
  }
];

export const CORS_CONFIG_JAVA = `// Configuração CORS recomendada no Spring Boot (WebConfigurer.java ou SecurityConfiguration.java)
@Bean
public CorsFilter corsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOriginPattern("*"); // Em produção, restrinja ao domínio do frontend
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    source.registerCorsConfiguration("/api/**", config);
    return new CorsFilter(source);
}`;
