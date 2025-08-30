const app = getApp();

Page({
  data: {
    markers: [],
    selectedBase: null
  },

  onLoad: function (options) {
    this.loadMarkers();
  },

  loadMarkers: function() {
    const bases = app.globalData.redBases;
    const markers = bases.map((base, index) => ({
      id: base.id,
      latitude: base.latitude,
      longitude: base.longitude,
      title: base.name,
      iconPath: '',
      width: 30,
      height: 30,
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

  onMarkerTap: function(e) {
    const markerId = e.detail.markerId;
    const selectedBase = app.globalData.redBases.find(base => base.id === markerId);
    
    this.setData({
      selectedBase: selectedBase
    });
  },

  onLocationTap: function() {
    wx.showToast({
      title: '正在定位...',
      icon: 'loading'
    });
  },

  onListTap: function() {
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
  }
});