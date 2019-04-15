package com.lukascode.puns.core.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lukascode.puns.core.mapping.Media;

public interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findByIsUsed(Boolean isUsed);
}
