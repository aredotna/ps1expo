Controller = require 'controllers/base/controller'
Channel = require 'models/channel'
Chaplin = require 'chaplin'
PlayerView = require 'views/player-view'

module.exports = class HomeController extends Controller
  index: ->
    console.log 'home index'
    @model = new Channel
      id: Chaplin.mediator.mainSlug

    @model.fetch
      success: =>
        @model.afterSuccess()
        @view = new PlayerView collection: @model.get('contents')
