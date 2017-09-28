<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>待时而动</title>
<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
<script src="extjs/ext-all.js" type="text/javascript"></script>
<script src="extjs/ext-lang-zh_CN.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css"  href="extjs/resources/css/ext-all.css" />

<script type="text/javascript">
	//删除网址
	var deleteQuestion = function () {
        var record = girdPanel.getSelectionModel().getSelected();
        if (!record) {
            Ext.MessageBox.alert('提示', '请选择要删除的问题!');
            return;
        }
        Ext.Msg.confirm('提示', '确定要删除问题<font color=red> ' + record.get('title') + ' </font>吗?', function (btn) {
            if (btn == 'yes') {
                jty.common.showProgress('请稍等', '正在处理...', '', 300, 11);
                Ext.Ajax.request({
                    url: 'deleteQuestion.action',
                    method: 'post',
                    params: {
                        'questionUid': record.get('questionUid')
                    },
                    success: function (response, options) {
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            questionGrid.store.reload();
                            Ext.MessageBox.hide();
                        } else {
                            Ext.MessageBox.alert('提示', result.message);
                        }
                    },
                    failure: function () {
                        Ext.MessageBox.alert('提示', '删除失败');
                    }
                });
            }
        });
    }


	var buildProjectProcessPanel = function() {
		Ext.QuickTips.init();
		
		var westPanel = new Ext.Panel({
			id : 'wPanel',
			title:'网址树',
			autoScroll : true,
			/* renderTo : "projectProcessSel", */
			height : 800,
			width : 400,
			/* autoWidth : true, */
			region:'west',
			tbar : [ {
				text : '业务应用类报表',
				cls : 'x-btn-text-icon',
				tooltip : '<b>业务应用类报表</b>',
				/* icon : 'images/count_report.png', */
				handler : function() {
				}
			} ],
			html : "<div>" + 222 + "</div>"
		});
		
		
		
		//store
		var gridStore = new Ext.data.Store({
			proxy:new Ext.data.HttpProxy({
				url:'loadUrlData.do'
			}),
			remoteSort:true,
			reader:new Ext.data.JsonReader({
				root:'root',
				totalProperty:'totalProperty'
			},[{name:'title',mapping:'title'},
			   {name:'url',mapping:'url'},
			   {name:'data',mapping:'data'},
			   {name:'tag',mapping:'tag'},
			   {name:'id',mapping:'id'},
			   {name:'createDate',mapping:'createDate'}
			   ])
		});
		//加载数据源
		gridStore.load({
				params: {
					start : 0,
					limit : 20
				}
			}
		);
		
		var smUrl =  new Ext.grid.CheckboxSelectionModel({dataIndex:'id'});
		var myColumns = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
		      smUrl,
		   {
			header:'标题',
			sortable:true,
			width:150,
			align:'center',
			dataIndex:'title',
			/* render:function(v,meta,r){
				
			} */
		},{
			header:'网址',
			id:'url',
			/* sortable:true, */
			width:200,
			align:'center',
			dataIndex:'url',
			renderer:function(v,meta,r){
				return '<div align="left"><a href="#" onclick="window.open(\'http://' + r.get('url')
				+ '\',\'_blank\')"> ' + v + '</a></div>';
			}
		},{
			header:'数据',
			sortable:true,
			width:150,
			align:'center',
			dataIndex:'data',
			renderer:function(value,meta,r){
				meta.attr='ext:qtitle="提示标题"' + 'ext:qtip="'+value+'"';
			    return value;
			}
		},{
			header:'标签',
			sortable:true,
			width:150,
			align:'center',
			dataIndex:'tag',
		},{
			header:'创建时间',
			sortable:true,
			width:150,
			align:'center',
			dataIndex:'createDate',
			renderer:function(v,meta,r){
				return new Date(v).format('Y-m-d H:i:s')
			}
		}
		
		])
		
		/* 
		var vp = new Ext.Viewport({
			layout:'border',
			items:[westPanel,centerPanel]
		}); */
		
		//上工具栏
		var lastDate = new Date();
		var firstDate = lastDate.add(Date.MONTH,-1);
		
		var addUrlWindow = function(){
			var formP1 =  new Ext.form.FormPanel({
				defaultType: 'textfield',
				frame: true,
				/* baseCls :'x-plain', */
				bodyStyle: 'margin：20px',
				autoScroll:true,
				labelWidth:100,
				defaults: {
					width:300, 
				},
				items:[{
					id:'title',
					labelStyle : 'color:#0000ff;width:80px;',
					name:'title',
					allowBlank:false,
					fieldLabel : '<font style="font-size:14px;font-family: 微软雅黑,黑体,Arial;" >标&nbsp;&nbsp;&nbsp;&nbsp; 题</font>',
					blankText:'标题不能为空',
					regex:/\s*\S+\s*/,
					regexText:'标题不为空格',
					maxLength:100,
					maxLengthText : '标题不能超过100位！'
				},{
					id:'url',
					labelStyle : 'color:#0000ff;width:80px;',
					fieldLabel : '<font style="font-size:14px;font-family: 微软雅黑,黑体,Arial;" >网&nbsp;&nbsp;&nbsp;&nbsp; 址</font>',
					name:'url',
					allowBlank:false,
					blankText:'网址不能为空',
					regex:/\s*\S+\s*/,
					regexText:'网址不能为空',
					maxLength:100,
					maxLengthText : '网址不能超过100位！'
				},new Ext.form.TextArea({
					labelStyle : 'color:#0000ff;width:80px;',
					fieldLabel : "描&nbsp;&nbsp;&nbsp;&nbsp; 述",
					width : 100,
					height : 100,
					name : "data",
					maxLength : 1000,
					maxLengthText : '描述不能超过1000位！',
					grow : false
				}),{
					id:'tag',
					labelStyle : 'color:#0000ff;width:80px;',
					fieldLabel : '<font style="font-size:14px;font-family: 微软雅黑,黑体,Arial;" >标&nbsp;&nbsp;&nbsp;&nbsp; 记</font>',
					name:'tag',
					allowBlank:false,
					blankText:'标记不能为空',
					regex:/\s*\S+\s*/,
					regexText:'标记不为空格',
					maxLength:100,
					maxLengthText : '标题不能超过100位！',
					anchor : '95%'

				}]
				
			});
			
			
			
			
			var win = new Ext.Window({
				title : '添加网址',
				height : 280,
				width : 450,
				frame : true,
				modal : true,
				resizable : false,
				layout:'fit',
				items : formP1,
				buttonAlign:'center',
				buttons : [{
					text : "确定",
					handler : function() {
						// 验证是否合法
 						if (!formP1.getForm().isValid()) {
							 Ext.MessageBox.alert('验证错误', '页面验证有错误！');
 							return;
 						}
						formP1.getForm().doAction('submit', {
							url : 'addUrlData.do',
							// 文件路径
							method : 'post',
							waitMsg : '正在保存......',
							params : {
/* 								'projectId' : document.getElementById('project_id').value */	
							},
							success : function(response) {
								gridStore.reload();
								win.close();
							},
							failure : function(response) {
								/* grid_batch.store.reload(); */
								Ext.MessageBox.alert('失败', '失败');
								win.close();
							}
						})
					}
				}, {
					text : "取消",
					handler : function() {
						win.close();
					}
				}]
			})
			win.show();
		}
		
		//删除网址的按钮
		var deleteUrlData = function(){
			var record = girdPanel.getSelectionModel().getSelections();
			if(record){
				var idStr = '';
				for(var i =0;i<record.length;i++){
					idStr += record[i].get('id');
					if(i != record.length-1){
						idStr = idStr+',';
					}
				}
				
				Ext.MessageBox.show({
					title : '提示',
					msg : '确定要删除选中网址记录吗？',
					icon : Ext.MessageBox.QUESTION,
					buttons : Ext.MessageBox.YESNO,
					fn:function(btn){
						if(btn == 'yes'){
							Ext.Ajax.request({
								url:'deleteUrlData.do',
								params:{
									ids:idStr
								},
								method:'post',
								success : function(response) {
									girdPanel.getStore().reload();
								},
								failure : function() {
									Ext.MessageBox.alert('提示', "系统错误  删除操作失败");
								}
							})
						}
					}
					
				})
			}
			
		};
		//搜索功能
		var gridReload = function(){
			var search = Ext.getCmp('field_s').getValue();
			/* Ext.Ajax.request({
				url:'searchUrl.do',
				methods:'post',
				params:{
					'searchText':search
				}
				 success:function(){
					girdPanel.getStore().reload();
				} 
			}) */
			gridStore.baseParams={
					'searchText':search
			}
			gridStore.load({
				params:{
					start:0,
					limit:20
				}
			})
		}
		
		var subTbar = new Ext.Toolbar([
			{
				text : '添加',
				cls : 'x-btn-text-icon',
				tooltip : '<b>添加网址</b>',
				icon : 'img/add.png', 
				handler : function() {
					addUrlWindow();
				}
			},'-',
			{
				text : '删除',
				cls : 'x-btn-text-icon',
				tooltip : '<b>删除网址</b>',
				icon : 'img/delete.png',
				handler : function() {
					deleteUrlData();
				}
			},'-',
			new Ext.form.DateField({
                id: 'start_date_EV_project',
                emptyText: '请选择',
                format: 'Y-m-d',
                width: 120,
                value: firstDate
            }), "<span>&nbsp; 到&nbsp;</span>",
            new Ext.form.DateField({
                id: 'end_date_EV_project',
                emptyText: '请选择',
                format: 'Y-m-d',
                width: 120,
                value: lastDate
            }),'-',new Ext.form.TextField({
            	emptyText :'网址标题,标签',
            	width:150,
            	id: 'field_s',
            	listeners:{
            		specialKey:function(textField,e){
            			if(e.keyCode==13){
            				gridReload();
            			}
            		}
            	}
            }),'-',
            {   tooltip: '<b>查询</b>',
				xtype: "button",
	            cls: 'x-btn-icon',
	            icon: 'img/search.png',
	            handler: function () {
	                gridReload();
	            }
        	},'-',{
                text: "清空",
                xtype: "button",
                id: 'clear_btn',
                cls: 'x-btn-text-icon',
                tooltip: '<b>清空查询条件</b>',
                icon: 'img/reset.png',
                handler: function () {
                	Ext.getCmp('field_s').setValue("");
                	gridStore.baseParams = {};
                	gridStore.load();
                }
            }
		]);
		
		//下工具栏
		var bbar = new Ext.PagingToolbar({
	        pageSize: 20,
	        store : gridStore,
	        displayInfo : true,
	        displayMsg : '第{0} 到 {1} 条数据 共{2}条',
	        emptyMsg : "没有数据"
	    });
		
		var girdPanel = new Ext.grid.GridPanel({
			id : 'gridId',
	        bodyStyle : 'width:100%',
	        height: '100%',
			loadMask : true,
			autoExpandColumn : 'url',
	        autoWidth : true, 
	        autoScroll: true,
	        tbar: subTbar,
	        cm : myColumns,
	        sm : smUrl,
	        store : gridStore,
	        bbar: bbar,
	        stripeRows : true,
	        enableColumnMove : false,
	        autoloadResize : true
		});
		
		
		
		var centerPanel = new Ext.Panel({
			id : 'cPanel',
			title:'收藏网址',
			autoScroll : true,
			height : '100%',
			width : 800, 
			layout:'fit',
			/* autoWidth : true,  */
			region:'center',
			/* collapseMode : 'mini', */
			tbar : [ {
				text : '添加网址',
				cls : 'x-btn-text-icon',
				tooltip : '<b>添加网址</b>',
				handler : function() {
					
				}
			}, '-', {
				text : '删除网址',
				tooltip : '<b>删除网址</b>',
				cls : 'x-btn-text-icon',
				handler : function() {
					/* Ext.getCmp('ppPanel').body.update("222222222222"); */
				}
			} ],
			/* html : "<div>" + 1111 + "</div>", */
			items:[girdPanel]
		});
		
		
		
		var panel = new Ext.Panel({
			renderTo:'projectProcessSel',
			title:'我的导航',
			layout:'border',
			width:1000,
			frame:false,
			autoWidth:true, 
			autoloadResize: true,
			height:800,
			resizable : false,
            border : false,
            maximizable : true,
			defaults: {  
		           collapsible: true, // 支持该区域的展开和折叠  
		           split: true, // 支持用户拖放改变该区域的大小  
		           /* bodyStyle: 'padding:15px'  */ 
		    },
			items:[westPanel,centerPanel]
		});
		/* 
		panel.render();
		panel.doLayout(); 
		*/
	}
	Ext.onReady(buildProjectProcessPanel);
</script>

</head>
<body>
	<div id="projectProcessSel" style="width:auto;height:100%"></div> 
</body>
</html>