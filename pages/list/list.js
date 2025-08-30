const app = getApp()

Page({
  data: {
    searchKeyword: '',
    selectedProvince: '',
    sortIndex: 0,
    viewMode: 'list', // 'list' or 'grid'
    
    allBases: [],
    filteredBases: [],
    provinces: [],
    userProvince: '',
    
    sortOptions: [
      { label: '默认排序', value: 'default' },
      { label: '评分最高', value: 'rating' },
      { label: '最多参观', value: 'visitCount' },
      { label: '距离最近', value: 'distance' }
    ],
    
    loading: true
  },

  onLoad: function (options) {
    // 检查是否从搜索进入
    if (options.search === 'true') {
      wx.setNavigationBarTitle({
        title: '搜索基地'
      });
    }
    
    this.loadData();
    this.loadUserLocation();
  },

  onShow: function () {
    // 页面显示时刷新数据
    this.filterBases();
  },

  loadData: function() {
    this.setData({
      loading: true
    });

    const allBases = app.getAllBases();
    const provinces = [...new Set(allBases.map(base => base.province))].sort();
    
    setTimeout(() => {
      this.setData({
        allBases: allBases,
        filteredBases: allBases,
        provinces: provinces,
        loading: false
      });
    }, 800);
  },

  loadUserLocation: function() {
    const userProvince = app.globalData.userProvince;
    this.setData({
      userProvince: userProvince || ''
    });
  },

  // 搜索功能
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  onSearch: function() {
    this.filterBases();
  },

  // 筛选功能
  selectProvince: function(e) {
    const province = e.currentTarget.dataset.province;
    this.setData({
      selectedProvince: province
    });
    this.filterBases();
  },

  // 排序功能
  onSortChange: function(e) {
    const sortIndex = parseInt(e.detail.value);
    this.setData({
      sortIndex: sortIndex
    });
    this.sortBases();
  },

  // 视图模式切换
  switchViewMode: function(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      viewMode: mode
    });
  },

  // 数据处理
  filterBases: function() {
    let bases = [...this.data.allBases];
    
    // 关键词搜索
    if (this.data.searchKeyword.trim()) {
      const keyword = this.data.searchKeyword.toLowerCase();
      bases = bases.filter(base => 
        base.name.toLowerCase().includes(keyword) ||
        base.address.toLowerCase().includes(keyword) ||
        base.description.toLowerCase().includes(keyword) ||
        base.province.toLowerCase().includes(keyword) ||
        base.city.toLowerCase().includes(keyword)
      );
    }
    
    // 省份筛选
    if (this.data.selectedProvince) {
      bases = bases.filter(base => base.province === this.data.selectedProvince);
    }
    
    this.setData({
      filteredBases: bases
    });
    
    this.sortBases();
  },

  sortBases: function() {
    let bases = [...this.data.filteredBases];
    const sortOption = this.data.sortOptions[this.data.sortIndex];
    
    switch (sortOption.value) {
      case 'rating':
        bases.sort((a, b) => b.rating - a.rating);
        break;
      case 'visitCount':
        bases.sort((a, b) => b.visitCount - a.visitCount);
        break;
      case 'distance':
        // 这里可以实现基于用户位置的距离排序
        bases.sort((a, b) => {
          // 优先显示用户所在省份的基地
          if (this.data.userProvince) {
            if (a.province === this.data.userProvince && b.province !== this.data.userProvince) {
              return -1;
            }
            if (b.province === this.data.userProvince && a.province !== this.data.userProvince) {
              return 1;
            }
          }
          return 0;
        });
        break;
      default:
        // 默认排序：用户所在省份优先，然后按id排序
        bases.sort((a, b) => {
          if (this.data.userProvince) {
            if (a.province === this.data.userProvince && b.province !== this.data.userProvince) {
              return -1;
            }
            if (b.province === this.data.userProvince && a.province !== this.data.userProvince) {
              return 1;
            }
          }
          return a.id - b.id;
        });
    }
    
    this.setData({
      filteredBases: bases
    });
  },

  clearFilters: function() {
    this.setData({
      searchKeyword: '',
      selectedProvince: '',
      sortIndex: 0
    });
    this.filterBases();
  },

  // 事件处理
  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  goToBooking: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/booking/booking?baseId=${id}`
    });
  },

  makeCall: function(e) {
    const phone = e.currentTarget.dataset.phone;
    if (phone && phone !== '暂无') {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: function() {
          wx.showToast({
            title: '拨打失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '暂无联系电话',
        icon: 'none'
      });
    }
  },

  openMap: function(e) {
    const item = e.currentTarget.dataset.item;
    if (item.latitude && item.longitude) {
      wx.openLocation({
        latitude: item.latitude,
        longitude: item.longitude,
        name: item.name,
        address: item.address,
        fail: function() {
          wx.showToast({
            title: '打开地图失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '暂无位置信息',
        icon: 'none'
      });
    }
  },

  scrollToUserLocation: function() {
    if (this.data.userProvince && this.data.selectedProvince !== this.data.userProvince) {
      this.setData({
        selectedProvince: this.data.userProvince
      });
      this.filterBases();
      
      wx.showToast({
        title: `已切换到${this.data.userProvince}`,
        icon: 'success'
      });
    }
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500);
  },

  // 上拉加载更多（如果需要分页）
  onReachBottom: function() {
    // 这里可以实现分页加载更多数据
  }
})