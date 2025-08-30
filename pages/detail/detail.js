const app = getApp()

Page({
  data: {
    baseId: null,
    baseInfo: {},
    nearbyBases: [],
    isCollected: false,
    loading: true,
    error: false,
    
    // 照片相关数据
    photoGallery: [],
    filteredPhotos: [],
    selectedPhotoCategory: 'all',
    showAllPhotos: false,
    photoCategories: [
      { type: 'all', name: '全部', count: 0 },
      { type: 'exterior', name: '外景', count: 0 },
      { type: 'interior', name: '内景', count: 0 },
      { type: 'exhibition', name: '展品', count: 0 }
    ]
  },

  onLoad: function (options) {
    const baseId = parseInt(options.id);
    if (baseId) {
      this.setData({
        baseId: baseId,
        loading: true,
        error: false
      });
      this.loadBaseInfo(baseId);
    } else {
      this.setData({
        loading: false,
        error: true
      });
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      });
    }
  },

  onShow: function() {
    // 页面显示时检查收藏状态
    if (this.data.baseId) {
      this.checkCollectionStatus(this.data.baseId);
    }
  },

  loadBaseInfo: function(id) {
    try {
      const allBases = app.getAllBases();
      const baseInfo = allBases.find(base => base.id === id);
      
      if (baseInfo) {
        // 为基地信息添加完整的图片数据结构
        const enhancedBaseInfo = {
          ...baseInfo,
          images: this.generateBaseImages(baseInfo)
        };
        
        this.setData({
          baseInfo: enhancedBaseInfo,
          loading: false
        });
        
        wx.setNavigationBarTitle({
          title: baseInfo.name
        });

        // 加载其他数据
        this.loadNearbyBases(id);
        this.loadPhotoGallery(id);
      } else {
        this.setData({
          loading: false,
          error: true
        });
        wx.showToast({
          title: '基地信息不存在',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('加载基地信息失败:', error);
      this.setData({
        loading: false,
        error: true
      });
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'error'
      });
    }
  },

  generateBaseImages: function(baseInfo) {
    // 直接使用 app.js 中配置的本地图片路径
    const rawImages = Array.isArray(baseInfo.images)
      ? baseInfo.images.filter(p => typeof p === 'string' && p.trim())
      : [];

    if (rawImages.length > 0) {
      return rawImages.map((path, index) => ({
        url: path,
        title: `${baseInfo.name}${index === 0 ? '外观' : '内景'}`,
        category: index === 0 ? 'exterior' : 'interior'
      }));
    }

    // 兜底猜测一张本地图；若不存在则由 WXML 的占位显示
    const guessedPath = `/pages/photo/${(baseInfo.name || '').trim()}.png`;
    return [{ url: guessedPath, title: `${baseInfo.name}外观`, category: 'exterior' }];
  },

  loadPhotoGallery: function(baseId) {
    try {
      // 生成完整的照片画廊数据
      const photoGallery = this.generatePhotoGallery(baseId);
      
      this.setData({
        photoGallery: photoGallery
      });
      
      this.updatePhotoCategories();
      this.filterPhotos();
    } catch (error) {
      console.error('加载照片失败:', error);
      this.setData({
        photoGallery: []
      });
    }
  },

  generatePhotoGallery: function(baseId) {
    // 使用当前基地的本地图片作为“内部图片”数据来源
    const allBases = app.getAllBases();
    const baseInfo = allBases.find(b => b.id === baseId) || {};
    const rawImages = Array.isArray(baseInfo.images)
      ? baseInfo.images.filter(p => typeof p === 'string' && p.trim())
      : [];

    const gallerySources = rawImages.length > 0
      ? rawImages
      : [`/pages/photo/${(baseInfo.name || '').trim()}.png`];

    return gallerySources.map((path, index) => ({
      url: path,
      title: `${baseInfo.name || '基地'}照片${index + 1}`,
      description: `${baseInfo.name || '基地'}相关照片`,
      category: index === 0 ? 'exterior' : 'interior',
      originalIndex: index
    }));
  },

  updatePhotoCategories: function() {
    const photoGallery = this.data.photoGallery;
    const categories = this.data.photoCategories.map(cat => {
      const count = cat.type === 'all' 
        ? photoGallery.length 
        : photoGallery.filter(photo => photo.category === cat.type).length;
      return { ...cat, count: count };
    });
    
    this.setData({
      photoCategories: categories
    });
  },

  filterPhotos: function() {
    const { photoGallery, selectedPhotoCategory, showAllPhotos } = this.data;
    let filteredPhotos = selectedPhotoCategory === 'all' 
      ? photoGallery 
      : photoGallery.filter(photo => photo.category === selectedPhotoCategory);
    
    // 如果不显示全部照片，只显示前6张
    if (!showAllPhotos && filteredPhotos.length > 6) {
      filteredPhotos = filteredPhotos.slice(0, 6);
    }
    
    this.setData({
      filteredPhotos: filteredPhotos
    });
  },

  // 照片相关事件处理
  selectPhotoCategory: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedPhotoCategory: type,
      showAllPhotos: false // 切换分类时重置显示状态
    });
    this.filterPhotos();
  },

  toggleShowAllPhotos: function() {
    this.setData({
      showAllPhotos: !this.data.showAllPhotos
    });
    this.filterPhotos();
  },

  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const urls = this.data.baseInfo.images.map(img => img.url);
    
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },

  previewPhoto: function(e) {
    const index = e.currentTarget.dataset.index;
    const urls = this.data.photoGallery.map(photo => photo.url);
    const current = this.data.photoGallery[index].url;
    
    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  // 原有的其他方法保持不变...
  loadNearbyBases: function(currentId) {
    try {
      const allBases = app.getAllBases();
      const otherBases = allBases.filter(base => base.id !== currentId);
      const shuffled = otherBases.sort(() => 0.5 - Math.random());
      
      // 为周边基地也添加图片数据（统一为本地图片对象结构）
      const nearbyBasesWithImages = shuffled.slice(0, 3).map(base => ({
        ...base,
        images: this.generateBaseImages(base)
      }));
      
      this.setData({
        nearbyBases: nearbyBasesWithImages
      });
    } catch (error) {
      console.error('加载周边基地失败:', error);
      this.setData({
        nearbyBases: []
      });
    }
  },

  checkCollectionStatus: function(id) {
    try {
      const collections = wx.getStorageSync('collections') || [];
      const isCollected = collections.includes(id);
      
      this.setData({
        isCollected: isCollected
      });
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  },

  // 其他原有方法保持不变...
  goBack: function() {
    wx.navigateBack({
      fail: function() {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    });
  },

  makeCall: function() {
    const phone = this.data.baseInfo.phone;
    if (phone && phone !== '暂无' && phone !== '') {
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function() {
          console.log('拨打电话成功');
        },
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

  shareBase: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  collectBase: function() {
    const baseId = this.data.baseId;
    const isCollected = this.data.isCollected;
    
    try {
      let collections = wx.getStorageSync('collections') || [];
      
      if (isCollected) {
        collections = collections.filter(id => id !== baseId);
        wx.showToast({
          title: '已取消收藏',
          icon: 'success'
        });
      } else {
        collections.push(baseId);
        wx.showToast({
          title: '收藏成功',
          icon: 'success'
        });
      }
      
      wx.setStorageSync('collections', collections);
      this.setData({
        isCollected: !isCollected
      });
    } catch (error) {
      console.error('收藏操作失败:', error);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'error'
      });
    }
  },

  openMap: function() {
    const baseInfo = this.data.baseInfo;
    if (baseInfo.latitude && baseInfo.longitude) {
      wx.openLocation({
        latitude: baseInfo.latitude,
        longitude: baseInfo.longitude,
        name: baseInfo.name,
        address: baseInfo.address,
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

  copyAddress: function() {
    const address = this.data.baseInfo.address;
    if (address && address !== '地址信息加载中...') {
      wx.setClipboardData({
        data: address,
        success: function() {
          wx.showToast({
            title: '地址已复制',
            icon: 'success'
          });
        },
        fail: function() {
          wx.showToast({
            title: '复制失败',
            icon: 'error'
          });
        }
      });
    } else {
      wx.showToast({
        title: '暂无地址信息',
        icon: 'none'
      });
    }
  },

  copyBookingUrl: function() {
    const bookingUrl = this.data.baseInfo.bookingUrl;
    if (bookingUrl && bookingUrl !== '无需预约' && bookingUrl !== '需现场排队') {
      wx.setClipboardData({
        data: bookingUrl,
        success: function() {
          wx.showToast({
            title: '链接已复制',
            icon: 'success'
          });
        },
        fail: function() {
          wx.showToast({
            title: '复制失败',
            icon: 'error'
          });
        }
      });
    } else {
      wx.showToast({
        title: '无需预约或暂无链接',
        icon: 'none'
      });
    }
  },

  goToBooking: function() {
    const baseId = this.data.baseId;
    wx.navigateTo({
      url: `/pages/booking/booking?baseId=${baseId}`,
      fail: function() {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'error'
        });
      }
    });
  },

  goToNearbyDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/detail/detail?id=${id}`,
      fail: function() {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'error'
        });
      }
    });
  },

  onShareAppMessage: function () {
    const baseInfo = this.data.baseInfo;
    return {
      title: `推荐红色基地：${baseInfo.name}`,
      desc: baseInfo.description || '值得参观的红色教育基地',
      path: `/pages/detail/detail?id=${this.data.baseId}`,
      imageUrl: baseInfo.images && baseInfo.images.length > 0 ? baseInfo.images[0].url : ''
    };
  },

  onShareTimeline: function () {
    const baseInfo = this.data.baseInfo;
    return {
      title: `推荐红色基地：${baseInfo.name}`,
      imageUrl: baseInfo.images && baseInfo.images.length > 0 ? baseInfo.images[0].url : ''
    };
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    if (this.data.baseId) {
      this.setData({
        loading: true
      });
      this.loadBaseInfo(this.data.baseId);
      wx.stopPullDownRefresh();
    }
  },

  // 重新加载
  retryLoad: function() {
    if (this.data.baseId) {
      this.setData({
        loading: true,
        error: false
      });
      this.loadBaseInfo(this.data.baseId);
    }
  },

  // 页面错误处理
  onError: function(error) {
    console.error('页面错误:', error);
    this.setData({
      loading: false,
      error: true
    });
  }
})