package com.lukascode.puns.core.api.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerSnapshot {

    private Long id;

    private String email;

    private String nick;

    private UUID avatarId;

    private List<ScoreSnapshot> scores;

    private LocalDateTime creationTime;

}
