let loaded = false;
let loading = false;
let areaDB = new Map();
let areaChildDB = new Map();

function loadJson(callback){
    if(loading) return;
    loading = true;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', './areaList.js');
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4) return;// 通信成功时，状态值为4
        if(xhr.status !== 200) return;
        loading = false;

        try{
            var result = JSON.parse(xhr.responseText);
            addToMap(areaDB, result);
            addToChildMap(areaChildDB, 0, result);
            loaded = true;
            console.log('areaDB inited');
        }catch(e){}
        
        if(callback) callback();
    };
}

function addToMap(map, areas){
    areas.forEach(a => {
        map.set(a.code.toString(), a.name);
        if(a.subordinates && a.subordinates.length > 0){
            addToMap(map, a.subordinates);
        }
    });
}

function addToChildMap(map, code, areas){
    let values = [];
    areas.forEach(a => {
        values.push({ code: a.code.toString(), name: a.name });
        map.set(code.toString(), values);

        let childrens = a.subordinates;
        if(childrens && childrens.length > 0){
            addToChildMap(map, a.code, childrens);
        }
    });
}

export function getAreaName(code){
    if(!code) return '';

    code = code.toString();
    return areaDB.has(code) ? areaDB.get(code) : '';
}

export function getChildren(code){
    code = code || 0;
    code = code.toString();
    return areaChildDB.has(code) ? areaChildDB.get(code) : [];
}

let callbackQueue = [];

export function initAreaDB(callback){
    if(loaded){
        if(callback) callback();
        return;
    }else{
        if(callback) callbackQueue.push(callback);
        if(!loading){
            loadJson(function(){
                callbackQueue.forEach(cb => cb());
            });
        }
    }
}