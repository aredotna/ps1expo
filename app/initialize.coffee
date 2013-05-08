Application = require 'application'

# Initialize the application on DOM ready event.
$ ->
  window.app = (new Application).initialize()
