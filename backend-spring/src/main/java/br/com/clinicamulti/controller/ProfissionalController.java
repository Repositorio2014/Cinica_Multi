package br.com.clinicamulti.controller;

import br.com.clinicamulti.model.Profissional;
import br.com.clinicamulti.repository.ProfissionalRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profissionais")
@RequiredArgsConstructor
public class ProfissionalController {

    private final ProfissionalRepository profissionalRepository;

    @GetMapping
    public List<Profissional> listar(@RequestParam(required = false) String nome) {
        if (nome != null && !nome.isBlank()) {
            return profissionalRepository.findByNomeContainingIgnoreCase(nome);
        }
        return profissionalRepository.findByAtivoTrueOrderByNomeAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> buscarPorId(@PathVariable Long id) {
        return profissionalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Profissional> criar(@Valid @RequestBody Profissional profissional) {
        Profissional salvo = profissionalRepository.save(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profissional> atualizar(@PathVariable Long id, @Valid @RequestBody Profissional dados) {
        return profissionalRepository.findById(id)
                .map(existente -> {
                    existente.setNome(dados.getNome());
                    existente.setCpf(dados.getCpf());
                    existente.setRegistroConselho(dados.getRegistroConselho());
                    existente.setTelefone(dados.getTelefone());
                    existente.setEmail(dados.getEmail());
                    existente.setValorSessao(dados.getValorSessao());
                    existente.setEspecialidades(dados.getEspecialidades());
                    existente.setCor(dados.getCor());
                    existente.setAtivo(dados.isAtivo());
                    return ResponseEntity.ok(profissionalRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        return profissionalRepository.findById(id)
                .map(prof -> {
                    prof.setAtivo(false);
                    profissionalRepository.save(prof);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
