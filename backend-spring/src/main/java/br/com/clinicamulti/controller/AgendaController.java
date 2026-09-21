package br.com.clinicamulti.controller;

import br.com.clinicamulti.model.Agenda;
import br.com.clinicamulti.service.AgendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/agendas")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    @GetMapping
    public List<Agenda> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return agendaService.listarPorIntervalo(inicio, fim);
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<Agenda> listarPorPaciente(@PathVariable Long pacienteId) {
        return agendaService.listarPorPaciente(pacienteId);
    }

    @PostMapping
    public ResponseEntity<Agenda> criar(@Valid @RequestBody Agenda agenda) {
        Agenda salva = agendaService.salvar(agenda);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Agenda> atualizarStatus(
            @PathVariable Long id,
            @RequestParam Agenda.StatusAgendamento status) {
        Agenda atualizada = agendaService.atualizarStatus(id, status);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        agendaService.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}
