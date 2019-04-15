package com.lukascode.puns.core.controller.advice;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ErrorDetails {

    private int code;

    private String message;

    private String description;

    private HttpStatus status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private LocalDateTime timestamp;

    public ErrorDetails(int code, String message, String description, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.description = description;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

}
