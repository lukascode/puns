package com.lukascode.puns.core.api.dto;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class ChangePassRequest {

    @NotBlank
    private String oldPass;

    @NotBlank
    private String newPass;

}
