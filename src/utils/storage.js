// 本地存储封装
export const getItem = name =>{
    const data= window.localStorage.getItem(name)
    //为什么放入try catch中，因为不知道getItem获取什么格式的数据
    
    try{
        //尝试把data转换为js对象
        return JSON.parse(data)
    }catch(err){
        return data
        //如果不是返回原样
    }
}
export const setItem = (name,value) =>{
    //如果value是对象，就不value转换为json
    if(typeof value === 'object'){
        value = JSON.stringify(value)
    }
     window.localStorage.setItem(name,value)

}
export const removeItem = name =>{
    window.localStorage.removeItem(name)

}