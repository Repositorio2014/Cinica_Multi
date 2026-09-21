package br.com.clinicamulti.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sala")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da sala é obrigatório")
    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Builder.Default
    private Integer capacidade = 2;

    @ElementCollection
    @CollectionTable(name = "sala_recursos", joinColumns = @JoinColumn(name = "sala_id"))
    @Column(name = "recurso")
    @Builder.Default
    private List<String> recursos = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;
}
