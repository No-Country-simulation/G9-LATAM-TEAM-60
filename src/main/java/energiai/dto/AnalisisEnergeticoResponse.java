package energiai.dto;

import java.util.List;

public class AnalisisEnergeticoResponse {
    private String categoria;
    private double probabilidad;
    private List<String> recomendaciones;
    private double costo_estimado_mensual;

    // Constructor vacío
    public AnalisisEnergeticoResponse() {}

    // --- GETTERS Y SETTERS ---

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public double getProbabilidad() { return probabilidad; }
    public void setProbabilidad(double probabilidad) { this.probabilidad = probabilidad; }

    public List<String> getRecomendaciones() { return recomendaciones; }
    public void setRecomendaciones(List<String> recomendaciones) { this.recomendaciones = recomendaciones; }

    public double getCosto_estimado_mensual() { return costo_estimado_mensual; }
    public void setCosto_estimado_mensual(double costo_estimado_mensual) { this.costo_estimado_mensual = costo_estimado_mensual; }


}
