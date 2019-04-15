package com.lukascode.puns.core.service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lukascode.puns.core.mapping.Score;

public interface ScoreRepository extends JpaRepository<Score, Long> {
}
