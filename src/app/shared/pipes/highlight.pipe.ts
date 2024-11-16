import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
    //实现关键字高亮
    transform(value: any, cont:string) {
        let toValue = value.replace("<","《").replace(">","》");//将内容中的 <>符号替换掉
        return this.getHtml(toValue,cont);
    }

    //text 当前表格数据 key关键词 replace替换字符串方法 new RegExp(key,'ig')查询匹配key的值 ig不区分大小写 $&替换的字符串片段
    getHtml(text,key) {
        if(key!="" && key!=null && typeof(key)!="undefined"){
            key = key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");//将关键词中的特殊符号进行重新编译，防止正则冲突
            return '<span class="ztextn">'+text.replace(new RegExp(key,'ig'),'<span class="ztextred">$&</span>')+'</span>';
        }else{
            return '<span class="ztextn">'+text+'</span>';
        }
    }
}