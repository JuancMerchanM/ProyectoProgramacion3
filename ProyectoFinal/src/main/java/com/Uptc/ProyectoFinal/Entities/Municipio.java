package com.Uptc.ProyectoFinal.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Municipio {
    private String codigo;
    private String nombre;
    private double latitud;
    private double longitud;
    public String getCodigo() {
		return codigo;
	}
	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public double getLatitud() {
		return latitud;
	}
	public void setLatitud(double latitud) {
		this.latitud = latitud;
	}
	public double getLongitud() {
		return longitud;
	}
	public void setLongitud(double longitud) {
		this.longitud = longitud;
	}
	public int getPoblacion() {
		return poblacion;
	}
	public void setPoblacion(int poblacion) {
		this.poblacion = poblacion;
	}
	public Municipio(String codigo, String nombre, double latitud, double longitud, int poblacion) {
		super();
		this.codigo = codigo;
		this.nombre = nombre;
		this.latitud = latitud;
		this.longitud = longitud;
		this.poblacion = poblacion;
	}
	private int poblacion;
}
