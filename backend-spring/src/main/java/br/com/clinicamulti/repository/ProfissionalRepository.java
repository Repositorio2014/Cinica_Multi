package br.com.clinicamulti.repository;

import br.com.clinicamulti.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    Optional<Profissional> findByCpf(String cpf);
    List<Profissional> findByAtivoTrueOrderByNomeAsc();
    List<Profissional> findByNomeContainingIgnoreCase(String nome);
}
