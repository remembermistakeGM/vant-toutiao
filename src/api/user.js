import request from "../utils/request";
// import store from '@/store/'

// 用户登录
export const login = data => {
    return request({
        method: "POST",
        url: '/app/v1_0/authorizations',
        data

    })
}

// 发送验证码
export const sendSms = mobile => {
    return request({
        method: "GET"


    })
}

//获取用户信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: "/app/v1_0/user"
            // headers:{
            //     Authorization:`Bearer ${store.state.user.token}` 
            // },

    })
}

//获取用户频道列表
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: "/app/v1_0/user/channels"


    })
}

//添加用户频道
export const addUserChannels = data => {
    return request({
        method: 'PATCH',
        url: "/app/v1_0/user/channels",
        data

    })
}

//删除用户频道
export const deleteUserChannels = channelId => {
    return request({
      method: 'DELETE',
      url: `/app/v1_0/user/channels/${channelId}`
    })
}

/**
 * 添加关注
 */
 export const addFollow = userId => {
    return request({
      method: 'POST',
      url: '/app/v1_0/user/followings',
      data: {
        target: userId
      }
    })
  }
  
  /**
   * 取消关注
   */
  export const deleteFollow = userId => {
    return request({
      method: 'DELETE',
      url: `/app/v1_0/user/followings/${userId}`
    })
  }

/**
 * 收藏文章
 */
 export const addCollect = target => {
    return request({
      method: 'POST',
      url: '/app/v1_0/article/collections',
      data: {
        target
      }
    })
  }
  
  /**
   * 取消收藏文章
   */
  export const deleteCollect = target => {
    return request({
      method: 'DELETE',
      url: `/app/v1_0/article/collections/${target}`
    })
  }

  /**
 * 点赞
 */
export const addLike = articleId => {
    return request({
      method: 'POST',
      url: '/app/v1_0/article/likings',
      data: {
        target: articleId
      }
    })
  }
  
  /**
   * 取消点赞
   */
  export const deleteLike = articleId => {
    return request({
      method: 'DELETE',
      url: `/app/v1_0/article/likings/${articleId}`
    })
  }

  // 获取个人资料
  export const getUserProfile = () => {
    return request({
      method: 'GET',
      url: "/app/v1_0/user/profile",
    })
  }

  //编辑用户信息
  export const editUserProfile = params => {
    return request({
      method: 'PATCH',
      url: "/app/v1_0/user/profile",
      params
    })
  }

  //编辑用户照片资料（头像、身份证照片）
  export const getUserPhoto = params => {
    return request({
      method: 'PATCH',
      url: "/app/v1_0/user/photo",
      params
    })
  }

 
