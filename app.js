App({
    globalData: {
      userLocation: null,
      userCity: '',
      userProvince: '',
      redBases: [
        // 北京
        {
          id: 1,
          name: "中国共产党历史展览馆",
          province: "北京",
          city: "北京市",
          address: "北京市朝阳区北辰东路9号",
          latitude: 40.003021,
          longitude: 116.385564,
          description: "中国共产党历史展览馆是党中央为庆祝中国共产党成立100周年而建设的大型综合性主题展览馆，是展示中国共产党奋斗历史的精神殿堂。",
          introduction: "展览馆占地面积13.2万平方米，建筑面积8万平方米，展览面积3万平方米。展览馆建筑外观庄重大气，内部装饰精美典雅，集展览、教育、研究等功能于一体。",
          ticketInfo: "免费参观，需要提前预约",
          openTime: "周二至周日 9:00-17:00（16:00停止入场）",
          phone: "010-66266230",
          bookingUrl: "https://www.cpcmuseum.cn/",
          bookingMethod: "官网预约、微信公众号预约",
          images: [
            "",
            ""
          ],
          rating: 4.8,
          visitCount: 15000
        },
        {
          id: 2,
          name: "毛主席纪念堂",
          province: "北京",
          city: "北京市",
          address: "北京市东城区天安门广场",
          latitude: 39.903738,
          longitude: 116.396403,
          description: "毛主席纪念堂是为纪念中华人民共和国主要缔造者毛泽东而建造的纪念性建筑。",
          introduction: "纪念堂坐落在原中华门旧址，1977年9月9日举行落成典礼并对外开放。纪念堂建筑庄严肃穆，是人民瞻仰伟大领袖的神圣场所。",
          ticketInfo: "免费参观",
          openTime: "周二、三、四、六、日 8:00-12:00",
          phone: "010-65241851",
          bookingUrl: "需现场排队",
          bookingMethod: "现场排队，无需预约",
          images: ["/pages/photo/"],
          rating: 4.7,
          visitCount: 20000
        },
        {
          id: 3,
          name: "中国人民抗日战争纪念馆",
          province: "北京",
          city: "北京市",
          address: "北京市丰台区卢沟桥宛平城内街101号",
          latitude: 39.846939,
          longitude: 116.223542,
          description: "中国人民抗日战争纪念馆是全面反映中国人民抗日战争历史的大型综合性专题纪念馆。",
          introduction: "纪念馆于1987年7月7日卢沟桥事变爆发50周年之际正式对外开放。馆内收藏各种文物达两万余件，其中一级文物达百余件。",
          ticketInfo: "免费参观，需要预约",
          openTime: "周二至周日 9:00-16:30",
          phone: "010-83893163",
          bookingUrl: "http://www.1937china.com/",
          bookingMethod: "官网预约、电话预约",
          images: ["/pages/photo/中国人民抗日战争纪念馆.png"],
          rating: 4.6,
          visitCount: 12000
        },
        // 上海
        {
          id: 4,
          name: "中共一大会址纪念馆",
          province: "上海",
          city: "上海市",
          address: "上海市黄浦区黄陂南路374号",
          latitude: 31.220089,
          longitude: 121.473701,
          description: "中共一大会址纪念馆是中国共产党的诞生地，是马克思主义在中国大地上早期传播的重要见证。",
          introduction: "1921年7月23日，中国共产党第一次全国代表大会在此召开。纪念馆展现了中国共产党创建的光辉历程，是进行爱国主义教育和革命传统教育的重要场所。",
          ticketInfo: "免费参观，需要预约",
          openTime: "周二至周日 9:00-17:00",
          phone: "021-53832171",
          bookingUrl: "https://www.zgydjs.com/",
          bookingMethod: "官网预约、现场预约",
          images: [
            "/pages/photo/中共一大会址纪念馆.png"
          ],
          rating: 4.9,
          visitCount: 18000
        },
        {
          id: 5,
          name: "上海龙华烈士陵园",
          province: "上海",
          city: "上海市",
          address: "上海市徐汇区龙华路2887号",
          latitude: 31.176711,
          longitude: 121.442494,
          description: "上海龙华烈士陵园是为纪念在龙华地区英勇就义的革命烈士而建立的陵园。",
          introduction: "陵园占地285亩，安葬着包括顾正红、萧楚女、罗亦农等在内的1700多名烈士。园内建有烈士纪念馆、烈士墓群、纪念雕塑等。",
          ticketInfo: "免费参观",
          openTime: "6:00-17:00",
          phone: "021-64685995",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: ["/pages/photo/上海市龙华烈士陵园（龙华烈士纪念馆）.png",
          "/pages/photo/上海市龙华烈士陵园（龙华烈士纪念馆）.png"],
          rating: 4.5,
          visitCount: 8000
        },
        // 湖南
        {
          id: 6,
          name: "毛泽东故居",
          province: "湖南",
          city: "湘潭市",
          address: "湖南省韶山市韶山冲上屋场",
          latitude: 27.915966,
          longitude: 112.526633,
          description: "毛泽东故居是中华人民共和国主要缔造者毛泽东的出生地和少年时期居住地。",
          introduction: "故居建于清乾隆年间，是一栋砖木结构的农舍，共13间半房屋。毛泽东1893年12月26日诞生于此，并在这里度过了童年和少年时代。",
          ticketInfo: "免费参观",
          openTime: "8:00-17:30",
          phone: "0731-55685157",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: ["/pages/photo/"],
          rating: 4.8,
          visitCount: 25000
        },
        {
          id: 7,
          name: "刘少奇故居",
          province: "湖南",
          city: "长沙市",
          address: "湖南省宁乡市花明楼炭子冲",
          latitude: 28.253889,
          longitude: 112.835278,
          description: "刘少奇故居是无产阶级革命家、政治家刘少奇的出生地和童年、少年时期居住地。",
          introduction: "故居建于清朝道光年间，坐东朝西，砖木结构，茅草盖顶，共21间半房屋。刘少奇1898年11月24日诞生于此。",
          ticketInfo: "免费参观",
          openTime: "8:30-17:00",
          phone: "0731-87094027",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: [],
          rating: 4.7,
          visitCount: 15000
        },
        // 江西
        {
          id: 8,
          name: "井冈山革命博物馆",
          province: "江西",
          city: "吉安市",
          address: "江西省井冈山市茨坪红军南路",
          latitude: 26.577778,
          longitude: 114.178611,
          description: "井冈山革命博物馆是为纪念中国共产党创建的第一个农村革命根据地而建立的专题性博物馆。",
          introduction: "博物馆展示了井冈山革命根据地的历史，馆藏文物近3000件，其中珍贵文物800多件，是了解井冈山革命历史的重要窗口。",
          ticketInfo: "免费参观，需要预约",
          openTime: "8:00-17:00",
          phone: "0796-6552248",
          bookingUrl: "http://www.jgsgmjng.com/",
          bookingMethod: "官网预约、电话预约",
          images: [],
          rating: 4.6,
          visitCount: 12000
        },
        {
          id: 9,
          name: "南昌八一起义纪念馆",
          province: "江西",
          city: "南昌市",
          address: "江西省南昌市西湖区中山路380号",
          latitude: 28.681944,
          longitude: 115.853611,
          description: "南昌八一起义纪念馆是为纪念南昌起义而设立的专题纪念馆。",
          introduction: "纪念馆成立于1956年，原为江西大旅社，是南昌起义的指挥部旧址。馆内陈列着大量起义文物和史料，展现了人民军队的诞生历程。",
          ticketInfo: "免费参观",
          openTime: "8:00-18:00",
          phone: "0791-86772610",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: [],
          rating: 4.5,
          visitCount: 10000
        },
        // 陕西
        {
          id: 10,
          name: "延安革命纪念馆",
          province: "陕西",
          city: "延安市",
          address: "陕西省延安市宝塔区王家坪路4号",
          latitude: 36.585278,
          longitude: 109.493889,
          description: "延安革命纪念馆是展示延安革命历史的综合性纪念馆。",
          introduction: "纪念馆展示了中共中央在延安十三年的光辉历程，馆藏文物3.6万多件，是进行革命传统教育和爱国主义教育的重要基地。",
          ticketInfo: "免费参观，需要预约",
          openTime: "8:00-18:00",
          phone: "0911-2332435",
          bookingUrl: "需电话预约",
          bookingMethod: "电话预约",
          images: [],
          rating: 4.7,
          visitCount: 16000
        },
        // 四川
        {
          id: 11,
          name: "邓小平故居",
          province: "四川",
          city: "广安市",
          address: "四川省广安市广安区协兴镇牌坊村",
          latitude: 30.456389,
          longitude: 106.633611,
          description: "邓小平故居是中国改革开放总设计师邓小平的诞生地。",
          introduction: "故居建于清朝嘉庆年间，是一座具有浓郁川东民居特色的三合院建筑。邓小平1904年8月22日诞生于此。",
          ticketInfo: "免费参观",
          openTime: "8:30-17:30",
          phone: "0826-2711960",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: [],
          rating: 4.6,
          visitCount: 14000
        },
        // 重庆
        {
          id: 12,
          name: "渣滓洞监狱旧址",
          province: "重庆",
          city: "重庆市",
          address: "重庆市沙坪坝区歌乐山正街319号",
          latitude: 29.537222,
          longitude: 106.423611,
          description: "渣滓洞监狱是国民党当局关押和屠杀革命者的监狱，是进行革命传统教育的重要场所。",
          introduction: "渣滓洞原为人工采煤的小煤窑，1943年被国民党改建为监狱。许多革命烈士在此英勇就义，是红岩精神的重要载体。",
          ticketInfo: "免费参观",
          openTime: "8:30-17:00",
          phone: "023-65651016",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: ["/pages/photo/渣滓洞.png","/pages/photo/渣滓洞.png"],
          rating: 4.8,
          visitCount: 20000
        },
        {
          id: 13,
          name: "白公馆监狱旧址",
          province: "重庆",
          city: "重庆市",
          address: "重庆市沙坪坝区歌乐山森林公园内",
          latitude: 29.541111,
          longitude: 106.420833,
          description: "白公馆是国民党军统特务重庆集中营的监狱之一，关押过许多革命志士。",
          introduction: "白公馆原为四川军阀白驹的郊外别墅，1943年被国民党特务机关改建为监狱。小说《红岩》中许多故事发生在此处。",
          ticketInfo: "免费参观",
          openTime: "8:30-17:00",
          phone: "023-65651016",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: ["/pages/photo/白公馆.png"],
          rating: 4.7,
          visitCount: 18000
        },
        // 湖北
        {
          id: 14,
          name: "武昌起义纪念馆",
          province: "湖北",
          city: "武汉市",
          address: "湖北省武汉市武昌区武珞路1号",
          latitude: 30.544444,
          longitude: 114.353611,
          description: "武昌起义纪念馆是为纪念1911年武昌起义而建立的专题纪念馆。",
          introduction: "纪念馆位于武昌蛇山南麓的红楼内，展示了辛亥革命的历史过程，是全国重点文物保护单位。",
          ticketInfo: "免费参观",
          openTime: "9:00-17:00",
          phone: "027-88875566",
          bookingUrl: "无需预约",
          bookingMethod: "直接参观",
          images: ["/pages/photo/"],
          rating: 4.5,
          visitCount: 12000
        },
        // 河北
        {
          id: 15,
          name: "西柏坡纪念馆",
          province: "河北",
          city: "石家庄市",
          address: "河北省平山县西柏坡镇",
          latitude: 38.342222,
          longitude: 113.962222,
          description: "西柏坡纪念馆是为纪念中共中央在西柏坡的革命活动而建立的纪念馆。",
          introduction: "西柏坡是中共中央解放全中国的最后一个农村指挥所，被誉为'新中国从这里走来'。纪念馆展示了这一伟大历史进程。",
          ticketInfo: "免费参观，需要预约",
          openTime: "9:00-17:00",
          phone: "0311-82851355",
          bookingUrl: "http://www.xbp.gov.cn/",
          bookingMethod: "官网预约、电话预约",
          images: ["/pages/photo/西柏坡纪念馆.png",
                    "/pages/photo/西柏坡纪念馆.png"],
          rating: 4.8,
          visitCount: 16000
        }
      ]
    },
  
    onLaunch: function () {
      this.getUserLocation();
    },
  
    getUserLocation: function() {
      const that = this;
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          that.globalData.userLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          that.getCityFromLocation(res.latitude, res.longitude);
        },
        fail: function() {
          wx.showToast({
            title: '定位失败',
            icon: 'none'
          });
        }
      });
    },
  
    getCityFromLocation: function(lat, lng) {
      const that = this;
      // 根据经纬度判断城市
      if (lat >= 39.8 && lat <= 40.2 && lng >= 116.2 && lng <= 116.7) {
        that.globalData.userCity = '北京市';
        that.globalData.userProvince = '北京';
      } else if (lat >= 31.1 && lat <= 31.3 && lng >= 121.3 && lng <= 121.7) {
        that.globalData.userCity = '上海市';
        that.globalData.userProvince = '上海';
      } else if (lat >= 29.4 && lat <= 29.8 && lng >= 106.3 && lng <= 106.8) {
        that.globalData.userCity = '重庆市';
        that.globalData.userProvince = '重庆';
      } else if (lat >= 27.8 && lat <= 28.3 && lng >= 112.4 && lng <= 113.2) {
        that.globalData.userCity = '长沙市';
        that.globalData.userProvince = '湖南';
      } else if (lat >= 28.5 && lat <= 29.0 && lng >= 115.7 && lng <= 116.0) {
        that.globalData.userCity = '南昌市';
        that.globalData.userProvince = '江西';
      } else if (lat >= 36.5 && lat <= 36.7 && lng >= 109.4 && lng <= 109.6) {
        that.globalData.userCity = '延安市';
        that.globalData.userProvince = '陕西';
      } else if (lat >= 30.3 && lat <= 30.7 && lng >= 106.5 && lng <= 106.8) {
        that.globalData.userCity = '广安市';
        that.globalData.userProvince = '四川';
      } else if (lat >= 30.4 && lat <= 30.7 && lng >= 114.1 && lng <= 114.6) {
        that.globalData.userCity = '武汉市';
        that.globalData.userProvince = '湖北';
      } else if (lat >= 38.2 && lat <= 38.5 && lng >= 113.8 && lng <= 114.1) {
        that.globalData.userCity = '石家庄市';
        that.globalData.userProvince = '河北';
      } else {
        that.globalData.userCity = '未知';
        that.globalData.userProvince = '未知';
      }
    },
  
    getRecommendedBases: function() {
      const userProvince = this.globalData.userProvince;
      return this.globalData.redBases.filter(base => base.province === userProvince);
    },
  
    getAllBases: function() {
      return this.globalData.redBases;
    }
  })