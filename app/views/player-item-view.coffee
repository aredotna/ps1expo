template = require 'views/templates/player-item'
View = require 'views/base/view'

module.exports = class PlayerItemView extends View
  className: 'player-item'
  template: template

  initialize: ->
    super

    @listenTo @model, 'show:video', @displayVideo

  displayVideo: ->
    @displayYouTube() if @model.isYouTube()

  displayYouTube: ->
    console.log 'displayYouTube'
    # YT.Player
