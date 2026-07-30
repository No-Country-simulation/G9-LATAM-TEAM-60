package energiai.dto;

import java.time.LocalDateTime;

// Estructura estándar de respuesta de error para toda la API.
// La usa el GlobalExceptionHandler para devolver siempre el mismo formato.
public record ErrorResponseDTO(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path
) {
    public ErrorResponseDTO(int status, String error, String message, String path) {
        this(LocalDateTime.now(), status, error, message, path);
    }
}