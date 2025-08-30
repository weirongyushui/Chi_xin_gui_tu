const app = getApp();

Page({
  data: {
    mapCenter: {
      latitude: 39.9042,
      longitude: 116.4074
    },
    mapScale: 10,
    markers: [],
    selectedBase: null,
    filterType: 'all',
    allBases: []
  },

  onLoad: function (options) {
    this.initMap();
    this.loadRedBases();
  },

  onShow: function () {
    this.updateUserLocation();
  },

  initMap: function() {
    // 如果有用户位置，以用户位置为中心
    if (app.globalData.userLocation) {
      this.setData({
        mapCenter: app.globalData.userLocation
      });
    }
  },

  loadRedBases: function() {
    const allBases = app.globalData.redBases;
    this.setData({
      allBases: allBases
    });
    this.updateMarkers();
  },

  updateMarkers: function() {
    const { allBases, filterType } = this.data;
    let filteredBases = allBases;

    // 根据筛选类型过滤
    switch (filterType) {
      case 'nearby':
        if (app.globalData.userLocation) {
          // 计算距离并筛选附近的基地（这里简化处理）
          const userLocation = app.globalData.userLocation;
          filteredBases = allBases.filter(base => {
            const distance = this.calculateDistance(
              userLocation.latitude, userLocation.longitude,
              base.latitude, base.longitude
            );
            return distance < 100; // 100公里内
          });
        }
        break;
      case 'museum':
        filteredBases = allBases.filter(base => base.name.includes('博物馆'));
        break;
      case 'memorial':
        filteredBases = allBases.filter(base => base.name.includes('纪念馆'));
        break;
      case 'residence':
        filteredBases = allBases.filter(base => base.name.includes('故居'));
        break;
      case 'site':
        filteredBases = allBases.filter(base => base.name.includes('旧址'));
        break;
    }

    // 生成地图标记
    const markers = filteredBases.map((base, index) => ({
      id: base.id,
      latitude: base.latitude,
      longitude: base.longitude,
      title: base.name,
      iconPath: '/images/marker-red.png',
      width: 40,
      height: 40,
      callout: {
        content: base.name,
        fontSize: 12,
        borderRadius: 8,
        bgColor: '#ffffff',
        padding: 8,
        display: 'BYCLICK'
      }
    }));

    this.setData({
      markers: markers
    });
  },

  calculateDistance: function(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  updateUserLocation: function() {
    if (app.globalData.userLocation) {
      this.setData({
        mapCenter: app.globalData.userLocation
      });
    }
  },

  onMarkerTap: function(e) {
    const markerId = e.detail.markerId;
    const selectedBase = this.data.allBases.find(base => base.id === markerId);
    
    if (selectedBase) {
      this.setData({
        selectedBase: selectedBase,
        mapCenter: {
          latitude: selectedBase.latitude,
          longitude: selectedBase.longitude
        }
      });
    }
  },

  onRegionChange: function(e) {
    if (e.type === 'end') {
      // 地图移动结束后可以更新一些状态
    }
  },

  onLocationTap: function() {
    if (app.globalData.userLocation) {
      this.setData({
        mapCenter: app.globalData.userLocation,
        mapScale: 12
      });
    } else {
      wx.showToast({
        title: '正在获取位置...',
        icon: 'loading'
      });
      app.getUserLocation();
    }
  },

  onListViewTap: function() {
    wx.navigateTo({
      url: '/pages/list/list'
    });
  },

  onNavigateTap: function() {
    const base = this.data.selectedBase;
    if (base) {
      wx.openLocation({
        latitude: base.latitude,
        longitude: base.longitude,
        name: base.name,
        address: base.address
      });
    }
  },

  onDetailTap: function() {
    const base = this.data.selectedBase;
    if (base) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${base.id}`
      });
    }
  },

  onClosePanelTap: function() {
    this.setData({
      selectedBase: null
    });
  },

  onFilterTap: function(e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({
      filterType: filterType
    });
    this.updateMarkers();
  }
});