package energiai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta con el Token JWT de autenticación.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenJWTDataDTO {
    private String token;
}
