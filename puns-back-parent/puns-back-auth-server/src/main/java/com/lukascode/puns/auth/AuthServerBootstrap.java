package com.lukascode.puns.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.lukascode.puns.core.mapping.Player;
import com.lukascode.puns.core.service.PlayerRepository;

@SpringBootApplication
@EntityScan(basePackageClasses = Player.class)
@EnableJpaRepositories(basePackageClasses = PlayerRepository.class)
public class AuthServerBootstrap {

    public static void main(String[] args) {
        SpringApplication.run(AuthServerBootstrap.class, args);
    }
}
