package com.lukascode.puns.core.mapping;

import java.time.Instant;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "game_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(value = {"player"})
public class Score {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private Integer points;

    @Column(name = "game_room_id")
    private String gameRoomId;

    @OneToOne
    @JoinColumn(name = "guessed_word_id")
    private Word guessedWord;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "event_timestamp")
    private Date eventTimestamp;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @PrePersist
    public void prePersist() {
        if (eventTimestamp == null) {
            eventTimestamp = Date.from(Instant.now());
        }
    }

}
