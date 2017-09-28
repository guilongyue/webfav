package com.jty.dao;

import java.util.ArrayList;
import java.util.List;

import com.jty.entity.URLEnt;

public interface UrlDao {
	ArrayList<URLEnt> findAll(String searchText);
	boolean addUrlData(URLEnt urlEnt);
	boolean deleteUrlData(List<Integer> ids);
}
