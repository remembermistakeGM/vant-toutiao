import request from "../utils/request";
//文章请求相关模块

//获取用户文章列表
export const getArticles = params => { 
    return request({
        method: 'GET',
        url: '/app/v1_1/articles',
        params
    })
}

//获取全部频道列表
export const getAllChannel = () =>{
    return request({
        method:"GET",
        url:"/app/v1_0/channels",

    })

}

//获取文章详情
export const getArticleDetail = article_id =>{
    return request ({
        method:"GET",
         url:`/app/v1_0/articles/${article_id}`
    })
}

