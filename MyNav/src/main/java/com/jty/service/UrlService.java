package com.jty.service;

import java.util.ArrayList;

import com.jty.entity.URLEnt;
/**
 * 实体表名为url_entity,增加索引以查询
 *  CREATE INDEX index_title ON url_entity(title)
 *	CREATE INDEX index_tag ON url_entity(tag)
 */

public interface UrlService {

	/**
	 * 加载所有的网址信息
	 * 
	 * @return
	 */

	ArrayList<URLEnt> getUrlAll(String searchText);

	/**
	 * 删除网址信息
	 * 
	 * @param urlIds
	 * @return
	 */
	boolean deleteURLEnt(int urlIds);
	
	boolean deleteURLEnt(String urlIds);


	/**
	 * 增加网址信息
	 * 
	 * @param title
	 * @param url
	 * @param data
	 * @param comm
	 * @return
	 */
	boolean addUrl(String title, String url, String data, String comm);
	

	

}
