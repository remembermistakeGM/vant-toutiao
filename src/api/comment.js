import request from "../utils/request";
//文章评论请求相关模块

//获取文章评论或回复列表
export const getComments = params =>{
    return request ({
        method:"GET",
        url:"/app/v1_0/comments",
        params
    })
}

//点赞文章评论或回复列表
export const addCommentLike = commentId =>{
    return request ({
        method:"POST",
        url:"/app/v1_0/comment/likings",
        data:{
            target:commentId
        }
    })
}

//取消文章评论或回复列表
export const deleteCommentLikeLikings = commentId =>{
    return request ({
        method:"DELETE",
        url:`/app/v1_0/comment/likings/${commentId}`,
       
    })
}

/**
 * 添加评论或评论回复
 */
 export const addComment = (data) =>{
    return request({
      method: "POST",
      url: "/app/v1_0/comments",
      data
    });
  }
