package com.jty.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.jty.dao.UrlDao;
import com.jty.entity.URLEnt;
import com.jty.service.UrlService;

@Service("urlService")
public class UrlServiceImpl implements UrlService {
	
	@Resource
	private UrlDao urlDao;
	

	public ArrayList<URLEnt> getUrlAll(String searchText) {
		return urlDao.findAll(searchText);
	}
	
	public boolean deleteURLEnt(String urlIds) {
		// TODO Auto-generated method stub
		String[] arrIds = urlIds.split(",");
		ArrayList<Integer> l= new ArrayList<Integer>();
		for(String arr:arrIds){
			l.add(Integer.valueOf(arr));
		}
		System.out.println(l);
		urlDao.deleteUrlData(l);
		return true;
	}


	public boolean addUrl(String title, String url, String data, String comm) {
		URLEnt newUrlEnt = new URLEnt(title,url,data,comm,new Date());
		urlDao.addUrlData(newUrlEnt);
		return true;
	}


	public boolean deleteURLEnt(int urlIds) {
		// TODO Auto-generated method stub
		return false;
	}



}
