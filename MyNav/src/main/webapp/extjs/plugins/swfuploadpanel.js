/**
 * Makes a Panel to provide the ability to upload multiple files using the
 * SwfUpload flash script.
 * 
 * @author Michael Giddens
 * @website http://www.silverbiology.com
 * @created 2008-03-06
 * @version 0.4
 * 
 * @known_issues - Progress bar used hardcoded width. Not sure how to make 100%
 *               in bbar - Panel requires width / height to be set. Not sure why
 *               it will not fit - when panel is nested sometimes the column
 *               model is not always shown to fit until a file is added. Render
 *               order issue.
 */

// Create user extension namespace
Ext.namespace('Ext.ux');
Ext.ux.SwfUploadPanel = function(config) {
	// Default Params for SwfUploader
	if (!config.single_select) {
		config.single_select = false;
	}
	if (!config.file_types) {
		config.file_types = "*.*";
	}
	if (!config.file_types_description) {
		config.file_types_description = "All Files";
	}
	if (!config.file_size_limit) {
		config.file_size_limit = 2 * 1024 * 1024 * 1024 + " B";
	}
	if (!config.file_upload_limit) {
		config.file_upload_limit = "0";
	}
	if (!config.file_post_name) {
		config.file_post_name = "attachments"; // This is the "name" of the
		// file
	}
	// item that the server-side script
	// will receive. Setting this
	// doesn't work in the Linux Flash
	// Player
	if (!config.flash_url) {
		config.flash_url = "swfupload/swfupload.swf"; // Relative to this file
	}
	if (!config.debug) {
		config.debug = false;
	}
	if (config.auto_upload == undefined) {// 是否选择文件后自动上传
		config.auto_upload = true;
	}
	if (config.show_deleted == undefined) {// 是否显示删除操作
		// 如果显示，在则有必要给出deleteFileFun
		config.show_deleted = false;
	}
	// config.deleteFileFun 删除文件操作函数
	if (!config.session_id) {// sessionID
		config.session_id = "";
	}
	this.rec = Ext.data.Record.create([{
				name : 'name'
			}, {
				name : 'size'
			}, {
				name : 'id'
			}, {
				name : 'type'
			}, {
				name : 'creationdate',
				type : 'date',
				dateFormat : 'm/d/Y'
			}, {
				name : 'status'
			}]);

	var store = new Ext.data.Store({
				reader : new Ext.data.JsonReader({
							id : 'id'
						}, this.rec)
			});
	this.buildUpload = function() {
		this.suo = new SWFUpload({
					upload_url : config.upload_url + ';jsessionid=' + config.session_id,
					post_params : config.post_params,
					file_post_name : config.file_post_name,
					file_size_limit : config.file_size_limit,
					file_types : config.file_types,
					file_types_description : config.file_types_description,
					file_upload_limit : config.file_upload_limit,
					flash_url : config.flash_url,
					flash9_url : "swfupload/swfupload_fp9.swf",
					// Event Handler Settings
					file_queued_handler : this.fileQueue.createDelegate(this),
					file_queue_error_handler : this.fileQueueError.createDelegate(this),
					file_dialog_complete_handler : this.fileDialogComplete.createDelegate(this),

					upload_progress_handler : this.uploadProgress.createDelegate(this),
					upload_complete_handler : this.uploadComplete.createDelegate(this),
					upload_success_handler : this.fileComplete.createDelegate(this),
					upload_error_handler : this.fileCancelled.createDelegate(this),
					upload_start_handler : this.uploadStart.createDelegate(this),
					swfupload_loaded_handler : this.swfUploadLoaded.createDelegate(this),
					// Button Settings
					button_image_url : "swfupload/XPButtonUploadText_61x22.gif",
					button_placeholder_id : "spanButtonPlaceholder",
					button_width : 61,
					button_height : 22,
					debug : config.debug
				});
	};
	this.deleteRecord = function(fileId) {
		var record = jty.common.getRecordByProperty(store, 'id', fileId);
		if (record != null) {
			this.suo.cancelUpload(fileId);
			store.remove(record);
		}
	};
	this.progress_bar = new Ext.ProgressBar({
				text : '上传进度',
				height : 25
			});

	var cm = new Ext.grid.ColumnModel([{
				id : 'name',
				header : "名称",
				align : 'center',
				dataIndex : 'name',
				renderer : this.formatFileName
			}, {
				id : 'size',
				header : "大小",
				width : 80,
				align : 'center',
				dataIndex : 'size',
				renderer : this.formatBytes
			}, {
				id : 'status',
				header : "状态",
				width : 80,
				align : 'center',
				dataIndex : 'status',
				renderer : this.formatStatus
			}, {
				header : "操作",
				width : 60,
				align : 'center',
				dataIndex : 'id',
				hidden : !config.show_deleted,
				renderer : this.formatOperate
			}]);
	config = config || {};
	config = Ext.apply(config || {}, {
				id : "swfUploadPanel",
				store : store,
				cm : cm,
				autoExpandColumn : 'name',
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : config.single_select
						}),
				tbar : ['<span id="spanButtonPlaceholder"></span>'],
				bbar : [this.progress_bar],
				listeners : {
					'contextmenu' : function(e) {
						e.stopEvent();
					},
					'render' : function() {
						this.buildUpload();
						this.progress_bar.setWidth(this.bbar.getWidth() - 6);
						Ext.fly(this.progress_bar.el.dom.firstChild.firstChild).applyStyles("height: " + (Ext.isIE ? "16px" : "25px"));
					},
					'rowclick' : function(grid, rowIndex, e) {
						var record = grid.store.getAt(rowIndex);
						if (record) {
							var fileId = record.get("id");
							var target = e.getTarget();
							if (target.id == ("swfupload_file_" + fileId)) {
								if (fileId.indexOf('_') < 0) {
									config.deleteFileFun(fileId);
								} else {
									this.deleteRecord(fileId);
								}
							}
						}
					}
				}
			});
	cm.defaultSortable = false;
	Ext.ux.SwfUploadPanel.superclass.constructor.apply(this, arguments);
	this.on('resize', function() {
				this.progress_bar.setWidth(this.bbar.getWidth() - 6);
				Ext.fly(this.progress_bar.el.dom.firstChild.firstChild).applyStyles("height: 16px");
			});

};
Ext.extend(Ext.ux.SwfUploadPanel, Ext.grid.GridPanel, {
			/**
			 * 文件名加图标
			 * 
			 * @param {Integer}
			 *            status
			 * @return {String}
			 */
			formatFileName : function(name) {
				var _name = name.split('.');
				var _img;
				switch (_name[_name.length - 1]) {
					case 'exe' :
						_img = '<img src="images/business/exe.gif" width="14" height="14">';
						break;
					case 'zip' :
						_img = '<img src="images/business/rar.gif" width="14" height="14">';
						break;
					case 'rar' :
						_img = '<img src="images/business/rar.gif" width="14" height="14">';
						break;
					case 'txt' :
						_img = '<img src="images/business/txt.gif" width="14" height="14">';
						break;
					case 'xls' :
						_img = '<img src="images/business/xls.gif" width="14" height="14">';
						break;
					case 'doc' :
						_img = '<img src="images/business/doc.gif" width="14" height="14">';
						break;
					case 'pdf' :
						_img = '<img src="images/business/pdf.gif" width="14" height="14">';
						break;
					case 'jpg' :
						_img = '<img src="images/business/jpg.gif" width="14" height="14">';
						break;
					case 'gif' :
						_img = '<img src="images/business/jpg.gif" width="14" height="14">';
						break;
					case 'png' :
						_img = '<img src="images/business/jpg.gif" width="14" height="14">';
						break;
					case 'docx' :
						_img = '<img src="images/business/docx.gif" width="14" height="14">';
						break;
					case 'ppt' :
						_img = '<img src="images/business/ppt.gif" width="14" height="14">';
						break;
					case 'pptx' :
						_img = '<img src="images/business/ppt.gif" width="14" height="14">';
						break;
					case 'xml' :
						_img = '<img src="images/business/XML.gif" width="14" height="14">';
						break;
					default :
						_img = '<img src="images/business/unknow.gif" width="14" height="14">';
						break;
				}
				_img = _img + '&nbsp;&nbsp;&nbsp;' + name;
				return jty.util.extTableRender(_img);
			},
			/**
			 * Formats file status 有需要的状态可以添加
			 * 
			 * @param {Integer}
			 *            status
			 * @return {String}
			 */
			formatStatus : function(status) {
				switch (status) {
					case 0 :
						return ("等待");
					case 1 :
						return ("正在上传...");
					case 2 :
						return ("完成");
					case 3 :
						return ("错误");
					case 4 :
						return ("取消");
					case 5 :
						return ("失败，存在同名文件！");
					case 6 :
						return ("超出了队列");
					case 7 :
						return ("文件过大超过2G");
					case 8 :
						return ("空文件");
					case 9 :
						return ("无效的文件");
					default :
						return (status);
				}
			}
			/**
			 * 删除
			 * 
			 * @param {Integer}
			 *            文件ID
			 * @return {String}
			 */
			,
			formatOperate : function(fileID, mete, rec) {
				var status = rec.get("status");
				if (status != 1) {
					var _context = '<img id="swfupload_file_' + fileID + '" src="images/icon-png/delete.png" alt="删除" title="删除" style="cursor:pointer;"/>';
					return _context;
				}
				return "";
			}
			/**
			 * Formats raw bytes into kB/mB/GB/TB
			 * 
			 * @param {Integer}
			 *            bytes
			 * @return {String}
			 */
			,
			formatBytes : function(bytes) {
				if (isNaN(bytes)) {
					return ('');
				}
				return Ext.util.Format.fileSize(bytes);
			}

			/**
			 * Add file to store / grid
			 * 
			 * @param {file}
			 * @return {}
			 */
			,
			fileQueue : function(file) {
				file.status = 0;
				var r = new this.rec(file);
				this.store.add(r);
				this.fireEvent('fileQueued', this, file);
			}
			/**
			 * Error when file queue error occurs
			 */
			,
			fileQueueError : function(file, code, queue_remaining) {
				switch (code) {
					case -100 :
						Ext.MessageBox.alert('错误', "超出了队列限制！");
						break;
					case -110 :
						file.status = 7;
						var r = new this.rec(file);
						this.store.add(r);
						break;
					case -120 :
						file.status = 8;
						var r = new this.rec(file);
						this.store.add(r);
						break;
					case -130 :
						file.status = 9;
						var r = new this.rec(file);
						this.store.add(r);
						break;
				}
			},
			fileComplete : function(file, s, r) {
				if (this.suo.getStats().files_queued > 0) {
					this.uploadFiles();
				} else {
					this.fireEvent('queueUploadComplete', this);
				}
				if (this.cancelled) {
					this.cancelled = false;
				} else {
					var o = Ext.decode(s);
					var r = jty.common.getRecordByProperty(this.store, 'id', file.id);
					if (r != null) {
						r.set('status', 2);
						r.commit();
						this.progress_bar.reset();
						this.progress_bar.updateText('上传进度');
						if (this.remove_completed) {
							this.store.remove(r);
						}
						this.fireEvent('fileUploadComplete', this, file, o);
					}
				}
			},
			fileDialogComplete : function(file_count) {
				if (this.auto_upload) {
					this.uploadFiles();
				}
			},
			uploadProgress : function(file, current_size, total_size) {
				this.progress_bar.updateProgress(current_size / total_size, '上传文件: ' + file.name + ' (' + this.formatBytes(current_size) + ' / ' + this.formatBytes(total_size)
								+ ')');
			},
			uploadComplete : function(file, result) {
			},
			uploadStart : function(file) {
				this.fireEvent('uploadStart', this, file);
			},
			uploadFiles : function() {
				var file = this.suo.getFile();
				if (file) {
					var r = jty.common.getRecordByProperty(this.store, 'id', file.id);
					if (r != null) {
						r.set('status', 1);
						r.commit();
						this.suo.startUpload();
					}
				}
			},
			addPostParam : function(name, value) {
				this.suo.settings.post_params[name] = value;
				this.suo.setPostParams(this.suo.settings.post_params);
			},
			stopUpload : function(cancel_btn) {
				this.suo.stopUpload();
				this.getStore().each(function() {
							if (this.data.status == 1) {
								this.set('status', 0);
								this.commit();
							}
						});
				this.progress_bar.reset();
				this.progress_bar.updateText('上传进度');

			},
			fileCancelled : function(file, code, message) {
				if (code == -280) {
					return;
				}
				var r = jty.common.getRecordByProperty(this.store, 'id', file.id);
				if (r != null) {
					r.set('status', 4);
					r.commit();
				}
				this.progress_bar.reset();
				this.progress_bar.updateText('上传进度');
				this.cancelled = true;
			},
			swfUploadLoaded : function() {
				this.fireEvent('swfUploadLoaded', this);
			}
		});