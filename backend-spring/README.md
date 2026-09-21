# Clínica Multi - Back-end Spring Boot 3 (Clean Architecture)

Projeto Java 17+ com Spring Boot 3.3 e PostgreSQL, sem JHipster, projetado para alta performance, fácil manutenção e integração total com o front-end React.

---

## 🚀 Como Executar

### 1. Subir o PostgreSQL via Docker (Opcional se já tiver PostgreSQL local)
Na pasta `backend-spring/`:
```bash
docker-compose up -d
```

### 2. Executar a Aplicação Spring Boot
```bash
# Com Maven Wrapper
./mvnw spring-boot:run

# Ou com Maven instalado
mvn spring-boot:run
```

A aplicação inicializará na porta **`8080`**.

---

## 📡 Endpoints REST Disponíveis

| Entidade | Método | Endpoint | Descrição |
|---|---|---|---|
| **Paciente** | GET | `/api/pacientes` | Lista pacientes ativos ou filtra por nome (`?nome=`) |
| **Paciente** | POST | `/api/pacientes` | Cadastra novo paciente com CPF único |
| **Paciente** | PUT | `/api/pacientes/{id}` | Atualiza cadastro completo |
| **Paciente** | DELETE | `/api/pacientes/{id}` | Inativação lógica do paciente |
| **Profissional** | GET | `/api/profissionais` | Lista médicos e terapeutas |
| **Profissional** | POST | `/api/profissionais` | Cadastra terapeuta com especialidades |
| **Sala** | GET | `/api/salas` | Lista salas e capacidades de atendimento |
| **Agenda** | GET | `/api/agendas` | Filtra sessões por data/hora (`?inicio=&fim=`) |
| **Agenda** | POST | `/api/agendas` | Cria agendamento com validação de conflito de salas |
| **Agenda** | PATCH | `/api/agendas/{id}/status` | Altera status (`CONFIRMADO`, `ATENDIDO`, etc) |
| **Prontuário** | GET | `/api/prontuarios?pacienteId={id}` | Histórico clínico PEP do paciente |
| **Prontuário** | POST | `/api/prontuarios` | Salva evolução, anamnese ou laudo |

---

## 🔒 CORS Configurado
O endpoint `/api/**` já está habilitado com CORS liberado para integração direta com a aplicação React em desenvolvimento ou produção.
