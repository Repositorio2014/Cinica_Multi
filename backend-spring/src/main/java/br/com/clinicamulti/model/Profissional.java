package br.com.clinicamulti.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "profissional")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profissional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do profissional é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    @Column(nullable = false, unique = true, length = 18)
    private String cpf;

    @NotBlank(message = "O registro de conselho (CRM/CRP/CREFITO) é obrigatório")
    @Column(name = "registro_conselho", nullable = false)
    private String registroConselho;

    private String telefone;
    private String email;

    @Column(name = "valor_sessao")
    private BigDecimal valorSessao;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profissional_especialidades", joinColumns = @JoinColumn(name = "profissional_id"))
    @Column(name = "especialidade")
    @Builder.Default
    private Set<String> especialidades = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;

    private String cor;
}
