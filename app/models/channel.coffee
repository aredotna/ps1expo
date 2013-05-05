Model         = require 'models/base/model'
Blocks        = require 'models/blocks'
Chaplin       = require 'chaplin'
config        = require 'config'

module.exports = class Channel extends Model
  collection: Blocks
  collectionAttr: "contents"

  initialize: (attributes, options)->
    super

    @subscribeEvent 'channel:loaded', @setUpPusher
    @set('id', attributes.id)

  urlRoot: "#{config.api.versionRoot}/channels"

  url: (method)->
    url = "#{@urlRoot}/"
    url += @idOrSlug()

  idOrSlug: ->
    if @has('slug') then @get('slug') else @id

  sync: (method, model, options) ->
    options.url = @url(method)
    super

  parse: (data) ->
    console.log 'parse', data
    return data 

  afterSuccess: ->
    @set 'contents', new Blocks(@get('contents'))

  # 
  # Pusher
  # 

  setUpPusher: ->
    channel = this
    
    @pusher = Chaplin.mediator.pusher.subscribe "channel-#{config.env}-#{channel.id}"
    @pusher.bind 'new_comment', (comment) -> channel.get('contents').addComment comment      

    @listener = new Backpusher @pusher, channel.get('contents')
    @listener.bind 'remote_update', (model) -> model.trigger 'remote:update'
    @listener.bind 'remote_destroy', (model) -> channel.get('contents').remove(model)
   

  # 
  # Disposal
  # 

  dispose: ->
    @listener?.dispose()
    @listener = null
    Chaplin.mediator.pusher.unsubscribe "channel-#{config.env}-#{@id}"
    @pusher?.unbind 'new_comment', null
    super



