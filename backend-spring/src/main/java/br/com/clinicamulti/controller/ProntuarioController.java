package br.com.clinicamulti.controller;

import br.com.clinicamulti.model.Prontuario;
import br.com.clinicamulti.repository.ProntuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prontuarios")
@RequiredArgsConstructor
public class ProntuarioController {

    private final ProntuarioRepository prontuarioRepository;

    @GetMapping
    public List<Prontuario> listarPorPaciente(@RequestParam(required = false) Long pacienteId) {
        if (pacienteId != null) {
            return prontuarioRepository.findByPacienteIdOrderByDataAtendimentoDesc(pacienteId);
        }
        return prontuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prontuario> buscarPorId(@PathVariable Long id) {
        return prontuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Prontuario> salvar(@Valid @RequestBody Prontuario prontuario) {
        Prontuario salvo = prontuarioRepository.save(prontuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!prontuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        prontuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
