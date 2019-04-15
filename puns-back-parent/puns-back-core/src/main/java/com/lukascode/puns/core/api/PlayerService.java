package com.lukascode.puns.core.api;

import java.util.List;

import com.lukascode.puns.core.api.dto.ChangePassRequest;
import com.lukascode.puns.core.api.dto.PlayerSnapshot;
import com.lukascode.puns.core.api.dto.RegisterRequest;
import com.lukascode.puns.core.api.dto.SetAvatarRequest;

public interface PlayerService {

    Long register(RegisterRequest request);

    void changePass(ChangePassRequest request, String playerNick);

    PlayerSnapshot getPlayerByNick(String playerNick);

    List<PlayerSnapshot> getAllPlayers();

    void setAvatar(SetAvatarRequest setAvatarRequest, String playerNick);

    boolean isEmailTaken(String email);

    boolean isNickTaken(String nick);
}
