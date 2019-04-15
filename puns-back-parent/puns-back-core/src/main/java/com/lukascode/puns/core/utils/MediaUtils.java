package com.lukascode.puns.core.utils;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import com.lukascode.puns.core.service.MediaStorageProperties;
import com.lukascode.puns.core.service.PunsCoreApiException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MediaUtils {

    private final MediaStorageProperties mediaStorageProperties;

    public void validateMediaUploadRequest(HttpServletRequest request) {
        if (request.getContentLengthLong() < 0L) {
            throw PunsCoreApiException.thereIsNoContentLengthHeader();
        }
        if (request.getContentLengthLong() > mediaStorageProperties.getMaxFileSize()) {
            throw PunsCoreApiException.mediaToLarge(mediaStorageProperties.getMaxFileSize());
        }
        final String contentType = request.getContentType();
        if (mediaStorageProperties.getSupportedMediaTypes().get(contentType) == null) {
            throw PunsCoreApiException.httpMediaTypeNotSupported();
        }
    }

}
