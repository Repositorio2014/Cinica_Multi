package br.com.clinicamulti.repository;

import br.com.clinicamulti.model.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Long> {

    List<Agenda> findByDataHoraInicioBetweenOrderByDataHoraInicioAsc(LocalDateTime inicio, LocalDateTime fim);

    List<Agenda> findByPacienteIdOrderByDataHoraInicioDesc(Long pacienteId);

    List<Agenda> findByProfissionalIdOrderByDataHoraInicioAsc(Long profissionalId);

    // Validação de choque de sala:
    @Query("SELECT COUNT(a) > 0 FROM Agenda a WHERE a.sala.id = :salaId " +
           "AND a.status <> 'CANCELADO' " +
           "AND (:id IS NULL OR a.id <> :id) " +
           "AND (:inicio < a.dataHoraFim AND :fim > a.dataHoraInicio)")
    boolean existeConflitoDeSala(@Param("salaId") Long salaId, 
                                 @Param("inicio") LocalDateTime inicio, 
                                 @Param("fim") LocalDateTime fim,
                                 @Param("id") Long id);

    // Validação de choque de profissional no mesmo horário:
    @Query("SELECT COUNT(a) > 0 FROM Agenda a WHERE a.profissional.id = :profId " +
           "AND a.status <> 'CANCELADO' " +
           "AND (:id IS NULL OR a.id <> :id) " +
           "AND (:inicio < a.dataHoraFim AND :fim > a.dataHoraInicio)")
    boolean existeConflitoProfissional(@Param("profId") Long profId,
                                      @Param("inicio") LocalDateTime inicio,
                                      @Param("fim") LocalDateTime fim,
                                      @Param("id") Long id);
}
