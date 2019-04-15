package com.lukascode.puns.core.api.dto;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddScoreRequest {

    @NotNull
    private Long playerId;

    @NotNull
    private Integer points;

    private String gameRoomId;

    private String guessedWord;

}
