package energiai.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateUserDataDTO(
        @NotBlank String nombreCompleto,
        @NotBlank String username,
        @NotBlank String password
) {
}
