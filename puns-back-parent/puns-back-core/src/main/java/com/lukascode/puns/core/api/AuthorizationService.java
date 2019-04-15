package com.lukascode.puns.core.api;

import com.lukascode.puns.core.api.dto.AccessToken;
import com.lukascode.puns.core.api.dto.LoginRequest;
import com.lukascode.puns.core.api.dto.RefreshTokenRequest;

public interface AuthorizationService {

    AccessToken getToken(LoginRequest loginRequest);

    AccessToken refreshToken(RefreshTokenRequest refreshTokenRequest);

}
