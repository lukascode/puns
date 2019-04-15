package com.lukascode.puns.core.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lukascode.puns.core.api.WordService;
import com.lukascode.puns.core.service.MediaRepository;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/words")
public class WordController {

    private final WordService wordService;
    private final MediaRepository mediaRepository;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<String> getAllWords() {
        log.info("Received getAllWords request");
        return wordService.getAllWords();
    }

    @RequestMapping(value = "/random", method = RequestMethod.GET)
    public String getRandomWord() {
        log.info("Received getRandomWord request");
        return wordService.getRandomWord();
    }

}

