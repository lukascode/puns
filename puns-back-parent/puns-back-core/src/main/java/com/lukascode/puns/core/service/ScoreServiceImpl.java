package com.lukascode.puns.core.service;

import static java.lang.String.format;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lukascode.puns.core.api.ScoreService;
import com.lukascode.puns.core.api.dto.AddScoreRequest;
import com.lukascode.puns.core.mapping.Player;
import com.lukascode.puns.core.mapping.Score;
import com.lukascode.puns.core.mapping.Word;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScoreServiceImpl implements ScoreService {

    private final PlayerRepository playerRepository;
    private final WordRepository wordRepository;

    @Override
    public void addScoreForPlayer(AddScoreRequest addScoreRequest) {
        final Player player = playerRepository.findById(addScoreRequest.getPlayerId())
                .orElseThrow(() -> PunsCoreApiException.resourceNotFound(format("User with id '%s' not found", addScoreRequest.getPlayerId())));
        final Word word = wordRepository.findByWord(addScoreRequest.getGuessedWord())
                .orElseThrow(() -> PunsCoreApiException.resourceNotFound(format("Word with name '%s' not found", addScoreRequest.getGuessedWord())));
        final Score score = Score.builder()
                .gameRoomId(addScoreRequest.getGameRoomId())
                .points(addScoreRequest.getPoints())
                .guessedWord(word)
                .player(player)
                .build();
        player.addScore(score);
        playerRepository.save(player);
    }
}
