package energiai.service;

import energiai.dto.CreateUserDataDTO;
import energiai.dto.LogInDTO;
import energiai.model.Users;
import energiai.repository.UserRepository;
import energiai.infra.security.SecurityConfiguration;
import energiai.infra.security.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Servicio centralizado para gestionar usuarios y autenticación.
 * Elimina la duplicación de código entre controladores.
 */
@Service
public class UsuarioService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final AuthenticationManager manager;
    private final SecurityConfiguration securityConfiguration;

    public UsuarioService(UserRepository userRepository,
                          TokenService tokenService,
                          AuthenticationManager manager,
                          SecurityConfiguration securityConfiguration) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.manager = manager;
        this.securityConfiguration = securityConfiguration;
    }

    public Map<String, Object> autenticarUsuario(LogInDTO dto) {
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

        return response;
    }

    @Transactional
    public Users registrarUsuario(CreateUserDataDTO dto) {
        if (userRepository.findByUsername(dto.username()) != null) {
            throw new IllegalArgumentException("El usuario ya existe");
        }
        Users user = new Users();
        user.setNombreCompleto(dto.nombreCompleto() != null && !dto.nombreCompleto().isBlank() ? dto.nombreCompleto() : dto.username());
        user.setUsername(dto.username());
        user.setPassword(securityConfiguration.passwordEncoder().encode(dto.password()));
        return userRepository.save(user);
    }
}
