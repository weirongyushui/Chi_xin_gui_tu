const app = getApp()

Page({
  data: {
    userInfo: {},
    userLocation: '',
    visitedCount: 0,
    collectedCount: 0,
    bookingCount: 0,
    recentBases: []
  },

  onLoad: function () {
    this.loadUserData();
  },

  onShow: function () {
    this.loadUserData();
    this.loadStats();
    this.loadRecentBases();
  },

  loadUserData: function() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userProfile') || {};
    const userCity = app.globalData.userCity;
    const userProvince = app.globalData.userProvince;
    
    let userLocation = '';
    if (userProvince && userCity) {
      userLocation = userProvince === userCity ? userCity : `${userProvince} ${userCity}`;
    }
    
    this.setData({
      userInfo: userInfo,
      userLocation: userLocation
    });
  },

  loadStats: function() {
    // 加载统计数据
    const collections = wx.getStorageSync('collections') || [];
    const bookingHistory = wx.getStorageSync('bookingHistory') || [];
    const visitHistory = wx.getStorageSync('visitHistory') || [];
    
    const activeBookings = bookingHistory.filter(item => item.status === 'confirmed').length;
    
    this.setData({
      visitedCount: visitHistory.length,
      collectedCount: collections.length,
      bookingCount: activeBookings
    });
  },

  loadRecentBases: function() {
    const recentIds = wx.getStorageSync('recentViewed') || [];
    if (recentIds.length === 0) {
      this.setData({ recentBases: [] });
      return;
    }
    
    const allBases = app.getAllBases();
    const recentBases = recentIds.slice(0, 5).map(id => {
      return allBases.find(base => base.id === id);
    }).filter(base => base);
    
    this.setData({
      recentBases: recentBases
    });
  },

  // 用户操作
  chooseAvatar: function() {
    if (!this.data.userInfo.nickName) {
      this.login();
      return;
    }
    
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.updateAvatar(tempFilePath);
      }
    });
  },

  updateAvatar: function(avatarUrl) {
    const userInfo = { ...this.data.userInfo, avatarUrl: avatarUrl };
    wx.setStorageSync('userProfile', userInfo);
    this.setData({ userInfo: userInfo });
    
    wx.showToast({
      title: '头像更新成功',
      icon: 'success'
    });
  },

  login: function() {
    const that = this;
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userProfile', userInfo);
        that.setData({ userInfo: userInfo });
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '登录取消',
          icon: 'none'
        });
      }
    });
  },

  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userProfile');
          this.setData({
            userInfo: {}
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 导航功能
  goToBookings: function() {
    if (!this.checkLogin()) return;
    
    wx.navigateTo({
      url: '/pages/booking/booking'
    });
  },

  goToCollections: function() {
    if (!this.checkLogin()) return;
    
    const collections = wx.getStorageSync('collections') || [];
    if (collections.length === 0) {
      wx.showToast({
        title: '暂无收藏',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到收藏页面（这里可以创建一个专门的收藏页面）
    wx.navigateTo({
      url: '/pages/list/list?type=collection'
    });
  },

  goToHistory: function() {
    if (!this.checkLogin()) return;
    
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  clearRecent: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空最近浏览记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('recentViewed');
          this.setData({ recentBases: [] });
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // 功能操作
  shareApp: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none'
    });
  },

  contactService: function() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-000-0000\n工作时间：9:00-18:00',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '拨打电话',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4000000000'
          });
        }
      }
    });
  },

  showFeedback: function() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的宝贵意见！您可以通过以下方式反馈：\n\n1. 在线客服\n2. 邮箱：feedback@redbase.com\n3. 微信群：红色基地用户群',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  showAbout: function() {
    wx.showModal({
      title: '关于我们',
      content: '红色基地票务小程序致力于为用户提供便捷的红色教育基地参观预约服务，传承红色文化，弘扬爱国主义精神。\n\n版本：v1.0.0\n开发团队：红色传承科技',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  showSettings: function() {
    wx.showActionSheet({
      itemList: ['隐私设置', '通知设置', '缓存清理', '检查更新'],
      success: (res) => {
        const actions = ['privacy', 'notification', 'cache', 'update'];
        this.handleSetting(actions[res.tapIndex]);
      }
    });
  },

  handleSetting: function(type) {
    switch (type) {
      case 'privacy':
        wx.showModal({
          title: '隐私设置',
          content: '当前版本暂不支持隐私设置修改，如有需要请联系客服。',
          showCancel: false
        });
        break;
      case 'notification':
        wx.openSetting({
          success: (res) => {
            console.log('设置结果：', res.authSetting);
          }
        });
        break;
      case 'cache':
        this.clearCache();
        break;
      case 'update':
        this.checkUpdate();
        break;
    }
  },

  clearCache: function() {
    wx.showModal({
      title: '清理缓存',
      content: '确定要清理应用缓存吗？这将清除临时文件但保留您的个人数据。',
      success: (res) => {
        if (res.confirm) {
          // 这里可以清理一些临时缓存
          wx.showToast({
            title: '缓存清理完成',
            icon: 'success'
          });
        }
      }
    });
  },

  checkUpdate: function() {
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          wx.showModal({
            title: '发现新版本',
            content: '发现新版本，是否下载更新？',
            success: (modalRes) => {
              if (modalRes.confirm) {
                updateManager.onUpdateReady(() => {
                  wx.showModal({
                    title: '更新提示',
                    content: '新版本已下载完成，是否重启应用？',
                    success: (restartRes) => {
                      if (restartRes.confirm) {
                        updateManager.applyUpdate();
                      }
                    }
                  });
                });
              }
            }
          });
        } else {
          wx.showToast({
            title: '已是最新版本',
            icon: 'success'
          });
        }
      });
    } else {
      wx.showToast({
        title: '当前版本过低，请更新微信',
        icon: 'none'
      });
    }
  },

  // 学习功能
  showPartyHistory: function() {
    wx.showModal({
      title: '党史学习',
      content: '中国共产党历史是最生动、最有说服力的教科书。学习党史有助于我们了解党的光辉历程，传承红色基因。',
      showCancel: false,
      confirmText: '开始学习',
      success: () => {
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
      }
    });
  },

  showRedStories: function() {
    wx.showModal({
      title: '红色故事',
      content: '每一个红色基地都有着动人的故事，每一位革命先烈都有着不朽的精神。让我们一起聆听这些感人的红色故事。',
      showCancel: false,
      confirmText: '开始阅读',
      success: () => {
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
      }
    });
  },

  showQuiz: function() {
    wx.showModal({
      title: '知识问答',
      content: '通过问答的形式检验您对党史知识的掌握程度，寓教于乐，加深印象。',
      showCancel: false,
      confirmText: '开始答题',
      success: () => {
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
      }
    });
  },

  // 工具函数
  checkLogin: function() {
    if (!this.data.userInfo.nickName) {
      wx.showModal({
        title: '需要登录',
        content: '此功能需要登录后才能使用，是否立即登录？',
        success: (res) => {
          if (res.confirm) {
            this.login();
          }
        }
      });
      return false;
    }
    return true;
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '红色基地票务 - 传承红色文化',
      desc: '便捷预约红色教育基地，传承革命精神',
      path: '/pages/index/index'
    };
  },

  onShareTimeline: function () {
    return {
      title: '红色基地票务 - 传承红色文化'
    };
  }
})