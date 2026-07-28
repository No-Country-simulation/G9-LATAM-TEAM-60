package energiai.dto;

import jakarta.validation.constraints.NotBlank;

public record LogInDTO(
        @NotBlank String username,
        @NotBlank String password
) {
}
