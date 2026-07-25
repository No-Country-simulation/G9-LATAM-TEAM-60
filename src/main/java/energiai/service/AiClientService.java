package energiai.service;


import energiai.dto.AnalisisEnergeticoRequest;
import energiai.dto.AnalisisEnergeticoResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class AiClientService {


    // Este método es nuestro "MOCK INICIAL".
    // Más adelante, aquí haremos una petición HTTP a la API de Python.
    public AnalisisEnergeticoResponse obtenerAnalisis(AnalisisEnergeticoRequest request) {

        // Creamos el objeto de respuesta que devolveremos
        AnalisisEnergeticoResponse mockResponse = new AnalisisEnergeticoResponse();

        // 1. MOCK DE LA IA: Simulamos reglas básicas para clasificar el consumo
        double consumo = request.getConsumo_kwh();

        // 2. MOCK FINANCIERO: Cálculo de la tarifa (R$ 0.75)
        double tarifaBase = 0.75;
        mockResponse.setCosto_estimado_mensual(consumo * tarifaBase);

        return mockResponse;
    }










}
