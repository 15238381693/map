<template>
  <div class="serviceContent">
    <div class="content">
      <p>一、查阅服务内容</p>
      <p class="indent">
        本馆设有档案管理查询室，依照《郑州市城乡建设档案查阅利用规定》等相关规定，提供城建档案的查阅服务。
      </p>
      <p>二、查阅服务流程</p>
      <p>（一）来馆查阅者凭借有效证件和权属相关文件，向工作人员提出查阅申请。</p>
      <p>（二）工作人员利用电子目录或纸质目录检索查阅者所需要的相关信息。</p>
      <p>（三）馆内数字化档案可当时阅览，未数字化的档案原件需从库房调运，请耐心等待。</p>
      <p>（四）如需复制，提请工作人员办理。</p>
      <p>（五）复制件加盖“郑州市城市建设档案馆档案管理专用章”后既办理完毕，具有与档案原件同等效力。</p>
      <p>（六）办理完成后，请进行查阅登记。</p>
      <p>三、开放时间和联系方式</p>
      <p>开放时间：查阅档案每周一至周五</p>
      <p>1.上午8:30-12:00，下午2:00-5:30（冬季）</p>
      <p>2.上午8:30-12:00，下午2:30-6:00（夏季）</p>
    </div>

    <div class="footer">
      <p>单位地址：嵩山北路6号</p>
      <p>咨询电话：0371-67188600</p>
      <p>邮政编码：450007</p>
    </div>
    <van-button type="info" class="backBtn" @click="goback()">返回</van-button>
  </div>
</template>
<script>
export default {
  name: 'ServiceContent',
  methods: {
    goback() {
      this.$router.push('/home')
    }
  }
}
</script>
<style lang="less" scoped>
.serviceContent {
  padding: 10px 20px 20px;

  background: #f5f5f5;
  line-height: 26px;
  .indent {
    text-indent: 2em;
  }
  .footer {
    margin: 30px 0px;
  }
  .backBtn {
    display: block;
    width: 300px;
    margin: 0 auto;
  }
}
</style>
