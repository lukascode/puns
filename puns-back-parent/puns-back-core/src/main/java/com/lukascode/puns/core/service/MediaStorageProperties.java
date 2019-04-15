package com.lukascode.puns.core.service;

import java.util.Map;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.ToString;

@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "puns.storage")
@ToString
public class MediaStorageProperties {

    @NotBlank
    private String rootPath;

    @NotNull
    private Long maxFileSize;

    @NotNull
    private Map<String, String> supportedMediaTypes;

}
