package br.com.clinicamulti.repository;

import br.com.clinicamulti.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByCpf(String cpf);
    List<Paciente> findByAtivoTrueOrderByNomeAsc();
    List<Paciente> findByNomeContainingIgnoreCase(String nome);
}
