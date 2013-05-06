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

    @subscribeEvent 'video:prev', @prevVideo
    @subscribeEvent 'video:next', @nextVideo

  attach: ->
    super
    @loadVideoScripts()
    @renderSubViews()

  loadVideoScripts: ->
    $.getScript '//www.youtube.com/iframe_api'

  renderSubViews: ->
    @subview 'info', new InfoView collection: @collection

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

  onYouTubeStateChange: (e) =>
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

  destroyPlayers: ->
    @v_player = null
    @yt_player?.destroy()
    @$('#video-player').html ''

  nextVideo: ->
    @destroyPlayers()
    if @currentIndex is (@collection.length - 1)
      @currentIndex = 0 
    else 
      @currentIndex++
    @loadPlayer()

  prevVideo: ->
    @destroyPlayers()
    if @currentIndex is 0
      @currentIndex = @collection.length
    else 
      @currentIndex++
    @loadPlayer()


