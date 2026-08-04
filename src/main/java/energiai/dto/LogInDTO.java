package energiai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogInDTO {
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
}
