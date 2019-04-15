package com.lukascode.puns.core.api.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreSnapshot {

    private Long id;

    private Integer points;

    private String gameRoomId;

    private String guessedWord;

    private Date eventTimestamp;

}
