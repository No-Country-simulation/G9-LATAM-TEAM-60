package energiai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {
    private long totalConsultas;
    private double consumoPromedioKwh;
    private double costoTotalEstimado;
    private Map<String, Long> distribucionCategorias;
    private List<AnalisisEnergeticoResponse> analisisRecientes;
}
