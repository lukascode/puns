package com.lukascode.puns.auth.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lukascode.puns.core.mapping.Player;
import com.lukascode.puns.core.service.PlayerRepository;

import static java.lang.String.format;

@Service("playerDetailsService")
public class PlayerDetailsService implements UserDetailsService {

    @Autowired
    private PlayerRepository playerRepository;

    @Override
    public UserDetails loadUserByUsername(String nick) throws UsernameNotFoundException {
        return new PlayerDetails(findPlayerBy(nick));
    }

    private Player findPlayerBy(String nick) {
        final Player player = playerRepository.findByNickIgnoreCase(nick)
                .orElseThrow(() -> new UsernameNotFoundException(format("Username '%s' not found", nick)));
        return player;
    }
}
