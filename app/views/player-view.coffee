template = require 'views/templates/player'
View = require 'views/base/view'
InfoView = require 'views/info-view'

module.exports = class PlayerView extends View
  autoRender: yes
  className: 'player'
  region: 'player'
  template: template
  currentIndex: 0

  initialize: ->
    super

    window.onYouTubeIframeAPIReady = => @loadPlayer()

  attach: ->
    super
    @loadVideoScripts()

  loadVideoScripts: ->
    $.getScript '//www.youtube.com/iframe_api'

  loadPlayer: ->
    block = @collection.at @currentIndex

    if block.isYouTube()
      @displayYoutubePlayer block
      return true

    if block.isVimeo()
      @displayVimeoPlayer(block)
      return true

  displayYoutubePlayer: (block) ->
    @yt_player = new YT.Player 'video-player',
      height: '390'
      width: '640'
      videoId: block.youtubeVideoId()
      events: 
        onReady: @playYoutube
        onStateChange: @onYouTubeStateChange

  playYoutube: (e)-> e.target.playVideo()

  onYouTubeStateChange: (e)=>
    if e.data is YT.PlayerState.ENDED
      @yt_player.destroy()
      @nextVideo()

  displayVimeoPlayer: (block)->
    html = block.vimeoEmbed()
    @$('#video-player').html html
    iframe = @$('#video-player iframe')[0]
    @v_player = $f(iframe)
    @v_player.addEvent 'finish', @onVimeoFinish
    @playVimeo()

  playVimeo: -> @v_player.api 'play'

  onVimeoFinish: ->
    @v_player = null
    @$('#video-player').html ''
    @nextVideo()

  nextVideo: ->
    @currentIndex = if @currentIndex is (@collection.length - 1) then 0 else @currentIndex++
    @loadPlayer()

  prevVideo: ->
    @currentIndex = if @currentIndex is 0 then @collection.length else @currentIndex--
    @loadPlayer()


