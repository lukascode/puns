package com.lukascode.puns.core.service;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lukascode.puns.core.mapping.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByNickIgnoreCase(String nick);

    Optional<Player> findByEmailIgnoreCase(String email);

}
