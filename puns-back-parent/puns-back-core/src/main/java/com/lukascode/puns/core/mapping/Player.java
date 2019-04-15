package com.lukascode.puns.core.mapping;

import static java.util.Objects.nonNull;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"avatar", "scores"})
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String nick;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean active;

    @OneToOne
    @JoinColumn(name = "avatar_media_id")
    private Media avatar;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "player", orphanRemoval = true)
    private List<Score> scores;

    @Column(name = "creation_time", nullable = false)
    private LocalDateTime creationTime;

    public boolean hasAvatar() {
        return nonNull(avatar);
    }

    public void addScore(Score score) {
        scores.add(score);
    }

}
