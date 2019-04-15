package com.lukascode.puns.core.service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.lukascode.puns.core.mapping.Media;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class MediaScheduledTasks {

    private final MediaRepository mediaRepository;
    private final MediaStorageProperties mediaStorageProperties;

    @Scheduled(fixedDelay = 300000L) // 5 minutes
    public void removeUnusedMediaTask() {

        log.info("removeUnusedMediaTask started");

        List<Media> resources = mediaRepository.findByIsUsed(false);

        resources.forEach(m -> {

            final Path path = Paths.get(mediaStorageProperties.getRootPath(), m.getStoragePath());

            log.info("Trying to delete a file: {} from the file system", path.toAbsolutePath());

            final File file = path.toFile();
            if (file.exists() && file.isFile()) {
                file.delete();
                log.info("A File: {} successfully deleted from the file system", path.toAbsolutePath());
            }

        });

        mediaRepository.deleteAll(resources);

        log.info("removeUnusedMediaTask finished");

    }

}
