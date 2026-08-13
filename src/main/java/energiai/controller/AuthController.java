package energiai.controller;

import energiai.dto.*;
import energiai.model.Users;
import energiai.repository.UserRepository;
import energiai.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST para la autenticación y registro de usuarios mediante JWT.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final UserRepository userRepository;

    public AuthController(UsuarioService usuarioService, UserRepository userRepository) {
        this.usuarioService = usuarioService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LogInDTO dto) {
        try {
            Map<String, Object> response = usuarioService.autenticarUsuario(dto);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Usuario o contraseña incorrectos"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid CreateUserDataDTO dto) {
        try {
            usuarioService.registrarUsuario(dto);
            Map<String, Object> response = usuarioService.autenticarUsuario(new LogInDTO(dto.username(), dto.password()));
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
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
