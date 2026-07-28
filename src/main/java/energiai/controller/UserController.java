package energiai.controller;

import energiai.dto.CreateUserDataDTO;
import energiai.dto.CreateUserReturnDTO;
import energiai.dto.LogInDTO;
import energiai.dto.TokenJWTDataDTO;
import energiai.model.Users;
import energiai.repository.UserRepository;
import energiai.infra.security.SecurityConfiguration;
import energiai.infra.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private SecurityConfiguration securityConfiguration;

    @Transactional
    @PostMapping("/signin")
    public ResponseEntity createUser(@RequestBody @Valid CreateUserDataDTO dto, UriComponentsBuilder uri) {
        if (userRepository.findByUsername(dto.username()) != null) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
        }
        Users user = new Users();
        user.setNombreCompleto(dto.nombreCompleto());
        user.setUsername(dto.username());
        user.setPassword(securityConfiguration.passwordEncoder().encode(dto.password()));
        userRepository.save(user);

        URI newUri = uri.path("/users/{id}").buildAndExpand(user.getId()).toUri();
        return ResponseEntity.created(newUri).body(new CreateUserReturnDTO(dto.nombreCompleto(), dto.username()));
    }

    @GetMapping
    public ResponseEntity getUsers() {
        return ResponseEntity.ok().body(userRepository.findAll().stream()
                .map(u -> new CreateUserReturnDTO(u.getNombreCompleto(), u.getUsername())));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid LogInDTO dto) {
        var token = new UsernamePasswordAuthenticationToken(dto.username(), dto.password());
        var auth = manager.authenticate(token);
        var tokenJWT = tokenService.createToken((Users) auth.getPrincipal());

        return ResponseEntity.ok(new TokenJWTDataDTO(tokenJWT));
    }
}
