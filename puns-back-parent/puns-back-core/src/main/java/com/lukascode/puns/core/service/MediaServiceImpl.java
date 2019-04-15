package com.lukascode.puns.core.service;

import static java.lang.String.format;
import static java.util.Objects.nonNull;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;

import com.lukascode.puns.core.api.MediaService;
import com.lukascode.puns.core.api.dto.MediaUploadResponse;
import com.lukascode.puns.core.mapping.Media;
import com.lukascode.puns.core.utils.MediaUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final GlobalMapper globalMapper;
    private final MediaRepository mediaRepository;
    private final MediaStorageProperties mediaStorageProperties;
    private final MediaUtils mediaUtils;

    @Override
    @Transactional
    public MediaUploadResponse uploadMedia(HttpServletRequest request) {

        mediaUtils.validateMediaUploadRequest(request);

        final String extension = grabExtension(request);

        final String filename = grabFilename(request).orElseGet(() -> "unnamed" + extension);

        Media media = Media.builder()
                .fileName(filename)
                .isUsed(true)
                .creationTime(LocalDateTime.now())
                .build();

        media = mediaRepository.save(media);

        final String storageFilename = media.getId().toString() + extension;

        final Path path = Paths.get(mediaStorageProperties.getRootPath(), storageFilename);

        log.info("Storing media { filename: {}, path: {}", filename, path.toAbsolutePath());

        try {
            storeFile(request.getInputStream(), path);
        } catch (IOException e) {
            throw PunsCoreApiException.unexpectedServerError(e.getMessage());
        }

        media.setStoragePath(storageFilename);
        media = mediaRepository.save(media);

        return globalMapper.toMediaUploadResponse(media);

    }

    @Override
    @Transactional
    public void downloadMedia(HttpServletResponse response, UUID uuid) {

        final Media media = findMedia(uuid);

        final String storagePath = media.getStoragePath() != null ? media.getStoragePath() : "";

        final Path resource = Paths.get(mediaStorageProperties.getRootPath(), storagePath);

        serveFile(response, resource, media.getFileName());

    }

    @Override
    @Transactional
    public Media getMediaEntityById(UUID id) {
        return findMedia(id);
    }

    @Override
    @Transactional
    public void setMediaAsUnused(UUID uuid) {
        final Media media = findMedia(uuid);
        media.setIsUsed(false);
        mediaRepository.save(media);
    }

    @PostConstruct
    public void initialize() {
        final Path storagePath = Paths.get(mediaStorageProperties.getRootPath());
        try {
            log.info("Init media storage service path { path: {}}", storagePath);
            Files.createDirectories(storagePath);
        } catch (IOException e) {
            log.error("Init media storage service error {path: {}}", storagePath, e);
        }
    }

    private void storeFile(InputStream in, Path path) {
        try {
            FileUtils.copyInputStreamToFile(in, path.toFile());
        } catch (IOException e) {
            log.error("Storing file error {path: {}}", path.toAbsolutePath(), e);
            throw PunsCoreApiException.systemStorageException(e.getMessage());
        }
    }

    private void serveFile(HttpServletResponse response, Path resource, String responseFilename) {
        try {
            if (Files.exists(resource)) {
                String contentType = Files.probeContentType(resource);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                response.setContentType(contentType);
                response.setHeader("Content-Disposition", String.format("inline; filename=\"" + responseFilename + "\""));

                response.setContentLength((int) Files.size(resource));
                FileCopyUtils.copy(Files.newInputStream(resource), response.getOutputStream());
            } else {
                throw PunsCoreApiException.systemStorageException(format("Resource '%s' not exists on file system", resource.toAbsolutePath()));
            }
        } catch (IOException e) {
            throw PunsCoreApiException.unexpectedServerError();
        }
    }

    private Optional<String> grabFilename(HttpServletRequest request) {
        final String disposition = request.getHeader("Content-Disposition");
        return nonNull(disposition) ? Optional.of(disposition.replaceFirst("(?i)^.*filename=\"?([^\"]+)\"?.*$", "$1")) : Optional.empty();
    }

    private String grabExtension(HttpServletRequest request) {
        return mediaStorageProperties.getSupportedMediaTypes().get(request.getContentType());
    }

    private Media findMedia(UUID uuid) {
        return mediaRepository.findById(uuid).orElseThrow(() -> {
            final String msg = format("Media with id: %s not found", uuid);
            log.error(msg);
            return PunsCoreApiException.resourceNotFound(msg);
        });
    }

}
