config = 
  api: {}
  pusher: {}
  errbit: {}
  
production = no # MUST BE YES/NO
staging = false # MUST BE TRUE/FALSE

environment =
  if production
    'production'
  else if staging
    'staging'
  else
    'development'

environments =
  production: 'http://api.are.na/'
  staging: 'http://staging.are.na/'
  development: 'http://localhost:3000/'

pusher_keys = 
  production: '19beda1f7e2ca403abab'
  staging: '1f4ef2d9292c6ac10cdc'
  development: '944c5f601f3a394785f0'

config.env = environment
config.api.root = environments[environment]
config.api.versionRoot = "#{config.api.root}v2"
config.pusher.key = pusher_keys[environment]

module.exports = config