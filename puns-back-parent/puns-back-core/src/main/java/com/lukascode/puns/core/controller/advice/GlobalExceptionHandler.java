package com.lukascode.puns.core.controller.advice;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.lukascode.puns.core.service.PunsCoreApiException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        final ErrorDetails errorDetails = PunsCoreApiException.httpMessageNotReadable(ex).getErrorDetails();
        return responseEntity(errorDetails);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        final ErrorDetails errorDetails = PunsCoreApiException.httpMessageNotWritable(ex).getErrorDetails();
        return responseEntity(errorDetails);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        final ErrorDetails errorDetails = PunsCoreApiException.invalidMethodArgument(ex).getErrorDetails();
        return responseEntity(errorDetails);
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        final ErrorDetails errorDetails = PunsCoreApiException.missingServletRequestParameter(ex).getErrorDetails();
        return responseEntity(errorDetails);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        final ErrorDetails errorDetails = PunsCoreApiException.httpMediaTypeNotSupported(ex).getErrorDetails();
        return responseEntity(errorDetails);
    }

    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        final ErrorDetails errorDetails = PunsCoreApiException.httpRequestMethodNotSupported(ex).getErrorDetails();
        return responseEntity(errorDetails);
    }

    @ExceptionHandler(PunsCoreApiException.class)
    public ResponseEntity<Object> handleApiException(PunsCoreApiException e) {
        log.error("PunsCoreApiException caught", e);
        final ErrorDetails errorDetails = e.getErrorDetails();
        return responseEntity(errorDetails);
    }

    private ResponseEntity<Object> responseEntity(ErrorDetails errorDetails) {
        return new ResponseEntity<>(errorDetails, errorDetails.getStatus());
    }
}
