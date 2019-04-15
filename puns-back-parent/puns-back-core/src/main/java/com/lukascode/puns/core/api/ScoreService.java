package com.lukascode.puns.core.api;

import com.lukascode.puns.core.api.dto.AddScoreRequest;

public interface ScoreService {

    void addScoreForPlayer(AddScoreRequest addScoreRequest);

}
