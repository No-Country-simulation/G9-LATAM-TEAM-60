package energiai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserReturnDTO {
    private String nombreCompleto;
    private String username;

    public String nombreCompleto() {
        return nombreCompleto;
    }

    public String username() {
        return username;
    }
}
