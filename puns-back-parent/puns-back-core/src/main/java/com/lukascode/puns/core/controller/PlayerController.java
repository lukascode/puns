package com.lukascode.puns.core.controller;

import java.security.Principal;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.lukascode.puns.core.api.AuthorizationService;
import com.lukascode.puns.core.api.PlayerService;
import com.lukascode.puns.core.api.dto.AccessToken;
import com.lukascode.puns.core.api.dto.ChangePassRequest;
import com.lukascode.puns.core.api.dto.LoginRequest;
import com.lukascode.puns.core.api.dto.PlayerSnapshot;
import com.lukascode.puns.core.api.dto.RefreshTokenRequest;
import com.lukascode.puns.core.api.dto.RegisterRequest;
import com.lukascode.puns.core.api.dto.SetAvatarRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/player")
public class PlayerController {

    private final AuthorizationService playerAuthorizationService;
    private final PlayerService playerService;

    @PostMapping("/token/new")
    public AccessToken login(@RequestBody @Valid LoginRequest loginRequest) {
        log.info("Received login request {nick: {}}", loginRequest.getNick());
        return playerAuthorizationService.getToken(loginRequest);
    }

    @PostMapping("/token/refresh")
    public AccessToken refresh(@RequestBody @Valid RefreshTokenRequest refreshTokenRequest) {
        log.info("Received refresh token request");
        return playerAuthorizationService.refreshToken(refreshTokenRequest);
    }

    @PostMapping("/register")
    public Long register(@RequestBody @Valid RegisterRequest registerRequest) {
        log.info("Received register request { email: {}}", registerRequest.getEmail());
        return playerService.register(registerRequest);
    }

    @PostMapping("/change/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@RequestBody @Valid ChangePassRequest changePassRequest, Principal principal) {
        log.info("Received changePassword request {user: {}}", principal.getName());
        playerService.changePass(changePassRequest, principal.getName());
    }

    @GetMapping("/current")
    public PlayerSnapshot getCurrentPlayer(Principal principal) {
        log.info("Received getCurrentPlayer request {user: {}}", principal.getName());
        return playerService.getPlayerByNick(principal.getName());
    }

    @PostMapping("/set-avatar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setAvatar(@RequestBody @Valid @NotNull SetAvatarRequest setAvatarRequest, Principal principal) {
        log.info("Received setAvatar request {user: {}}", principal.getName());
        playerService.setAvatar(setAvatarRequest, principal.getName());
    }

    @GetMapping("/email-taken/{email}")
    public boolean isEmailTaken(@PathVariable String email) {
        log.info("Received isEmailTaken request { email: {} }", email);
        return playerService.isEmailTaken(email);
    }

    @GetMapping("/nick-taken/{nick}")
    public boolean isNickTaken(@PathVariable String nick) {
        log.info("Received isEmailTaken request { nick: {} }", nick);
        return playerService.isNickTaken(nick);
    }

    @GetMapping("/all")
    public List<PlayerSnapshot> getAllPlayers() {
        log.info("Received getAllPlayers request");
        return playerService.getAllPlayers();
    }

}
