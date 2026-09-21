package br.com.clinicamulti.controller;

import br.com.clinicamulti.model.Sala;
import br.com.clinicamulti.repository.SalaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaRepository salaRepository;

    @GetMapping
    public List<Sala> listar() {
        return salaRepository.findByAtivoTrueOrderByNomeAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sala> buscarPorId(@PathVariable Long id) {
        return salaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Sala> criar(@Valid @RequestBody Sala sala) {
        Sala salva = salaRepository.save(sala);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sala> atualizar(@PathVariable Long id, @Valid @RequestBody Sala dados) {
        return salaRepository.findById(id)
                .map(existente -> {
                    existente.setNome(dados.getNome());
                    existente.setDescricao(dados.getDescricao());
                    existente.setCapacidade(dados.getCapacidade());
                    existente.setRecursos(dados.getRecursos());
                    existente.setAtivo(dados.isAtivo());
                    return ResponseEntity.ok(salaRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        return salaRepository.findById(id)
                .map(sala -> {
                    sala.setAtivo(false);
                    salaRepository.save(sala);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
