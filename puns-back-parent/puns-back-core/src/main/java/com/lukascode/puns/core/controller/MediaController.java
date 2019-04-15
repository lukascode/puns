package com.lukascode.puns.core.controller;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lukascode.puns.core.api.MediaService;
import com.lukascode.puns.core.api.dto.MediaUploadResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/media")
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public MediaUploadResponse uploadMedia(HttpServletRequest request) {
        log.info("Received uploadMedia request");
        return mediaService.uploadMedia(request);
    }

    @GetMapping("/download/{uuid}")
    public void downloadMedia(HttpServletResponse response, @PathVariable UUID uuid) {
        log.info("Received downloadMedia request { uuid: {} }", uuid);
        mediaService.downloadMedia(response, uuid);
    }

}
