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

    @delegate 'click', '.prev', @triggerPrev
    @delegate 'click', '.next', @triggerNext

    @subscribeEvent 'title:prev', @prevVideo
    @subscribeEvent 'title:next', @nextVideo

  triggerPrev: -> Chaplin.mediator.publish 'video:prev'

  triggerNext: -> Chaplin.mediator.publish 'video:next'

  prevVideo: ->
    if @currentIndex is 0
      @currentIndex = @collection.length
    else 
      @currentIndex--
    @renderAllItems()

  nextVideo: ->
    if @currentIndex is (@collection.length - 1)
      @currentIndex = 0
    else 
      @currentIndex++
    @renderAllItems()

  filterer: (item, index) -> index is @currentIndex