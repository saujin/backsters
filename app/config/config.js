import packg from '../../package'

export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost:3000',
  version: packg.version,
  appName: packg.name,
  betaAccessCode: process.env.BETA_ACCESS_CODE || '79isgold',
  logging: {
    requestLoggingEnabled: false,
    logentriesToken: process.env.LOGENTRIES_TOKEN
  },
  session: {
    secret: process.env.SESSION_SECRET || 'secret'
  },
  database: {
    connectionString: process.env.MONGOLAB_URI || 'mongodb://backster:backster@ds059644.mongolab.com:59644/heroku_41kscgc4'
  },
  sendgrid: {
    username: process.env.SENDGRID_USERNAME || 'app44375130@heroku.com',
    password: process.env.SENDGRID_PASSWORD || 'wdv3mvvn8906'
  },
  emails: {
    enabled: Boolean(process.env.EMAILS_ENABLED),
    notificationFrom: process.env.EMAILS_NOTIFICATION_FROM || 'info@backster.co',
    notificationTo: process.env.EMAILS_NOTIFICATION_TO || 'josef.zavisek@strv.com',

    companyRegistration: {
      subject: process.env.EMAIL_COMPANYREGISTRATION_SUBJECT || 'Backsters - company registration'
    },
    investorRegistration: {
      subject: process.env.EMAIL_INVESTORREGISTRATION_SUBJECT || 'Backsters - investor registration'
    },
    investorInterest: {
      subject: process.env.EMAIL_INVESTORINTEREST_SUBJECT || 'Backsters - investor interest'
    }
  }
}
