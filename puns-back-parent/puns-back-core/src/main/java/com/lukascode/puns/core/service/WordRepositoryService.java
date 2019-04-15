package com.lukascode.puns.core.service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.lukascode.puns.core.api.WordService;
import com.lukascode.puns.core.mapping.Word;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class WordRepositoryService implements WordService {

    private final WordRepository wordRepository;

    @Override
    public String getRandomWord() {
        log.info("Getting random word");
        final Random random = new Random();
        final List<Word> allWords = wordRepository.findAll();
        final String randomWord = allWords.get(random.nextInt(allWords.size())).getWord();
        log.info("Got random word {value: {}}", randomWord);
        return randomWord;
    }

    @Override
    public List<String> getAllWords() {
        log.info("Getting all words");
        final List<Word> allWords = wordRepository.findAll();
        log.info("Got all words {size: {}}", allWords.size());
        return allWords.stream().map(Word::getWord).collect(Collectors.toList());
    }
}
