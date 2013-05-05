template = require 'views/templates/player'
CollectionView = require 'views/base/collection-view'
PlayerItemView = require 'views/player-item-view'

module.exports = class PlayerView extends CollectionView
  autoRender: yes
  className: 'player'
  region: 'player'
  itemView: PlayerItemView
  template: template
  currentIndex: 0

  initialize: ->
    super

    @listenTo @, 'visibilityChange', @showVideos

  filterer: (item, index) -> index is @currentIndex

  showVideos: (visible) ->
    _.each visible, (item) -> item.trigger 'show:video' 

