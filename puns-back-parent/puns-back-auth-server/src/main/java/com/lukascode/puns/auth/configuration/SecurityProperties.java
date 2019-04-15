package com.lukascode.puns.auth.configuration;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "puns.security")
@Data
@Validated
public class SecurityProperties {

    @NotBlank
    private String signingKey;

    @NotBlank
    private String punsWebClientId;

    @NotBlank
    private String punsWebClientSecret;

    @NotNull
    private Integer punsWebClientTokenExpiresIn;

    @NotNull
    private Integer punsWebClientRefreshTokenExpiresIn;

    @NotBlank
    private String punsLiveServerClientId;

    @NotBlank
    private String punsLiveServerClientSecret;

    @NotNull
    private Integer punsLiveServerClientTokenExpiresIn;

}
