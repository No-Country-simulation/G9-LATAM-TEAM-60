package energiai.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import energiai.model.Users;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.secret}")
    private String secret;

    public String createToken(Users user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("EnergiAI")
                    .withSubject(user.getUsername())
                    .withExpiresAt(ExpiryDate())
                    .sign(algorithm);
        } catch (JWTCreationException e){
            throw new RuntimeException("Error al crear el token de seguridad \n" + e.getMessage());
        }
    }

    private Instant ExpiryDate() {
        return LocalDateTime.now().plusDays(30).toInstant(ZoneOffset.of("-03:00"));
    }

    public String getSubject(String token) {
        if (token == null) {
            throw new RuntimeException();
        }

        DecodedJWT verifier = null;
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            verifier = JWT.require(algorithm)
                    .withIssuer("EnergiAI")
                    .build()
                    .verify(token);
        } catch (JWTVerificationException e) {
            System.out.println("Ocurrió un error mientras se verificaba el token de seguridad \n" + e.getMessage());
        }

        if (verifier.getSubject() == null) {
            throw new RuntimeException();
        }
        return verifier.getSubject();
    }
}
