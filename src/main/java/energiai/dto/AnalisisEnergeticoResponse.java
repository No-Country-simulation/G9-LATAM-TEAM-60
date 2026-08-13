package energiai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalisisEnergeticoResponse {
    private Long id;
    private String identificador;
    private String categoria;
    private double probabilidad;
    private double costo_estimado_mensual;
    private List<String> recomendaciones;
    private String fecha;

    private Double consumo_kwh;
    private String tipo_inmueble;
    private Integer cantidad_equipos;
    private Boolean uso_horario_pico;
    private Integer horas_alto_consumo;
    private String region;
    private AnalisisEnergeticoRequest request;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public double getProbabilidad() {
        return probabilidad;
    }

    public void setProbabilidad(double probabilidad) {
        this.probabilidad = probabilidad;
    }

    public double getCosto_estimado_mensual() {
        return costo_estimado_mensual;
    }

    public void setCosto_estimado_mensual(double costo_estimado_mensual) {
        this.costo_estimado_mensual = costo_estimado_mensual;
    }

    public List<String> getRecomendaciones() {
        return recomendaciones;
    }

    public void setRecomendaciones(List<String> recomendaciones) {
        this.recomendaciones = recomendaciones;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public Double getConsumo_kwh() {
        return consumo_kwh;
    }

    public void setConsumo_kwh(Double consumo_kwh) {
        this.consumo_kwh = consumo_kwh;
    }

    public String getTipo_inmueble() {
        return tipo_inmueble;
    }

    public void setTipo_inmueble(String tipo_inmueble) {
        this.tipo_inmueble = tipo_inmueble;
    }

    public Integer getCantidad_equipos() {
        return cantidad_equipos;
    }

    public void setCantidad_equipos(Integer cantidad_equipos) {
        this.cantidad_equipos = cantidad_equipos;
    }

    public Boolean isUso_horario_pico() {
        return uso_horario_pico;
    }

    public void setUso_horario_pico(Boolean uso_horario_pico) {
        this.uso_horario_pico = uso_horario_pico;
    }

    public Integer getHoras_alto_consumo() {
        return horas_alto_consumo;
    }

    public void setHoras_alto_consumo(Integer horas_alto_consumo) {
        this.horas_alto_consumo = horas_alto_consumo;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public AnalisisEnergeticoRequest getRequest() {
        return request;
    }

    public void setRequest(AnalisisEnergeticoRequest request) {
        this.request = request;
    }
}
