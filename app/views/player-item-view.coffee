template = require 'views/templates/player-item'
View = require 'views/base/view'

module.exports = class PlayerItemView extends View
  className: 'player-item'
  template: template

  initialize: ->
    super

    @listenTo @model, 'show:video', @displayVideo

  displayVideo: -> 
    # @$('.video').html @model.get('embed').html
    if @model.isYouTube()
      @displayYouTube()

  displayYouTube: ->
    console.log 'displayYouTube'
    # YT.Player
