package com.jty.web;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.jty.entity.URLEnt;
import com.jty.service.UrlService;
import com.jty.util.JsonResult;

@Controller
public class WebControll {
	@Resource
	private UrlService urlService;
	
	@RequestMapping("/hello.do")
	public String hello(){
		return "hello";
	}
	
	@RequestMapping("/index.do")
	public ModelAndView index(){
		ModelAndView mv = new ModelAndView();
		mv.addObject("message", "");
		mv.setViewName("hello");
		return mv;
	}
	
	@ResponseBody
	@RequestMapping("/loadUrlData.do")
	public JsonResult loadData(String searchText){
		List l = urlService.getUrlAll(searchText);
		JsonResult res = new JsonResult();
		res.setRoot(l);
		res.setMessage("hahah");
		res.setTotalProperty(l.size());
		return res;
	}
	
	@ResponseBody
	@RequestMapping("/addUrlData.do")
	public JsonResult addUrlData(String title,String url,String data,String tag){
		HashMap<String,Object> map = new HashMap<String,Object>();
		urlService.addUrl(title, url, data, tag);
		JsonResult res = new JsonResult(true,"success111");
		return res;
	}
	
	@ResponseBody
	@RequestMapping("/deleteUrlData.do")
	public JsonResult deleteUrlData(String ids){
		JsonResult res;
		try{
			urlService.deleteURLEnt(ids);
			res = new JsonResult(true,"success11");
		}catch(Exception e){
			res = new JsonResult(e);
		}
		return res;
	}
	
}
