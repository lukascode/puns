package com.lukascode.puns.core.controller;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lukascode.puns.core.api.ScoreService;
import com.lukascode.puns.core.api.dto.AddScoreRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/scores")
public class ScoresController {

    private final ScoreService scoreService;

    @PostMapping("/add-score")
    public void addScore(@NotNull @Valid @RequestBody AddScoreRequest addScoreRequest) {
        log.info("Received addScore request", addScoreRequest);
        scoreService.addScoreForPlayer(addScoreRequest);
    }

}
