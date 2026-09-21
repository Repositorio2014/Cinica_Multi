package br.com.clinicamulti.controller;

import br.com.clinicamulti.model.Paciente;
import br.com.clinicamulti.repository.PacienteRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteRepository pacienteRepository;

    @GetMapping
    public List<Paciente> listar(@RequestParam(required = false) String nome) {
        if (nome != null && !nome.isBlank()) {
            return pacienteRepository.findByNomeContainingIgnoreCase(nome);
        }
        return pacienteRepository.findByAtivoTrueOrderByNomeAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        return pacienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Paciente> criar(@Valid @RequestBody Paciente paciente) {
        Paciente salvo = pacienteRepository.save(paciente);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @Valid @RequestBody Paciente dados) {
        return pacienteRepository.findById(id)
                .map(existente -> {
                    existente.setNome(dados.getNome());
                    existente.setCpf(dados.getCpf());
                    existente.setDataNascimento(dados.getDataNascimento());
                    existente.setTelefone(dados.getTelefone());
                    existente.setEmail(dados.getEmail());
                    existente.setNomeResponsavel(dados.getNomeResponsavel());
                    existente.setTelefoneResponsavel(dados.getTelefoneResponsavel());
                    existente.setEndereco(dados.getEndereco());
                    existente.setConvenio(dados.getConvenio());
                    existente.setObservacoes(dados.getObservacoes());
                    existente.setAtivo(dados.isAtivo());
                    return ResponseEntity.ok(pacienteRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        return pacienteRepository.findById(id)
                .map(paciente -> {
                    paciente.setAtivo(false);
                    pacienteRepository.save(paciente);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
