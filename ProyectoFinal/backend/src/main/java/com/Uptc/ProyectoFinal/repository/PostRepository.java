package com.Uptc.ProyectoFinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Uptc.ProyectoFinal.entity.RoutePost;

public interface PostRepository extends JpaRepository<RoutePost,Long>{
}
