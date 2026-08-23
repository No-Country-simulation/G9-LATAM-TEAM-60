package energiai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalisisEnergeticoRequest {
    private String region;
    private double consumo_kwh;
    private boolean uso_horario_pico;
    private int cantidad_equipos;
    private String tipo_inmueble;
    private int horas_alto_consumo;

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public double getConsumo_kwh() {
        return consumo_kwh;
    }

    public void setConsumo_kwh(double consumo_kwh) {
        this.consumo_kwh = consumo_kwh;
    }

    public boolean isUso_horario_pico() {
        return uso_horario_pico;
    }

    public void setUso_horario_pico(boolean uso_horario_pico) {
        this.uso_horario_pico = uso_horario_pico;
    }

    public int getCantidad_equipos() {
        return cantidad_equipos;
    }

    public void setCantidad_equipos(int cantidad_equipos) {
        this.cantidad_equipos = cantidad_equipos;
    }

    public String getTipo_inmueble() {
        return tipo_inmueble;
    }

    public void setTipo_inmueble(String tipo_inmueble) {
        this.tipo_inmueble = tipo_inmueble;
    }

    public int getHoras_alto_consumo() {
        return horas_alto_consumo;
    }

    public void setHoras_alto_consumo(int horas_alto_consumo) {
        this.horas_alto_consumo = horas_alto_consumo;
    }
}
