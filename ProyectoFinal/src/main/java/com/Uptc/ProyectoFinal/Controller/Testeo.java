package com.Uptc.ProyectoFinal.Controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/test") // Endpoint
@CrossOrigin(origins = "*")
public class Testeo {

    @GetMapping(path = "/mensajeEjemplo/", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getMessage() {
        return "Funciona.";
    }

}
