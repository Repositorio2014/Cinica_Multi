package br.com.clinicamulti.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prontuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoProntuario tipo = TipoProntuario.EVOLUCAO;

    @NotNull(message = "Data do atendimento é obrigatória")
    @Column(name = "data_atendimento", nullable = false)
    private LocalDateTime dataAtendimento;

    @NotBlank(message = "Título da evolução é obrigatório")
    @Column(nullable = false)
    private String titulo;

    @NotBlank(message = "O conteúdo ou descrição clínica é obrigatório")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @Builder.Default
    private boolean confidencial = false;

    private String especialidade;

    @Column(columnDefinition = "TEXT")
    private String objetivos;

    @Column(columnDefinition = "TEXT")
    private String atividades;

    @Column(name = "resposta_paciente", columnDefinition = "TEXT")
    private String respostaPaciente;

    @Column(name = "orientacoes_casa", columnDefinition = "TEXT")
    private String orientacoesCasa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @ManyToOne
    @JoinColumn(name = "agenda_id")
    private Agenda agenda;

    public enum TipoProntuario {
        ANAMNESE, EVOLUCAO, LAUDO, ATESTADO, ENCAMINHAMENTO
    }
}
