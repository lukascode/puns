package com.lukascode.puns.core.configuration.security;

import javax.validation.constraints.NotBlank;

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
    private String clientId;

    @NotBlank
    private String clientSecret;

    @NotBlank
    private String punsCoreApiResourceId;

    @NotBlank
    private String authServerTokenUrl;

}
