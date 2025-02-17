    const msLink='<span class="badge badge-pill badge-secondary-outline border border-secondary p-1 ml-1 mt-1 mb-0 mr-0">:text:'
            +'<a class="ms-link drop-ms ml-1" onclick="dropRef(this,\':text:\')">'
                 +'<svg width="12" height="12" viewBox="0 0 12 12" class="flex-none drop-svg ml-1">'
                 +'    <path fill-rule="evenodd" fill="currentColor" d="M7.41421356,6 L9.88226406,3.5319495 C10.0816659,3.33254771 10.0828664,3.01179862 9.88577489,2.81470708 L9.18529292,2.11422511 C8.97977275,1.90870494 8.66708101,1.91870543 8.4680505,2.11773594 L6,4.58578644 L3.5319495,2.11773594 C3.33254771,1.91833414 3.01179862,1.91713357 2.81470708,2.11422511 L2.11422511,2.81470708 C1.90870494,3.02022725 1.91870543,3.33291899 2.11773594,3.5319495 L4.58578644,6 L2.11773594,8.4680505 C1.91833414,8.66745229 1.91713357,8.98820138 2.11422511,9.18529292 L2.81470708,9.88577489 C3.02022725,10.0912951 3.33291899,10.0812946 3.5319495,9.88226406 L6,7.41421356 L8.4680505,9.88226406 C8.66745229,10.0816659 8.98820138,10.0828664 9.18529292,9.88577489 L9.88577489,9.18529292 C10.0912951,8.97977275 10.0812946,8.66708101 9.88226406,8.4680505 L7.41421356,6 L7.41421356,6 Z"></path>'
               +'</svg>'
            +'</a></span>'
        ,addTableReq='<a class="new-table-req position-absolute :base:" onclick="addRow(this)"><svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">'
            +'<path d="M18 12.8572V23.1429M12.8571 18H23.1428M8.99999 6.42859H27C28.4201 6.42859 29.5714 7.57986 29.5714 9.00002V27C29.5714 28.4202 28.4201 29.5714 27 29.5714H8.99999C7.57983 29.5714 6.42856 28.4202 6.42856 27V9.00002C6.42856 7.57986 7.57983 6.42859 8.99999 6.42859Z" stroke="#1A1A1A" stroke-linecap="round" stroke-linejoin="round"/>'
            +'</svg></a>'
        ,dubRecBtn='<a class="new-table-req position-absolute :base:" onmouseover="markGroup(this)" onmouseout="unMarkGroup()" onclick="dubRec(this)" title="'+t9n('[RU]Дублировать эту строку[EN]Duplicate the line')+'">'
            +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
            +'    <path d="M7 17H6C5.46957 17 4.96086 16.7893 4.58579 16.4142C4.21071 16.0391 4 15.5304 4 15V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15C15.5304 4 16.0391 4.21071 16.4142 4.58579C16.7893 4.96086 17 5.46957 17 6V7M13 11H22C23.1046 11 24 11.8954 24 13V22C24 23.1046 23.1046 24 22 24H13C11.8954 24 11 23.1046 11 22V13C11 11.8954 11.8954 11 13 11Z" stroke="#1A1A1A" stroke-linecap="round" stroke-linejoin="round"/>'
            +'</svg></a>'
        ,delFile='<a class="mr-3" onclick="deleteFile(this)"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
                +'<path d="M5 8H23M10 8V6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4H16C16.5304 4 17.0391 4.21071 17.4142 4.58579C17.7893 4.96086 18 5.46957 18 6V8M21 8V22C21 22.5304 20.7893 23.0391 20.4142 23.4142C20.0391 23.7893 19.5304 24 19 24H9C8.46957 24 7.96086 23.7893 7.58579 23.4142C7.21071 23.0391 7 22.5304 7 22V8H21Z" stroke="#1A1A1A" stroke-linecap="round" stroke-linejoin="round">'
                +'</path></svg></a>';
    var bt={3:'SHORT',8:'CHARS',9:'DATE',13:'NUMBER',14:'SIGNED',11:'BOOLEAN',12:'MEMO',4:'DATETIME',10:'FILE',2:'HTML',7:'BUTTON',6:'PWD',5:'GRANT',15:'CALCULATABLE',16:'REPORT_COLUMN',17:'PATH'};
    var conf={order:0,page:1,total:undefined,totalsOn:undefined,columns:{},ids:{},arrs:{},metas:{},uniq:{},lastHead:undefined};
    function unMarkGroup(){
        $('.dub-grouped').removeClass('dub-grouped');
    }
    function markGroup(el){
        const oid=$(el).closest('td').attr('obj-id');
        $('td[obj-id='+oid+']').closest('tr').addClass('dub-grouped');
    }
    function errMsgCard(err){
        $('.err-msg').html(err).show();
        setTimeout(()=>{$('.err-msg').hide()},9000);
    }
    var page=1,total,totalsOn,columns={},ids={},arrs={},metas={},uniq={},lastHead,baseType=new Array();
    function getRep(json){
        clearSubTotals();
        $('.ajax-wait').hide();
        var i,j,h,name,type,filters,base,value,curHead='';
        for(i in json.columns) // Remember the columns set
            curHead+=json.columns[i].name+i;
        if(lastHead!==curHead){ // No table header yet or columns added/removed
            columns={},ids={},arrs={},metas={};
            lastHead=curHead;
            for(i in json.columns)
                columns[json.columns[i].name]={type:json.columns[i].type,col:i};
            h='';
            filters='<tr class="no-padding filters">';
            for(i in json.columns)
                if(json.columns[i].id){
                    name=json.columns[i].name;
                    type=json.columns[i].type;
                    if(name.substr(-2)==='ID'&&columns[name.substr(0,name.length-2)]){
                        ids[i]=0;
                        $('.new-req').show();
                        if(!metas[type]&&!json.columns[i].ref){
                            newApi('GET','metadata/'+type,'getMeta');
                            metas[type]=0;
                        }
                    }
                    else{
                        if(columns[name+'ID'])
                            ids[i]=1;
                        h+='<th id="'+type+'"'+(ids[i]?' is-object="1"':'')+'><a sq-order desc col-id="'+json.columns[i].id+'" onclick="orderBy(this)">'
                            +'<span class="sq-order-num"></span><span class="sq-order-dir"></span> <span class="sq-col-name">'+name+'</span></a>';
                        filters+='<td><input filter-id="'+type+'" base="'+json.columns[i].format+'" name="FR_'+name.replace(/ /g,'_')+'">';
                    }
                }
            $('.sq-table thead tr').html(h);
            $('.sq-table tbody').html(filters);
            $('.filters input').keyup(()=>{applyFilters(event.target)});
            const urlParams = getFilterParams(); 
            if(!$.isEmptyObject(urlParams)){
                $('.clear-filters').show();
                $('.refr').removeClass('ml-2');
            }
            for(let key in urlParams)
                $('.filters input[name="'+key+'"]').val(urlParams[key]);
            i=-1;
            $('.sq-table').click(function(){if(event.target.tagName==='TD'&&event.ctrlKey)processSubTotals(event.target)});
        }
        else if(json.data[0].length===0){
            if(page===1){
                $('.page-switch,.total-count').hide();
                $('.page-count-from').html('');
                $('.page-count-to').html('0 ');
                $('.page-count-recs').html(t9n('[RU]записей[EN]records'));
                $('.sq-row').remove();
            }
            else{
                $('#pageNext,#pageLast').hide();
                $('.total-count').html('');
                total=page*limit-limit;
                page--;
            }
            drawFoot(json);
            return;
        }
        else
            $('.sq-row').remove();
        h='';
        for(i in json.data[0])
            h+=drawLine(json,i);
        $('.sq-table tbody').append(h);
        $('.sq-row td[req-id]').click(function(){inlineEdit(this)});
        if('totals' in json.columns[0])
            totalsOn=true;
        drawFoot(json);
        i++;
        if(i<defaultLimit){
            total=limit*page-limit+i;
            $('.total-count').hide();
        }
        if(i<defaultLimit&&page===1){
            $('.page-count-from').html(t9n('[RU]Всего [EN]Total: '));
            $('.page-count-to').html(i);
            $('.page-count-recs').html('');
        }
        else{
            $('.page-count-from').html((page*limit-limit+1)+'-');
            $('.page-count-to').html(page*limit-limit+i);
            $('.page-count-recs').html('');
            $('.total-count-from').html(t9n('[RU] из [EN] of ')).show();
            $('.total-count-num').html(total?total:'<a onclick="getCount()">?</a>').show();
        }
        if(i<defaultLimit)
            $('#pageNext,#pageLast').hide();
        else{
            if(!total||total!=page*limit-limit+i)
                $('#pageNext').show();
            else
                $('#pageNext').hide();
            if(total&&total!=page*limit-limit+i)
                $('#pageLast').show();
            else
                $('#pageLast').hide();
        }
        $('.sq-row').find('td[base="MEMO"]').each(function(){ // restore the line breaks
            addBreaks(this);
        });
        if(page===1)
            $('#pagePrev,#pageFirst').hide();
        else
            $('#pagePrev').show();
        if(page>2)
            $('#pageFirst').show();
        $('.sq-row').find('td').each(function(){markDown(this)});
    }
    function addBreaks(el){
        $(el).attr('old-val',$(el).html());
        $(el).html($(el).html().replace(/[\t\ n]+$/gm,'').replace(/\n/gm,'<br />'));
    }
    function drawFoot(json,el){
        $('.sq-table tfoot').remove(); // Re-create the footer if any
        if('totals' in json.columns[0]){
            var h='<tfoot><tr>';
            for(j in json.columns)
                if(ids[j]!==0)
                    h+='<th footer-id="'+json.columns[j].type+'" align="right">'+formatNum(json.columns[j].totals||'',2);
            $('.sq-table').append(h);
        }
    }
    function drawLine(json,i,cl){
        var base,j,h='<tr class="sq-row '+(cl||'')+'">';
        for(j in json.data){
            const col=json.columns[j];
            base='base="'+col.format+'"';
            if(isNumeric(col.format))
                value=formatNum(json.data[j][i],col.format);
            else
                value=json.data[j][i];
            if(col.type==='')
                h+='<td '+base+' class="calculable">'+value;
            else if(ids[j]===1)
                h+='<td req-id="'+col.type+'" is-object="1" class="position-relative" '+base
                    +' onmouseover="showAdd('+col.type+',this)"'
                    +(col.ref?' ref-id="':' obj-id="')+json.data[columns[col.name+'ID'].col][i]+'">'+value;
            else if(ids[j]!==0)
                h+='<td req-id="'+col.type+'" class="position-relative" '+base
                    +'onmouseover="'+(col.ref?'showAdd('+col.type+',this)':'$(\'.new-table-req\').remove()')+'">'+value;
        }
        return h;
    }
    var order=0;
    function orderSync(o){
        $('.sq-table th a').each(function(){
            const i=parseInt($(this).attr('sq-order'));
            if(i>o){
                $(this).attr('sq-order',i-1);
                $(this).find('.sq-order-num').html(i-1);
            }
        });
    }
    function orderBy(el){
        if($(el).attr('sq-order')===''){
            $(el).attr('sq-order',++order).attr('desc','');
            $(el).find('.sq-order-num').html(order);
            $(el).find('.sq-order-dir').html('&#9651;');
        }
        else if($(el).attr('desc')===''){
            $(el).attr('desc',1);
            $(el).find('.sq-order-dir').html('&#9661;');
        }
        else{
            orderSync(parseInt($(el).attr('sq-order')));
            $(el).attr('sq-order','');
            $(el).find('.sq-order-num,.sq-order-dir').html('');
            order--;
        }
        doApplyFilters();
    }
    function isNumeric(v){
        return ['NUMBER','SIGNED'].includes(v);
    }
    function showAdd(rid,el){
        if($(el).find('.new-table-req').length>0||$(el).hasClass('editing')||$(el).html().length==0)
            return;
        $('.new-table-req').remove();
        if(typeof metas[rid]==='object'&&!metas[rid].refId)
            return;
        const align=isNumeric($(el).attr('base'))?'NUMBER':'NO-NUMBER';
        var isRef;
        if(metas[rid]===0)
            return $(el).prepend(dubRecBtn.replace(':base:',align));
        if(typeof metas[rid]==='object'){ // This is a reference
            rid=metas[rid].id; // Get its parent
            isRef=true;
        }
        var parentId=$(el).closest('.sq-row').find('td[req-id='+metas[rid]+'][is-object=1]').attr('obj-id')
                        ||$(el).closest('.sq-row').find('td[req-id='+metas[rid]+'][is-object=1]').attr('ref-id');
        if(parentId>0&&($(el).attr('obj-id')>0||isRef))
            $(el).prepend(addTableReq.replace(':base:',align));
    }
    function dubRec(el){ // Duplicate the main record
        const td=$(el).closest('td');
        const tid=td.attr('req-id');
        const oid=td.attr('obj-id');
        const base=td.attr('base');
        if(uniq[tid]==='1'){
            $(el).remove();
            var val=td.html();
            if(base==="NUMBER")
                newApi('POST','object/'+tid+'?JSON&order_val=val&desc=1&LIMIT=1','dubRecUniqNum','',{td:td,oid:oid,tid:tid,val:val});
            else if(base==="SHORT"||base==="CHARS"){ 
                var fd=new FormData();
                var index=val.match(/ \((\d+)\)$/);
                if(index){
                    index=parseInt(index[1])+1
                    val=val.replace(/( \(\d+\)$)/,'');
                }
                else
                    index=1;
                fd.append('F_'+tid,val+' ('+index+')');
                newApi('POST','object/'+tid+'?JSON','dubRecUniqText',fd,{td:td,oid:oid,tid:tid,val:val,index:index});
            }
            else if(base==="DATETIME") // Set current date&time and hope this is unique so far
                newApi('POST','_m_save/'+oid+'?JSON&t'+tid+'='+(Date.now()/1000),'dubRecDone','copybtn=1',td);
            else
                errMsgCard(t9n('[RU]Значение типа '+base+' уникально и не может быть продублировано[EN]Please duplicate the unique value of '+base+' another way'));
        }
        else
            newApi('POST','_m_save/'+oid+'?JSON','dubRecDone','copybtn=1',td);
        event.stopPropagation();
    }
    function dubRecUniqText(json,vars){ // Check for duplicates for uniques
        var fd=new FormData();
        if(json.object){
            vars.index++;
            fd.append('F_'+vars.tid,vars.val+' ('+vars.index+')');
            newApi('POST','object/'+vars.tid+'?JSON','dubRecUniqText',fd,{td:vars.td,oid:vars.oid,tid:vars.tid,val:vars.val,index:vars.index});
        }
        else{
            fd.append('t'+vars.tid,vars.val+' ('+vars.index+')');
            fd.append('copybtn',1);
            newApi('POST','_m_save/'+vars.oid+'?JSON','dubRecDone',fd,vars.td);
        }
    }
    function dubRecUniqNum(json,vars){ // Check for duplicates for uniques
        if(json.object&&json.object[0].val&&parseInt(json.object[0].val))
            newApi('POST','_m_save/'+vars.oid+'?JSON&t'+vars.tid+'='+(parseInt(json.object[0].val)+1),'dubRecDone','copybtn=1',vars.td);
        else
            errMsgCard(t9n('[RU]Ошибка вычисления уникального значения[EN]Failed to calculate the unique value'));
    }
    function dubRecDone(json,el){ // Duplicate done - get it via report
        var fd=new FormData();
        fd.append('FR_'+$('#'+$(el).attr('req-id')).find('.sq-col-name').html()+'ID',json.obj);
        newApi('POST','report/'+id+'?JSON','newRecGet',fd,{el:el});
    }
    function newRecGet(json,vars){ // Show the duplicate
        $('.dub-rec').removeClass('dub-rec');
        for(var i in json.data[0]){
            $(vars.el).closest('tr').before(drawLine(json,i,'dub-rec'));
            $(vars.el).closest('tr').prev().find('td[base="MEMO"]').each(function(){ // restore the line breaks
                addBreaks(this);
            });
        }
        if(vars.mode){
            // Restore the subtotals class
            $('td[obj-id='+$(vars.el).attr('obj-id')+']').closest('tr:not(.dub-rec)').find('td').each(function(i){
                if($(this).hasClass('sub-totals'))
                    $('td[obj-id='+$(vars.el).attr('obj-id')+']').closest('.dub-rec').find('td').eq(i).addClass('sub-totals');
            });
            $('td[obj-id='+$(vars.el).attr('obj-id')+']').closest('tr:not(.dub-rec)').remove();
        }
        $('.dub-rec td[req-id]').click(function(){inlineEdit(this)});
        if(vars.mode==='edit')
            $('.dub-rec').removeClass('dub-rec');
        else{
            if(!vars.mode)
                $('.dub-rec td[req-id='+$(vars.el).attr('req-id')+']').first().click();
            setTimeout(()=>{$('.dub-rec').removeClass('dub-rec')},3000);
        }
        if($('.sub-totals').length>0)
            recalcSubTotals();
        doApplyFilters('TOTALS');
    }
    function addRow(el){
        event.stopPropagation();
        if($('.sq-new').length>0)
            return $('.sq-new').click();
        var i,j,reqId,td,h='';
        if(el)
            reqId=$(el).closest('td').attr('req-id');
        $('.sq-table thead tr th').each(function(){
            var i;
            if(el&&(metas[this.id]===0))
                i=$(el).closest('.sq-row').find('td[req-id='+this.id+']').attr('obj-id');
            h+='<td req-id="'+this.id+'" '+(baseType[this.id]?'base="'+baseType[this.id]+'"':'')+' onclick="inlineEdit(this)"'
                    +' class="position-relative '+(reqId===this.id||(!reqId&&metas[this.id]===0)?' sq-new':'')+(this.id?'':' calculable')+'"'
                    +(this.id?' onmouseover="showAdd('+this.id+',this)"':'')
                    +($(this).attr('is-object')?' is-object="1"':'')+'>';
        });
        if(reqId){
            $(el).closest('.sq-row').after('<tr class="sq-row" id="newRow">'+h);
            $('#newRow').find('td').each(function(){ // Fill in the upper fields
                const i=$(this).attr('req-id');
                if(metas[reqId].id===i)
                    $(this).html('');
                else if(i&&reqId!==i)
                    if(!isUnder(reqId,i)){
                        const td=$(el).closest('.sq-row').find('td[req-id='+i+']');
                        $(this).html(td.html());
                        if($(td).attr('obj-id'))
                            $(this).attr('obj-id',$(td).attr('obj-id'))
                        if($(td).attr('ref-id'))
                            $(this).attr('ref-id',$(td).attr('ref-id'))
                    }
            });
            $('#newRow').removeAttr('id');
            $(el).remove();
        }
        else
            $('.sq-table .filters').after('<tr class="sq-row">'+h);
        $('.sq-new').click();
    }
    function isUnder(reqId,i){
        while(i)
            if(i===reqId||metas[i].id===reqId)
                return true;
            else
                i=metas[i].id||metas[i];
    }
    function navKey(el){
        if(event.keyCode===13&&!event.shiftKey){ // Enter
            $(el).closest('td').removeClass('last-edited');
            saveVal(el);
        }
        else if(event.keyCode===27){ // Escape
            el.value=$(el).closest('td').attr('old-val');
            $(el).closest('td').removeClass('last-edited');
            saveVal(el);
        }
        else if(event.keyCode===38&&$(el).prop("tagName")!=='MEMO'){ // Up arrow
            if(neigh=$(el).closest('tr').prev().find('td')[$(el).closest('td').prevAll('td').length])
                neigh.click();
        }
        else if(event.keyCode===40&&$(el).prop("tagName")!=='MEMO'){ // Down arrow
            if(neigh=$(el).closest('tr').next().find('td')[$(el).closest('td').prevAll('td').length])
                neigh.click();
        }
        else if(event.keyCode===9){ // Tab
            if(event.shiftKey)
                $(el).closest('td').prev().click();
            else
                $(el).closest('td').next().click();
            event.preventDefault();
        }
    }
    function clearSubTotals(){
        $('.sub-totals').removeClass('sub-totals sub-totals-left sub-totals-right sub-totals-top sub-totals-bottom');
        $('.sub-totals-tab').hide();
    }
    function processSubTotals(el){
        if($(el).hasClass('sub-totals'))
            $(el).removeClass('sub-totals-left sub-totals-right sub-totals-top sub-totals-bottom');
        $(el).toggleClass('sub-totals');
        recalcSubTotals();
    }
    function recalcSubTotals(){
        var sum=count=avg=min=max=0;
        $('.sub-totals').each(function(){
            const base=$(this).attr('base');
            if(base==='NUMBER')
                val=parseInt(unFormatNum($(this).html()))||0;
            else
                val=parseFloat(unFormatNum($(this).html()))||0;
            sum+=val;
            count++;
            if(min>val)
                min=val;
            if(max<val)
                max=val;
            // Recalc borders
            if($(this).prev().hasClass('sub-totals'))
                $(this).prev().removeClass('sub-totals-right');
            else
                $(this).addClass('sub-totals-left');
            if($(this).next().hasClass('sub-totals'))
                $(this).next().removeClass('sub-totals-left');
            else
                $(this).addClass('sub-totals-right');
            const i=$(this).closest('tr').find('td').index(this);
            if($(this).closest('tr').prev().find('td').eq(i).hasClass('sub-totals'))
                $(this).closest('tr').prev().find('td').eq(i).removeClass('sub-totals-bottom');
            else
                $(this).addClass('sub-totals-top');
            if($(this).closest('tr').next().find('td').eq(i).hasClass('sub-totals'))
                $(this).closest('tr').next().find('td').eq(i).removeClass('sub-totals-top');
            else
                $(this).addClass('sub-totals-bottom');
        });
        $('.sub-totals-sum').html(sum);
        $('.sub-totals-count').html(count);
        $('.sub-totals-min').html(min);
        $('.sub-totals-max').html(max);
        $('.sub-totals-avg').html((sum/count).toFixed(2).replace('.00',''));
        $('.sub-totals-tab').show();
    }
    function inlineEdit(el){
        event.stopPropagation();
        if(event&&event.ctrlKey)
            return processSubTotals(el);
        var reqType=$(el).attr('req-id')
            ,w=$(el).css('width');
        if($('#'+reqType).css('max-width')==='none')
            $('#'+reqType+',td[req-id='+reqType+']').css('max-width',w).css('min-width',w);
        if($(el).hasClass('editing')&&event.target&&event.target.tagName==='TD'&&metas[reqType].refId)
            return blurSelect($(el).find('select'));
        if($(el).hasClass('editing')||$(el).hasClass('saving')||!$(el).attr('req-id'))
            return;
        if($(el).hasClass('last-edited'))
            return $(el).removeClass('last-edited');
        if($(el).attr('base')!=='FILE' && ($(el).html().indexOf('<a target')!==-1||metas[reqType]===undefined)) // Interactive report or unknown rec type
            return;
        // For a requisite, check if the parent ID is known
        if(typeof metas[reqType]==='object'&&!$(el).closest('.sq-row').find('td[req-id='+metas[reqType].id+']').attr('is-object'))
            return;
        $('.new-table-req,input[type="file"]').remove();
        var i,val=$(el).html()
            ,parentType=parseInt(metas[reqType].id||metas[reqType]);
        const parentId=$(el).closest('.sq-row').find('td[req-id='+parentType+'][is-object=1]').attr('obj-id')
                    ||$(el).closest('.sq-row').find('td[req-id='+parentType+'][is-object=1]').attr('ref-id');
        $('.select2.inline-edit').each(function(){blurSelect(this)});
        if(metas[reqType].ref){
            if(metas[reqType].multi){
                var h='',mult=val.split(',');
                for(i in mult)
                    if(mult[i].length>0)
                        h+=msLink.replace(/:text:/g,escapeHtmls(mult[i]));
                $(el).html(h);
                $(el).append('<select multi="1" ref-id="'+reqType+'" class="select2 inline-edit ml-1 mt-1 w-100" onchange="saveRef(this)"><option> </option></select>');
                fillInDdl(el,mult);
            }
            else{
                $(el).html('<select ref-id="'+reqType+'" class="select2 inline-edit w-100" onchange="saveRef(this)">'
                                +'<option selected value="current">'+val+'</option></select>');
                fillInDdl(el,[val]);
            }
        }
        else if($(el).attr('base')==='MEMO')
            $(el).html('<textarea class="inline-edit w-100" onkeydown="navKey(this)" onblur="saveVal(this)" onchange="saveVal(this)" style="min-height:'+$(el).css('height')+';max-height:'+$(el).css('height')+'">');
        else if($(el).attr('base')==='DATE'){
            $(el).html('<input type="date" class="inline-edit w-100" onkeydown="navKey(this)" onblur="saveVal(this)" onfocusout="saveVal(this)">');
            val=moment.utc(val||new Date(),'DD.MM.YYYY');
        }
        else if($(el).attr('base')==='DATETIME'){
            $(el).html('<input type="datetime-local" class="inline-edit w-100" onkeydown="navKey(this)" onblur="saveVal(this)" onfocusout="saveVal(this)">');
            val=moment.utc(val||new Date(),'DD.MM.YYYY HH:mm:ss');
        }
        else if($(el).attr('base')==='FILE')
            $(el).html(($(el).find('a').length>0?delFile:'') + '<input type="file" class="inline-edit" onchange="saveInlineFile(this)">');
        else if(isNumeric($(el).attr('base'))){
            val=unFormatNum(val);
            $(el).html('<input type="number" class="inline-edit w-100" onkeydown="navKey(this)" onblur="saveVal(this)" onchange="saveVal(this)">');
        }
        else
            $(el).html('<input type="text" class="inline-edit w-100" onkeydown="navKey(this)" onblur="saveVal(this)" onchange="saveVal(this)">');

        $('.inline-edit').focus();
        $('.last-edited,.editing').removeClass('last-edited editing');
        $('.editing-text').removeClass('editing-text');
        $(el).addClass('editing last-edited');
        $(el).find('input,textarea').closest('td').addClass('editing-text');
        if($(el).attr('obj-id')&&$('td[obj-id='+$(el).attr('obj-id')+']').length>1) // Highlight the same objects in the table in case there are more than one
            if($(el).attr('obj-id'))
                $('td[obj-id='+$(el).attr('obj-id')+']').addClass('same-object');
            else if($(el).attr('ref-id'))
                $('td[ref-id='+$(el).attr('ref-id')+']').each(function(){
                    if(parentId===$(this).closest('.sq-row').find('td[req-id='+parentType+'][is-object=1]').attr('obj-id'))
                        $(this).addClass('same-object');
                });
        if($(el).attr('base')==='DATE'){
            $(el).attr('old-val',$(el).hasClass('sq-new')?'':val.format("DD.MM.YYYY"));
            $(el).find('input').val(val.format("YYYY-MM-DD"));
        }
        else if($(el).attr('base')==='DATETIME'){
            $(el).attr('old-val',$(el).hasClass('sq-new')?'':val.format("DD.MM.YYYY"));
            $(el).find('input').val(val.format("YYYY-MM-DD HH:mm:ss"));
        }
        else if($(el).attr('base')==='MEMO')
            $(el).find('textarea').val($(el).attr('old-val'));
        else if($(el).attr('base')!=='FILE'){
            $(el).find('input,textarea').val(val);
            $(el).attr('old-val',val);
        }
    }
    function unFormatNum(v){
        return v.replace(/ /g,'').replace(',','.');
    }
    function delRefDone(json,el){
        $(el).closest('span').remove();
    }
    function getRef(json,vars){
        var v;
        if(json.reqs&&json.reqs[vars.id]&&json.reqs[vars.id].multiselect)
            for(var i in json.reqs[vars.id].multiselect.ref_val)
                if(json.reqs[vars.id].multiselect.ref_val[i]===vars.ref){
                    $(vars.el).closest('span').addClass('bg-warning');
                    newApi('POST','_m_del/'+json.reqs[vars.id].multiselect.id[i]+'?JSON','delRefDone','',vars.el);
                    if($(vars.el).closest('td').attr('old-val')===vars.ref) // The last and only ref
                        v='';
                    else
                        v=$(vars.el).closest('td').attr('old-val').replace(','+vars.ref+',',',')  // Among others
                                                            .replace(new RegExp(escapeRegex(','+vars.ref)+'$',''),'') // Last
                                                            .replace(new RegExp('^'+escapeRegex(vars.ref+','),''),''); // First
                    $(vars.el).closest('td').attr('old-val',v);
                }
    }
    function dropRef(el,ref){
        var reqType=$(el).closest('td').attr('req-id')
            ,parentType=metas[reqType].id
            ,i=$(el).closest('.sq-row').find('td[req-id='+parentType+']').attr('obj-id');
        if(i)
            newApi('GET','edit_obj/'+i+'?JSON','getRef','',{el:el,id:reqType,ref:ref})
    }
    function blurSelect(el){
        $(el).closest('td').html($(el).closest('td').attr('old-val')).removeClass('editing').removeClass('last-edited');
        $('.same-object').removeClass('same-object');
    }
    function fillInDdlDo(json,vars){
        if(json){
            var i,ref=$(vars.el).find('select').attr('ref-id');
            const oid=findParent(vars.el);
            if(!ddList[oid])
                ddList[oid]={};
            ddList[oid][ref]={};
            for(i in json)
                ddList[oid][ref][i]=json[i];
            fillInDdl(vars.el,vars.vals);
        }
    }
    var ddList={},ddLLimit=50;
    function fillInDdl(el,vals){
        var i,j=0,h='',ref=$(el).find('select').attr('ref-id')
            ,val=$(el).find('select option[selected]').html()
            ,oldId=$(el).find('select option[selected]').attr('value');
        const oid=findParent(el);
        if(ddList[oid]&&ddList[oid][ref]){
            for(i in ddList[oid][ref]){
                j++;
                if(vals.indexOf(ddList[oid][ref][i])===-1)
                    h+='<option value="'+i+'">'+ddList[oid][ref][i]+'</option>';
            }
            $(el).find('select').append(h);
            $(el).find('select').attr('old-val',val).attr('old-id',oldId);
            if(j>=ddLLimit)
                $(el).find('select').attr('i-more',1)
            initSel2($(el).find('select'));
        }
        else
            newApi('GET','_ref_reqs/'+ref+'?JSON&id='+oid+'&LIMIT='+ddLLimit,'fillInDdlDo','',{el:el,vals:vals});
    }
    function findParent(el){
        var oid;
        $(el).closest('tr').find('td[is-object=1]').each(function(){
            if(metas[$(this).attr('req-id')]===0)
                oid=$(this).attr('obj-id');
        });
        return oid;
    }
    function initSel2(el){
        var curEl=el;
        $(el).select2({
            tags: true,
            createTag: function (params) {
                let term = $.trim(params.term);
                if (term === '') return null;
                return {
                  id: '-1',
                  text: term,
                  newTag: true
                }
            },
            sorter: data => data.sort((a, b) => a.text.localeCompare(b.text)),
            placeholder: t9n('[RU]Выберите[EN]Select'),
            allowClear: true,
            ajax: $(curEl).attr('i-more') ? {
                url: function(params){
                    return requestURL='/'+db+'/_ref_reqs/'+$(this).closest('td').attr('req-id')+'?JSON&id='+findParent(this);
                },
                processResults: function(data){
                    let formattedData=[];
                    if(data)
                        for(var i in data)
                            if($(curEl).closest('td').find('span[ref='+i+']').length===0)
                                formattedData.push({"id":i, "text":data[i]})
                    return {results:formattedData};
                },
                dataType: 'json',
                cache: true,
                delay: 330
            } : undefined
        });
    }
    function refreshLine(json,el){
        $(el).closest('.sq-row').find('td[is-object=1]').each(function(){
            if(metas[$(this).attr('req-id')]===0){
                saveDone({},{el:this});
                return false;
            }
        });
    }
    function saveDone(json,vars){
        const reqId=$(vars.el).attr('req-id');
        $('.saving').removeClass('saving');
        if(vars.id)
            $(vars.el).attr('ref-id',vars.id);
        if($(vars.el).attr('obj-id'))
            parent=$(vars.el);
        else
            parent=$(vars.el).closest('.sq-row').find('td[req-id='+metas[reqId].id+']');
        const parentId=parent.attr('obj-id');
        const parentType=parent.attr('req-id');
        var fd=new FormData();
        fd.append('FR_'+$('#'+parentType).find('.sq-col-name').html()+'ID',parentId);
        if($('input[filter-id='+reqId+']').val().length>0&&$('th[footer-id='+reqId+']').html().length>0)
            $('th[footer-id='+reqId+']').css('color','red').prop('title', t9n('[RU]Возможно, значение неактуально из-за примененного фильтра[EN]The value might be not correct because of the filter applied'));
        else
            newApi('POST','report/'+id+'?JSON','newRecGet',fd,{el:parent,mode:'edit'});
    }
    function delDone(json,el){
        $('.saving').removeClass('saving');
        doApplyFilters('TOTALS');
        if(metas[$(el).attr('req-id')]===0){
            if(total)
                $('.total-count-num').html(--total);
            $('td[obj-id='+$(el).attr('obj-id')+']').closest('.sq-row').remove();
            if($('.sq-row').length===0){
                $('.page-count-from').html('');
                $('.page-count-to').html(0);
            }
            else
                $('.page-count-to').html(parseInt($('.page-count-to').html())-1);
            return;
        }
        $(el).html('').attr('obj-id','').attr('ref-id','');
        for(var i in metas)
            if(metas[i].id===$(el).attr('req-id'))
                $(el).closest('.sq-row').find('td[req-id='+i+']').html('').attr('obj-id','').attr('ref-id','');
    }
    function createDone(json,el){
        if(json.warning){
            errMsgCard(escapeHtmls(val)+': '+json.warning);
            $(el).closest('tr').remove();
            $('td[obj-id='+json.id+']').first().click();
            return;
        }
        $(el).removeClass('saving');
        $(el).attr('obj-id',json.id);
        $(el).html(json.val);
        if($(el).hasClass('sq-new')){
            $(el).removeClass('sq-new');
            if(total)
                $('.total-count-num').html(++total);
            $('.page-count-to').html(1+parseInt($('.page-count-to').html()));
        }
        var fd=new FormData();
        fd.append('FR_'+$('#'+$(el).attr('req-id')).find('.sq-col-name').html()+'ID',json.id);
        newApi('POST','report/'+id+'?JSON','newRecGet',fd,{el:el,mode:'new'});
    }
    function dropMsDone(json,i){
        $('#'+i).remove();
    }
    function addMsDone(json,el){
        $(el).removeClass('saving').removeClass('editing').removeClass('last-edited');
    }
    function createDicObj(json,el){
        if(json.id){
            $(el).find('option:selected').attr('value',json.id);
            ddList[findParent(el)][$(el).closest('td').attr('req-id')][json.id]=json.val;
            saveRef(el);
        }
        else
            errMsgCard(t9n('[RU]Ошибка создания справочного значения[EN]Failed to create the dictionary value'));
    }
    function saveRef(el){
        var td=$(el).closest('td')
            ,ref=$(el).attr('ref-id')
            ,pid=metas[td.attr('req-id')].id
            ,val=$(el).find('option:selected').text()||''
            ,i=$(el).closest('.sq-row').find('td[req-id='+pid+']').attr('obj-id');
        if(el.value==="-1"){ // New DDL item
            var fd=new FormData();
            const t=metas[$(el).attr('ref-id')].ref;
            fd.append('t'+t,val);
            newApi('POST','_m_new/'+t+'?JSON&up=1','createDicObj',fd,el);
            return;
        }
        if(parseInt(i)){
            if($(el).attr('multi')){
                newApi('POST','_m_set/'+i+'?JSON&t'+ref+'='+el.value,'addMsDone','',td);
                $(el).remove();
                val=td.attr('old-val')+(td.attr('old-val').length>0?',':'')+val;
                td.attr('old-val',val);
            }
            else{
                newApi('POST','_m_set/'+i+'?JSON&t'+ref+'='+(el.value||''),'saveDone','',{el:td,id:el.value||''});
                for(i in metas)
                    if(metas[i].id===$(td).attr('req-id'))
                        $(td).closest('.sq-row').find('td[req-id='+i+']').html('').attr('obj-id','').attr('ref-id','');
            }
        }
        else{
            $(td).attr('value',el.value); // Save ref value in the cell, not the DB
            $(el).closest('.sq-row').find('td[req-id='+pid+']').click(); // then switch to fill in the first column
        }
        try{
            $(td).find('select.select2').select2('destroy');
        }
        catch {};
        td.removeClass('editing').html(val);
        $('.same-object').html(val).attr('old-val',val);
        $('.same-object').removeClass('same-object');
    }
    function saveVal(elem){
        var i,parent,req,val,digits=0,el=$(elem).closest('td'),dispVal;
        const type=$(el).attr('req-id');
        const base=$(el).attr('base');
        val=base==='NUMBER'&&elem.value!=''?Math.floor(elem.value):elem.value;
        if($(el).hasClass('saving')||!$(el).hasClass('editing')) // Blur and Change both might be triggered
            return;
        if($(el).hasClass('sq-new')&&val==='')
            return $(el).closest('.sq-row').remove();
        if(base==='DATE'){
            val=moment.utc(val).format("DD.MM.YYYY");
            if(!val.match(/^(\d\d\.\d\d\.\d\d\d\d)$/))
                val='';
        }
        else if(base==='DATETIME'){
            val=moment.utc(val).format("DD.MM.YYYY HH:mm:ss");
            if(!val.match(/^(\d\d\.\d\d\.\d\d\d\d \d\d:\d\d:\d\d)$/))
                val='';
        }
        if(val!=$(el).attr('old-val')){
            var up=1,fd=new FormData();
            fd.append('t'+type,val);
            if($(el).attr('is-object')==="1"){
                if($(el).attr('obj-id')>0){
                    if(val==='')
                        newApi('POST','_m_del/'+$(el).attr('obj-id')+'?JSON','delDone',fd,el);
                    else
                        newApi('POST','_m_save/'+$(el).attr('obj-id')+'?JSON','saveDone',fd,{el:el});
                }
                else{
                    if(val===''){ // Delete the record
                        $(el).removeClass('editing').html(val).attr('old-val',val);
                        $('.same-object').removeClass('same-object');
                        return;
                    }
                    if(arrs[type])
                        up=$(el).closest('.sq-row').find('td[req-id='+arrs[type]+']').attr('obj-id')
                            ||$(el).closest('.sq-row').find('td[req-id='+arrs[type]+']').attr('ref-id');
                    for(i in metas)
                        if(metas[i].id===type&&metas[i].refId)
                            if(req=el.closest('tr').find('td[req-id='+i+']').attr('value'))
                                fd.append('t'+i,req);
                    newApi('POST','_m_new/'+type+'?JSON&up='+up,'createDone',fd,el);
                }
            }
            else{
                i=metas[type].id;
                i=$(el).closest('.sq-row').find('td[req-id='+i+'][is-object=1]').attr(metas[i].refId?'ref-id':'obj-id');
                if(i)
                    newApi('POST','_m_save/'+i+'?JSON','saveDone',fd,{el:el});
                else{
                    errMsgCard('Ошибка: Отсутствует ID. Возможно, стоит добавить колонку '+$('#'+type).find('.sq-col-name').html()+'ID.');
                    return $(elem).addClass('bg-danger');
                }
            }
            $(el).addClass('saving');
        }
        $(el).removeClass('editing editing-text');
        if(isNumeric($(el).attr('base')))
            dispVal = formatNum(val,$(el).attr('base'));
        else
            dispVal = val;
        $(el).html(dispVal).attr('old-val',val);
        if(base==='MEMO')
            addBreaks(el);
        $('.same-object').html(dispVal).attr('old-val',val);
        $('.same-object').removeClass('same-object');
    }
    function formatNum(n,f){
        var digits = f === 'NUMBER' ? 0 : 2;
        value = n === '' ? '' : Intl.NumberFormat(undefined,{
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
            useGrouping:true
        }).format(parseFloat(n));
        return value.replace(/(\u00A0|&nbsp;)/g, ' ');
    }
    function saveInlineFileDone(json,el){
        const v='<a target="_blank" href="/'+json.args+'">'+$(el).find('input').get(0).files.item(0).name+'</a>';
        $(el).html(v);
        $(el).removeClass('editing');
        $(el).attr('v',v);
    }
    function saveInlineFile(el){
        var fd=new FormData(),td=$(el).closest('td');
        if(el.files[0].name){
            fd.append('t'+$(el).closest('td').attr('req-id'),el.files[0],el.files[0].name);
            newApi('POST','_m_set/'+$(el).closest('tr').children(':first').attr('obj-id')+'?JSON','saveInlineFileDone',fd,td);
            $(el).removeClass('last-edited');
        }
        else
            $(el).closest('td').html($(el).closest('td').attr('v'));
    }
    function deleteFile(el){
        newApi('POST','_m_set/'+$(el).closest('tr').children(':first').attr('obj-id')+'?JSON','deleteFileDone','t'+$(el).closest('td').attr('req-id'),el);
    }
    function deleteFileDone(json,el){
        $(el).closest('td').html('');
    }
    function getMeta(json,refId){
        baseType[json.id]=bt[json.type];
        uniq[json.id]=json.unique;
        for(var i in json.reqs){
            baseType[json.reqs[i].id]=bt[json.reqs[i].type];
            metas[json.reqs[i].id]={id:refId||json.id
                                    ,arrId:json.reqs[i].arr_id
                                    ,refId:json.reqs[i].ref_id
                                    ,ref:json.reqs[i].ref
                                    ,multi:json.reqs[i].attrs&&json.reqs[i].attrs.indexOf(":MULTI:")!==-1
                                    ,type:json.reqs[i].type};
            if(json.reqs[i].arr_id)
                arrs[json.reqs[i].arr_id]=metas[json.reqs[i].arr_id]=refId||json.id;
            // Get ref column's reqs in case we have those in the report
            if(json.reqs[i].ref_id&&$('#'+json.reqs[i].id).length>0)
                newApi('GET','metadata/'+json.reqs[i].ref,'getMeta','',json.reqs[i].id);  // Set the Ref as parent for this req
        }
    }
    var limit,defaultLimit=20;
    function getSmart(json){
        try{
            if(json.obj.typ!=='22')
                return errMsgCard('Ошибка: Неверный тип объекта '+json.obj.typ);
        }
        catch(e){
            return errMsgCard('Ошибка: '+e+' '+json);
        }
        $('.rep-header').html(json.obj.val);
        limit=defaultLimit=parseInt(json.reqs[134].value)||defaultLimit;
        doApplyFilters();
    }
    var timer,lastK;
    function doApplyFilters(p){
        var fd=new FormData();
        filters={};
        lastK='';
        $('.filters input').each(function(){
            if(this.value!==''){
                $('.clear-filters').show();
                $('.refr').removeClass('ml-2');
                if(this.value==='%'||this.value==='!%'||this.value.substr(0,1)==='@'||this.value.substr(0,2)==='!@')
                    val=this.value;
                else
                    switch($(this).attr('base')){
                        case "NUMBER":
                        case "SIGNED":
                        case "DATE":
                        case "DATETIME":
                        case "BOOLEAN":
                            val=this.value;
                            break;
                        default:
                            val=this.value.indexOf('%')===-1?'%'+this.value.replace(/ /g,'%')+'%':this.value;
                    }
                fd.append($(this).attr('name'),val);
            }
        });
        if(p==='RECORD_COUNT')
            newApi('POST','report/'+id+'?JSON&RECORD_COUNT','getCountDone',fd);
        else if(p==='TOTALS'){
            if($('.sq-table tfoot').length>0||totalsOn)
                newApi('POST','report/'+id+'?JSON','drawFoot',fd);
        }
        else{
            if(!p){
                const urlParams=getFilterParams();
                for(let key in urlParams)
                    fd.append(key,urlParams[key]);
            }
            if(p===-2) // First page
                p=0,page=1;
            else if(p===2&&total) // Last page
                p=0,page=Math.ceil(total/limit);
            page+=p||0;
            $('.ajax-wait').show();
            newApi('POST','report/'+id+'?JSON&LIMIT='+(page===1?'':limit*(page-1)+',')+limit+collectOrder(),'getRep',fd);
        }
    }
    function getFilterParams(){
        let params = {};
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach(function(value, key) {
            if(value!==''){
                if(value==='%'||value==='!%'||value.substr(0,1)==='@'||value.substr(0,2)==='!@')
                    val=value;
                else {
                    const prefix = key.split('_')[0];
                    switch(prefix){
                        case "FR":
                        case "TO":
                            val=value;
                            break;
                        default:
                            val=value.indexOf('%')===-1?'%'+value.replace(/ /g,'%')+'%':value;
                    }
                }
                params[key] = val;
            }
        });
        return params;
    }
    function collectOrder(){
        var o=[];
        $('.sq-table th a').each(function(){
            if($(this).attr('sq-order')!=='')
                o[$(this).attr('sq-order')-1]=($(this).attr('desc')===''?'':'-')+$(this).attr('col-id');
        });
        return o.length>0?'&ORDER='+o.join(','):'';
    }
    const waitGif='<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path d="M14 4V8M14 20V24M6.93 6.93L9.76 9.76M18.24 18.24L21.07 21.07M4 14H8M20 14H24M6.93 21.07L9.76 18.24M18.24 9.76L21.07 6.93" stroke="#1A1A1A" stroke-linecap="round" stroke-linejoin="round"/>'
        +'</svg>';
    function getCount(){
        $('.total-count-num').html(waitGif);
        doApplyFilters('RECORD_COUNT');
    }
    function getCountDone(json){
        total=json.count;
        $('.total-count-from').html(t9n('[RU] из [EN] of '));
        $('.total-count-num').html(total);
    }
    function applyFilters(el){
        if(lastK!==el.value||el.value===''){
            window.clearTimeout(timer); // Включить задержку, чтобы дать пользователю набрать текст поиска
            lastK=el.value;
            // Запустить поиск через XXXмс после последнего нажатия клавиши в поле поиска
            timer=setTimeout(()=>{
                page=1;
                total=undefined;
                doApplyFilters(-2);
            },333);
        }
    }
    function escapeHtmls(t){
        t=t||'';
        if(!search.full&&t.length>127)
            t=t.substr(0,127)+'...';
        return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function escapeRegex(string){
        return string.replace(/[/\-\\^$*+?.()|[\]{}]/g,'\\$&');
    }
    function getRoundedDecimalString(string) {
        var lastPartNum = +('0.' + string);
        return (Math.round((lastPartNum + Number.EPSILON) * 100) / 100).toFixed(2).slice(2,4);
    }
    function markDown(el){
        if(el&&el.innerHTML.indexOf('***')===-1&&el.innerHTML.indexOf('~~~')===-1&&el.innerHTML.indexOf('___')===-1)
            el.innerHTML=el.innerHTML.replace(/\*\*(.+?)\*\*(?!\*)/g,'<b>$1</b>')
                                    .replace(/__(.+?)__(?!\_)/g,'<i>$1</i>')
                                    .replace(/~~(.+?)~~(?!\~)/g,'<s>$1</s>');
    }
    if(id>0)
        newApi('GET','edit_obj/'+id+'?JSON','getSmart');
    else
        $('.rep-header').html(t9n('[RU]Не задан [EN]Choose ')+'<a href="/'+db+'/sql">'+t9n('[RU]запрос[EN]a query')+'</a>');