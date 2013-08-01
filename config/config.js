module.exports = {
  development:
    {
      db: 'mongodb://10.255.132.156/loggermail',
      notificationUrl: 'http://10.255.206.97:8080/notification',
      swift: { authurl: 'http://osdash-ch2-b01.sys.comcast.net:5000/v2.0/tokens',
               username: 'bpaluc000',
               password: '',
               tenantId: 'bbe9d090418e489eacedcac50f155299',
               container: 'loggermail'
             },
      serviceUrl: 'http://10.253.24.165:4000/'
    },
  TEST:
    {
      db: 'mongodb://10.255.132.156/loggermail-test',
      notificationUrl: 'http://localhost:4001/notification',
      swift: { authurl: 'http://osdash-ch2-b01.sys.comcast.net:5000/v2.0/tokens',
               username: 'bpaluc000',
               password: '',
               tenantId: 'bbe9d090418e489eacedcac50f155299',
               container: 'loggermail-test'
             }, 
      serviceUrl: 'http://10.253.24.165:4000/'
    }
}
