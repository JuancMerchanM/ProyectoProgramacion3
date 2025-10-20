package com.Uptc.ProyectoFinal.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conexion {
    private String origen;
    private String destino;
    private double distancia; // en kilómetros
    private String tipoVia; // "Principal", "Secundaria", "Terciaria"
	public Conexion(String origen, String destino, double distancia, String tipoVia) {
		super();
		this.origen = origen;
		this.destino = destino;
		this.distancia = distancia;
		this.tipoVia = tipoVia;
	}
	public String getOrigen() {
		return origen;
	}
	public void setOrigen(String origen) {
		this.origen = origen;
	}
	public String getDestino() {
		return destino;
	}
	public void setDestino(String destino) {
		this.destino = destino;
	}
	public double getDistancia() {
		return distancia;
	}
	public void setDistancia(double distancia) {
		this.distancia = distancia;
	}
	public String getTipoVia() {
		return tipoVia;
	}
	public void setTipoVia(String tipoVia) {
		this.tipoVia = tipoVia;
	}
}