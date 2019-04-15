package com.lukascode.puns.core.service;

import static java.lang.String.format;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lukascode.puns.core.api.MediaService;
import com.lukascode.puns.core.api.PlayerService;
import com.lukascode.puns.core.api.dto.ChangePassRequest;
import com.lukascode.puns.core.api.dto.PlayerSnapshot;
import com.lukascode.puns.core.api.dto.RegisterRequest;
import com.lukascode.puns.core.api.dto.SetAvatarRequest;
import com.lukascode.puns.core.mapping.Media;
import com.lukascode.puns.core.mapping.Player;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class PlayerRepositoryService implements PlayerService {

    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final GlobalMapper globalMapper;
    private final MediaService mediaService;

    @Override
    public Long register(RegisterRequest registerRequest) {
        playerRepository.findByEmailIgnoreCase(registerRequest.getEmail()).ifPresent(p -> {
            throw PunsCoreApiException.userAlreadyExists(registerRequest.getEmail());
        });
        final Player player = globalMapper.registerRequestToPlayer(registerRequest);
        return playerRepository.save(player).getId();
    }

    @Override
    public void changePass(ChangePassRequest request, String playerNick) {
        final Player player = findPlayerByNick(playerNick);
        if (passwordEncoder.matches(request.getOldPass(), player.getPassword())) {
            player.setPassword(passwordEncoder.encode(request.getNewPass()));
            playerRepository.save(player);
        } else {
            throw PunsCoreApiException.passwordMismatch();
        }
    }

    @Override
    public PlayerSnapshot getPlayerByNick(String playerNick) {
        final Player player = findPlayerByNick(playerNick);
        return globalMapper.toPlayerSnapshot(player);
    }

    @Override
    public List<PlayerSnapshot> getAllPlayers() {
        return playerRepository.findAll().stream().map(globalMapper::toPlayerSnapshot).collect(Collectors.toList());
    }

    @Override
    public void setAvatar(SetAvatarRequest setAvatarRequest, String playerNick) {
        final Player player = findPlayerByNick(playerNick);
        final Media newAvatar = mediaService.getMediaEntityById(setAvatarRequest.getResourceId());
        if (player.hasAvatar()) {
            mediaService.setMediaAsUnused(player.getAvatar().getId());
        }
        player.setAvatar(newAvatar);
        playerRepository.save(player);
    }

    @Override
    public boolean isEmailTaken(String email) {
        final Optional<Player> player = playerRepository.findByEmailIgnoreCase(email);
        if (player.isPresent()) {
            return true;
        }
        return false;
    }

    @Override
    public boolean isNickTaken(String nick) {
        final Optional<Player> player = playerRepository.findByNickIgnoreCase(nick);
        if (player.isPresent()) {
            return true;
        }
        return false;
    }

    private Player findPlayerByNick(String nick) {
        final Player player = playerRepository.findByNickIgnoreCase(nick).orElseThrow(() -> PunsCoreApiException.resourceNotFound(format("User with nick '%s' not found", nick)));
        return player;
    }

}
