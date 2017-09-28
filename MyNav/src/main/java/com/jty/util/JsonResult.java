package com.jty.util;

import java.util.ArrayList;
import java.util.List;

public class JsonResult<T> {
	private T root;
	private boolean success;
	private String message;
	
	private int limit;
	
	private String sort;
	//默认倒序
	private String dir ;
	
	private int start;
	private long total;
	
	//记录数
	private long totalProperty;
	
	private List<Object> rows = new ArrayList<Object>();

	public JsonResult() {
		super();
		// TODO Auto-generated constructor stub
	}

	public JsonResult(T root, boolean success, String message, int limit, String sort, String dir, int start,
			long total, long totalProperty, List<Object> rows) {
		super();
		this.root = root;
		this.success = success;
		this.message = message;
		this.limit = limit;
		this.sort = sort;
		this.dir = dir;
		this.start = start;
		this.total = total;
		this.totalProperty = totalProperty;
		this.rows = rows;
	}

	public JsonResult(T root, boolean success, String message) {
		super();
		this.root = root;
		this.success = success;
		this.message = message;
	}
	
	//异常
	public JsonResult(Exception e) {
		this(null,false,e.getMessage());
	}
	
	public JsonResult(T data) {
		this(data,true,"");
	}
	public JsonResult(boolean success, String message) {
		this(null,success,message);
	}
	
	@Override
	public String toString() {
		return "JsonResult [root=" + root + ", success=" + success + ", message=" + message + ", limit=" + limit
				+ ", sort=" + sort + ", dir=" + dir + ", start=" + start + ", total=" + total + ", totalProperty="
				+ totalProperty + ", rows=" + rows + "]";
	}

	public T getRoot() {
		return root;
	}

	public void setRoot(T root) {
		this.root = root;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		this.dir = dir;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	public long getTotalProperty() {
		return totalProperty;
	}

	public void setTotalProperty(long totalProperty) {
		this.totalProperty = totalProperty;
	}

	public List<Object> getRows() {
		return rows;
	}

	public void setRows(List<Object> rows) {
		this.rows = rows;
	}
	
	
	

}
