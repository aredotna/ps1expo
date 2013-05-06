Collection    = require 'models/base/collection'
Block         = require 'models/block'
Chaplin       = require 'chaplin'
config        = require 'config'

module.exports = class Blocks extends Collection
  model: Block

  comparator: (model) -> model.get 'position'