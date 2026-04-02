// 直接本地运行，不从网络下载
const cookieName = '电信营业厅'
const notify = require('../sendNotify')

// 从 GitHub Secrets 读取手机号
const mobileVal = process.env.TELECOM_MOBILE

if (!mobileVal) {
  console.log('请设置 TELECOM_MOBILE')
  process.exit(0)
}

// 👈 已经帮你把你发的 Cookie 完整放进来了
const cookieVal = `aactgsh111220=15303342095; isLogin=logined; sajssdk_2015_cross_new_user=1; .ybtj.189.cn=D100E99D1A60ABC70027A93DB0034F3C; t7QVxkFZL7WUT=08OwTYCJWyI6cf29BFN72t7SMAkFz.0C30ckvzyMc48xfyeFy_2fNfrrv97r3VOWl7m_926SxZlru6jguZN.d3U12HkIQece1ftdToAAp4VEZfhee.hY0gmH6gGfFZ9koS2HVWd93RmQP9Az_5NZImCQ0m2vKCVXiMAVp8CJ5KgPMb1ccAqpnRf5uEqz2pRX_CGakVsgKjqcTUyXtwjaUprFBDznWFeGKV0RpyHqdoLTb8N.DrKgq94Ou.u3mqqoRPIiIsMTdskBtDT9srsYFjelvPVYPC3vg.d.PdSiRgP7YpRVyeQH44d5p7bAMYC3bATYLYORsSWcZecs7Jl7lEYdForIh_J86vHtJqz1Uram23tCyvC1V0b5Rcpis7n9ougw9iFoIHKmpMCl7_WSh6MxgTCTdAFz4pTBDNpCuxD4vh_7bwd3y2HXJ8LEWbPm6; SHOPID_COOKIEID=10018; cityCode=hb_yc; userId=201%7C2026012900010117090; Hm_lvt_79fae2027f43ca31186e567c6c8fe33e=1775107265; t7QVxkFZL7WUS=602aG8kz8Zu7hnjsdPuv.cXbQ2e0rNtiN1wy8APBgSoldJVcZa5drfhWAp8uEpt3L.8bkph4c9s2TNyaJKBLnS8q; zhizhendata2015jssdkcross=%7B%22distinct_id%22%3A%22MjAyNjAxMjkwMDAxMDExNzA5MA%3D%3D%22%2C%22first_id%22%3A%2219d4ca3622a1dd-01e81ee7113506b-2c5f030c-351348-19d4ca3622bda4%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E5%BC%95%E8%8D%90%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fbaidu.com%2F%22%7D%2C%22login_type%22%3A%22%22%2C%22utms%22%3A%7B%7D%2C%22%24device_id%22%3A%2219d4ca3622a1dd-01e81ee7113506b-2c5f030c-351348-19d4ca3622bda4%22%7D; HMACCOUNT=B63900761E1E197E; JSESSIONID-PROD=ODQ2NTYwYzktYTMxMS00MDBkLWI5MTItNWQyZjUyYzAyNWNl; Hm_lpvt_79fae2027f43ca31186e567c6c8fe33e=1775107697;`

sign()

function sign() {
  let url = {
    url: `https://wapside.189.cn:9001/api/home/sign`,
    headers: { Cookie: cookieVal }
  }
  url.headers['Content-Type'] = 'application/json;charset=utf-8'
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;7.6.0;iOS;13.3;iPhone XR'
  url.headers['Host'] = 'wapside.189.cn:9001'
  url.headers['Origin'] = 'https://wapside.189.cn:9001'
  url.headers['Referer'] = 'https://wapside.189.cn:9001/resources/dist/signInActivity.html'
  url.body = JSON.stringify({ phone: mobileVal })

  const https = require('https')
  const req = https.request(url, (res) => {
    let data = ''
    res.on('data', (chunk) => { data += chunk })
    res.on('end', () => {
      console.log(`${cookieName}, data: ${data}`)
      try {
        let result = JSON.parse(data)
        let subTitle = ``
        let detail = ``

        if (result.data?.code == 1) {
          subTitle = `签到结果: 成功 (${mobileVal})`
          detail = `获得金币${result.data.coin}, 金豆${result.data.flow}`
        } else if (result.data?.code == 0) {
          subTitle = `签到结果: 重复 (${mobileVal})`
          detail = `说明: ${result.data.msg}`
        } else {
          subTitle = `签到结果: 失败 (${mobileVal})`
          detail = `说明: ${result.data?.msg || '无返回信息'}`
        }

        console.log(subTitle, detail)
        notify.sendNotify(cookieName, subTitle + '\n' + detail)

      } catch (e) {
        console.log('解析失败', e)
        notify.sendNotify('电信签到异常', 'Cookie 可能过期')
      }
    })
  })

  req.on('error', (e) => console.error(e))
  req.write(url.body)
  req.end()
}
