package energiai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "analisis_energetico_response")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalisisEnergeticoResponseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private AnalisisEnergeticoRequestEntity request;

    private String categoria;

    private Double probabilidad;

    @Column(name = "costo_estimado_mensual")
    private Double costoEstimadoMensual;

    @Column(name = "recomendaciones", length = 2000)
    private String recomendaciones;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AnalisisEnergeticoRequestEntity getRequest() {
        return request;
    }

    public void setRequest(AnalisisEnergeticoRequestEntity request) {
        this.request = request;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Double getProbabilidad() {
        return probabilidad;
    }

    public void setProbabilidad(Double probabilidad) {
        this.probabilidad = probabilidad;
    }

    public Double getCostoEstimadoMensual() {
        return costoEstimadoMensual;
    }

    public void setCostoEstimadoMensual(Double costoEstimadoMensual) {
        this.costoEstimadoMensual = costoEstimadoMensual;
    }

    public String getRecomendaciones() {
        return recomendaciones;
    }

    public void setRecomendaciones(String recomendaciones) {
        this.recomendaciones = recomendaciones;
    }

    public List<String> getRecomendacionesList() {
        if (this.recomendaciones == null || this.recomendaciones.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(this.recomendaciones.split(";;;"))
                .map(s -> s.trim())
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public void setRecomendacionesList(List<String> list) {
        if (list == null || list.isEmpty()) {
            this.recomendaciones = "";
        } else {
            this.recomendaciones = String.join(";;;", list);
        }
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
