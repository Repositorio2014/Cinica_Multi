package br.com.clinicamulti.repository;

import br.com.clinicamulti.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
    List<Prontuario> findByPacienteIdOrderByDataAtendimentoDesc(Long pacienteId);
    List<Prontuario> findByProfissionalIdOrderByDataAtendimentoDesc(Long profissionalId);
}
