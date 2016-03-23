/* method テーブルソート機能（テーブル01_id、行番号、ソートタイプ:str,num）
	--------------------------------------------------------------------*/
var table_sort = {
		exec: function(tid,idx,type){
			var table = document.getElementById(tid);
			var tbody = table.getElementsByTagName('tbody')[0];
			var rows  = tbody.getElementsByTagName('tr');
			var sbody = document.createElement('tbody');

			//save array
			var srows = new Array();
			for(var i=0;i<rows.length;i++){
				srows.push({
					row: rows[i],
					cel: rows[i].getElementsByTagName('td')[idx].innerHTML,
					idx: i
				});
			}

			//sort array
			srows.sort(function(a,b){
				if(type == 'str')
					return a.cel < b.cel ? 1 : -1;
				else
					return b.cel - a.cel;
			});
			if(this.flag == 1) srows.reverse();

			//replace
			for(var i=0;i<srows.length;i++){
				sbody.appendChild(srows[i].row)
			}
			table.replaceChild(sbody,tbody);
			this.replaceText(table,idx);

			//set flag
			this.flag = this.flag > 0 ? 0 : 1;
		},

		replaceText: function(table,idx){
			var thead = table.getElementsByTagName('a');

			//preset header-text
			if(!this.exp){
				this.text = new Array();
				for(var i=0;i<thead.length;i++){
					this.text.push(thead[i].firstChild.nodeValue);
				}
				this.exp = 1;
			}

			//set&remove suffix
			for(var i=0;i<thead.length;i++){
				if(i == idx){
					thead[i].firstChild.nodeValue = this.flag == 0
					? this.text[i] + this.suffix[0]
					: this.text[i] + this.suffix[1];
				}
				else {
					thead[i].firstChild.nodeValue = this.text[i];
				}
			}
		},

		suffix: ['▽','△'],
		flag: 0
	}




/* method テーブルソート機能　2つのテーブル同期（テーブル01_id、テーブル02_id、行番号、ソートタイプ:str,num）
	--------------------------------------------------------------------*/
var table_sort_02 = {
		exec: function(tid_01,tid_02,idx,type){

			var table = document.getElementById(tid_01);
			var f_table = document.getElementById(tid_02);

			var tbody = table.getElementsByTagName('tbody')[0];
			var rows  = tbody.getElementsByTagName('tr');
			var sbody = document.createElement('tbody');

			var f_tbody = f_table.getElementsByTagName('tbody')[0];
			var f_rows  = f_tbody.getElementsByTagName('tr');
			var f_sbody = document.createElement('tbody');

			//save array
			var srows = new Array();
			var f_srows = new Array();

			for(var i=0;i<rows.length;i++){
				srows.push({
					row: rows[i],
					cel: rows[i].getElementsByTagName('td')[idx].innerHTML,
					idx: i
				});
				f_srows.push({
					row: f_rows[i],
					//cel: f_rows[i].getElementsByTagName('td')[0].innerHTML,
					idx: i
				});
			}

			//sort array
			srows.sort(function(a,b){
				if(type === 'str')
					return a.cel < b.cel ? 1 : -1;
				else
					var obj = b.cel - a.cel;
				return obj;
			});


			if(this.flag == 1){
				srows.reverse();
			}

			//replace
			for(var i=0;i<srows.length;i++){
				sbody.appendChild(srows[i].row)
				var num = srows[i].idx;
				f_sbody.appendChild(f_srows[num].row);
			}

			table.replaceChild(sbody,tbody);
			f_table.replaceChild(f_sbody,f_tbody);

			//set flag
			this.flag = this.flag > 0 ? 0 : 1;
		},

		replaceText: function(table,idx){
			var thead = table.getElementsByTagName('a');

			preset header-text
			if(!this.exp){
				this.text = new Array();
				for(var i=0;i<thead.length;i++){
					this.text.push(thead[i].firstChild.nodeValue);
				}
				this.exp = 1;
			}

			//set&remove suffix
			for(var i=0;i<thead.length;i++){
				if(i == idx){
					thead[i].firstChild.nodeValue = this.flag == 0
					? this.text[i] + this.suffix[0]
					: this.text[i] + this.suffix[1];
				}
				else {
					thead[i].firstChild.nodeValue = this.text[i];
				}
			}
		},

		suffix: ['▽','△'],
		flag: 0
};
	
