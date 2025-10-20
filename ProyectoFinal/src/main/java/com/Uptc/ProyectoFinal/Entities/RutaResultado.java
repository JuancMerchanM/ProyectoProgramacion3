package com.Uptc.ProyectoFinal.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RutaResultado {
    private List<String> municipios;
    private double distanciaTotal;
    private String descripcion;
	public RutaResultado(List<String> municipios, double distanciaTotal, String descripcion) {
		super();
		this.municipios = municipios;
		this.distanciaTotal = distanciaTotal;
		this.descripcion = descripcion;
	}
}