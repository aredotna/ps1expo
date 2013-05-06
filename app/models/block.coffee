Model         = require 'models/base/model'
Chaplin       = require 'chaplin'
config        = require 'config'

module.exports = class Block extends Model

  isVimeo: -> @get('embed').html.indexOf('vimeo') isnt -1

  isYouTube: -> @get('embed').html.indexOf('youtube') isnt -1

  youtubeVideoId: ->
    reg = new RegExp('(?:https?://)?(?:www\\.)?(?:youtu\\.be/|youtube\\.com(?:/embed/|/v/|/watch\\?v=))([\\w-]{10,12})', 'g')
    reg.exec(@get('embed').html)[1]

  vimeoEmbed: ->
    html = @get('embed').html
    regEx = /(src)=["']([^"']*)["']/gi
    html.replace regEx, (all, type, value) -> "src=\"#{value}?api=1\""