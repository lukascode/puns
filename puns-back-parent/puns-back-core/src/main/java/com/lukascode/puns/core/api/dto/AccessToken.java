package com.lukascode.puns.core.api.dto;

import lombok.Data;

@Data
public class AccessToken {

    private String access_token;

    private String token_type;

    private String refresh_token;

    private Integer expires_in;

    private String scope;

    private String jti;

}
