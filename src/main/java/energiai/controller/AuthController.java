package energiai.controller;

import energiai.dto.*;
import energiai.model.Users;
import energiai.repository.UserRepository;
import energiai.infra.security.SecurityConfiguration;
import energiai.infra.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private SecurityConfiguration securityConfiguration;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LogInDTO dto) {
        try {
            var token = new UsernamePasswordAuthenticationToken(dto.username(), dto.password());
            var auth = manager.authenticate(token);
            Users user = (Users) auth.getPrincipal();
            var tokenJWT = tokenService.createToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", tokenJWT);
            response.put("jwtToken", tokenJWT);
            response.put("username", user.getUsername());
            response.put("nombreCompleto", user.getNombreCompleto());
            response.put("role", "ROLE_USER");
            response.put("id", user.getId());

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Usuario o contraseña incorrectos"));
        }
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid CreateUserDataDTO dto) {
        if (userRepository.findByUsername(dto.username()) != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "El usuario ya existe"));
        }
        Users user = new Users();
        user.setNombreCompleto(dto.nombreCompleto() != null && !dto.nombreCompleto().isBlank() ? dto.nombreCompleto() : dto.username());
        user.setUsername(dto.username());
        user.setPassword(securityConfiguration.passwordEncoder().encode(dto.password()));
        userRepository.save(user);

        var tokenJWT = tokenService.createToken(user);
        Map<String, Object> response = new HashMap<>();
        response.put("token", tokenJWT);
        response.put("jwtToken", tokenJWT);
        response.put("username", user.getUsername());
        response.put("nombreCompleto", user.getNombreCompleto());
        response.put("role", "ROLE_USER");
        response.put("id", user.getId());

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        Users user = (Users) userRepository.findByUsername(auth.getName());
        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("nombreCompleto", user.getNombreCompleto());
        response.put("role", "ROLE_USER");

        return ResponseEntity.ok(response);
    }
}
