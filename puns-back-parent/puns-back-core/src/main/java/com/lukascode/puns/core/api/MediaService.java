package com.lukascode.puns.core.api;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lukascode.puns.core.api.dto.MediaUploadResponse;
import com.lukascode.puns.core.mapping.Media;

public interface MediaService {

    MediaUploadResponse uploadMedia(HttpServletRequest request);

    void downloadMedia(HttpServletResponse response, UUID uuid);

    Media getMediaEntityById(UUID id);

    void setMediaAsUnused(UUID uuid);

}
