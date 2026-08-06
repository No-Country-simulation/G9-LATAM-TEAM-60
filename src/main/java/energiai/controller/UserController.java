package energiai.controller;

import energiai.dto.CreateUserDataDTO;
import energiai.dto.CreateUserReturnDTO;
import energiai.dto.LogInDTO;
import energiai.model.Users;
import energiai.repository.UserRepository;
import energiai.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;

/**
 * Controlador de gestión de usuarios legacy (/users).
 * Delega la lógica de autenticación y registro a UsuarioService para evitar duplicación de código.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private final UsuarioService usuarioService;
    private final UserRepository userRepository;

    public UserController(UsuarioService usuarioService, UserRepository userRepository) {
        this.usuarioService = usuarioService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> createUser(@RequestBody @Valid CreateUserDataDTO dto, UriComponentsBuilder uri) {
        try {
            Users user = usuarioService.registrarUsuario(dto);
            URI newUri = uri.path("/users/{id}").buildAndExpand(user.getId()).toUri();
            return ResponseEntity.created(newUri).body(new CreateUserReturnDTO(user.getNombreCompleto(), user.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok().body(userRepository.findAll().stream()
                .map(u -> new CreateUserReturnDTO(u.getNombreCompleto(), u.getUsername())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LogInDTO dto) {
        try {
            Map<String, Object> response = usuarioService.autenticarUsuario(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Usuario o contraseña incorrectos"));
        }
    }
}
