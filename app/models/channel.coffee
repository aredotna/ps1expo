Model   = require 'models/base/model'
Blocks  = require 'models/blocks'
Chaplin = require 'chaplin'
config  = require 'config'

module.exports = class Channel extends Model
  collection: Blocks
  collectionAttr: "contents"

  initialize: (attributes, options)->
    super

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

  afterSuccess: ->
    @set 'contents', new Blocks(@filterContents())
    @setUpPusher()

  filterContents: ->
    _.filter @get('contents'), (block) ->
      if block.class is "Media"
        block.source.provider.name is "YouTube" or "Vimeo"

  # 
  # Pusher
  # 

  setUpPusher: ->
    channel = this
    
    @pusher = Chaplin.mediator.pusher.subscribe "channel-#{config.env}-#{channel.id}"

    @listener = new Backpusher @pusher, channel.get('contents')
    @listener.bind 'remote_create', (model) -> 
      console.log 'block added', model
    @listener.bind 'remote_update', (model) -> 
      console.log 'remote_update', model
      model.trigger 'remote:update'
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



