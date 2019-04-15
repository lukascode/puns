package com.lukascode.puns.core.service;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lukascode.puns.core.mapping.Word;

public interface WordRepository extends JpaRepository<Word, Long> {

    Optional<Word> findByWord(String word);
}
