package com.Uptc.ProyectoFinal.Controller;
import com.Uptc.ProyectoFinal.Entities.Conexion;
import com.Uptc.ProyectoFinal.Entities.Municipio;
import com.Uptc.ProyectoFinal.Entities.RutaResultado;
import com.Uptc.ProyectoFinal.Services.GrafoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boyaca")
@CrossOrigin(origins = "*")
public class MapaController {
    
    @Autowired
    private GrafoService grafoService;
    
    @GetMapping("/municipios")
    public ResponseEntity<Map<String, Municipio>> obtenerMunicipios() {
        return ResponseEntity.ok(grafoService.obtenerTodosMunicipios());
    }
    
    @GetMapping("/municipios/{codigo}/conexiones")
    public ResponseEntity<List<Conexion>> obtenerConexiones(@PathVariable String codigo) {
        return ResponseEntity.ok(grafoService.obtenerConexiones(codigo));
    }
    
    @GetMapping("/ruta")
    public ResponseEntity<RutaResultado> calcularRuta(
            @RequestParam String origen,
            @RequestParam String destino) {
        return ResponseEntity.ok(grafoService.calcularRutaMasCorta(origen, destino));
    }
    
    @GetMapping("/municipios/{codigo}/cercanos")
    public ResponseEntity<List<Municipio>> obtenerCercanos(
            @PathVariable String codigo,
            @RequestParam(defaultValue = "50") double radio) {
        return ResponseEntity.ok(grafoService.obtenerMunicipiosCercanos(codigo, radio));
    }
}