package com.lukascode.puns.core.service;

import static java.lang.String.format;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.lukascode.puns.core.api.AuthorizationService;
import com.lukascode.puns.core.api.dto.AccessToken;
import com.lukascode.puns.core.api.dto.LoginRequest;
import com.lukascode.puns.core.api.dto.RefreshTokenRequest;
import com.lukascode.puns.core.configuration.security.SecurityProperties;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PlayerAuthorizationService implements AuthorizationService {

    private final SecurityProperties securityProperties;

    private final RestTemplate restTemplate;

    public PlayerAuthorizationService(SecurityProperties securityProperties, RestTemplateBuilder restTemplateBuilder) {
        this.securityProperties = securityProperties;
        this.restTemplate = restTemplateBuilder.build();
    }

    @Override
    public AccessToken getToken(LoginRequest loginRequest) {
        log.info("Getting token for user {}", loginRequest.getNick());
        final HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(prepareFormData(loginRequest), prepareHeaders());
        return postForAccessToken(requestEntity);
    }

    @Override
    public AccessToken refreshToken(RefreshTokenRequest refreshTokenRequest) {
        log.info("Refreshing token");
        final HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(prepareFormData(refreshTokenRequest), prepareHeaders());
        return postForAccessToken(requestEntity);
    }

    private AccessToken postForAccessToken(HttpEntity<MultiValueMap<String, String>> requestEntity) {
        ResponseEntity<AccessToken> response;
        try {
            response = restTemplate.exchange(securityProperties.getAuthServerTokenUrl(), HttpMethod.POST, requestEntity, AccessToken.class);
        } catch (HttpStatusCodeException e) {
            if (e.getStatusCode().value() == 400) {
                throw PunsCoreApiException.badCredentials();
            } else if (e.getStatusCode().value() == 401) {
                throw PunsCoreApiException.invalidRefreshToken();
            }
            throw PunsCoreApiException.unexpectedServerError();
        } catch(ResourceAccessException e) {
            throw PunsCoreApiException.authServerNotResponding();
        } catch(RestClientException e) {
            throw PunsCoreApiException.unexpectedServerError();
        }
        return response.getBody();
    }

    private MultiValueMap<String, String> prepareFormData(LoginRequest loginRequest) {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add(OAuthConstants.GRANT_TYPE, OAuthConstants.GRANT_TYPE_PASSWORD);
        map.add(OAuthConstants.USERNAME, loginRequest.getNick());
        map.add(OAuthConstants.PASSWORD, loginRequest.getPassword());
        return map;
    }

    private MultiValueMap<String, String> prepareFormData(RefreshTokenRequest refreshTokenRequest) {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add(OAuthConstants.GRANT_TYPE, OAuthConstants.GRANT_TYPE_REFRESH_TOKEN);
        map.add(OAuthConstants.REFRESH_TOKEN, refreshTokenRequest.getRefreshToken());
        return map;
    }

    private HttpHeaders prepareHeaders() {
        HttpHeaders headers = new HttpHeaders();
        appendTokenAccessAuth(headers).setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }

    private HttpHeaders appendTokenAccessAuth(HttpHeaders headers) {
        String authParams = format("%s:%s", securityProperties.getClientId(), securityProperties.getClientSecret());
        authParams = Base64Utils.encodeToString(authParams.getBytes());
        headers.set(OAuthConstants.AUTHORIZATION, format("%s %s", OAuthConstants.AUTHORIZATION_TYPE, authParams));
        return headers;
    }

    private class OAuthConstants {

        static final String AUTHORIZATION = "Authorization";

        static final String AUTHORIZATION_TYPE = "Basic";

        static final String GRANT_TYPE = "grant_type";

        static final String GRANT_TYPE_PASSWORD = "password";

        static final String GRANT_TYPE_REFRESH_TOKEN = "refresh_token";

        static final String REFRESH_TOKEN = "refresh_token";

        static final String USERNAME = "username";

        static final String PASSWORD = "password";

    }

}
