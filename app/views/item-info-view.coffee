template = require 'views/templates/item-info'
View = require 'views/base/view'

module.exports = class ItemInfoView extends View
  autoRender: yes
  className: 'item-info'
  template: template

  initialize: ->
    super

    @listenTo @model, 'remote:update', @render

  render: ->
    super