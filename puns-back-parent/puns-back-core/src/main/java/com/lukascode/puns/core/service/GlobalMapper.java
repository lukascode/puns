package com.lukascode.puns.core.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lukascode.puns.core.api.dto.MediaUploadResponse;
import com.lukascode.puns.core.api.dto.PlayerSnapshot;
import com.lukascode.puns.core.api.dto.RegisterRequest;
import com.lukascode.puns.core.api.dto.ScoreSnapshot;
import com.lukascode.puns.core.mapping.Media;
import com.lukascode.puns.core.mapping.Player;
import com.lukascode.puns.core.mapping.Score;

@Component
@Mapper(componentModel = "spring")
public abstract class GlobalMapper {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Player registerRequestToPlayer(RegisterRequest registerRequest) {
        return Player.builder()
                .email(registerRequest.getEmail())
                .nick(registerRequest.getNick())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .active(true)
                .avatar(null)
                .creationTime(LocalDateTime.now())
                .scores(Collections.EMPTY_LIST)
                .role("ROLE_PLAYER")
                .build();
    }
    
    @Mappings({
            @Mapping(source = "id", target = "resourceId"),
            @Mapping(source = "fileName", target = "name")
    })
    public abstract MediaUploadResponse toMediaUploadResponse(Media media);

    @Mappings({
            @Mapping(source = "avatar.id", target = "avatarId")
    })
    public abstract PlayerSnapshot toPlayerSnapshot(Player player);

    public abstract List<ScoreSnapshot> toListScoreSnapshot(List<Score> scores);

    @Mappings({
            @Mapping(source = "guessedWord.word", target = "guessedWord")
    })
    public abstract ScoreSnapshot toScoreSnapshot(Score score);

}
