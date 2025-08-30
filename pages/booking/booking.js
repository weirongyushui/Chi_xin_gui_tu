const app = getApp()

Page({
  data: {
    baseId: null,
    baseInfo: {},
    
    // 表单数据
    visitDate: '',
    selectedTimeSlot: -1,
    visitorCount: 1,
    contactName: '',
    contactPhone: '',
    idNumber: '',
    specialNeeds: '',
    
    // 时间段
    timeSlots: [
      { time: '09:00-10:30', available: true },
      { time: '10:30-12:00', available: true },
      { time: '14:00-15:30', available: true },
      { time: '15:30-17:00', available: false }
    ],
    
    // 日期范围
    today: '',
    maxDate: '',
    
    // 状态
    isAgreed: false,
    submitLoading: false,
    canSubmit: false,
    
    // 预约记录
    bookingHistory: []
  },

  onLoad: function (options) {
    const baseId = parseInt(options.baseId);
    if (baseId) {
      this.setData({
        baseId: baseId
      });
      this.loadBaseInfo(baseId);
    }
    
    this.initDateRange();
    this.loadBookingHistory();
    this.loadUserInfo();
  },

  loadBaseInfo: function(id) {
    const allBases = app.getAllBases();
    const baseInfo = allBases.find(base => base.id === id);
    
    if (baseInfo) {
      this.setData({
        baseInfo: baseInfo
      });
      
      wx.setNavigationBarTitle({
        title: `预约 ${baseInfo.name}`
      });
    }
  },

  initDateRange: function() {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    this.setData({
      today: this.formatDate(tomorrow),
      maxDate: this.formatDate(maxDate)
    });
  },

  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  loadBookingHistory: function() {
    const history = wx.getStorageSync('bookingHistory') || [];
    const processedHistory = history.map(item => {
      let statusText = '';
      switch(item.status) {
        case 'confirmed':
          statusText = '已确认';
          break;
        case 'pending':
          statusText = '待确认';
          break;
        case 'cancelled':
          statusText = '已取消';
          break;
        default:
          statusText = '未知';
      }
      return {
        ...item,
        statusText: statusText
      };
    });
    
    this.setData({
      bookingHistory: processedHistory.slice(0, 5) // 只显示最近5条
    });
  },

  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      contactName: userInfo.name || '',
      contactPhone: userInfo.phone || '',
      idNumber: userInfo.idNumber || ''
    });
  },

  // 表单事件处理
  onDateChange: function(e) {
    this.setData({
      visitDate: e.detail.value
    });
    this.checkCanSubmit();
  },

  selectTimeSlot: function(e) {
    const index = e.currentTarget.dataset.index;
    const slot = this.data.timeSlots[index];
    
    if (slot.available) {
      this.setData({
        selectedTimeSlot: index
      });
      this.checkCanSubmit();
    } else {
      wx.showToast({
        title: '该时段已满',
        icon: 'none'
      });
    }
  },

  decreaseCount: function() {
    const count = this.data.visitorCount;
    if (count > 1) {
      this.setData({
        visitorCount: count - 1
      });
    }
  },

  increaseCount: function() {
    const count = this.data.visitorCount;
    if (count < 10) {
      this.setData({
        visitorCount: count + 1
      });
    }
  },

  onContactNameInput: function(e) {
    this.setData({
      contactName: e.detail.value
    });
    this.checkCanSubmit();
  },

  onContactPhoneInput: function(e) {
    this.setData({
      contactPhone: e.detail.value
    });
    this.checkCanSubmit();
  },

  onIdNumberInput: function(e) {
    this.setData({
      idNumber: e.detail.value
    });
    this.checkCanSubmit();
  },

  onSpecialNeedsInput: function(e) {
    this.setData({
      specialNeeds: e.detail.value
    });
  },

  toggleAgreement: function() {
    this.setData({
      isAgreed: !this.data.isAgreed
    });
    this.checkCanSubmit();
  },

  checkCanSubmit: function() {
    const { visitDate, selectedTimeSlot, contactName, contactPhone, idNumber, isAgreed } = this.data;
    
    const canSubmit = visitDate && 
                     selectedTimeSlot >= 0 && 
                     contactName.trim() && 
                     contactPhone.trim() && 
                     idNumber.trim() && 
                     isAgreed;
    
    this.setData({
      canSubmit: canSubmit
    });
  },

  // 验证函数
  validatePhone: function(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  validateIdNumber: function(idNumber) {
    const idRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return idRegex.test(idNumber);
  },

  // 提交预约
  submitBooking: function() {
    if (!this.data.canSubmit || this.data.submitLoading) {
      return;
    }

    // 验证手机号
    if (!this.validatePhone(this.data.contactPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // 验证身份证号
    if (!this.validateIdNumber(this.data.idNumber)) {
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none'
      });
      return;
    }

    this.setData({
      submitLoading: true
    });

    // 保存用户信息
    const userInfo = {
      name: this.data.contactName,
      phone: this.data.contactPhone,
      idNumber: this.data.idNumber
    };
    wx.setStorageSync('userInfo', userInfo);

    // 模拟提交
    setTimeout(() => {
      this.saveBookingRecord();
      
      this.setData({
        submitLoading: false
      });

      wx.showModal({
        title: '预约成功',
        content: '您的预约已提交成功，请按预约时间准时到达',
        showCancel: false,
        confirmText: '知道了',
        success: () => {
          wx.navigateBack();
        }
      });
    }, 2000);
  },

  saveBookingRecord: function() {
    const bookingData = {
      id: Date.now(),
      baseId: this.data.baseId,
      baseName: this.data.baseInfo.name,
      visitDate: this.data.visitDate,
      timeSlot: this.data.timeSlots[this.data.selectedTimeSlot].time,
      visitorCount: this.data.visitorCount,
      contactName: this.data.contactName,
      contactPhone: this.data.contactPhone,
      idNumber: this.data.idNumber,
      specialNeeds: this.data.specialNeeds,
      status: 'confirmed',
      createTime: new Date().toISOString()
    };

    let history = wx.getStorageSync('bookingHistory') || [];
    history.unshift(bookingData);
    wx.setStorageSync('bookingHistory', history);
  },

  // 取消预约
  cancelBooking: function(e) {
    const bookingId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: (res) => {
        if (res.confirm) {
          let history = wx.getStorageSync('bookingHistory') || [];
          history = history.map(item => {
            if (item.id === bookingId) {
              item.status = 'cancelled';
            }
            return item;
          });
          wx.setStorageSync('bookingHistory', history);
          
          this.loadBookingHistory();
          
          wx.showToast({
            title: '已取消预约',
            icon: 'success'
          });
        }
      }
    });
  },

  viewTicket: function(e) {
    const bookingId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '票据查看功能开发中',
      icon: 'none'
    });
  }
})