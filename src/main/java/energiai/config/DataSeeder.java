package energiai.config;

import energiai.infra.security.SecurityConfiguration;
import energiai.model.Users;
import energiai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityConfiguration securityConfiguration;

    @Override
    public void run(String... args) throws Exception {
        crearUsuarioSiNoExiste("admin", "password123", "Administrador Principal");
        crearUsuarioSiNoExiste("user", "password123", "Usuario Demo");
        crearUsuarioSiNoExiste("jorel", "password123", "Jorel");
        crearUsuarioSiNoExiste("jorell@correo.cl", "password123", "Jorell");
    }

    private void crearUsuarioSiNoExiste(String username, String rawPassword, String nombreCompleto) {
        if (userRepository.findByUsername(username) == null) {
            Users u = new Users();
            u.setUsername(username);
            u.setPassword(securityConfiguration.passwordEncoder().encode(rawPassword));
            u.setNombreCompleto(nombreCompleto);
            userRepository.save(u);
            System.out.println("[DataSeeder] Usuario creado por defecto: " + username);
        }
    }
}
