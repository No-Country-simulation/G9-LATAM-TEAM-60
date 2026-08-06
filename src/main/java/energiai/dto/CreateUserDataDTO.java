package energiai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDataDTO {
    @NotBlank
    private String nombreCompleto;
    @NotBlank
    private String username;
    @NotBlank
    private String password;

    public String username() {
        return username;
    }

    public String password() {
        return password;
    }

    public String nombreCompleto() {
        return nombreCompleto;
    }
}
