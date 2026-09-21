package br.com.clinicamulti.repository;

import br.com.clinicamulti.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalaRepository extends JpaRepository<Sala, Long> {
    List<Sala> findByAtivoTrueOrderByNomeAsc();
}
