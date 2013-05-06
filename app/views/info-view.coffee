template = require 'views/templates/info'
CollectionView = require 'views/base/collection-view'
ItemInfoView = require 'views/item-info-view'
Chaplin = require 'chaplin'

module.exports = class InfoView extends CollectionView
  autoRender: yes
  className: 'info'
  region: 'info'
  listSelector: '.current-video-container'
  template: template
  currentIndex: 0
  itemView: ItemInfoView

  initialize: ->
    super

    @delegate 'click', '.prev', @prevVideo
    @delegate 'click', '.next', @nextVideo

  prevVideo: ->
    if @currentIndex is 0
      @currentIndex = @collection.length
    else 
      @currentIndex--
    Chaplin.mediator.publish 'video:prev'
    @renderAllItems()

  nextVideo: ->
    if @currentIndex is (@collection.length - 1)
      @currentIndex = 0
    else 
      @currentIndex++
    Chaplin.mediator.publish 'video:next'
    @renderAllItems()

  filterer: (item, index) -> index is @currentIndex