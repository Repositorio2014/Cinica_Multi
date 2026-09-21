package br.com.clinicamulti.service;

import br.com.clinicamulti.model.Agenda;
import br.com.clinicamulti.repository.AgendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final AgendaRepository agendaRepository;

    public List<Agenda> listarPorIntervalo(LocalDateTime inicio, LocalDateTime fim) {
        if (inicio != null && fim != null) {
            return agendaRepository.findByDataHoraInicioBetweenOrderByDataHoraInicioAsc(inicio, fim);
        }
        return agendaRepository.findAll();
    }

    public List<Agenda> listarPorPaciente(Long pacienteId) {
        return agendaRepository.findByPacienteIdOrderByDataHoraInicioDesc(pacienteId);
    }

    @Transactional
    public Agenda salvar(Agenda agenda) {
        if (agenda.getDataHoraFim().isBefore(agenda.getDataHoraInicio()) ||
            agenda.getDataHoraFim().isEqual(agenda.getDataHoraInicio())) {
            throw new IllegalArgumentException("O horário de término deve ser posterior ao início.");
        }

        // Validação 1: Profissional ocupado
        boolean profOcupado = agendaRepository.existeConflitoProfissional(
                agenda.getProfissional().getId(),
                agenda.getDataHoraInicio(),
                agenda.getDataHoraFim(),
                agenda.getId()
        );
        if (profOcupado) {
            throw new IllegalStateException("O terapeuta/médico já possui atendimento agendado neste intervalo de horário!");
        }

        // Validação 2: Sala ocupada (caso haja sala atribuída)
        if (agenda.getSala() != null && agenda.getSala().getId() != null) {
            boolean salaOcupada = agendaRepository.existeConflitoDeSala(
                    agenda.getSala().getId(),
                    agenda.getDataHoraInicio(),
                    agenda.getDataHoraFim(),
                    agenda.getId()
            );
            if (salaOcupada) {
                throw new IllegalStateException("A sala selecionada já está ocupada neste horário por outra sessão!");
            }
        }

        return agendaRepository.save(agenda);
    }

    @Transactional
    public Agenda atualizarStatus(Long id, Agenda.StatusAgendamento status) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado com id: " + id));
        agenda.setStatus(status);
        return agendaRepository.save(agenda);
    }

    @Transactional
    public void cancelar(Long id) {
        atualizarStatus(id, Agenda.StatusAgendamento.CANCELADO);
    }
}
