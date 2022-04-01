<template>
  <div class="booking">
    <div>
      <van-form scroll-to-error @submit="onSubmit">
        <van-field
          v-model="form.name"
          maxlength="30"
          input-align="right"
          label="姓名："
          placeholder="请输入姓名"
          required
          :rules="[{ required: true, message: '请填写监护人姓名' }]"
        />
        <van-field
          v-model="form.idcard"
          maxlength="30"
          input-align="right"
          label="身份证号："
          placeholder="请输入身份证号"
          required
          :rules="[{ required: true, message: '请填写身份证号' }]"
        />
        <van-field
          v-model="form.gongchengname"
          maxlength="30"
          input-align="right"
          label="工程名称："
          placeholder="请输入工程名称"
        />
        <van-field
          v-model="form.jscompany"
          maxlength="30"
          input-align="right"
          label="建设单位："
          placeholder="请输入建设单位"
        />
        <van-field
          v-model="form.sgcompany"
          maxlength="30"
          input-align="right"
          label="施工单位："
          placeholder="请输入施工单位"
        />
        <van-field
          v-model="form.gongchengaddr"
          v-if="['01', '02', '99'].includes(type)"
          maxlength="30"
          input-align="right"
          label="工程地址："
          placeholder="请输入工程地址"
        />
        <van-field
          v-if="type === '01' || type === '99'"
          v-model="form.area"
          maxlength="30"
          label-width="140"
          input-align="right"
          label="建筑面积（平方米）："
          placeholder="请输入工程建筑面积"
        />

        <van-field
          v-if="type === '02'"
          v-model="form.lengthandwidth"
          maxlength="30"
          label-width="140"
          input-align="right"
          label="路长及宽度（米）："
          placeholder="请输入路长及宽度（米）"
        />

        <van-field
          v-if="type === '03'"
          v-model="form.guige"
          maxlength="30"
          label-width="100"
          input-align="right"
          label="规格及材质："
          placeholder="请输入规格及材质"
        />
        <van-field
          v-if="type === '03'"
          v-model="form.startpoint"
          maxlength="30"
          label-width="100"
          input-align="right"
          label="起点及止点："
          placeholder="请输入起点及止点"
        />

        <van-field
          v-if="type === '04'"
          v-model="form.width"
          maxlength="30"
          label-width="100"
          input-align="right"
          label="宽度（米）："
          placeholder="输入宽度（米）"
        />
        <van-field
          v-if="type === '04'"
          v-model="form.hezai"
          maxlength="30"
          label-width="100"
          input-align="right"
          label="荷载："
          placeholder="请输入荷载"
        />
        <van-field
          v-if="type === '04'"
          v-model="form.kongshu"
          maxlength="30"
          label-width="100"
          input-align="right"
          label="孔数："
          placeholder="请输入孔数"
        />
        <van-field
          v-model="form.price"
          maxlength="30"
          label-width="140"
          input-align="right"
          label="工程预算（万元）："
          placeholder="输入工程预算（万元）"
        />

        <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="value"
          label="预约时间"
          input-align="right"
          placeholder="点击选择时间"
          required
          :rules="[{ required: true, message: '请选择时间' }]"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            title=""
            show-toolbar
            :columns="dateColumns"
            @confirm="dateConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
        <van-popup v-model="timeShow" position="bottom">
          <div class="wrapper">
            <van-picker
              title=""
              show-toolbar
              :columns="timeColumns"
              @confirm="timeConfirm"
              @cancel="timeShow = false"
            />
          </div>
        </van-popup>
        <h3>预约情况</h3>
        <div v-for="(item, index) in timeList" :key="index" class="timeBox">
          <div>
            <p>{{ item.week }}</p>
            <p>{{ item.date }}</p>
          </div>
          <div>
            <p :class="item.am === 0 ? grayClass : ''">上午:08:30-12:00(剩余{{ item.am }}人)</p>
            <p :class="item.pm === 0 ? grayClass : ''">下午:14:30-17:30(剩余{{ item.pm }}人)</p>
          </div>
        </div>
        <van-button block type="info" native-type="submit" round class="subBtn">提交</van-button>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import qs from 'qs'
import moment from 'moment'
export default {
  name: 'Booking',
  data() {
    return {
      type: '',
      form: {
        name: '',
        idcard: '',
        gongchengname: '',
        jscompany: '',
        sgcompany: '',
        gongchengaddr: '',
        area: '',
        lengthandwidth: '',
        guige: '',
        startpoint: '',
        width: '',
        hezai: '',
        kongshu: '',
        price: ''
      },
      showPicker: false,
      value: '',
      yuyuedate: new Date(),
      yuyuetime: '',
      minDate: new Date(),
      currentDate: new Date(),
      timeShow: false,
      dateColumns: [],
      timeColumns: ['上午:8:30-12:00', '下午:14:30-17:30'],
      timeList: [],
      grayClass: 'gray'
    }
  },
  created() {
    this.type = this.$route.query.type
    if (Object.keys(this.userInfo).length > 0) {
      this.init()
    } else {
      this.$store.dispatch('app/setUserInfo').then(() => {
        this.init()
      })
    }

    // 获取预约时间数量
    this.$axios({
      method: 'POST',
      url: `/zzscjdagl/rest/zhbyuyuezixunrest/countRecentYYZXRemainingData`,
      data: {}
    })
      .then((res) => {
        this.timeList = res.data.custom.list
        this.timeList &&
          this.timeList.forEach((item) => {
            this.dateColumns.push(item.date)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  methods: {
    init() {
      this.form.name = this.userInfo.realName
      this.form.idcard = this.userInfo.idCode
    },
    dateConfirm(value, index) {
      this.yuyuedate = value
      this.showPicker = false
      if (this.yuyuedate) {
        this.timeShow = true
      }
    },
    timeConfirm(value, index) {
      this.yuyuetime = index
      this.timeShow = false
      this.value = `${this.yuyuedate} ${value}`
    },
    onSubmit() {
      this.$axios({
        method: 'POST',
        url: `/zzscjdagl/rest/zhbyuyuezixunrest/insert`,
        data: {
          ...this.form,
          type: this.type,
          yuyuedate: this.yuyuedate,
          yuyuetime: this.yuyuetime
        }
      })
        .then((res) => {
          if (res.data.status.code === '1') {
            this.$router.push('/success')
          } else {
            this.$toast.fail('预约时间已经满员，请预约其他的时间')
          }
        })
        .catch((err) => {
          this.$toast.fail('提交失败')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.booking {
  padding: 20px;
  background: #fff;
  min-height: 100%;
  /deep/.van-field__control::placeholder {
    color: #969799;
  }
  /deep/.van-field__error-message {
    text-align: right;
  }
  h3 {
    margin-top: 10px;
    font-size: 18px;
  }
  .timeBox {
    display: flex;
    margin: 10px 0;
    div {
      &:first-child {
        padding: 0 10px;
      }
      &:last-child {
        line-height: 28px;
        // border: 1px solid red;
      }
    }
    .gray {
      color: #bfc0c1;
    }
  }
  .subBtn {
    width: 180px;
    height: 34px;
    margin: 32px auto;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
