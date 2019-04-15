package com.lukascode.puns.core.service;

import static java.lang.String.format;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;
import static org.springframework.http.HttpStatus.PAYLOAD_TOO_LARGE;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;

import com.lukascode.puns.core.controller.advice.ErrorDetails;

public class PunsCoreApiException extends RuntimeException {

    private ErrorDetails errorDetails;

    private PunsCoreApiException(int code, String message, String description, HttpStatus status) {
        errorDetails = new ErrorDetails(code, message, description, status);
    }

    public ErrorDetails getErrorDetails() {
        return errorDetails;
    }

    public static PunsCoreApiException httpMessageNotReadable(HttpMessageNotReadableException e) {
        return new PunsCoreApiException(4000, "HTTP_MESSAGE_NOT_READABLE", e.getMessage(), BAD_REQUEST);
    }

    public static PunsCoreApiException httpMessageNotWritable(HttpMessageNotWritableException e) {
        return new PunsCoreApiException(4001, "HTTP_MESSAGE_NOT_WRITABLE", e.getMessage(), INTERNAL_SERVER_ERROR);
    }

    public static PunsCoreApiException invalidMethodArgument(MethodArgumentNotValidException e) {
        return new PunsCoreApiException(4002, "METHOD_ARGUMENT_NOT_VALID", e.getMessage(), BAD_REQUEST);
    }

    public static PunsCoreApiException missingServletRequestParameter(MissingServletRequestParameterException e) {
        return new PunsCoreApiException(4003, "MISSING_REQUEST_PARAMETER", e.getMessage(), BAD_REQUEST);
    }

    public static PunsCoreApiException httpRequestMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        return new PunsCoreApiException(4004, "HTTP_REQUEST_METHOD_NOT_SUPPORTED", e.getMessage(), BAD_REQUEST);
    }

    public static PunsCoreApiException httpMediaTypeNotSupported(HttpMediaTypeNotSupportedException e) {
        return new PunsCoreApiException(4005, "HTTP_MEDIA_TYPE_NOT_SUPPORTED", e.getMessage(), UNSUPPORTED_MEDIA_TYPE);
    }

    public static PunsCoreApiException httpMediaTypeNotSupported() {
        return new PunsCoreApiException(4005, "HTTP_MEDIA_TYPE_NOT_SUPPORTED", null, UNSUPPORTED_MEDIA_TYPE);
    }

    public static PunsCoreApiException thereIsNoContentLengthHeader() {
        return new PunsCoreApiException(4006, "MISSING_CONTENT_LENGTH_HEADER", "Content-Length header is required", BAD_REQUEST);
    }

    public static PunsCoreApiException unexpectedServerError() {
        return new PunsCoreApiException(4007, "UNEXPECTED_SERVER_ERROR", null, INTERNAL_SERVER_ERROR);
    }

    public static PunsCoreApiException unexpectedServerError(String message) {
        return new PunsCoreApiException(4007, "UNEXPECTED_SERVER_ERROR", message, INTERNAL_SERVER_ERROR);
    }

    public static PunsCoreApiException authServerNotResponding() {
        return new PunsCoreApiException(4008, "AUTH_SERVER_NOT_RESPONDING", null, INTERNAL_SERVER_ERROR);
    }

    public static PunsCoreApiException mediaToLarge(Long maxSize) {
        return new PunsCoreApiException(4009, "MEDIA_TO_LARGE", format("The file is too large (max %s bytes)", maxSize), PAYLOAD_TOO_LARGE);
    }

    public static PunsCoreApiException systemStorageException(String message) {
        return new PunsCoreApiException(4010, "SYSTEM_STORAGE_EXCEPTION", message, INTERNAL_SERVER_ERROR);
    }

    public static PunsCoreApiException badCredentials() {
        return new PunsCoreApiException(1000, "BAD_CREDENTIALS", "Credentials are incorrect", BAD_REQUEST);
    }

    public static PunsCoreApiException invalidRefreshToken() {
        return new PunsCoreApiException(1001, "INVALID_REFRESH_TOKEN", null, BAD_REQUEST);
    }

    public static PunsCoreApiException userAlreadyExists(String field) {
        return new PunsCoreApiException(1002, "USER_ALREADY_EXISTS", format("User with this email %s already exists", field), BAD_REQUEST);
    }

    public static PunsCoreApiException resourceNotFound(String msg) {
        return new PunsCoreApiException(1003, "RESOURCE_NOT_FOUND", msg, NOT_FOUND);
    }

    public static PunsCoreApiException passwordMismatch() {
        return new PunsCoreApiException(1004, "PASSWORD_MISMATCH", "Old pass does not match the current one", BAD_REQUEST);
    }

}
