package com.Uptc.ProyectoFinal.Services;

import com.Uptc.ProyectoFinal.Entities.Conexion;
import com.Uptc.ProyectoFinal.Entities.Municipio;
import com.Uptc.ProyectoFinal.Entities.RutaResultado;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GrafoService {
    
    private Map<String, Municipio> municipios = new HashMap<>();
    private Map<String, List<Conexion>> grafo = new HashMap<>();
    
    public GrafoService() {
        inicializarMapa();
    }
    
    private void inicializarMapa() {
        // Municipios principales de Boyacá
        agregarMunicipio("TUN", "Tunja", 5.5353, -73.3678, 203000);
        agregarMunicipio("DUI", "Duitama", 5.8269, -73.0342, 120000);
        agregarMunicipio("SOG", "Sogamoso", 5.7147, -72.9342, 115000);
        agregarMunicipio("PAI", "Paipa", 5.7794, -73.1147, 32000);
        agregarMunicipio("CHI", "Chiquinquirá", 5.6186, -73.8186, 63000);
        agregarMunicipio("VLE", "Villa de Leyva", 5.6347, -73.5253, 17000);
        agregarMunicipio("MON", "Moniquirá", 5.8808, -73.5686, 23000);
        agregarMunicipio("RAM", "Ramiriquí", 5.3936, -73.3328, 13000);
        agregarMunicipio("SAM", "Samacá", 5.4897, -73.4972, 20000);
        agregarMunicipio("TIB", "Tibasosa", 5.7486, -72.9858, 14000);
        agregarMunicipio("NOB", "Nobsa", 5.7714, -72.9397, 17000);
        agregarMunicipio("FIR", "Firavitoba", 5.6806, -72.9814, 7000);
        agregarMunicipio("GUA", "Guateque", 4.9308, -73.4186, 10000);
        agregarMunicipio("SOR", "Soracá", 5.4939, -73.3161, 6000);
        agregarMunicipio("CUI", "Cuitiva", 5.6000, -73.0167, 5000);
        
        // Conexiones entre municipios (carreteras)
        agregarConexion("TUN", "PAI", 43, "Principal");
        agregarConexion("PAI", "DUI", 18, "Principal");
        agregarConexion("DUI", "SOG", 19, "Principal");
        agregarConexion("TUN", "SAM", 20, "Secundaria");
        agregarConexion("SAM", "VLE", 18, "Secundaria");
        agregarConexion("VLE", "CHI", 42, "Principal");
        agregarConexion("CHI", "MON", 35, "Secundaria");
        agregarConexion("TUN", "SOR", 15, "Secundaria");
        agregarConexion("TUN", "RAM", 32, "Secundaria");
        agregarConexion("RAM", "GUA", 48, "Secundaria");
        agregarConexion("DUI", "NOB", 8, "Principal");
        agregarConexion("NOB", "SOG", 12, "Principal");
        agregarConexion("DUI", "TIB", 10, "Secundaria");
        agregarConexion("SOG", "FIR", 6, "Secundaria");
        agregarConexion("PAI", "CUI", 25, "Terciaria");
        agregarConexion("MON", "VLE", 38, "Secundaria");
    }
    
    private void agregarMunicipio(String codigo, String nombre, double lat, double lon, int pob) {
        municipios.put(codigo, new Municipio(codigo, nombre, lat, lon, pob));
        grafo.put(codigo, new ArrayList<>());
    }
    
    private void agregarConexion(String origen, String destino, double distancia, String tipo) {
        Conexion c1 = new Conexion(origen, destino, distancia, tipo);
        Conexion c2 = new Conexion(destino, origen, distancia, tipo);
        grafo.get(origen).add(c1);
        grafo.get(destino).add(c2);
    }
    
    public Map<String, Municipio> obtenerTodosMunicipios() {
        return new HashMap<>(municipios);
    }
    
    public List<Conexion> obtenerConexiones(String codigoMunicipio) {
        return grafo.getOrDefault(codigoMunicipio, new ArrayList<>());
    }
    
    public RutaResultado calcularRutaMasCorta(String origen, String destino) {
        // Algoritmo de Dijkstra
        Map<String, Double> distancias = new HashMap<>();
        Map<String, String> padres = new HashMap<>();
        PriorityQueue<NodoDistancia> cola = new PriorityQueue<>(
            Comparator.comparingDouble(n -> n.distancia)
        );
        
        for (String codigo : municipios.keySet()) {
            distancias.put(codigo, Double.MAX_VALUE);
        }
        distancias.put(origen, 0.0);
        cola.offer(new NodoDistancia(origen, 0.0));
        
        while (!cola.isEmpty()) {
            NodoDistancia actual = cola.poll();
            String codActual = actual.codigo;
            
            if (codActual.equals(destino)) break;
            
            for (Conexion conexion : grafo.get(codActual)) {
                double nuevaDist = distancias.get(codActual) + conexion.getDistancia();
                if (nuevaDist < distancias.get(conexion.getDestino())) {
                    distancias.put(conexion.getDestino(), nuevaDist);
                    padres.put(conexion.getDestino(), codActual);
                    cola.offer(new NodoDistancia(conexion.getDestino(), nuevaDist));
                }
            }
        }
        
        // Reconstruir ruta
        List<String> ruta = new ArrayList<>();
        String actual = destino;
        while (actual != null) {
            ruta.add(0, municipios.get(actual).getNombre());
            actual = padres.get(actual);
        }
        
        double distTotal = distancias.get(destino);
        String desc = String.format("Ruta más corta de %s a %s", 
            municipios.get(origen).getNombre(), 
            municipios.get(destino).getNombre());
        
        return new RutaResultado(ruta, distTotal, desc);
    }
    
    public List<Municipio> obtenerMunicipiosCercanos(String codigo, double radioKm) {
        Municipio centro = municipios.get(codigo);
        List<Municipio> cercanos = new ArrayList<>();
        
        for (Municipio m : municipios.values()) {
            if (!m.getCodigo().equals(codigo)) {
                double dist = calcularDistanciaHaversine(
                    centro.getLatitud(), centro.getLongitud(),
                    m.getLatitud(), m.getLongitud()
                );
                if (dist <= radioKm) {
                    cercanos.add(m);
                }
            }
        }
        
        return cercanos;
    }
    
    private double calcularDistanciaHaversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radio de la Tierra en km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    private static class NodoDistancia {
        String codigo;
        double distancia;
        
        NodoDistancia(String codigo, double distancia) {
            this.codigo = codigo;
            this.distancia = distancia;
        }
    }
}