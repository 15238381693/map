import { Toast } from 'vant'
import EXIF from 'exif-js'
// import { uploadOCRFileApi, submitOCRApi } from '@/api/common'

export const onOversize = size => {
  Toast('图片大小不能超过' + size + 'Mb')
}

// base64转File文件
export const base64ToFile = (dataUrl, name, fileType = 'image/jpg') => {
  const arr = dataUrl.split(',')
  // const mime = arr[0].match(/:(.*?);/)[1]  // image/jpg,image/png...
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const index = fileType.lastIndexOf('/')
  const imgType = fileType.substring(index + 1, fileType.length)
  const newFile = new File([u8arr], name + '.' + imgType, { type: fileType })
  return newFile
}

export const compressBase64Img = (base64String, name, fileType = 'image/jpg', w = 100, quality = 0.7) => {
  var newImage = new Image()
  var imgWidth, imgHeight

  var promise = new Promise(resolve => (newImage.onload = resolve))
  newImage.src = base64String
  return promise.then(() => {
    imgWidth = newImage.width
    imgHeight = newImage.height
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    if (Math.max(imgWidth, imgHeight) > w) {
      if (imgWidth > imgHeight) {
        canvas.width = w
        canvas.height = (w * imgHeight) / imgWidth
      } else {
        canvas.height = w
        canvas.width = (w * imgWidth) / imgHeight
      }
    } else {
      canvas.width = imgWidth
      canvas.height = imgHeight
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height)
    const base64 = canvas.toDataURL(fileType, quality)
    const newfile = base64ToFile(base64, name, fileType)
    console.log('base new size', newfile.size)
    return newfile
  })
}

/**
 *
 * @param {*} file
 * @param {*} fileType
 * @param {*} base 值越大，图片清晰度越高
 * @param {*} quality  值越小，所绘制出的图像越模糊
 * @returns
 */
export const compressImg = (file, fileType = 'image/jpg', base = 600, quality = 1) => {
  console.log('base', base)
  return new Promise((resolve, reject) => {
    let orientation = 1
    EXIF.getData(file, function() {
      orientation = EXIF.getTag(this, 'Orientation')
      console.log('orientation..//', orientation)
    })
    const img = new Image()
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      img.src = e.target.result
      img.onload = e => {
        const { width: originWidth, height: originHeight } = img
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        let l = 1
        // const base = 400 // 根据需要更改，值越大，图片清晰度越高
        let targetWidth, targetHeight
        if (originWidth > originHeight) {
          l = originWidth / base
          targetWidth = base
          targetHeight = originHeight / l
        } else {
          l = originHeight / base
          targetHeight = base
          targetWidth = originWidth / l
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        function rotateImg(img, direction, canvas, degree, step) {
          var ctx = canvas.getContext('2d')
          switch (step) {
            case 0:
              canvas.width = targetWidth
              canvas.height = targetHeight
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
              break
            case 1:
              canvas.width = targetHeight
              canvas.height = targetWidth
              ctx.rotate(degree)
              ctx.drawImage(img, 0, -targetHeight, targetWidth, targetHeight)
              break
            case 2:
              canvas.width = targetWidth
              canvas.height = targetHeight
              ctx.rotate(degree)
              ctx.drawImage(img, -targetWidth, -targetHeight, targetWidth, targetHeight)
              break
            case 3:
              canvas.width = targetHeight
              canvas.height = targetWidth
              ctx.rotate(degree)
              ctx.drawImage(img, -targetWidth, 0, targetWidth, targetHeight)
              break
          }
        }
        if (navigator.userAgent.match(/iphone/i) && orientation !== 1) {
          const degree = (90 * Math.PI) / 180
          switch (orientation) {
            case 6:
              rotateImg(img, 'left', canvas, degree, 1)
              break
            case 8:
              rotateImg(img, 'right', canvas, -degree, 3)
              break
            case 3:
              rotateImg(img, 'right', canvas, degree, 2)
              break
          }
        }
        const dataUrl = canvas.toDataURL(fileType, quality)
        const newfile = base64ToFile(dataUrl, file.name, fileType)
        console.log('new size', newfile.size)
        resolve(newfile)
      }
    }
  })
}
// export const beforeRead = (file, type, nextMethod) => {
//   console.log('nextMethod', file)
//   const fileType = ['image/jpeg', 'image/jpg', 'image/png']
//   if (fileType.indexOf(file.type) === -1) {
//     this.$toast('请上传jpg/png格式的图片')
//     return false
//   } else {
//     if (nextMethod) {
//       const res = nextMethod(file, type)
//       if (!res) {
//         return res
//       }
//     }
//   }
//   return true
// }

// export const submitOCR = async (imgUrl, type) => {
//   console.log('submitOCR', imgUrl, type)
//   try {
//     const res = await submitOCRApi({ imgUrl, type })
//     const { data } = res
//     if (type === 'idcard') {
//       if (data['身份证号码'] && typeof data['身份证号码'] === 'string' && data['身份证号码'] !== '') {
//         this.form.certNo = data['身份证号码']
//       } else {
//         this.$toast.fail('请上传清晰的身份证正面照片！')
//       }
//     } else if (type === 'bank_card') {
//       if (data['银行卡号'] && typeof data['银行卡号'] === 'string' && data['银行卡号'] !== '') {
//         this.form.bankAccount = data['银行卡号']
//       } else {
//         this.$toast.fail('请上传清晰的银行卡正面照片！')
//       }
//     }
//   } catch (err) {
//     if (err.msg && err.msg !== '') {
//       this.$toast.fail(err.msg)
//     }
//   }
// }

// export const uploadOCRFile = (file, type) => {
//   uploadOCRFileApi(file).then(res => {
//     console.log('dOCRFile', res)
//     const { code, data } = res
//     if (code === 0) {
//       const { internalUrl } = data
//       submitOCR(internalUrl, type)
//     } else {
//       this.$toast.fail('上传失败！')
//       return false
//     }
//   })
// }
