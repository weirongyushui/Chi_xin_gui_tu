const app = getApp()

Page({
  data: {
    userCity: '',
    userProvince: '',
    recommendedBases: [],
    hotBases: [],
    loading: true
  },

  onLoad: function () {
    this.loadData();
  },

  onShow: function () {
    this.loadUserLocation();
  },

  loadData: function() {
    this.setData({
      loading: true
    });

    // 模拟加载延迟
    setTimeout(() => {
      this.loadUserLocation();
      this.loadRecommendedBases();
      this.loadHotBases();
      
      this.setData({
        loading: false
      });
    }, 1000);
  },

  loadUserLocation: function() {
    const userCity = app.globalData.userCity;
    const userProvince = app.globalData.userProvince;
    
    this.setData({
      userCity: userCity,
      userProvince: userProvince
    });
  },

  loadRecommendedBases: function() {
    const recommendedBases = app.getRecommendedBases();
    
    // 如果当前城市没有基地，展示全部基地的前3个
    if (recommendedBases.length === 0) {
      const allBases = app.getAllBases();
      this.setData({
        recommendedBases: allBases.slice(0, 3)
      });
    } else {
      this.setData({
        recommendedBases: recommendedBases.slice(0, 3)
      });
    }
  },

  loadHotBases: function() {
    const allBases = app.getAllBases();
    // 按参观人数排序，取前6个
    const sortedBases = allBases.sort((a, b) => b.visitCount - a.visitCount);
    
    this.setData({
      hotBases: sortedBases.slice(0, 6)
    });
  },

  // 事件处理
  getLocation: function() {
    const that = this;
    wx.showLoading({
      title: '定位中...'
    });

    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        app.globalData.userLocation = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        app.getCityFromLocation(res.latitude, res.longitude);
        
        that.loadUserLocation();
        that.loadRecommendedBases();
        
        wx.hideLoading();
        wx.showToast({
          title: '定位成功',
          icon: 'success'
        });
      },
      fail: function() {
        wx.hideLoading();
        wx.showModal({
          title: '定位失败',
          content: '请检查是否开启位置权限',
          showCancel: false
        });
      }
    });
  },

  goToSearch: function() {
    wx.navigateTo({
      url: '/pages/list/list?search=true'
    });
  },

  goToMap: function() {
    wx.navigateTo({
      url: '/pages/map/map'
    });
  },

  goToList: function() {
    wx.navigateTo({
      url: '/pages/list/list'
    });
  },



  goToRoute: function() {
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

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500);
  }
})